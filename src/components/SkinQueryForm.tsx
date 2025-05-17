import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import styled from "styled-components";
import CustomInput from "./Input";
import CustomCheckbox from "./CustomCheckbox";
import GradientButton from "./GradientButton";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Loader2, ShieldCheck, FileText } from "lucide-react";

import axios from "axios";

interface ApiResponse {
  response?: string;

  error?: string;

  analysis?: {
    final_analysis: string;
    initial_diagnosis: string;
    vectordb_results: string;
  };

  status?: string;
}

declare global {
  interface Window {
    TypingDNA: any;
  }
}

const StyledCard = styled(Card)`
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    box-shadow: 0 10px 40px rgba(31, 38, 135, 0.25);
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #62d5d0, #4a9c98, #2d7a77);
  }
`;

const SkinQueryForm: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState<string | null>(null); // 'image' or 'audio'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingPattern, setTypingPattern] = useState(null);
  const [typingDnaInstance, setTypingDnaInstance] = useState<any>(null);
  const [includeTypingData, setIncludeTypingData] = useState(false);

  interface KeyStroke {
    key: string;
    timeDown: number;
    timeUp: number | null;
  }

  const [keystrokes, setKeystrokes] = useState<KeyStroke[]>([]);
  const currentKeyRef = useRef<KeyStroke | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.TypingDNA) {
      try {
        const tdna = new window.TypingDNA();
        tdna.addTarget("symptoms"); // ID of textarea
        setTypingDnaInstance(tdna);
        console.log("TypingDNA initialized in SkinQueryForm");
      } catch (err) {
        console.error("Error initializing TypingDNA:", err);
      }
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentTime = Date.now();

    currentKeyRef.current = {
      key: e.key,
      timeDown: currentTime,
      timeUp: null,
    };
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    const currentTime = Date.now();

    if (currentKeyRef.current && currentKeyRef.current.key === e.key) {
      const completeKeystroke: KeyStroke = {
        ...currentKeyRef.current,

        timeUp: currentTime,
      };
      setKeystrokes((prev) => [...prev, completeKeystroke]);
      currentKeyRef.current = null;
    }
  };

  const handleInputSubmit = async (
    msg: string,
    uploaded: { imageUrl: string; audioUrl: string }
  ) => {
    if (!msg.trim()) return;
    setIsLoading(true);
    setError(null);
    setMessage(""); // Clear message after submit
    setFileUrl("");
    setFileType(null);
    setKeystrokes([]); // Clear keystrokes after submit
    try {
      const payload: any = {
        question: msg,
        image: uploaded.imageUrl || (fileType === "image" ? fileUrl : ""),
        audio: uploaded.audioUrl || (fileType === "audio" ? fileUrl : ""),
        typing: {
          keystrokes: keystrokes.map(k => ({
            key: k.key,
            timeDown: k.timeDown,
            timeUp: k.timeUp
          }))
        }
      };
      console.log("Sending to API:", payload);
      const response = await axios.post("/api/external/chat", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 100000 // 100 seconds timeout to match --max-time 100
      });
      if (response.data.error) {
        setError(response.data.error);
        setIsLoading(false);
        return;
      }
      navigate("/output", { state: { apiResponse: response.data } });
    } catch (err: any) {
      console.error("API Error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to get a response. Please try again."
      );
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("Please enter your symptoms first.");

      return;
    }

    setError(null);

    await handleInputSubmit(message, {
      imageUrl: "",

      audioUrl: "",
    });
  };

  return (
    <StyledCard className="w-full max-w-xl mx-auto bg-white/95 dark:bg-card/95 backdrop-blur-lg border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-2">
          <div className="p-3 rounded-full bg-teal-50 dark:bg-teal-900/30">
            <img 
              src="/favicon.ico" 
              alt="Cerebrum Icon" 
              className="h-8 w-8"
            />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#62d5d0] to-[#2d7a77] bg-clip-text text-transparent">Medical Assistant</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
          Describe your symptoms in detail for the most accurate analysis. You can optionally include an image or audio recording.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-full flex justify-center">
            <CustomInput
              onSubmit={async (msg: string, url: string, type: string) => {
                let uploaded = { imageUrl: "", audioUrl: "" };
                if (type === "image") {
                  uploaded.imageUrl = url;
                } else if (type === "audio") {
                  uploaded.audioUrl = url;
                }
                await handleInputSubmit(msg, uploaded);
              }}
              isLoading={isLoading}
              message={message}
              setMessage={setMessage}
              fileUrl={fileUrl}
              setFileUrl={setFileUrl}
              fileType={fileType}
              setFileType={setFileType}
              keystrokes={keystrokes}
              setKeystrokes={setKeystrokes}
              handleKeyDown={handleKeyDown}
              handleKeyUp={handleKeyUp}
            />
          </div>

          <div className="flex items-center justify-center w-full">
            <div className="flex items-center space-x-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <ShieldCheck className="h-4 w-4 text-[#62d5d0]" />
              <div className="flex items-center">
                <CustomCheckbox
                  checked={includeTypingData}
                  onChange={setIncludeTypingData}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center w-full">
            <GradientButton
              onClick={handleSubmit}
              disabled={isLoading}
              text={isLoading ? "Analyzing..." : "Submit for Analysis"}
            />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg w-full">
              <Loader2 className="h-4 w-4 animate-spin text-[#62d5d0]" />
              <span>Processing your medical data...</span>
            </div>
          )}

          <div className="w-full pt-2">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-4">
              <FileText className="h-3 w-3" />
              <span>All data is encrypted and processed securely</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-center pt-0">
        {error && (
          <div className="w-full text-center p-3 mb-3 bg-red-100 border border-red-200 rounded-xl text-red-800 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
            {error}
          </div>
        )}
      </CardFooter>
    </StyledCard>
  );
};

export default SkinQueryForm;
