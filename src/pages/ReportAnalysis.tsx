import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Upload, FileCheck, AlertCircle, PlusCircle, RefreshCw, BookOpen, ArrowRight, AlertTriangle } from 'lucide-react';
import Tesseract from 'tesseract.js';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import EnhancedFooter from '@/components/EnhancedFooter';
import CustomInput from '@/components/Input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AnalysisResult {
  text: string;
  confidence: number;
  summary: string;
}

// API key should be in environment variables for security
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent';

const ReportAnalysis: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [processingStage, setProcessingStage] = useState<string>("");
  const [pageLoading, setPageLoading] = useState(true);
  
  // Simulate initial page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const generateLocalSummary = (text: string): string => {
    let summary = "Medical Report Analysis:\n\n";
    
    if (text.includes("COMPLETE BLOOD COUNT") || text.includes("CBC")) {
      summary += "- Complete Blood Count (CBC) test results\n";
    }
    
    const hemoglobinMatch = text.match(/Hemoglobin\s+(\d+\.?\d*)\s+(\d+\.?\d*-\d+\.?\d*)\s+(\w+\/?\w*)/i);
    if (hemoglobinMatch) {
      const value = hemoglobinMatch[1];
      const range = hemoglobinMatch[2];
      const units = hemoglobinMatch[3];
      summary += `- Hemoglobin: ${value} ${units} (Normal range: ${range})\n`;
      
      const rangeParts = range.split('-');
      if (rangeParts.length === 2) {
        const min = parseFloat(rangeParts[0]);
        const max = parseFloat(rangeParts[1]);
        const val = parseFloat(value);
        
        if (val < min) {
          summary += "  * Hemoglobin is below normal range, which may indicate anemia\n";
        } else if (val > max) {
          summary += "  * Hemoglobin is above normal range, which may indicate polycythemia\n";
        } else {
          summary += "  * Hemoglobin is within normal range\n";
        }
      }
    }
    
    const doctorMatch = text.match(/Dr\.\s+([A-Za-z\s]+)/i);
    if (doctorMatch) {
      summary += `- Report signed by: Dr. ${doctorMatch[1]}\n`;
    }
    
    if (summary === "Medical Report Analysis:\n\n") {
      summary += "- Basic medical report detected\n";
      summary += "- The document appears to contain medical test results\n";
      summary += "- For detailed analysis, please consult with a healthcare professional\n";
    }
    
    return summary;
  };

  const generateSummary = async (text: string): Promise<string> => {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a medical report analyzer. Your task is to analyze this medical report and provide a clear, concise summary focusing on key findings, diagnoses, and recommendations. Use medical terminology appropriately but explain complex terms in simple language.

Medical Report:
${text}

Please provide a clear summary of the above medical report.`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          }
        })
      });

      if (!response.ok) {
        console.error('Gemini API error:', await response.text());
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      return generateLocalSummary(text);
    }
  };

  const handleFileUpload = async (msg: string, url: string, type: string) => {
    if (!url) return;

    try {
      setIsProcessing(true);
      setFileUrl(url);
      setFileType(type);
      setProcessingStage("initializing");

      // Switch to results tab when processing starts
      setActiveTab("results");
      
      setProcessingStage("extracting");
      const { data: { text, confidence } } = await Tesseract.recognize(
        url,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              console.log('Progress:', m.progress);
            }
          }
        }
      );

      let cleanedText = text
        .replace(/\s+/g, ' ')
        .trim();
      
      cleanedText = cleanedText
        .replace(/[^\w\s.,()\/\-:;%+]/g, '')
        .replace(/(\d)\.(\d)/g, '$1.$2')
        .replace(/(\d),(\d)/g, '$1,$2');

      setProcessingStage("analyzing");
      const summary = await generateSummary(cleanedText);

      const confidencePercentage = Math.min(Math.max(confidence * 100, 0), 100);

      setProcessingStage("finishing");
      
      setTimeout(() => {
        setResult({
          text: cleanedText,
          confidence: confidencePercentage,
          summary
        });
        setProcessingStage("");
      }, 500);

      toast({
        title: "Analysis Complete",
        description: "Medical report has been successfully analyzed.",
      });

    } catch (error) {
      console.error('Error processing report:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Unable to process the report. Please try another image.",
      });
      setActiveTab("upload");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setFileUrl("");
    setFileType(null);
    setMessage("");
    setActiveTab("upload");
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500";
    if (confidence >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const renderProcessingState = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 h-full">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <RefreshCw className="h-16 w-16 animate-spin text-[#62d5d0]" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {processingStage === "initializing" && "Preparing Analysis"}
            {processingStage === "extracting" && "Extracting Text"}
            {processingStage === "analyzing" && "Analyzing Report Content"}
            {processingStage === "finishing" && "Finalizing Results"}
          </h3>
          
          <Progress value={
            processingStage === "initializing" ? 20 :
            processingStage === "extracting" ? 50 :
            processingStage === "analyzing" ? 75 : 90
          } className="w-full max-w-md" />
          
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            {processingStage === "initializing" && "Setting up OCR engines and preparing analysis tools..."}
            {processingStage === "extracting" && "Converting image to text. This may take a moment for complex reports..."}
            {processingStage === "analyzing" && "Applying medical knowledge to understand report contents..."}
            {processingStage === "finishing" && "Compiling results and preparing your analysis..."}
          </p>
        </div>
      </div>
    );
  };

  const renderProcessedFindings = () => {
    if (!result) return null;
    
    // Try to extract key insights from the summary
    const keyFindings: string[] = [];
    const lines = result.summary.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        keyFindings.push(trimmed.substring(1).trim());
      }
    }

    return (
      <div className="space-y-6">
        {/* Summary panel with key findings */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-[#62d5d0]/10 to-transparent">
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-[#62d5d0]" />
              Report Analysis
            </CardTitle>
            <CardDescription>
              AI-generated interpretation of your medical report
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Executive Summary</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {result.summary}
                </p>
              </div>
              
              {keyFindings.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Key Findings</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {keyFindings.map((finding, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                    Report Clarity Score:
                  </span>
                  <div className="flex items-center">
                    <Progress 
                      value={result.confidence} 
                      className={`w-24 h-2 ${getConfidenceColor(result.confidence)}`} 
                    />
                    <span className="ml-2 text-sm font-medium">
                      {Math.round(result.confidence)}%
                    </span>
                  </div>
                </div>
                
                {result.confidence < 70 && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Low confidence - review carefully
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gradient-to-r from-transparent to-[#62d5d0]/10 text-sm text-gray-500">
            This is an AI-assisted analysis. Always consult with a medical professional.
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100/50 to-white dark:from-gray-900 dark:via-gray-800/60 dark:to-gray-900">
      {pageLoading && <Preloader message="Loading Medical Report Analyzer..." />}
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
              Medical Report Analyzer
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Upload your medical reports and get instant AI-powered analysis. Our system extracts key information 
              and provides clear explanations to help you better understand your health data.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Panel */}
                <Card className="w-full shadow-md">
                  <CardHeader className="bg-gradient-to-r from-[#62d5d0]/10 to-transparent">
                    <CardTitle className="flex items-center">
                      <Upload className="mr-2 h-5 w-5 text-[#62d5d0]" />
                      Upload Medical Report
                    </CardTitle>
                    <CardDescription>
                      Upload an image of your medical report for AI analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <CustomInput
                      onSubmit={handleFileUpload}
                      isLoading={isProcessing}
                      message={message}
                      setMessage={setMessage}
                      fileUrl={fileUrl}
                      setFileUrl={setFileUrl}
                      fileType={fileType}
                      setFileType={setFileType}
                      keystrokes={[]}
                      setKeystrokes={() => {}}
                      handleKeyDown={() => {}}
                      handleKeyUp={() => {}}
                    />
                    
                    <Button
                      onClick={() => handleFileUpload(message, fileUrl || "", fileType || "")}
                      disabled={isProcessing || (!message.trim() && !fileUrl)}
                      className="w-full bg-[#62d5d0] hover:bg-[#4db8b3] text-white"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FileCheck className="mr-2 h-5 w-5" />
                          Analyze Report
                        </>
                      )}
                    </Button>
                  </CardContent>
                  <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                      For best results, ensure the report image is clear and well-lit
                    </div>
                  </CardFooter>
                </Card>

                {/* Info Panel */}
                <div className="space-y-6">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>How It Works</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex">
                        <div className="flex-shrink-0 flex h-10 w-10 rounded-full bg-[#62d5d0]/10 items-center justify-center">
                          <span className="text-[#62d5d0] font-medium">1</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Upload Report</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Upload a clear image of your medical report document
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-shrink-0 flex h-10 w-10 rounded-full bg-[#62d5d0]/10 items-center justify-center">
                          <span className="text-[#62d5d0] font-medium">2</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Text Extraction</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Advanced OCR technology extracts text from your report
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-shrink-0 flex h-10 w-10 rounded-full bg-[#62d5d0]/10 items-center justify-center">
                          <span className="text-[#62d5d0] font-medium">3</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">AI Analysis</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Our AI interprets medical terminology and identifies key findings
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-shrink-0 flex h-10 w-10 rounded-full bg-[#62d5d0]/10 items-center justify-center">
                          <span className="text-[#62d5d0] font-medium">4</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Get Results</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Receive a clear summary and explanation of your medical report
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                
                  <Card className="shadow-md bg-gradient-to-r from-[#62d5d0]/5 to-white dark:from-[#62d5d0]/10 dark:to-gray-800">
                    <CardHeader>
                      <CardTitle>Supported Report Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        <Badge variant="secondary" className="justify-center py-1">Blood Tests</Badge>
                        <Badge variant="secondary" className="justify-center py-1">Pathology</Badge>
                        <Badge variant="secondary" className="justify-center py-1">Radiology</Badge>
                        <Badge variant="secondary" className="justify-center py-1">Lab Results</Badge>
                        <Badge variant="secondary" className="justify-center py-1">Physical Exams</Badge>
                        <Badge variant="secondary" className="justify-center py-1">Discharge Summaries</Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <p className="text-xs text-gray-500">
                        Note: Analysis accuracy varies based on image clarity and report complexity.
                      </p>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results" className="p-1">
              {isProcessing ? (
                renderProcessingState()
              ) : result ? (
                renderProcessedFindings()
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No Analysis Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6 text-center max-w-md">
                    Upload a medical report image from the Upload tab to see your analysis results here
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("upload")}
                    className="flex items-center"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Go to Upload
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            <p className="mb-2">
              <strong>Disclaimer:</strong> This tool is designed to assist in understanding medical reports 
              but is not a replacement for professional medical advice.
            </p>
            <p>
              Always consult with a healthcare provider to properly interpret medical reports and make health decisions.
            </p>
          </div>
        </div>
      </main>

      <EnhancedFooter />
    </div>
  );
};

export default ReportAnalysis;