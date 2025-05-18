import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { supabase } from "../lib/supabase";
import SignUpButton from "../components/SignUpButton";

const SignIn: React.FC = () => {
  useEffect(() => {
    const animateFloatingElements = () => {
      const elements = document.querySelectorAll(".floating");

      elements.forEach((el) => {
        const element = el as HTMLElement;

        // Generate more varied motion patterns with slower animation
        // Create random rotation for more dimension
        const randomRotate = Math.random() * 12 - 6; // -6 to 6 degrees rotation (reduced from -7.5 to 7.5)

        // Random scale variation (subtle)
        const randomScale = 0.97 + Math.random() * 0.06; // Scale between 0.97 and 1.03 (reduced range)

        // Random delay and increased duration for slower animations
        const randomDelay = Math.random() * 2; // Increased from 1.5
        const randomDuration = 3 + Math.random() * 4; // Increased from 1.5 + Math.random() * 2.5

        // Create unique animation name for each element to have different motion paths
        const animationIndex = Math.floor(Math.random() * 5) + 1; // 5 different animations

        // Apply animations with varied transforms
        element.style.animation = `float${animationIndex} ${randomDuration}s ease-in-out ${randomDelay}s infinite alternate`;
        element.style.transform = `rotate(${randomRotate}deg) scale(${randomScale})`;
      });
    };

    animateFloatingElements();
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("patient"); // Default to patient login

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (selectedRole: string) => {
    setRole(selectedRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (role === "doctor") {
        console.log("Checking doctor email:", formData.email);
        
        // Fetch doctor by email with proper column selection
        const { data: doctorData, error: doctorError } = await supabase
          .from("doctors")
          .select("id, email, first_name, last_name")
          .eq("email", formData.email.trim())
          .maybeSingle();

        console.log("Doctor check result:", { doctorData, doctorError });

        if (doctorError) {
          console.error("Doctor verification error:", doctorError);
          setError("Error verifying doctor credentials");
          setIsLoading(false);
          return;
        }

        if (!doctorData) {
          console.log("No doctor found with email:", formData.email);
          
          // Try a case-insensitive search as a fallback
          const { data: caseInsensitiveSearch } = await supabase
            .from("doctors")
            .select("id, email, first_name, last_name")
            .ilike("email", formData.email.trim())
            .maybeSingle();
            
          if (caseInsensitiveSearch) {
            console.log("Found doctor with case-insensitive search:", caseInsensitiveSearch.email);
            // Continue with authentication using the found email
          } else {
            setError("No doctor account found with this email");
            setIsLoading(false);
            return;
          }
        } else {
          console.log("Doctor found:", doctorData);
        }
      }

      // Authenticate with Supabase
      console.log("Attempting authentication for:", formData.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error("Authentication error:", error);
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        console.log("Authentication successful, user:", data.user.email);
        
        if (role === "doctor") {
          // Store doctor role in localStorage for later use
          localStorage.setItem("userRole", "doctor");
          console.log("Redirecting to doctor dashboard");
          setIsLoading(false);
          navigate("/doctor");
        } else {
          // User is a patient, proceed to dashboard
          localStorage.setItem("userRole", "patient");
          console.log("Redirecting to patient dashboard");
          setIsLoading(false);
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Unexpected error during sign in:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error("Google sign-in error:", error);
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // The redirect will happen automatically
      console.log("Google sign-in initiated:", data);
    } catch (err) {
      console.error("Unexpected error during Google sign in:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <svg
        className="pointer-events-none fixed w-[135vw] h-[135vw] md:w-[98vw] md:h-[98vw] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] opacity-55 select-none dark:opacity-20"
        viewBox="0 0 1200 900"
        fill="none"
      >
        <circle
          className="animate-pulse"
          cx="970"
          cy="350"
          r="69"
          fill="#62d5d0"
          fillOpacity="0.11"
        />
        <circle cx="160" cy="180" r="70" fill="#62d5d0" fillOpacity="0.16" />
        <circle
          className="animate-pulse"
          cx="960"
          cy="789"
          r="35"
          fill="#62d5d0"
          fillOpacity="0.14"
        />
        <circle cx="980" cy="170" r="33" fill="#62d5d0" fillOpacity="0.26" />
        <circle cx="120" cy="730" r="24" fill="#62d5d0" fillOpacity="0.19" />
        <circle
          className="animate-pulse"
          cx="720"
          cy="100"
          r="41"
          fill="#62d5d0"
          fillOpacity="0.18"
        />
      </svg>

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Blurred gradients */}
        <div className="floating absolute top-[15%] left-[10%] w-36 h-36 rounded-full bg-gradient-to-br from-[#62d5d0]/25 via-[#62d5d0]/20 to-[#62d5d0]/15 blur-2xl"></div>
        <div className="floating absolute bottom-[20%] right-[15%] w-48 h-48 rounded-full bg-gradient-to-br from-[#62d5d0]/25 via-[#62d5d0]/20 to-[#62d5d0]/15 blur-2xl"></div>
        <div className="floating absolute top-[60%] left-[20%] w-32 h-32 rounded-full bg-gradient-to-tl from-[#62d5d0]/25 via-[#62d5d0]/20 to-[#62d5d0]/15 blur-2xl"></div>

        {/* Small particles */}
        <div className="floating absolute top-[30%] right-[30%] w-6 h-6 rounded-full bg-[#62d5d0]/30"></div>
        <div className="floating absolute top-[40%] left-[40%] w-4 h-4 rounded-full bg-[#62d5d0]/35"></div>
        <div className="floating absolute bottom-[35%] left-[25%] w-5 h-5 rounded-full bg-[#62d5d0]/35"></div>
        <div className="floating absolute top-[25%] right-[18%] w-3 h-3 rounded-full bg-[#62d5d0]/35"></div>
        <div className="floating absolute bottom-[15%] right-[35%] w-4 h-4 rounded-full bg-[#62d5d0]/35"></div>
      </div>

      <style>{`
                /* Animation patterns for floating elements */
                @keyframes float1 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(8px, -12px) rotate(2deg); }
                    66% { transform: translate(-10px, -3px) rotate(-1deg); }
                    100% { transform: translate(5px, 10px) rotate(1.5deg); }
                }
                
                @keyframes float2 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(-14px, 7px) rotate(-2deg); }
                    75% { transform: translate(7px, 14px) rotate(0.5deg); }
                    100% { transform: translate(10px, -10px) rotate(1.5deg); }
                }
                
                @keyframes float3 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    20% { transform: translate(10px, 10px) rotate(3deg); }
                    40% { transform: translate(-15px, 7px) rotate(-1.5deg); }
                    60% { transform: translate(0px, -18px) rotate(0deg); }
                    80% { transform: translate(12px, -7px) rotate(2deg); }
                    100% { transform: translate(-7px, 0px) rotate(-2deg); }
                }
                
                @keyframes float4 {
                    0% { transform: translate(0, 0) rotate(0deg) scale(1); }
                    30% { transform: translate(7px, -16px) rotate(3deg) scale(1.02); }
                    70% { transform: translate(-14px, -7px) rotate(-3deg) scale(0.99); }
                    100% { transform: translate(10px, 10px) rotate(1.5deg) scale(1.01); }
                }
                
                @keyframes float5 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(-10px, -13px) rotate(-3.5deg); }
                    67% { transform: translate(18px, -3px) rotate(2deg); }
                    100% { transform: translate(-5px, 12px) rotate(-1.5deg); }
                }
                
                .floating {
                    will-change: transform;
                    transition: transform 0.4s ease-out;
                }
            `}</style>
      
      <StyledWrapper>
        <div className="center-viewport">
          <h1 className="big-header">Sign In</h1>
          <div className="form-container animate-in">
            <form className="form" onSubmit={handleSubmit} autoComplete="off">
              <ul className="wrapper">
                <li style={{ "--i": 2 } as React.CSSProperties}>
                  <input
                    className="input"
                    type="email"
                    placeholder="E-mail"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="username"
                  />
                </li>
                <li style={{ "--i": 1 } as React.CSSProperties}>
                  <input
                    className="input"
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                </li>
              </ul>
              <div className="button-container">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Submit"}
                </button>
                <button
                  type="button"
                  className="google-btn"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="google-icon"
                  />
                  Sign in with Google
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </form>
            <div className="user-type-toggle">
              <button
                className={`toggle-btn ${role === "patient" ? "active" : ""}`}
                onClick={() => handleRoleChange("patient")}
              >
                Patient
              </button>
              <button
                className={`toggle-btn ${role === "doctor" ? "active" : ""}`}
                onClick={() => handleRoleChange("doctor")}
              >
                Doctor
              </button>
            </div>
          </div>
          <div className="signup-button-container">
            <SignUpButton />
          </div>
        </div>
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f8fafc;
  padding: 20px;

  .form-container {
    width: 400px;
    max-width: 99vw;
    min-height: 360px;
    padding: 64px 56px;
    border-radius: 32px;
    box-shadow: 0 12px 32px rgba(98, 213, 208, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .form-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    text-align: center;
    background: linear-gradient(to right, #354745, #62d5d0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .input,
  button {
    width: 100%;
    height: 40px;
    position: relative;
    padding: 10px;
    border: 0.1px solid #62d5d0;
  }

  .submit-btn {
    width: 100%;
    background: #62d5d0;
    border: none;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    padding: 10px 0;
    transition: background 0.2s;
  }

  .submit-btn:hover {
    background: #4db8b3;
  }

  .wrapper {
    position: relative;
    transform: skewY(-14deg) translateX(120px);
    width: 400px;
    margin-bottom: 10px;
  }

  .wrapper li,
  button {
    position: relative;
    list-style: none;
    width: 200px;
    z-index: var(--i);
    transition: 0.3s;
    color: white;
  }

  .wrapper li::before,
  .wrapper .submit-btn::before {
    position: absolute;
    content: "";
    background: #62d5d0;
    top: 0;
    left: -40px;
    width: 40px;
    height: 40px;
    transform-origin: right;
    transform: skewY(45deg);
    transition: 0.3s;
  }

  .wrapper li::after,
  .wrapper .submit-btn::after {
    position: absolute;
    content: "";
    background: #62d5d0;
    width: 200px;
    height: 40px;
    top: -40px;
    left: 0;
    transform-origin: bottom;
    transform: skewX(45deg);
    transition: 0.3s;
  }

  .wrapper li:nth-child(1)::after,
  .wrapper li:nth-child(1)::before {
    background-color: #e8f7f6;
  }

  .wrapper li:nth-child(2)::after,
  .wrapper li:nth-child(2)::before {
    background-color: #b8e9e6;
  }

  li .input {
    outline: none;
    border: none;
    color: #354745;
    background: transparent;
  }

  li .input::placeholder {
    color: #354745;
  }

  li:nth-child(1) .input {
    background: #e8f7f6;
  }

  li:nth-child(2) .input {
    background: #b8e9e6;
  }

  li:nth-child(1) .input:focus {
    outline: none;
    border: 3.5px solid #e8f7f6;
  }

  li:nth-child(2) .input:focus {
    outline: none;
    border: 3.5px solid #b8e9e6;
  }

  .wrapper li:hover,
  button:hover {
    transform: translateX(-20px);
  }

  button:hover,
  button:hover::before,
  button:hover::after {
    background: #4db8b3;
  }

  button:active {
    transform: translateX(0px);
  }

  .error-message {
    color: #ff4d4d;
    background: rgba(255, 77, 77, 0.1);
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 16px;
    font-size: 14px;
    text-align: center;
  }

  .big-signup-btn {
    margin: 32px auto 0 auto;
    display: block;
    width: 300px;
    max-width: 90vw;
    padding: 18px 0;
    font-size: 1.5rem;
    font-weight: 700;
    border-radius: 12px;
    background: linear-gradient(90deg, #354745 0%, #62d5d0 100%);
    color: #fff;
    border: none;
    box-shadow: 0 4px 16px rgba(98, 213, 208, 0.1);
    cursor: pointer;
    transition: background 0.2s, color 0.2s, transform 0.1s;
  }
  .big-signup-btn:hover {
    background: linear-gradient(90deg, #62d5d0 0%, #354745 100%);
    color: #fff;
    transform: scale(1.03);
  }

  .header-and-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100vh;
    justify-content: center;
  }
  .big-header {
    font-size: 5rem;
    font-weight: 900;
    text-align: center;
    background: linear-gradient(90deg, #354745 0%, #62d5d0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    margin-bottom: 48px;
    letter-spacing: 2.5px;
  }

  .form-container.animate-in {
    animation: fadeInUp 3.2s cubic-bezier(0.23, 1, 0.32, 1);
  }
  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(60px) scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .center-viewport {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
  }

  .signup-button-container {
    margin-top: 48px;
    display: flex;
    justify-content: center;
    animation: fadeInUp 3.2s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .user-type-toggle {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }

  .toggle-btn {
    background: #62d5d0;
    border: none;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    padding: 10px 20px;
    margin: 0 10px;
    transition: background 0.2s;
  }

  /* Override the wrapper hover effect for toggle buttons */
  .user-type-toggle .toggle-btn:hover {
    transform: none;
    background: #4db8b3;
  }

  .toggle-btn.active {
    background: #4db8b3;
  }

  .google-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: white;
    border: 1px solid #e0e0e0;
    color: #757575;
    font-weight: 500;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    padding: 10px 0;
    transition: background 0.2s;
    margin-top: 10px;
    transform: none !important;
    position: relative;
    z-index: 1;

    &:hover {
      background: #f5f5f5;
      transform: none !important;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    &::before,
    &::after {
      display: none !important;
    }
  }

  .google-icon {
    width: 18px;
    height: 18px;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin-top: 20px;
  }
`;

export default SignIn;