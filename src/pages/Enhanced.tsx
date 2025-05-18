import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  Stethoscope,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  specialization: string;
  education: string;
  image_url: string;
  license_number: string;
}

const Enhanced = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get analysis ID from location state if available
  const [existingAnalysisId, setExistingAnalysisId] = useState(
    location.state?.analysisId
  );
  const [apiResponse, setApiResponse] = useState(location.state?.apiResponse);

  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [consentToShare, setConsentToShare] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if a record with the same content already exists
  useEffect(() => {
    const checkForExistingRecord = async () => {
      // Skip if we already have an analysisId or we don't have apiResponse
      if (existingAnalysisId || !apiResponse) return;
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) return;
        // Query for existing records with the same content
        const { data, error } = await supabase
          .from("analysis_records")
          .select("id, analysis_data")
          .eq("user_id", user.id)
          .filter("analysis_data", "neq", null);
        if (error || !data) return;
        // Find a match based on some unique property in the apiResponse
        const match = data.find((record: any) => {
          const analysisData = record.analysis_data;
          return (
            analysisData &&
            analysisData.analysis &&
            apiResponse.analysis &&
            analysisData.analysis.final_analysis ===
              apiResponse.analysis.final_analysis
          );
        });
        if (match) {
          setExistingAnalysisId(match.id);
        }
      } catch (err) {
        console.error("Error checking for existing records:", err);
      }
    };
    checkForExistingRecord();
  }, [existingAnalysisId, apiResponse]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase.from("doctors").select("*");

        if (error) {
          throw error;
        }

        setDoctors(data || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDoctor && consentToShare && agreeToTerms) {
      try {
        setSubmitting(true);
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user)
          throw new Error("You must be logged in to submit an analysis");
        let analysisId = existingAnalysisId;
        if (existingAnalysisId) {
          // If we have an existing analysisId, update that record
          const { error: updateError } = await supabase
            .from("analysis_records")
            .update({
              analysis_data: {
                ...apiResponse,
                doctor_id: selectedDoctor,
                status: "pending",
                request_date: new Date().toISOString(),
              },
            })
            .eq("id", existingAnalysisId);
          if (updateError) throw updateError;
        } else {
          // Only create a new record if no existing analysisId
          const { data: analysisRecord, error: analysisError } = await supabase
            .from("analysis_records")
            .insert({
              user_id: user.id,
              name: "Doctor Consultation Request",
              analysis_data: {
                ...apiResponse,
                doctor_id: selectedDoctor,
                status: "pending",
                request_date: new Date().toISOString(),
              },
            })
            .select()
            .single();
          if (analysisError) throw analysisError;
          analysisId = analysisRecord.id;
          setExistingAnalysisId(analysisId); // Store for future updates
        }
        toast({
          title: "Request Submitted",
          description: "Your consultation request has been sent to the doctor.",
        });
        // Redirect to the doctor response page
        navigate(
          `/doctor-response?analysisId=${analysisId}&doctorId=${selectedDoctor}`
        );
      } catch (err) {
        console.error("Error submitting form:", err);
        toast({
          title: "Submission Error",
          description:
            "There was a problem submitting your request. Please try again.",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    } else {
      toast({
        title: "Required Fields",
        description:
          "Please select a doctor and agree to all terms before submitting",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 via-blue-50/60 to-white dark:from-[#34205e]/50 dark:via-background/60 dark:to-background pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 pt-12">
          <Card className="w-full bg-white/90 dark:bg-card/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-[#62d5d0]">
                Our Doctor
              </CardTitle>
              <CardDescription>
                Choose a doctor who will review your medical information
              </CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin h-8 w-8 text-[#62d5d0]" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : (
                <RadioGroup
                  value={selectedDoctor || ""}
                  onValueChange={setSelectedDoctor}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                >
                  {doctors.map((doctor) => (
                    <Label
                      key={doctor.id}
                      htmlFor={doctor.id}
                      className={`flex flex-col h-full border rounded-lg p-4 cursor-pointer transition-all hover:border-[#62d5d0]/50 ${
                        selectedDoctor === doctor.id
                          ? "border-[#62d5d0] bg-[#62d5d0]/10"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <RadioGroupItem
                        value={doctor.id}
                        id={doctor.id}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12 border border-gray-200 dark:border-gray-700">
                          <AvatarImage
                            src={doctor.image_url}
                            alt={doctor.first_name}
                          />
                          <AvatarFallback>
                            <Stethoscope className="h-6 w-6 text-gray-400" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">
                              {doctor.first_name} {doctor.last_name}
                            </h3>
                            {selectedDoctor === doctor.id && (
                              <CheckCircle2 className="h-5 w-5 text-[#62d5d0]" />
                            )}
                          </div>
                          <p className="text-sm font-medium text-[#62d5d0]">
                            {doctor.specialization}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {doctor.education}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            License Number: {doctor.license_number}
                          </p>
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            </CardContent>
          </Card>

          <Card className="w-full bg-white/90 dark:bg-card/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-[#62d5d0]">
                Medical Consultation Consent
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <AlertDescription className="text-sm">
                  ⚠️ Please Note: By submitting your symptoms and personal
                  health information, you consent to sharing this data with
                  healthcare professionals. Ensure that you are comfortable
                  disclosing this information. We prioritize your privacy and
                  only use your data for medical consultation purposes.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox
                      id="consent"
                      checked={consentToShare}
                      onCheckedChange={(checked) =>
                        setConsentToShare(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="consent"
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      I consent to share my health information with qualified
                      healthcare professionals for consultation purposes
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) =>
                        setAgreeToTerms(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      I have read and agree to the privacy policy and understand
                      how my data will be used
                    </Label>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    type="submit"
                    className="w-full bg-[#62d5d0]/90 hover:bg-[#62d5d0] text-white"
                    disabled={
                      !selectedDoctor ||
                      !consentToShare ||
                      !agreeToTerms ||
                      submitting
                    }
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Submit and Continue"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center text-xs text-gray-500 dark:text-gray-400">
              <p>
                Your privacy is important to us. We adhere to strict data
                protection protocols.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Enhanced;
