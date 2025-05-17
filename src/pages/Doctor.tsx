import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import FlowConditions from "@/components/FlowConditions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { supabase } from "../lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  Calendar,
  Search,
  Users,
  FileText,
  BarChart2,
  Clock,
  ArrowUpRight,
  Filter,
  Plus,
  MessageSquare,
  Download,
  Network,
  X,
  CheckCircle,
  User,
} from "lucide-react";
import Navbar from "@/components/Navbar";

interface Doctor {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  license_number: string;
  specialty?: string;
  education?: string;
  years_experience?: number;
  bio?: string;
  profile_image?: string;
  created_at: string;
}

interface AnalysisRecord {
  id: string;
  user_id: string;
  name: string;
  analysis_data: {
    analysis?: {
      severity?: string;
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
    response?: string;
  };
  created_at: string;
  user_profiles?: {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    gender?: string;
    height?: number;
    weight?: number;
    blood_type?: string;
    chronic_conditions?: string;
    medications?: string;
    allergies?: string;
    family_history?: string;
    smoking_status?: string;
    alcohol_consumption?: string;
    physical_activity?: string;
    occupation?: string;
    stress_level?: string;
    pregnancy_status?: string;
    sleep_hours?: number;
    diet_type?: string;
    hobbies?: string;
  };
}

interface PatientAppointment {
  id: string;
  name: string;
  time: string;
  type: string;
  condition: string;
  image: string;
  age?: number;
  status: string;
}

interface DoctorAnalysis {
  id?: string;
  analysis_id: string;
  doctor_id: string;
  diagnosis: string;
  treatment_plan: string;
  recommendations: string;
  follow_up_notes: string;
  severity_assessment: string;  // Added this field
  created_at?: string;
}

const Doctor = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentDoctorId, setCurrentDoctorId] = useState<string | null>(null);
  const [patientAppointments, setPatientAppointments] = useState<PatientAppointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisRecord | null>(null);
  const [doctorAnalysisDialog, setDoctorAnalysisDialog] = useState(false);
  const [currentDoctorAnalysis, setCurrentDoctorAnalysis] = useState<DoctorAnalysis | null>(null);
  const [existingDoctorAnalysis, setExistingDoctorAnalysis] = useState<DoctorAnalysis | null>(null);
  const [savingAnalysis, setSavingAnalysis] = useState(false);
  const [todaysPatientCount, setTodaysPatientCount] = useState(0);
  const { toast } = useToast();

  // Fetch doctors from Supabase
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.email) {
          setCurrentUserEmail(user.email);
          console.log("Current user email:", user.email);
          
          // Get current doctor's ID
          const { data: doctorData, error: doctorError } = await supabase
            .from("doctors")
            .select("id")
            .eq("email", user.email)
            .single();
            
          if (doctorData && !doctorError) {
            setCurrentDoctorId(doctorData.id);
            console.log("Current doctor ID:", doctorData.id);
          }
        }

        // Get all doctors
        const { data, error } = await supabase.from("doctors").select("*");

        if (error) {
          console.error("Error fetching doctors:", error);
          return;
        }

        if (data) {
          console.log("Doctors fetched:", data);
          setDoctors(data);
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Fetch analysis records as appointments
  useEffect(() => {
    const fetchAnalysisRecords = async () => {
      try {
        setLoadingAppointments(true);

        // Get all analysis records (removed date filter)
        const { data, error } = await supabase
          .from("analysis_records")
          .select(`
            id, 
            user_id, 
            name, 
            created_at, 
            analysis_data,
            user_profiles(
              first_name, 
              last_name, 
              date_of_birth, 
              gender,
              height,
              weight,
              blood_type,
              chronic_conditions,
              medications,
              allergies,
              family_history,
              smoking_status,
              alcohol_consumption,
              physical_activity,
              occupation,
              stress_level
            )
          `)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching analysis records:", error);
          return;
        }

        if (data) {
          console.log("Analysis records fetched:", data);

          // Transform analysis records to appointment format
          const appointments: PatientAppointment[] = data.map((record: any) => {
            // Calculate appointment time (convert from ISO to readable time)
            const appointmentDate = new Date(record.created_at);
            const hours = appointmentDate.getHours();
            const minutes = appointmentDate.getMinutes();
            const ampm = hours >= 12 ? "PM" : "AM";
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes.toString().padStart(2, "0");
            const timeStr = `${formattedHours}:${formattedMinutes} ${ampm}`;

            // Calculate age if date_of_birth is available
            let age;
            if (record.user_profiles?.date_of_birth) {
              const birthDate = new Date(record.user_profiles.date_of_birth);
              const ageDifMs = Date.now() - birthDate.getTime();
              const ageDate = new Date(ageDifMs);
              age = Math.abs(ageDate.getUTCFullYear() - 1970);
            }

            // Get patient name or use a placeholder
            const patientName = record.user_profiles
              ? `${record.user_profiles.first_name || ""} ${
                  record.user_profiles.last_name || ""
                }`.trim()
              : `Patient ${record.id.slice(0, 5)}`;

            return {
              id: record.id,
              name: patientName,
              time: timeStr,
              type: "Consultation",
              condition:
                record.analysis_data?.analysis?.final_analysis ||
                record.analysis_data?.analysis?.initial_diagnosis ||
                "Unknown",
              image: "/placeholder.svg",
              age: age,
              status:
                new Date().getTime() - appointmentDate.getTime() <
                30 * 60 * 1000
                  ? "Checked In"
                  : "Scheduled",
            };
          });

          setPatientAppointments(appointments);

          // Count today's patients
          const today = new Date().toISOString().split("T")[0];
          const todaysCount = data.filter((record: any) =>
            record.created_at.startsWith(today)
          ).length;
          setTodaysPatientCount(todaysCount);
        }
      } catch (err) {
        console.error("Failed to fetch analysis records:", err);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAnalysisRecords();
  }, [selectedDate]); // Refetch if selected date changes

  // Function to fetch and view the complete analysis record when "View Analysis" is clicked
  const handleViewAnalysis = async (appointmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('analysis_records')
        .select(`
          *,
          user_profiles(
            first_name, 
            last_name, 
            date_of_birth, 
            gender,
            height,
            weight,
            blood_type,
            chronic_conditions,
            medications,
            allergies,
            family_history,
            smoking_status,
            alcohol_consumption,
            physical_activity,
            occupation,
            stress_level
          )
        `)
        .eq('id', appointmentId)
        .single();
        
      if (error) {
        console.error("Error fetching analysis record:", error);
        return;
      }
      
      if (data) {
        console.log("Analysis record fetched:", data);
        setSelectedAnalysis(data);
        
        // Check if there's an existing doctor analysis for this record
        if (currentDoctorId) {
          const { data: doctorAnalysisData, error: doctorAnalysisError } = await supabase
            .from('doctor_analyses')
            .select('*')
            .eq('analysis_id', appointmentId)
            .eq('doctor_id', currentDoctorId)
            .single();
            
          if (doctorAnalysisData && !doctorAnalysisError) {
            setExistingDoctorAnalysis(doctorAnalysisData);
            console.log("Found existing doctor analysis:", doctorAnalysisData);
          } else {
            setExistingDoctorAnalysis(null);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch analysis record details:", err);
    }
  };

  // Function to create or open doctor analysis
  const handleCreateAnalysis = () => {
    if (!selectedAnalysis || !currentDoctorId) return;
    
    // Always create a new analysis object, even if there's an existing one
    setCurrentDoctorAnalysis({
      analysis_id: selectedAnalysis.id,
      doctor_id: currentDoctorId,
      diagnosis: selectedAnalysis.analysis_data?.analysis?.initial_diagnosis || "",
      treatment_plan: "",
      recommendations: "",
      follow_up_notes: "",
      severity_assessment: selectedAnalysis.analysis_data?.analysis?.severity || "Moderate" // Default to Moderate if no severity in analysis
    });
    
    setDoctorAnalysisDialog(true);
  };

  // Function to save doctor analysis
  const saveDoctorAnalysis = async () => {
    if (!currentDoctorAnalysis || !currentDoctorId) return;
    
    try {
      setSavingAnalysis(true);
      
      // Always insert a new analysis, never update existing ones
      const { data, error } = await supabase
        .from('doctor_analyses')
        .insert({
          analysis_id: currentDoctorAnalysis.analysis_id,
          doctor_id: currentDoctorId,
          diagnosis: currentDoctorAnalysis.diagnosis,
          treatment_plan: currentDoctorAnalysis.treatment_plan,
          recommendations: currentDoctorAnalysis.recommendations,
          follow_up_notes: currentDoctorAnalysis.follow_up_notes,
          severity_assessment: currentDoctorAnalysis.severity_assessment
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error creating doctor analysis:", error);
        alert("Failed to save analysis: " + error.message);
        return;
      }
      
      // Update the existing doctor analysis with the result for the UI
      setExistingDoctorAnalysis(data);
      console.log("Analysis saved successfully:", data);
      
      // Close the dialog
      setDoctorAnalysisDialog(false);

      // Show toast notification
      toast({
        title: "Analysis Saved",
        description: (
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
            <span>Your analysis has been saved successfully.</span>
          </div>
        ),
      });

      // Update the appointment status
      setPatientAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === currentDoctorAnalysis.analysis_id
            ? { ...appointment, status: "Analyzed" }
            : appointment
        )
      );
    } catch (err) {
      console.error("Failed to save doctor analysis:", err);
      alert("An unexpected error occurred while saving the analysis");
    } finally {
      setSavingAnalysis(false);
    }
  };

  // Function to download analysis response as JSON
  const downloadResponse = () => {
    if (!selectedAnalysis) return;

    // Create a Blob with the JSON data
    const jsonBlob = new Blob([JSON.stringify(selectedAnalysis.analysis_data, null, 2)], {
      type: "application/json",
    });

    // Create a URL for the Blob
    const url = URL.createObjectURL(jsonBlob);

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    // Create an anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = `patient-analysis-${selectedAnalysis.id}-${timestamp}.json`;

    // Trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Dashboard Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-8"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>

          </TabsList>

          {/* Dashboard Content */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Today's Patients
                      </p>
                      <h3 className="text-2xl font-bold mt-1">{todaysPatientCount}</h3>
                      <p className="text-xs text-green-500 mt-1 flex items-center"></p>
                    </div>
                    <div className="bg-[#62d5d0]/10 p-3 rounded-full">
                      <Users className="h-5 w-5 text-[#62d5d0]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Skin Analyses
                      </p>
                      <h3 className="text-2xl font-bold mt-1">24</h3>
                      <p className="text-xs text-green-500 mt-1 flex items-center"></p>
                    </div>
                    <div className="bg-[#62d5d0]/10 p-3 rounded-full">
                      <FileText className="h-5 w-5 text-[#62d5d0]" />
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Average Wait Time
                      </p>
                      <h3 className="text-2xl font-bold mt-1">14m</h3>
                      <p className="text-xs text-red-500 mt-1 flex items-center"></p>
                    </div>
                    <div className="bg-[#62d5d0]/10 p-3 rounded-full">
                      <Clock className="h-5 w-5 text-[#62d5d0]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        AI Accuracy
                      </p>
                      <h3 className="text-2xl font-bold mt-1">96%</h3>
                      <p className="text-xs text-green-500 mt-1 flex items-center"></p>
                    </div>
                    <div className="bg-[#62d5d0]/10 p-3 rounded-full">
                      <BarChart2 className="h-5 w-5 text-[#62d5d0]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments & Patient Queue Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Today's Appointments</CardTitle>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 text-xs h-9 pl-3 pr-3"
                        >
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{format(selectedDate, "d MMM, yyyy")}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          initialFocus
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {loadingAppointments ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#62d5d0] border-r-transparent align-[-0.125em]" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                      </div>
                      <p className="ml-3 text-gray-600 dark:text-gray-300">Loading patient appointments...</p>
                    </div>
                  ) : patientAppointments.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">No appointments found for today.</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Patient analyses will appear here when they are submitted.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400">Patient</th>
                            <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400">Time</th>
                            <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400">Type</th>
                            <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400">Condition</th>
                            <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                            <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patientAppointments.map((appointment) => (
                            <tr key={appointment.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                              <td className="py-3 px-6">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={appointment.image} />
                                    <AvatarFallback className="bg-gray-200 text-gray-600">
                                      {appointment.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm">{appointment.name}</p>
                                    {appointment.age && (
                                      <p className="text-xs text-gray-500">{appointment.age} years</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-6 text-sm">{appointment.time}</td>
                              <td className="py-3 px-6">
                                <Badge variant="outline" className="font-normal">
                                  {appointment.type}
                                </Badge>
                              </td>
                              <td className="py-3 px-6">
                                <Badge 
                                  variant="outline" 
                                  className={`font-normal ${
                                    appointment.condition.toLowerCase().includes('mild') || 
                                    appointment.condition.toLowerCase().includes('minor')
                                      ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300" 
                                    : appointment.condition.toLowerCase().includes('moderate')
                                      ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300"
                                    : appointment.condition.toLowerCase().includes('severe') || 
                                      appointment.condition.toLowerCase().includes('serious')
                                      ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300"
                                    : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300"
                                  }`}
                                >
                                  {appointment.condition}
                                </Badge>
                              </td>
                              <td className="py-3 px-6">
                                <Badge
                                  variant={appointment.status === "Checked In" ? "default" : "secondary"}
                                  className={`font-normal ${
                                    appointment.status === "Checked In"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                                  }`}
                                >
                                  {appointment.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-6 text-right">
                                <Button variant="ghost" size="sm" onClick={() => handleViewAnalysis(appointment.id)}>View Analysis</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Tab Content */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Medical Team</CardTitle>
                    <CardDescription>
                      View and manage doctor information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div
                      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#62d5d0] border-r-transparent align-[-0.125em]"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                    <p className="ml-3 text-gray-600 dark:text-gray-300">
                      Loading doctor information...
                    </p>
                  </div>
                ) : doctors.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No doctors found in the database.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                      <Card key={doctor.id} className="overflow-hidden">
                        <div className="bg-gradient-to-r from-[#62d5d0]/80 to-[#62d5d0]/40 h-8"></div>
                        <CardContent className="pt-6 relative">
                          <Avatar className="h-16 w-16 border-4 border-white dark:border-gray-800 absolute -top-8 left-4 shadow-md">
                            <AvatarImage
                              src={doctor.profile_image || "/placeholder.svg"}
                            />
                            <AvatarFallback className="bg-[#62d5d0] text-white text-lg">
                              {`${doctor.first_name?.charAt(0) || ""}${
                                doctor.last_name?.charAt(0) || ""
                              }`}
                            </AvatarFallback>
                          </Avatar>

                          <div className="mt-8">
                            <h3 className="text-lg font-semibold">
                              Dr. {doctor.first_name} {doctor.last_name}
                            </h3>

                            <div className="grid grid-cols-1 gap-3 mt-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Email
                                </p>
                                <p className="text-sm">{doctor.email}</p>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  License Number
                                </p>
                                <p className="text-sm">
                                  {doctor.license_number || "Not specified"}
                                </p>
                              </div>

                              {doctor.bio && (
                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Bio
                                  </p>
                                  <p className="text-sm line-clamp-3">
                                    {doctor.bio}
                                  </p>
                                </div>
                              )}

                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Joined
                                </p>
                                <p className="text-sm">
                                  {new Date(
                                    doctor.created_at
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Doctor Profile */}
            {!loading &&
              currentUserEmail &&
              doctors.find((doc) => doc.email === currentUserEmail) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>
                      Update your professional information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const currentDoctor = doctors.find(
                        (doc) => doc.email === currentUserEmail
                      );
                      if (!currentDoctor) return null;

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-20 w-20">
                                <AvatarImage
                                  src={
                                    currentDoctor.profile_image ||
                                    "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback className="bg-[#62d5d0] text-white text-xl">
                                  {`${
                                    currentDoctor.first_name?.charAt(0) || ""
                                  }${currentDoctor.last_name?.charAt(0) || ""}`}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-semibold">
                                  Dr. {currentDoctor.first_name}{" "}
                                  {currentDoctor.last_name}
                                </h3>
                                <p className="text-[#62d5d0]">
                                  {currentDoctor.specialty ||
                                    "General Practice"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  License #: {currentDoctor.license_number}
                                </p>
                              </div>
                            </div>

                            <div className="pt-4">
                              <p className="text-sm font-medium text-gray-500 mb-1">
                                About
                              </p>
                              <p className="text-sm">
                                {currentDoctor.bio ||
                                  "No bio information available. Click Edit Profile to add your professional bio."}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">
                                Contact
                              </p>
                              <p className="text-sm">{currentDoctor.email}</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                            <h4 className="font-medium mb-4">
                              Professional Details
                            </h4>
                            <div className="space-y-4">
                              {currentDoctor.education && (
                                <div>
                                  <p className="text-sm font-medium text-gray-500">
                                    Education
                                  </p>
                                  <p className="text-sm">
                                    {currentDoctor.education}
                                  </p>
                                </div>
                              )}

                              {currentDoctor.years_experience !== undefined && (
                                <div>
                                  <p className="text-sm font-medium text-gray-500">
                                    Years of Experience
                                  </p>
                                  <p className="text-sm">
                                    {currentDoctor.years_experience} years
                                  </p>
                                </div>
                              )}

                              <div>
                                <p className="text-sm font-medium text-gray-500">
                                  CerebrumAI Status
                                </p>
                                <div className="flex items-center mt-1">
                                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                  <p className="text-sm">Verified Doctor</p>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-gray-500">
                                  Account Created
                                </p>
                                <p className="text-sm">
                                  {new Date(
                                    currentDoctor.created_at
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
      {/* Analysis Dialog */}
      {selectedAnalysis && (
        <Dialog open={!!selectedAnalysis} onOpenChange={() => setSelectedAnalysis(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="text-[#62d5d0]">Patient Analysis Results</DialogTitle>
              <DialogDescription>
                Analysis from {new Date(selectedAnalysis.created_at).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
                <TabsTrigger value="text">AI Analysis</TabsTrigger>
                <TabsTrigger value="doctor">Doctor's Analysis</TabsTrigger>
                <TabsTrigger value="patient">Patient Info</TabsTrigger>
                <TabsTrigger value="flow">Visual Flow</TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                      Analysis
                    </h2>

                    {selectedAnalysis.analysis_data.analysis && (
                      <>
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Final Analysis
                          </h3>
                          <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                            {selectedAnalysis.analysis_data.analysis.final_analysis}
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Initial Diagnosis
                          </h3>
                          <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                            {selectedAnalysis.analysis_data.analysis.initial_diagnosis}
                          </div>
                        </div>

                        {selectedAnalysis.analysis_data.analysis.audio_analysis && (
                          <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Audio Analysis
                            </h3>
                            <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                              <p>
                                <strong>Detected Emotion:</strong>{" "}
                                {selectedAnalysis.analysis_data.analysis.audio_analysis.detected_emotion}
                              </p>
                              <div className="mt-2">
                                <p className="mb-1">
                                  <strong>Emotion Probabilities:</strong>
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    Angry:{" "}
                                    {(
                                      selectedAnalysis.analysis_data.analysis.audio_analysis
                                        .probabilities.angry * 100
                                    ).toFixed(1)}
                                    %
                                  </div>
                                  <div>
                                    Fear:{" "}
                                    {(
                                      selectedAnalysis.analysis_data.analysis.audio_analysis
                                        .probabilities.fear * 100
                                    ).toFixed(1)}
                                    %
                                  </div>
                                  <div>
                                    Happy:{" "}
                                    {(
                                      selectedAnalysis.analysis_data.analysis.audio_analysis
                                        .probabilities.happy * 100
                                    ).toFixed(1)}
                                    %
                                  </div>
                                  <div>
                                    Neutral:{" "}
                                    {(
                                      selectedAnalysis.analysis_data.analysis.audio_analysis
                                        .probabilities.neutral * 100
                                    ).toFixed(1)}
                                    %
                                  </div>
                                  <div>
                                    Sad:{" "}
                                    {(
                                      selectedAnalysis.analysis_data.analysis.audio_analysis
                                        .probabilities.sad * 100
                                    ).toFixed(1)}
                                    %
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedAnalysis.analysis_data.analysis.image_analysis && (
                          <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Image Analysis
                            </h3>
                            <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedAnalysis.analysis_data.analysis.image_analysis.dermamnist && (
                                  <div className="p-2 border rounded-lg border-gray-200 dark:border-gray-700">
                                    <p className="font-medium">Skin Analysis (DermaMNIST):</p>
                                    <p>
                                      Prediction:{" "}
                                      {selectedAnalysis.analysis_data.analysis.image_analysis.dermamnist.predicted_label}
                                    </p>
                                    <p>
                                      Confidence:{" "}
                                      {(
                                        selectedAnalysis.analysis_data.analysis.image_analysis
                                          .dermamnist.probability * 100
                                      ).toFixed(1)}
                                      %
                                    </p>
                                  </div>
                                )}
                                {selectedAnalysis.analysis_data.analysis.image_analysis.breastmnist && (
                                  <div className="p-2 border rounded-lg border-gray-200 dark:border-gray-700">
                                    <p className="font-medium">Breast Analysis:</p>
                                    <p>
                                      Prediction:{" "}
                                      {selectedAnalysis.analysis_data.analysis.image_analysis.breastmnist.predicted_label}
                                    </p>
                                    <p>
                                      Confidence:{" "}
                                      {(
                                        selectedAnalysis.analysis_data.analysis.image_analysis
                                          .breastmnist.probability * 100
                                      ).toFixed(1)}
                                      %
                                    </p>
                                  </div>
                                )}
                                {selectedAnalysis.analysis_data.analysis.image_analysis.chestmnist && (
                                  <div className="p-2 border rounded-lg border-gray-200 dark:border-gray-700">
                                    <p className="font-medium">Chest X-Ray Analysis:</p>
                                    <p>
                                      Prediction:{" "}
                                      {selectedAnalysis.analysis_data.analysis.image_analysis.chestmnist.predicted_label}
                                    </p>
                                    <p>
                                      Confidence:{" "}
                                      {(
                                        selectedAnalysis.analysis_data.analysis.image_analysis
                                          .chestmnist.probability * 100
                                      ).toFixed(1)}
                                      %
                                    </p>
                                  </div>
                                )}
                                {selectedAnalysis.analysis_data.analysis.image_analysis.octmnist && (
                                  <div className="p-2 border rounded-lg border-gray-200 dark:border-gray-700">
                                    <p className="font-medium">OCT Analysis:</p>
                                    <p>
                                      Prediction:{" "}
                                      {selectedAnalysis.analysis_data.analysis.image_analysis.octmnist.predicted_label}
                                    </p>
                                    <p>
                                      Confidence:{" "}
                                      {(
                                        selectedAnalysis.analysis_data.analysis.image_analysis
                                          .octmnist.probability * 100
                                      ).toFixed(1)}
                                      %
                                    </p>
                                  </div>
                                )}
                                {selectedAnalysis.analysis_data.analysis.image_analysis.pathmnist && (
                                  <div className="p-2 border rounded-lg border-gray-200 dark:border-gray-700">
                                    <p className="font-medium">Pathology Analysis:</p>
                                    <p>
                                      Prediction:{" "}
                                      {selectedAnalysis.analysis_data.analysis.image_analysis.pathmnist.predicted_label}
                                    </p>
                                    <p>
                                      Confidence:{" "}
                                      {(
                                        selectedAnalysis.analysis_data.analysis.image_analysis
                                          .pathmnist.probability * 100
                                      ).toFixed(1)}
                                      %
                                    </p>
                                  </div>
                                )}
                                {selectedAnalysis.analysis_data.analysis.image_analysis.pneumoniamnist && (
                                  <div className="p-2 border rounded-lg border-gray-200 dark:border-gray-700">
                                    <p className="font-medium">Pneumonia Analysis:</p>
                                    <p>
                                      Prediction:{" "}
                                      {selectedAnalysis.analysis_data.analysis.image_analysis.pneumoniamnist.predicted_label}
                                    </p>
                                    <p>
                                      Confidence:{" "}
                                      {(
                                        selectedAnalysis.analysis_data.analysis.image_analysis
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

                        {selectedAnalysis.analysis_data.analysis.typing_analysis && (
                          <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Typing Analysis
                            </h3>
                            <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                              {selectedAnalysis.analysis_data.analysis.typing_analysis.error ? (
                                <p className="text-amber-600 dark:text-amber-400">
                                  {selectedAnalysis.analysis_data.analysis.typing_analysis.error}
                                </p>
                              ) : (
                                <p>
                                  <strong>Detected Condition:</strong>{" "}
                                  {selectedAnalysis.analysis_data.analysis.typing_analysis.detected_condition}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {selectedAnalysis.analysis_data.analysis.vectordb_results && (
                          <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              VectorDB Results
                            </h3>
                            <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
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
                                        ...selectedAnalysis.analysis_data.analysis.vectordb_results.matchAll(
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
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {selectedAnalysis.analysis_data.response && !selectedAnalysis.analysis_data.analysis && (
                      <div className="mb-2">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Response
                        </h3>
                        <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                          {selectedAnalysis.analysis_data.response}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="doctor">
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Doctor's Analysis
                      </h2>
                      
                      <Button
                        onClick={handleCreateAnalysis}
                        variant="default"
                        className="bg-[#62d5d0]/90 hover:bg-[#62d5d0] text-white"
                        disabled={!currentDoctorId}
                      >
                        {existingDoctorAnalysis ? "Edit Analysis" : "Create Analysis"}
                      </Button>
                    </div>
                    
                    {existingDoctorAnalysis ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Doctor's Diagnosis
                          </h3>
                          <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                            {existingDoctorAnalysis.diagnosis || "No diagnosis provided"}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Treatment Plan
                          </h3>
                          <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                            {existingDoctorAnalysis.treatment_plan || "No treatment plan provided"}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            recommendations
                          </h3>
                          <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                            {existingDoctorAnalysis.recommendations || "No recommendation plan provided"}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Follow-up Notes
                          </h3>
                          <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-gray-200">
                            {existingDoctorAnalysis.follow_up_notes || "No follow-up notes provided"}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                          <Clock className="h-4 w-4 mr-1" />
                          Created: {new Date(existingDoctorAnalysis.created_at || '').toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <FileText size={40} className="text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 mb-2">No doctor's analysis has been created yet</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          Click the button above to create a medical assessment for this patient
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="patient">
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                      Patient Information
                    </h2>
                    
                    {selectedAnalysis && selectedAnalysis.user_profiles ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-[#62d5d0] mb-3">Personal Details</h3>
                            <div className="grid grid-cols-1 gap-3">
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Name
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.first_name} {selectedAnalysis.user_profiles.last_name}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Date of Birth
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.date_of_birth ? 
                                    format(new Date(selectedAnalysis.user_profiles.date_of_birth), "MMMM d, yyyy") : 
                                    "Not provided"}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Gender
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.gender || "Not provided"}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Blood Type
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.blood_type || "Not provided"}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Height / Weight
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.height ? selectedAnalysis.user_profiles.height + " cm" : "?"} / 
                                  {selectedAnalysis.user_profiles.weight ? selectedAnalysis.user_profiles.weight + " kg" : "?"}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Pregnancy Status
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.pregnancy_status === "pregnant" ? "Pregnant" : 
                                   selectedAnalysis.user_profiles.pregnancy_status === "not-pregnant" ? "Not Pregnant" : "Not specified"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Medical Information */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-[#62d5d0] mb-3">Medical History</h3>
                            <div className="grid grid-cols-1 gap-3">
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Chronic Conditions
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.chronic_conditions || "None reported"}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Current Medications
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.medications || "None reported"}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Allergies
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.allergies || "None reported"}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Family History
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.family_history || "None reported"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Lifestyle Information */}
                        <div className="space-y-4 md:col-span-2">
                          <div>
                            <h3 className="text-sm font-medium text-[#62d5d0] mb-3">Lifestyle Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Smoking Status
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.smoking_status || "Not provided"}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Alcohol Consumption
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.alcohol_consumption || "Not provided"}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Physical Activity
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.physical_activity || "Not provided"}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Sleep Hours
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.sleep_hours ? selectedAnalysis.user_profiles.sleep_hours + " hours" : "Not provided"}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Diet Type
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.diet_type || "Not provided"}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Occupation
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.occupation || "Not provided"}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Stress Level
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.stress_level || "Not provided"}
                                </p>
                              </div>
                              
                              <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Hobbies/Interests
                                </p>
                                <p className="text-base">
                                  {selectedAnalysis.user_profiles.hobbies || "Not provided"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <User size={40} className="text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 mb-2">No patient profile information available</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          This patient hasn't completed their profile information
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="flow">
                <div className="p-2 rounded-xl">
                  {selectedAnalysis?.analysis_data ? (
                    <FlowConditions apiResponse={selectedAnalysis.analysis_data} />
                  ) : (
                    <div className="flex items-center justify-center h-48">
                      <Network size={40} className="text-[#62d5d0]/40" />
                      <p className="ml-3 text-gray-500">No data available to visualize</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="flex flex-wrap justify-between gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => setSelectedAnalysis(null)}
              >
                <X className="h-4 w-4" />
                Close
              </Button>
              
              <Button
                onClick={downloadResponse}
                variant="default"
                className="flex items-center gap-1 bg-[#62d5d0]/90 hover:bg-[#62d5d0] text-white"
              >
                <Download className="h-4 w-4" />
                Download Analysis Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Doctor Analysis Dialog */}
      {doctorAnalysisDialog && currentDoctorAnalysis && (
        <Dialog open={doctorAnalysisDialog} onOpenChange={setDoctorAnalysisDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="text-[#62d5d0]">
                {existingDoctorAnalysis ? "Edit Medical Analysis" : "Create Medical Analysis"}
              </DialogTitle>
              <DialogDescription>
                {existingDoctorAnalysis 
                  ? "Update your medical assessment for this patient" 
                  : "Provide your medical assessment for this patient"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="diagnosis" className="text-sm font-medium">
                  Diagnosis
                </label>
                <textarea 
                  id="diagnosis"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
                  rows={4}
                  value={currentDoctorAnalysis.diagnosis}
                  onChange={(e) => setCurrentDoctorAnalysis({
                    ...currentDoctorAnalysis,
                    diagnosis: e.target.value
                  })}
                  placeholder="Enter your diagnosis based on the analysis results..."
                />
                <p className="text-xs text-gray-500">
                  Include your professional assessment of the patient's condition
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="treatment" className="text-sm font-medium">
                  Treatment Plan
                </label>
                <textarea 
                  id="treatment"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
                  rows={4}
                  value={currentDoctorAnalysis.treatment_plan}
                  onChange={(e) => setCurrentDoctorAnalysis({
                    ...currentDoctorAnalysis,
                    treatment_plan: e.target.value
                  })}
                  placeholder="Describe the recommended treatment plan..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="treatment" className="text-sm font-medium">
                  Recommendation
                </label>
                <textarea 
                  id="treatment"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
                  rows={4}
                  value={currentDoctorAnalysis.recommendations}
                  onChange={(e) => setCurrentDoctorAnalysis({
                    ...currentDoctorAnalysis,
                    recommendations: e.target.value
                  })}
                  placeholder="Describe the recommended treatment plan..."
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="followup" className="text-sm font-medium">
                  Follow-up Notes
                </label>
                <textarea 
                  id="followup"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
                  rows={3}
                  value={currentDoctorAnalysis.follow_up_notes}
                  onChange={(e) => setCurrentDoctorAnalysis({
                    ...currentDoctorAnalysis,
                    follow_up_notes: e.target.value
                  })}
                  placeholder="Add recommendations for follow-up appointments, tests, or other notes..."
                />
              </div>
            </div>
            
            <DialogFooter className="flex flex-wrap justify-between gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => setDoctorAnalysisDialog(false)}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              
              <Button
                onClick={saveDoctorAnalysis}
                variant="default"
                className="flex items-center gap-1 bg-[#62d5d0]/90 hover:bg-[#62d5d0] text-white"
                disabled={savingAnalysis}
              >
                {savingAnalysis ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-1" />
                    Save Analysis
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Doctor;
