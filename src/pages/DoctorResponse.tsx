import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import {
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  ChevronLeft,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface DoctorAnalysis {
  id: string;
  doctor_id: string;
  analysis_id: string;
  diagnosis: string;
  treatment_plan: string;
  recommendations: string;
  follow_up_notes: string;
  severity_assessment: string;
  created_at: string;
  doctor: {
    first_name: string;
    last_name: string;
    specialization: string;
  };
}

interface Analysis {
  id: string;
  user_id: string;
  created_at: string;
  name: string;
  analysis_data: any;
}

const DoctorResponse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const analysisId = searchParams.get("analysisId");
  const doctorId = searchParams.get("doctorId");

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [doctorAnalysis, setDoctorAnalysis] = useState<DoctorAnalysis | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysisAndResponse = async () => {
      if (!user) {
        setError("You must be logged in to view this page");
        setLoading(false);
        return;
      }

      if (!analysisId || !doctorId) {
        setError("Missing analysis ID or doctor ID in URL.");
        setLoading(false);
        return;
      }

      try {
        // Get the specific analysis record using the analysisId from the URL
        const { data: analysisData, error: analysisError } = await supabase
          .from("analysis_records")
          .select("*")
          .eq("id", analysisId)
          .single();

        if (analysisError) {
          throw analysisError;
        }

        if (!analysisData) {
          setError("Analysis record not found.");
          setLoading(false);
          return;
        }

        setAnalysis(analysisData);

        // Check if there's a doctor analysis for this analysis record and doctor
        const { data: doctorAnalysisData, error: doctorAnalysisError } =
          await supabase
            .from("doctor_analyses")
            .select(
              `
            *,
            doctor:doctors(
              first_name,
              last_name,
              specialization
            )
          `
            )
            .eq("analysis_id", analysisId)
            .eq("doctor_id", doctorId) // Use doctorId from URL
            .maybeSingle();

        console.log(
          "Fetching doctor analysis with analysisId:",
          analysisId,
          "and doctorId:",
          doctorId
        );
        console.log("Doctor analysis fetch result data:", doctorAnalysisData);
        console.log("Doctor analysis fetch result error:", doctorAnalysisError);

        if (doctorAnalysisError) {
          console.error("Error fetching doctor analysis:", doctorAnalysisError);
        } else if (doctorAnalysisData) {
          setDoctorAnalysis(doctorAnalysisData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load analysis data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisAndResponse();

    // No need to poll if we are loading a specific doctor analysis
    return () => {};
  }, [user, analysisId, doctorId]); // Depend on user, analysisId, and doctorId

  const goBack = () => {
    navigate("/dashboard");
  };

  const getStatusBadge = () => {
    if (doctorAnalysis) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          Complete
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
      >
        <Clock className="h-3.5 w-3.5 mr-1" />
        Pending Doctor Review
      </Badge>
    );
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 via-blue-50/60 to-white dark:from-[#34205e]/50 dark:via-background/60 dark:to-background pt-20 pb-10 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#62d5d0] mx-auto mb-4" />
            <p className="text-gray-700 dark:text-gray-300">
              Loading your analysis data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 via-blue-50/60 to-white dark:from-[#34205e]/50 dark:via-background/60 dark:to-background pt-20 pb-10">
          <div className="max-w-2xl mx-auto px-4 pt-12">
            <Card className="w-full bg-white/90 dark:bg-card/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
              <CardHeader className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                <CardTitle className="text-xl text-red-500">Error</CardTitle>
                <CardDescription>
                  {error ||
                    "No analysis was found. Please submit an analysis first."}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Button
                  onClick={goBack}
                  className="bg-[#62d5d0]/90 hover:bg-[#62d5d0] text-white"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Return to Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 via-blue-50/60 to-white dark:from-[#34205e]/50 dark:via-background/60 dark:to-background pt-20 pb-10">
        <div className="max-w-4xl mx-auto px-4 pt-12">
          <Button variant="outline" className="mb-6" onClick={goBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="w-full bg-white/90 dark:bg-card/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700 mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-[#62d5d0]">
                  Analysis Status
                </CardTitle>
                <CardDescription>
                  Your analysis has been submitted
                </CardDescription>
              </div>
              {getStatusBadge()}
            </CardHeader>

            <CardContent>
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="bg-[#62d5d0]/20 p-2 rounded-full mr-3">
                    <FileText className="h-5 w-5 text-[#62d5d0]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Analysis ID</h3>
                    <p className="text-sm text-gray-500">
                      #{analysis.id.substring(0, 8)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-[#62d5d0]/20 p-2 rounded-full mr-3">
                    <Clock className="h-5 w-5 text-[#62d5d0]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Submitted on</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(analysis.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-2">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Doctor Information
                </h3>
                {doctorAnalysis?.doctor ? (
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <Avatar className="h-12 w-12 mr-4 border border-gray-200 dark:border-gray-700">
                      <AvatarFallback>
                        <Stethoscope className="h-6 w-6 text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        Dr. {doctorAnalysis.doctor.first_name}{" "}
                        {doctorAnalysis.doctor.last_name || ""}
                      </p>
                      <p className="text-sm text-[#62d5d0]">
                        {doctorAnalysis.doctor.specialization ||
                          "Medical Specialist"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Doctor information will be available when the analysis is
                    reviewed
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full bg-white/90 dark:bg-card/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-[#62d5d0]">
                Doctor's Response
              </CardTitle>
              <CardDescription>
                {doctorAnalysis
                  ? "The doctor has provided their assessment of your analysis"
                  : "Waiting for the doctor to review your analysis"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {doctorAnalysis ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Diagnosis
                    </h3>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-gray-800 dark:text-gray-200">
                        {doctorAnalysis.diagnosis}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Treatment Plan
                    </h3>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-gray-800 dark:text-gray-200">\
                        {doctorAnalysis.treatment_plan}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">\
                      Recommendations
                    </h3>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">\
                      <p className="text-gray-800 dark:text-gray-200">\
                        {doctorAnalysis.recommendations}
                      </p>
                    </div>
                  </div>

                  {doctorAnalysis.follow_up_notes && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">\
                        Follow-up Notes
                      </h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">\
                        <p className="text-gray-800 dark:text-gray-200">\
                          {doctorAnalysis.follow_up_notes}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500">\
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      Response provided on{" "}
                      {new Date(doctorAnalysis.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-3 mb-4">
                    <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Awaiting Doctor's Response
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Your analysis has been sent to the doctor for review. Please
                    check back later for the doctor's assessment.
                  </p>
                  <div className="mt-6 w-1/2 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 dark:bg-amber-600 animate-pulse rounded-full"></div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/dashboard")}
              >
                Return to Dashboard
              </Button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Need help? Contact our support team for assistance with your
                medical consultation.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorResponse;
