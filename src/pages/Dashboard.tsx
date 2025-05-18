import React, { useEffect, useState } from "react";
import SkinQueryForm from "@/components/SkinQueryForm";
import Navbar from "@/components/Navbar";
import EnhancedFooter from "@/components/EnhancedFooter";
import AnalysisHistorySidebar from "@/components/AnalysisHistorySidebar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./typingdna.js"; // Import the TypingDNA script

// Declare TypingDNA on the window object
declare global {
  interface Window {
    TypingDNA: any;
  }
}

interface AnalysisHistory {
  id: string;
  date: Date;
  condition?: string;
  severity?: "Mild" | "Moderate" | "Severe";
  status?: "Completed" | "In Progress" | "Needs Review";
  doctorName?: string;
  raw?: any;
}

const InputPage: React.FC = () => {
  const { user } = useAuth();
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("analysis_records")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching analysis history:", error);
      return;
    }

    setAnalysisHistory(
      (data || []).map((item: any) => ({
        id: item.id,
        date: new Date(item.created_at),
        condition: item.analysis_data?.analysis?.final_analysis || "Unknown",
        severity: item.analysis_data?.analysis?.severity || "Moderate",
        status: "Completed",
        doctorName: item.analysis_data?.doctorName || "",
        raw: item,
      }))
    );
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleSelectAnalysis = (id: string) => {
    const record = analysisHistory.find((item) => item.id === id);
    if (record && record.raw) {
      navigate("/output-history", {
        state: { apiResponse: record.raw.analysis_data },
      });
    }
  };

  // Add animation to floating elements
  useEffect(() => {
    const animateFloatingElements = () => {
      const elements = document.querySelectorAll(".floating");

      elements.forEach((el) => {
        const element = el as HTMLElement;

        // Generate more varied motion patterns with slower animation
        // Create random rotation for more dimension
        const randomRotate = Math.random() * 12 - 6; // -6 to 6 degrees rotation

        // Random scale variation (subtle)
        const randomScale = 0.97 + Math.random() * 0.06; // Scale between 0.97 and 1.03

        // Random delay and increased duration for slower animations
        const randomDelay = Math.random() * 2;
        const randomDuration = 3 + Math.random() * 4;

        // Create unique animation name for each element to have different motion paths
        const animationIndex = Math.floor(Math.random() * 5) + 1; // 5 different animations

        // Apply animations with varied transforms
        element.style.animation = `float${animationIndex} ${randomDuration}s ease-in-out ${randomDelay}s infinite alternate`;
        element.style.transform = `rotate(${randomRotate}deg) scale(${randomScale})`;
      });
    };

    animateFloatingElements();
  }, []);

  // Initialize TypingDNA once at page load
  useEffect(() => {
    // Check if TypingDNA library exists and initialize it
    if (typeof window !== "undefined" && window.TypingDNA) {
      try {
        console.log("Initializing TypingDNA in Input.tsx");
        // We'll let SkinQueryForm handle the specific targeting and pattern collection
      } catch (error) {
        console.error("Error initializing TypingDNA:", error);
      }
    } else {
      console.warn("TypingDNA library not found");
    }
  }, []);

  return (
    <div className="min-h-screen backdrop-blur-sm overflow-hidden ">
      <AnalysisHistorySidebar
        history={analysisHistory}
        onSelectAnalysis={handleSelectAnalysis}
        isCollapsed={isSidebarCollapsed}
        onCollapse={setIsSidebarCollapsed}
        onHistoryUpdate={fetchHistory}
      />

      <svg
        className="pointer-events-none fixed w-[135vw] h-[135vw] md:w-[98vw] md:h-[98vw] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] opacity-55 select-none dark:opacity-20"
        viewBox="0 0 1200 900"
        fill="none"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        {/* Changed colors to cyan/blue shades */}
        <circle
          className="animate-pulse"
          cx="970"
          cy="350"
          r="69"
          fill="#a5f3fc"
          fillOpacity="0.11"
        />
        <circle cx="160" cy="180" r="70" fill="#67e8f9" fillOpacity="0.16" />
        <circle
          className="animate-pulse"
          cx="960"
          cy="789"
          r="35"
          fill="#22d3ee"
          fillOpacity="0.14"
        />
        <circle cx="980" cy="170" r="33" fill="#0ea5e9" fillOpacity="0.26" />
        <circle cx="120" cy="730" r="24" fill="#0284c7" fillOpacity="0.19" />
        <circle
          className="animate-pulse"
          cx="720"
          cy="100"
          r="41"
          fill="#0891b2"
          fillOpacity="0.18"
        />
      </svg>

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Blurred gradients - More blue-centric */}
        <div className="floating  absolute top-[15%] left-[10%] w-36 h-36 rounded-full bg-gradient-to-br from-blue-400/25 via-sky-300/20 to-cyan-300/15 blur-2xl"></div>
        <div className="floating  absolute bottom-[20%] right-[15%] w-48 h-48 rounded-full bg-gradient-to-br from-sky-400/25 via-blue-300/20 to-cyan-300/15 blur-2xl"></div>
        <div className="floating  absolute top-[60%] left-[20%] w-32 h-32 rounded-full bg-gradient-to-tl from-blue-400/25 via-sky-300/20 to-cyan-300/15 blur-2xl"></div>
        <div className="floating  absolute top-[25%] left-[35%] w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-300/25 to-sky-300/15 blur-2xl"></div>
        <div className="floating  absolute bottom-[35%] right-[25%] w-36 h-36 rounded-full bg-gradient-to-bl from-sky-400/20 via-blue-300/25 to-cyan-300/15 blur-2xl"></div>
        <div className="floating  absolute top-[38%] right-[38%] w-44 h-44 rounded-full bg-gradient-to-tr from-blue-400/15 via-sky-300/20 to-cyan-300/25 blur-2xl"></div>
        <div className="floating  absolute bottom-[55%] left-[40%] w-52 h-52 rounded-full bg-gradient-to-bl from-sky-400/15 via-blue-300/20 to-cyan-300/25 blur-2xl"></div>

        {/* Small particles - Blue focused */}
        <div className="floating absolute top-[30%] right-[30%] w-6 h-6 rounded-full bg-blue-400/30"></div>
        <div className="floating absolute top-[40%] left-[40%] w-4 h-4 rounded-full bg-sky-400/35"></div>
        <div className="floating absolute bottom-[35%] left-[25%] w-5 h-5 rounded-full bg-blue-400/35"></div>
        <div className="floating absolute top-[25%] right-[18%] w-3 h-3 rounded-full bg-sky-400/35"></div>
        <div className="floating absolute bottom-[15%] right-[35%] w-4 h-4 rounded-full bg-cyan-400/35"></div>

        {/* Additional particles - More blue variety */}
        <div className="floating absolute top-[18%] right-[45%] w-7 h-7 rounded-full bg-blue-500/25"></div>
        <div className="floating absolute top-[55%] right-[15%] w-5 h-5 rounded-full bg-blue-400/30"></div>
        <div className="floating absolute bottom-[45%] left-[12%] w-6 h-6 rounded-full bg-sky-500/30"></div>
        <div className="floating absolute top-[65%] right-[28%] w-8 h-8 rounded-full bg-blue-400/25"></div>
        <div className="floating absolute top-[12%] left-[25%] w-4 h-4 rounded-full bg-sky-500/30"></div>
        <div className="floating absolute bottom-[25%] left-[45%] w-5 h-5 rounded-full bg-blue-400/25"></div>
        <div className="floating absolute top-[50%] left-[32%] w-3 h-3 rounded-full bg-blue-500/35"></div>
        <div className="floating absolute bottom-[55%] right-[10%] w-6 h-6 rounded-full bg-sky-400/30"></div>
        <div className="floating absolute top-[75%] left-[38%] w-5 h-5 rounded-full bg-blue-400/30"></div>
        <div className="floating absolute bottom-[65%] right-[42%] w-4 h-4 rounded-full bg-sky-500/25"></div>

        {/* Medium-sized circles with blue gradients */}
        <div className="floating absolute top-[38%] left-[15%] w-12 h-12 rounded-full bg-gradient-to-r from-blue-600/15 to-blue-400/10"></div>
        <div className="floating absolute bottom-[40%] right-[20%] w-14 h-14 rounded-full bg-gradient-to-r from-sky-600/15 to-blue-400/10"></div>
        <div className="floating absolute top-[15%] right-[25%] w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/15 to-sky-400/10"></div>
        <div className="floating absolute bottom-[22%] left-[30%] w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/15 to-blue-300/10"></div>
        <div className="floating absolute top-[62%] right-[15%] w-14 h-14 rounded-full bg-gradient-to-r from-sky-500/15 to-blue-300/10"></div>
        <div className="floating absolute bottom-[75%] left-[18%] w-12 h-12 rounded-full bg-gradient-to-r from-blue-600/10 to-sky-400/15"></div>
      </div>

      <style>{`
        /* Different animation patterns for more varied motion with slower speed */
        @keyframes float1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(8px, -12px) rotate(2deg); }
          66% { transform: translate(-10px, -3px) rotate(-1deg); }
          100% { transform: translate(5px, 10px) rotate(1.5deg); }
        }
        
        @keyframes float2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-14px, 7px) rotate(-2deg); }
          50% { transform: translate(-5px, -5px) rotate(1deg); }
          75% { transform: translate(10px, -8px) rotate(-1.5deg); }
          100% { transform: translate(7px, 10px) rotate(0.5deg); }
        }
        
        @keyframes float3 {
          0% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(12px, 5px) rotate(1.5deg); }
          40% { transform: translate(8px, -12px) rotate(-1deg); }
          60% { transform: translate(-10px, -8px) rotate(-2deg); }
          80% { transform: translate(-8px, 10px) rotate(1deg); }
          100% { transform: translate(10px, 6px) rotate(0deg); }
        }
        
        @keyframes float4 {
          0% { transform: translate(0, 0) rotate(0deg); }
          30% { transform: translate(-12px, -7px) rotate(-1.5deg); }
          60% { transform: translate(8px, 10px) rotate(2deg); }
          100% { transform: translate(4px, -5px) rotate(-0.5deg); }
        }
        
        @keyframes float5 {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(7px, 8px) rotate(1deg); }
          50% { transform: translate(-6px, 11px) rotate(-1deg); }
          75% { transform: translate(-12px, -4px) rotate(-2deg); }
          100% { transform: translate(10px, -8px) rotate(1.5deg); }
        }
      `}</style>

      <Navbar />
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-16" : "ml-80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Medical Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-7 relative">
              Get an AI-powered analysis of your medical condition. Simply enter
              your symptoms and provide data for a personalized assessment.
            </p>
          </div>

          <SkinQueryForm />

          <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Note: This tool is for informational purposes only and does not
              replace professional medical advice. Always consult with a
              healthcare provider for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPage;
