// OutputHistory.tsx - Read-only version of Output page for displaying history
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import EnhancedFooter from "@/components/EnhancedFooter";
import FlowConditions from "@/components/FlowConditions";
import AnalysisHistorySidebar from "@/components/AnalysisHistorySidebar";
import { Download, ArrowLeft, Network } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface AnalysisHistory {
  id: string;
  date: Date;
  condition: string;
  severity: "Mild" | "Moderate" | "Severe";
  status: "Completed" | "In Progress" | "Needs Review";
  doctorName?: string;
  raw: any;
}

interface ApiResponse {
  response?: string;
  error?: string;
  llm_error?: string;
  analysis?: {
    final_analysis?: string;
    initial_diagnosis?: string;
    vectordb_results?: string;
    audio_analysis?: {
      detected_emotion: string;
      probabilities: {
        angry: number;
        fear: number;
        happy: number;
        neutral: number;
        sad: number;
      };
    };
    image_analysis?: {
      breastmnist?: {
        predicted_label: string;
        probability: number;
      };
      chestmnist?: {
        predicted_label: string;
        probability: number;
      };
      dermamnist?: {
        predicted_label: string;
        probability: number;
      };
      octmnist?: {
        predicted_label: string;
        probability: number;
      };
      pathmnist?: {
        predicted_label: string;
        probability: number;
      };
      pneumoniamnist?: {
        predicted_label: string;
        probability: number;
      };
    };
    typing_analysis?: {
      detected_condition: string;
      error?: string;
    };
  };
  status?: string;
}

const OutputHistoryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const apiResponse = location.state?.apiResponse as ApiResponse | undefined;
  const { user } = useAuth();
  const currentAnalysisId = location.state?.analysisId;

  // Fetch analysis history from Supabase
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);

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
    const newHistory = (data || []).map((item: any) => ({
      id: item.id,
      date: new Date(item.created_at),
      condition: item.analysis_data?.analysis?.final_analysis || "Unknown",
      severity: item.analysis_data?.analysis?.severity || "Moderate",
      status: "Completed" as const,
      doctorName: item.analysis_data?.doctorName || "",
      raw: item,
    }));
    setAnalysisHistory(newHistory);

    // If the currently viewed record was deleted, navigate back to dashboard
    if (
      currentAnalysisId &&
      !newHistory.find((item) => item.id === currentAnalysisId)
    ) {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleSelectAnalysis = (id: string) => {
    const record = analysisHistory.find((item) => item.id === id);
    if (record && record.raw) {
      navigate("/output-history", {
        state: {
          apiResponse: record.raw.analysis_data,
          analysisId: id,
        },
      });
    }
  };

  const downloadResponse = () => {
    if (!apiResponse) return;
    const jsonBlob = new Blob([JSON.stringify(apiResponse, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(jsonBlob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const a = document.createElement("a");
    a.href = url;
    a.download = `skin-analysis-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const goBackToInput = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 via-blue-50/60 to-white dark:from-[#34205e]/50 dark:via-background/60 dark:to-background">
      <AnalysisHistorySidebar
        history={analysisHistory}
        onSelectAnalysis={handleSelectAnalysis}
        isCollapsed={isSidebarCollapsed}
        onCollapse={setIsSidebarCollapsed}
        onHistoryUpdate={fetchHistory}
      />
      <Navbar />
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-16" : "ml-80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Analysis Results
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Review your skin analysis results below. You can save these
              results or return to the input form.
            </p>
          </div>

          {apiResponse ? (
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                <TabsTrigger value="text">Text Analysis</TabsTrigger>
                <TabsTrigger value="flow">Visual Flow</TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <Card className="w-full max-w-6xl mx-auto bg-white/90 dark:bg-card/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-[#62d5d0]">
                      Skin Analysis Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                          Analysis
                        </h2>
                        {apiResponse.analysis && (
                          <>
                            <div className="mb-6">
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                Final Analysis
                              </h3>
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                                {apiResponse.analysis.final_analysis}
                              </div>
                            </div>

                            <div className="mb-6">
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                Initial Diagnosis
                              </h3>
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                                {apiResponse.analysis.initial_diagnosis}
                              </div>
                            </div>

                            {apiResponse.analysis?.audio_analysis && (
                              <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                  Audio Analysis
                                </h3>
                                <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                                  <p>
                                    <strong>Detected Emotion:</strong>{" "}
                                    {
                                      apiResponse.analysis.audio_analysis
                                        .detected_emotion
                                    }
                                  </p>
                                  <div className="mt-2">
                                    <p className="mb-1">
                                      <strong>Emotion Probabilities:</strong>
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div>
                                        Angry:{" "}
                                        {(
                                          apiResponse.analysis.audio_analysis
                                            .probabilities.angry * 100
                                        ).toFixed(1)}
                                        %
                                      </div>
                                      <div>
                                        Fear:{" "}
                                        {(
                                          apiResponse.analysis.audio_analysis
                                            .probabilities.fear * 100
                                        ).toFixed(1)}
                                        %
                                      </div>
                                      <div>
                                        Happy:{" "}
                                        {(
                                          apiResponse.analysis.audio_analysis
                                            .probabilities.happy * 100
                                        ).toFixed(1)}
                                        %
                                      </div>
                                      <div>
                                        Neutral:{" "}
                                        {(
                                          apiResponse.analysis.audio_analysis
                                            .probabilities.neutral * 100
                                        ).toFixed(1)}
                                        %
                                      </div>
                                      <div>
                                        Sad:{" "}
                                        {(
                                          apiResponse.analysis.audio_analysis
                                            .probabilities.sad * 100
                                        ).toFixed(1)}
                                        %
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {apiResponse.analysis?.image_analysis && (
                              <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                  Image Analysis
                                </h3>
                                <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {apiResponse.analysis.image_analysis
                                      .dermamnist && (
                                      <div className="p-2 border rounded-lg border-gray-200 dark:border-gray-700">
                                        <p className="font-medium">
                                          Skin Analysis (DermaMNIST):
                                        </p>
                                        <p>
                                          Prediction:{" "}
                                          {
                                            apiResponse.analysis.image_analysis
                                              .dermamnist.predicted_label
                                          }
                                        </p>
                                        <p>
                                          Confidence:{" "}
                                          {(
                                            apiResponse.analysis.image_analysis
                                              .dermamnist.probability * 100
                                          ).toFixed(1)}
                                          %
                                        </p>
                                      </div>
                                    )}
                                    {apiResponse.analysis.image_analysis
                                      .breastmnist && (
                                      <div className="p-2 border rounded-lg border-gray-200 dark:border-gray-700">
                                        <p className="font-medium">
                                          Breast Analysis:
                                        </p>
                                        <p>
                                          Prediction:{" "}
                                          {
                                            apiResponse.analysis.image_analysis
                                              .breastmnist.predicted_label
                                          }
                                        </p>
                                        <p>
                                          Confidence:{" "}
                                          {(
                                            apiResponse.analysis.image_analysis
                                              .breastmnist.probability * 100
                                          ).toFixed(1)}
                                          %
                                        </p>
                                      </div>
                                    )}
                                    {apiResponse.analysis.image_analysis
                                      .chestmnist && (
                                      <div className="p-2 border rounded-lg border-gray-200 dark:border-gray-700">
                                        <p className="font-medium">
                                          Chest X-Ray Analysis:
                                        </p>
                                        <p>
                                          Prediction:{" "}
                                          {
                                            apiResponse.analysis.image_analysis
                                              .chestmnist.predicted_label
                                          }
                                        </p>
                                        <p>
                                          Confidence:{" "}
                                          {(
                                            apiResponse.analysis.image_analysis
                                              .chestmnist.probability * 100
                                          ).toFixed(1)}
                                          %
                                        </p>
                                      </div>
                                    )}
                                    {apiResponse.analysis.image_analysis
                                      .octmnist && (
                                      <div className="p-2 border rounded-lg border-gray-200 dark:border-gray-700">
                                        <p className="font-medium">
                                          OCT Analysis:
                                        </p>
                                        <p>
                                          Prediction:{" "}
                                          {
                                            apiResponse.analysis.image_analysis
                                              .octmnist.predicted_label
                                          }
                                        </p>
                                        <p>
                                          Confidence:{" "}
                                          {(
                                            apiResponse.analysis.image_analysis
                                              .octmnist.probability * 100
                                          ).toFixed(1)}
                                          %
                                        </p>
                                      </div>
                                    )}
                                    {apiResponse.analysis.image_analysis
                                      .pathmnist && (
                                      <div className="p-2 border rounded-lg border-gray-200 dark:border-gray-700">
                                        <p className="font-medium">
                                          Pathology Analysis:
                                        </p>
                                        <p>
                                          Prediction:{" "}
                                          {
                                            apiResponse.analysis.image_analysis
                                              .pathmnist.predicted_label
                                          }
                                        </p>
                                        <p>
                                          Confidence:{" "}
                                          {(
                                            apiResponse.analysis.image_analysis
                                              .pathmnist.probability * 100
                                          ).toFixed(1)}
                                          %
                                        </p>
                                      </div>
                                    )}
                                    {apiResponse.analysis.image_analysis
                                      .pneumoniamnist && (
                                      <div className="p-2 border rounded-lg border-gray-200 dark:border-gray-700">
                                        <p className="font-medium">
                                          Pneumonia Analysis:
                                        </p>
                                        <p>
                                          Prediction:{" "}
                                          {
                                            apiResponse.analysis.image_analysis
                                              .pneumoniamnist.predicted_label
                                          }
                                        </p>
                                        <p>
                                          Confidence:{" "}
                                          {(
                                            apiResponse.analysis.image_analysis
                                              .pneumoniamnist.probability * 100
                                          ).toFixed(1)}
                                          %
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {apiResponse.analysis?.typing_analysis && (
                              <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                  Typing Analysis
                                </h3>
                                <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                                  {apiResponse.analysis.typing_analysis
                                    .error ? (
                                    <p className="text-amber-600 dark:text-amber-400">
                                      {
                                        apiResponse.analysis.typing_analysis
                                          .error
                                      }
                                    </p>
                                  ) : (
                                    <p>
                                      <strong>Detected Condition:</strong>{" "}
                                      {
                                        apiResponse.analysis.typing_analysis
                                          .detected_condition
                                      }
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="mb-6">
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                VectorDB Results
                              </h3>
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                                {apiResponse?.analysis?.vectordb_results && (
                                  <div className="mt-6 w-full">
                                    <h3 className="font-semibold text-lg mb-4 text-[#62d5d0]">
                                      Similar Conditions (Vector DB Results):
                                    </h3>
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700">
                                        <thead className="bg-gray-100 dark:bg-gray-800">
                                          <tr>
                                            <th className="px-4 py-2 border-b dark:border-gray-700">
                                              Condition
                                            </th>
                                            <th className="px-4 py-2 border-b dark:border-gray-700">
                                              Symptoms
                                            </th>
                                            <th className="px-4 py-2 border-b dark:border-gray-700">
                                              Treatment
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {[
                                            ...apiResponse.analysis.vectordb_results.matchAll(
                                              /([^,]+(?:\([^)]*\))?)\s*,"([^"]+)","([^"]+)"/g
                                            ),
                                          ].map((match, index) => (
                                            <tr
                                              key={index}
                                              className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
                                            >
                                              <td className="px-4 py-2 border-b dark:border-gray-700">
                                                {match[1]}
                                              </td>
                                              <td className="px-4 py-2 border-b dark:border-gray-700">
                                                {match[2]}
                                              </td>
                                              <td className="px-4 py-2 border-b dark:border-gray-700">
                                                {match[3]}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                        {apiResponse.response && !apiResponse.analysis && (
                          <div className="mb-2">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Response
                            </h3>
                            <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                              {apiResponse.response}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap justify-between gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={goBackToInput}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Input
                    </Button>
                    <Button
                      onClick={downloadResponse}
                      variant="default"
                      className="flex items-center gap-1 bg-[#62d5d0]/90 hover:bg-[#62d5d0] text-white"
                    >
                      <Download className="h-4 w-4" />
                      Save Results
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="flow">
                <Card className="w-full mx-auto bg-white/90 dark:bg-card/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-[#62d5d0] flex items-center gap-2">
                      <Network size={20} />
                      Condition Flow Visualization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-2 rounded-xl">
                      {/* Flow visualization component */}
                      <FlowConditions apiResponse={apiResponse} />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap justify-between gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={goBackToInput}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Input
                    </Button>
                    <Button
                      onClick={downloadResponse}
                      variant="default"
                      className="flex items-center gap-1 bg-[#62d5d0]/90 hover:bg-[#62d5d0] text-white"
                    >
                      <Download className="h-4 w-4" />
                      Save Results
                    </Button>
                    <Button
                      variant="default"
                      className="bg-[#62d5d0]/90 hover:bg-[#62d5d0] text-white"
                      onClick={() => navigate("/enhanced")}
                    >
                      Enhanced Analysis
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                No analysis results found. Please return to the input form.
              </p>
              <Button
                onClick={goBackToInput}
                className="bg-[#62d5d0] hover:bg-[#62d5d0]/90 text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Input Form
              </Button>
            </div>
          )}

          <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Note: This analysis is for informational purposes only and does
              not replace professional medical advice. Always consult with a
              healthcare provider for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
};

export default OutputHistoryPage;
