import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import EnhancedFooter from "@/components/EnhancedFooter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { Settings, History, User } from "lucide-react";

interface UserProfile {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  height: string;
  weight: string;
  blood_type: string;
  chronic_conditions: string;
  medications: string;
  allergies: string;
  family_history: string;
}

interface AnalysisRecord {
  id: string;
  name: string;
  timestamp: string;
  analysis_data: {
    analysis: {
      severity: string;
      initial_diagnosis?: string;
    };
  };
  created_at: string;
}

const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
    fetchUserProfile();
    fetchRecentAnalyses();
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchRecentAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("analysis_records")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentAnalyses(data || []);
    } catch (error) {
      console.error("Error fetching analyses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${getInitials(profile.first_name, profile.last_name)}&background=random`} />
                  <AvatarFallback>{getInitials(profile.first_name, profile.last_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">
                    {profile.first_name} {profile.last_name}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">
                      {new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()} years
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium capitalize">{profile.gender}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-medium">{profile.height} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{profile.weight} kg</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Analyses Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Analyses</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/settings?tab=analysis")}
                >
                  <History className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentAnalyses.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No recent analyses found
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAnalyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="p-4 border rounded-lg cursor-pointer"
                      onClick={() => navigate(`/output-history?id=${analysis.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{analysis.name}</h4>
                          <p className="text-sm text-gray-500">
                            {format(new Date(analysis.created_at), "PPP")}
                          </p>
                          <p className="mt-2">
                            <span className="font-medium">Severity:</span>{" "}
                            {analysis.analysis_data.analysis.severity}
                          </p>
                          {analysis.analysis_data.analysis.initial_diagnosis && (
                            <p className="mt-1">
                              <span className="font-medium">Diagnosis:</span>{" "}
                              {analysis.analysis_data.analysis.initial_diagnosis}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/output-history?id=${analysis.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Summary Card */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Medical Conditions</h4>
                  <p className="text-gray-600">
                    {profile.chronic_conditions || "No chronic conditions reported"}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Current Medications</h4>
                  <p className="text-gray-600">
                    {profile.medications || "No medications reported"}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Allergies</h4>
                  <p className="text-gray-600">
                    {profile.allergies || "No allergies reported"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
};

export default AccountPage; 