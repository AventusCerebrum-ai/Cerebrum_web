import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import EnhancedFooter from "@/components/EnhancedFooter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import OutputHistory from "./OutputHistory";
import { format } from "date-fns";

interface UserProfile {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone: string;
  gender: string;
  height: string;
  weight: string;
  blood_type: string;
  chronic_conditions: string;
  conditions: string;
  medications: string;
  allergies: string;
  family_history: string;
  smoking_status: string;
  alcohol_consumption: string;
  physical_activity: string;
  sleep_hours: string;
  diet: string;
  occupation: string;
  stress_level: string;
  hobbies: string;
}

const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
    fetchUserProfile();
    fetchAnalysisHistory();
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
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysisHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      setAnalyses(data);
    } catch (error) {
      console.error("Error fetching analysis history:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update(profile)
        .eq("user_id", user?.id);

      if (error) throw error;
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account Settings</TabsTrigger>
            <TabsTrigger value="history">Analysis History</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={profile.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={profile.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile.email} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={profile.date_of_birth}
                    onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input
                      value={profile.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input
                      value={profile.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={profile.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Blood Type</Label>
                  <Input
                    value={profile.blood_type}
                    onChange={(e) => handleInputChange("blood_type", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Chronic Conditions</Label>
                  <Input
                    value={profile.chronic_conditions}
                    onChange={(e) => handleInputChange("chronic_conditions", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Medications</Label>
                  <Input
                    value={profile.medications}
                    onChange={(e) => handleInputChange("medications", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Allergies</Label>
                  <Input
                    value={profile.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Family History</Label>
                  <Input
                    value={profile.family_history}
                    onChange={(e) => handleInputChange("family_history", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Analysis History</CardTitle>
              </CardHeader>
              <CardContent>
                {analyses.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No analysis history found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analyses.map((analysis) => (
                      <div
                        key={analysis.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
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
          </TabsContent>
        </Tabs>
      </div>
      <EnhancedFooter />
    </div>
  );
};

export default AccountSettings; 