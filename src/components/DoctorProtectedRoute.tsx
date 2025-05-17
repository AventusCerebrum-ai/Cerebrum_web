import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface DoctorProtectedRouteProps {
  children: ReactNode;
}

export const DoctorProtectedRoute: React.FC<DoctorProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkDoctor = async () => {
      // First check the localStorage for the user role
      const userRole = localStorage.getItem("userRole");
      
      // Get current user
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.log("Auth error or no user found:", error);
        navigate("/signin");
        return;
      }

      console.log("Checking doctor authorization for:", user.email);

      // If the user already has the doctor role in localStorage, we can skip the database check
      if (userRole === "doctor") {
        console.log("Doctor role found in localStorage");
        setAuthorized(true);
        setChecking(false);
        return;
      }

      // If no role in localStorage, verify from database
      const { data: doctor, error: doctorError } = await supabase
        .from("doctors")
        .select("id, email, first_name, last_name")
        .eq("email", user.email)
        .maybeSingle();

      console.log("Doctor check result:", { doctor, doctorError });

      if (doctorError) {
        console.error("Error checking doctor:", doctorError);
        navigate("/dashboard");
        return;
      }

      if (doctor) {
        console.log("Doctor authorized:", doctor.email);
        // Store the role in localStorage for future use
        localStorage.setItem("userRole", "doctor");
        setAuthorized(true);
      } else {
        console.log("User not authorized as doctor:", user.email);
        localStorage.setItem("userRole", "patient");
        // Redirect non-doctors to patient dashboard
        navigate("/dashboard");
      }

      setChecking(false);
    };

    checkDoctor();
  }, [navigate]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#62d5d0] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Verifying doctor credentials...</p>
        </div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};