import React, { useEffect, useRef } from "react";
import { Eye, Mail, UserCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import MarqueeCompanies from "@/components/MarqueeCompanies";
import ReviewCarousel from "@/components/ReviewCarousel";
import LatestDevelopments from "@/components/LatestDevelopments";
import EnhancedFooter from "@/components/EnhancedFooter";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import ThemeAwareSpline from "@/components/ThemeAwareSpline";


const features = [
  {
    icon: <Eye size={38} strokeWidth={1.8} />,
    title: "Multimodal Input",
    description: "Seamless capture of text, images, and behavioral data for a holistic triage.",
  },
  {
    icon: <UserCheck size={38} strokeWidth={1.8} />,
    title: "Personalized AI",
    description: "AI-driven analysis delivers tailored, actionable recommendations to users.",
  },
  {
    icon: <Mail size={38} strokeWidth={1.8} />,
    title: "Secure Doctor Access",
    description: "Connect safely with professionals only when advanced intervention is needed.",
  },
];

const Index: React.FC = () => {
  const navigate = useNavigate();

  // Add animation to floating elements
  useEffect(() => {
    const animateFloatingElements = () => {
      const elements = document.querySelectorAll('.floating');
      
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

  return (
    <div className="relative min-h-screen dark:from-[#34205e]/50 dark:via-background/60 dark:to-background transition-colors overflow-x-hidden">
      {/* Unique animated SVG ambient background - Removed blue circle */}
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

      {/* Animated floating elements - Enhanced with more blue shades */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Blurred gradients - More blue-centric */}
        <div className="floating absolute top-[15%] left-[10%] w-36 h-36 rounded-full bg-gradient-to-br from-blue-400/25 via-sky-300/20 to-cyan-300/15 blur-2xl"></div>
        <div className="floating absolute bottom-[20%] right-[15%] w-48 h-48 rounded-full bg-gradient-to-br from-sky-400/25 via-blue-300/20 to-cyan-300/15 blur-2xl"></div>
        <div className="floating absolute top-[60%] left-[20%] w-32 h-32 rounded-full bg-gradient-to-tl from-blue-400/25 via-sky-300/20 to-cyan-300/15 blur-2xl"></div>
        <div className="floating absolute top-[25%] left-[35%] w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-300/25 to-sky-300/15 blur-2xl"></div>
        <div className="floating absolute bottom-[35%] right-[25%] w-36 h-36 rounded-full bg-gradient-to-bl from-sky-400/20 via-blue-300/25 to-cyan-300/15 blur-2xl"></div>
        <div className="floating absolute top-[38%] right-[38%] w-44 h-44 rounded-full bg-gradient-to-tr from-blue-400/15 via-sky-300/20 to-cyan-300/25 blur-2xl"></div>
        <div className="floating absolute bottom-[55%] left-[40%] w-52 h-52 rounded-full bg-gradient-to-bl from-sky-400/15 via-blue-300/20 to-cyan-300/25 blur-2xl"></div>

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

      <Navbar />
      <section className="relative flex flex-col-reverse md:flex-row items-center justify-center h-screen pt-20 md:pt-20 px-4 md:px-12 max-w-6xl mx-auto gap-8 animate-fade-in">
        <div className="w-full md:w-1/2 flex flex-col gap-6 md:gap-9 z-10">
          <h1 className="text-4xl md:text-4xl text-[#354745] tracking-widest leading-loose animate-[fade-in_1s_ease-in] dark:text-[#e8f7f6] trasnform -translate-y-2">
            CerebrumAI : Intelligent, Multimodal Triage System
          </h1>
          <p className="text-xl">___</p>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
            CerebrumAI is a next-generation, multimodal AI system that collects
            and analyzes patient inputs—including text, images, and behavioral
            data—to deliver personalized triage recommendations.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="group flex items-center gap-2 px-8 py-3 font-semibold rounded-[40px] border-2 border-[#62d5d0] bg-[#62d5d0]/90 hover:bg-[#62d5d0] text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 animate-fade-in"
            >
              Get Started
              <span className="ml-1 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center relative t">
          <div className="flex flex-col items-center relative transform -translate-y-10 translate-x-10">
            <ThemeAwareSpline />
            <div className="absolute bottom-6 right-4 w-[120px] h-[40px] md:w-[180px] rounded-2xl z-20 translate-x-[20%] translate-y-[20%] flex items-center justify-center bg-white dark:bg-card/80 backdrop-blur-lg">
              Cerebrum.ai
            </div>
          </div>
        </div>
      </section>

      {/* Multiple animation keyframes for varied motion patterns */}
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
          transition: transform 0.4s ease-out; /* Increased from 0.2s for smoother transitions */
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Journey progress bar animation */
        @keyframes progressGlow {
          0%, 100% { box-shadow: 0 0 5px rgba(103, 232, 249, 0.6); }
          50% { box-shadow: 0 0 15px rgba(103, 232, 249, 0.8); }
        }
        
        .journey-progress-bar {
          animation: progressGlow 3s infinite;
        }
        
        .journey-node {
          animation: progressGlow 2s infinite;
        }
        
        .journey-node.delay-1 {
          animation-delay: 0.5s;
        }
        
        .journey-node.delay-2 {
          animation-delay: 1s;
        }
        
        .journey-node.delay-3 {
          animation-delay: 1.5s;
        }
      `}</style>

      {/* Marquee Companies */}
      <MarqueeCompanies />

      {/* Modernized Digital Triage Section - NEW CARD-BASED DESIGN */}
      <section className="relative z-1 min-h-[70vh] flex items-center justify-center px-2 md:px-0 py-20 animate-fade-in">
        {/* Animated SVG background */}
        <svg className="absolute inset-0 w-full h-full z-0 animate-pulse" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="80%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
            </radialGradient>
          </defs>
          <ellipse cx="720" cy="300" rx="700" ry="250" fill="url(#grad1)" />
          <ellipse cx="400" cy="100" rx="180" ry="60" fill="#22d3ee" fillOpacity="0.08" />
          <ellipse cx="1200" cy="500" rx="200" ry="80" fill="#a5f3fc" fillOpacity="0.10" />
        </svg>
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="backdrop-blur-2xl bg-white/95 dark:bg-[#1a2233]/80 border border-cyan-400/20 rounded-3xl shadow-2xl p-8 md:p-14 flex flex-col items-center">
            <h3 className="font-extrabold text-3xl md:text-4xl mb-6 text-cyan-600 dark:text-cyan-300 text-center tracking-wide drop-shadow-lg">
              The CerebrumAI Triage Journey
            </h3>
            <p className="text-lg md:text-xl text-gray-600 dark:text-cyan-100 text-center mb-12 max-w-2xl">
              Experience a next-gen, interactive digital triage—where your journey is powered by AI, multimodal data, and actionable insights.
            </p>
            
            {/* Journey Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
              <JourneyCard 
                number="1"
                icon="🔍"
                title="Multimodal Input"
                description="Submit your symptoms using text, images, or even behavioral biometrics for a comprehensive analysis."
                delay={0}
                gradient="from-cyan-500 to-blue-500"
              />
              <JourneyCard 
                number="2"
                icon="🧠"
                title="AI-Powered Analysis"
                description="CerebrumAI fuses your data and runs advanced models for a holistic, accurate assessment."
                delay={150}
                gradient="from-blue-500 to-indigo-500"
              />
              <JourneyCard 
                number="3"
                icon="💡"
                title="Personalized Insights"
                description="Receive context-aware, actionable recommendations tailored specifically to your unique needs."
                delay={300}
                gradient="from-indigo-500 to-purple-500"
              />
              <JourneyCard 
                number="4"
                icon="👨‍⚕️"
                title="Seamless Doctor Connect"
                description="If needed, securely connect with healthcare professionals for specialized care."
                delay={450}
                gradient="from-purple-500 to-cyan-500"
              />
            </div>

            {/* Journey Path Connector */}
            <div className="hidden md:flex w-full justify-center mt-6 mb-8">
              <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full w-3/4 opacity-60"></div>
            </div>

            {/* Animated Journey Progress */}
            <div className="hidden md:block relative w-full max-w-3xl h-2 my-8">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full journey-progress-bar"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-300 shadow-lg shadow-cyan-500/50 journey-node"></div>
              <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-500/50 journey-node delay-1"></div>
              <div className="absolute left-2/3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-indigo-400 shadow-lg shadow-indigo-500/50 journey-node delay-2"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50 journey-node delay-3"></div>
            </div>

            {/* Call to Action */}
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="mt-10 px-10 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-bold shadow-xl hover:scale-105 hover:from-cyan-300 hover:to-blue-400 transition-all text-lg"
            >
              Start Your Triage Journey
            </button>
          </div>
        </div>
      </section>

      {/* Review Carousel */}
      <ReviewCarousel />

      {/* Latest Developments */}
      <LatestDevelopments />

      {/* App Showcase Section */}
      <section className="relative z-10 min-h-screen py-12 flex flex-col items-center justify-center w-full mx-auto px-4 animate-fade-in bg-gradient-to-t from-[#f0f9ff] to-[#e0f2fe] dark:from-[#141c2a] dark:to-[#334155]">
        <div className="max-w-6xl mx-auto w-full mb-6 md:mb-10 text-center">
          <h2 className="text-2xl md:text-4xl font-semibold mb-3 md:mb-4 dark:text-white">
            Experience Cerebrum.ai with app
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our intuitive interface makes triage simple, secure, and effective
            across all devices.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-evenly gap-6 md:gap-8 w-full py-4 md:py-8 max-w-6xl mx-auto">
          {/* App Screenshot 1 */}
          <div className="app-screenshot-card group">
            <div className="app-screenshot-container">
              <div className="phone-frame">
                <div className="phone-notch"></div>

                {/* Light mode image */}
                <img
                  src="/app2_light.jpeg"
                  alt="CerebrumAI Analysis Interface"
                  className="app-screenshot block dark:hidden"
                  loading="lazy"
                />

                {/* Dark mode image */}
                <img
                  src="/app_photo2.jpeg"
                  alt="CerebrumAI Analysis Interface (Dark Mode)"
                  className="app-screenshot hidden dark:block"
                  loading="lazy"
                />

                <div className="phone-home-indicator"></div>
              </div>
              <div className="screenshot-overlay">
                <span className="screenshot-label">Analysis Interface</span>
              </div>
            </div>
          </div>

          {/* App Screenshot 2 - Featured/Middle */}
          <div className="app-screenshot-card group featured">
            <div className="app-screenshot-container">
              <div className="phone-frame">
                <div className="phone-notch"></div>

                {/* Light mode image */}
                <img
                  src="/app1_light.jpeg"
                  alt="CerebrumAI Analysis Interface"
                  className="app-screenshot block dark:hidden"
                  loading="lazy"
                />

                {/* Dark mode image */}
                <img
                  src="/app_photo1.jpeg"
                  alt="CerebrumAI Analysis Interface (Dark Mode)"
                  className="app-screenshot hidden dark:block"
                  loading="lazy"
                />
                <div className="phone-home-indicator"></div>
              </div>
              <div className="screenshot-overlay">
                <span className="screenshot-label">Landing Page</span>
              </div>
            </div>
          </div>

          {/* App Screenshot 3 */}
          <div className="app-screenshot-card group">
            <div className="app-screenshot-container">
              <div className="phone-frame">
                <div className="phone-notch"></div>

                {/* Light mode image */}
                <img
                  src="/app3_light.jpeg"
                  alt="CerebrumAI Analysis Interface"
                  className="app-screenshot block dark:hidden"
                  loading="lazy"
                />

                {/* Dark mode image */}
                <img
                  src="/app_photo3.jpeg"
                  alt="CerebrumAI Analysis Interface (Dark Mode)"
                  className="app-screenshot hidden dark:block"
                  loading="lazy"
                />
                <div className="phone-home-indicator"></div>
              </div>
              <div className="screenshot-overlay">
                <span className="screenshot-label">Results View</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 pb-6 text-center">
          <p className="text-base md:text-lg mb-3 text-gray-700 dark:text-gray-300">
            Ready to experience CerebrumAI?
          </p>
          <button
            onClick={() =>
              window.open(
                "https://drive.google.com/file/d/1CuoDjR35BBWVv9ZU-V84n51eaooQRoci/view?usp=drivesdk",
                "_blank"
              )
            }
            className="inline-flex items-center justify-center gap-2 px-6 py-2 md:px-8 md:py-3 font-medium rounded-full border-2 border-[#62d5d0] bg-[#62d5d0]/90 hover:bg-[#62d5d0] text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Try It Now
            <span className="ml-1 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>
      </section>

      {/* Add CSS for app screenshots */}
      <style>{`
        .app-screenshot-card {
          perspective: 1000px;
          width: 280px;
          transition: all 0.5s ease;
        }
        
        .app-screenshot-card.featured {
          transform: translateY(-20px) scale(1.05);
          z-index: 20;
        }

        .app-screenshot-container {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 0 6px rgba(0, 0, 0, 0.05);
          transform-style: preserve-3d;
          transition: transform 0.6s ease;
          height: 580px;
          background: linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
          backdrop-filter: blur(10px);
        }
        
        .dark.app-screenshot-container {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 0 6px rgba(0, 0, 0, 0.05);
          transform-style: preserve-3d;
          transition: transform 0.6s ease;
          height: 580px;
          background: linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
          backdrop-filter: blur(10px);
        }
        
        .dark .app-screenshot-container {
          background: linear-gradient(145deg, rgba(30,41,59,0.4) 0%, rgba(30,41,59,0.1) 100%);
        }

        .dark .app-screenshot-container {
          background: linear-gradient(145deg, rgba(30,41,59,0.4) 0%, rgba(30,41,59,0.1) 100%);
        }
        
        .group:hover .app-screenshot-container {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), 0 0 8px rgba(0, 0, 0, 0.06);
        }
        
        /* Phone frame styling */
        .phone-frame {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 28px;
          background-color: #ffffff;
          padding: 12px 8px;
          box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .dark .phone-frame {
          background-color: #1a1a1a;
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.05);
        }
        
        /* Notch styling */
        .phone-notch {
          position: relative;
          height: 28px;
          width: 40%;
          margin: 0 auto 8px;
          background-color: #1a1a1a;
          border-bottom-left-radius: 14px;
          border-bottom-right-radius: 14px;
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .phone-notch:before {
          content: "";
          position: absolute;
          height: 6px;
          width: 6px;
          border-radius: 50%;
          background-color: rgba(80, 80, 80, 0.8);
          left: 25%;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .phone-notch:after {
          content: "";
          position: absolute;
          height: 8px;
          width: 40px;
          border-radius: 4px;
          background-color: rgba(80, 80, 80, 0.5);
          top: 50%;
          transform: translateY(-50%);
        }
        
        /* Home indicator */
        .phone-home-indicator {
          height: 5px;
          width: 36%;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 2.5px;
          margin: 8px auto 5px;
        }
        
        .dark .phone-home-indicator {
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        .app-screenshot {
          width: 100%;
          height: calc(100% - 41px); /* Adjust for notch and home indicator */
          object-fit: cover;
          transition: transform 0.5s ease;
          border-radius: 10px;
        }
        
        .group:hover .app-screenshot {
          transform: scale(1.03);
        }
        
        .screenshot-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }
        
        .group:hover .screenshot-overlay {
          opacity: 1;
          transform: translateY(0);
        }
        
        .screenshot-label {
          color: white;
          font-weight: 500;
          font-size: 16px;
        }
        
        /* Side buttons for phone-like look */
        .app-screenshot-container:before {
          content: "";
          position: absolute;
          top: 100px;
          right: -2px;
          height: 35px;
          width: 4px;
          background-color: rgba(60, 60, 60, 0.8);
          border-top-left-radius: 2px;
          border-bottom-left-radius: 2px;
          z-index: 30;
        }
        
        .app-screenshot-container:after {
          content: "";
          position: absolute;
          top: 150px;
          right: -2px;
          height: 65px;
          width: 4px;
          background-color: rgba(60, 60, 60, 0.8);
          border-top-left-radius: 2px;
          border-bottom-left-radius: 2px;
          z-index: 30;
        }
        
        /* Volume buttons */
        .app-screenshot-card:before {
          content: "";
          position: absolute;
          top: 100px;
          left: -2px;
          height: 30px;
          width: 4px;
          background-color: rgba(60, 60, 60, 0.8);
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
          z-index: 30;
        }
        
        .app-screenshot-card:after {
          content: "";
          position: absolute;
          top: 140px;
          left: -2px;
          height: 30px;
          width: 4px;
          background-color: rgba(60, 60, 60, 0.8);
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
          z-index: 30;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .app-screenshot-card {
            width: 240px;
            margin-bottom: 40px;
          }
          
          .app-screenshot-card.featured {
            transform: scale(1.05);
          }
          
          .app-screenshot-container {
            height: 480px;
          }
          
          .phone-notch {
            height: 24px;
          }
          
          .app-screenshot {
            height: calc(100% - 37px);
          }
        }
        
        @media (max-width: 640px) {
          .app-screenshot-card {
            width: 220px;
          }
          
          .app-screenshot-container {
            height: 440px;
          }
          
          .phone-notch {
            height: 20px;
            width: 35%;
          }
          
          .phone-home-indicator {
            height: 4px;
            width: 30%;
          }
          
          .app-screenshot {
            height: calc(100% - 32px);
          }
        }
      `}</style>

      <EnhancedFooter />
    </div>
  );
};

// Journey Card Component for card-based layout
const JourneyCard = ({ number, icon, title, description, delay, gradient }) => (
  <div 
    className={`journey-card flex flex-col rounded-xl overflow-hidden shadow-md transform hover:scale-105 transition-all duration-300`}
    style={{animation: `fadeInUp 0.7s ${delay}ms both`}}
  >
    <div className={`bg-white dark:bg-gray-900/80 h-full rounded-xl p-6 flex flex-col border border-${gradient.split('-')[2]}-200 dark:border-${gradient.split('-')[2]}-500/30`}>
      <div className="journey-number flex justify-between items-start mb-2">
        <div className={`text-xl font-bold bg-${gradient.split('-')[2]}-500 text-white w-8 h-8 flex items-center justify-center rounded-full`}>{number}</div>
        <div className="text-2xl">{icon}</div>
      </div>
      <h4 className={`text-lg font-bold text-${gradient.split('-')[2]}-700 dark:text-${gradient.split('-')[2]}-300 mb-2`}>{title}</h4>
      <p className="text-gray-700 dark:text-gray-300 text-sm flex-grow">{description}</p>
      <div className={`mt-4 w-8 h-1 rounded-full bg-${gradient.split('-')[2]}-300 dark:bg-${gradient.split('-')[2]}-500/50`}></div>
    </div>
  </div>
);

// Original TriageStep component kept for reference
const TriageStep = ({ icon, title, desc, delay }) => (
  <div className={`relative flex items-center w-full max-w-xl mb-10 group`} style={{animation: `fadeInUp 0.7s ${delay}ms both`}}>
    <div className="flex flex-col items-center mr-6 z-10">
      {icon}
      <div className="w-1 h-10 bg-cyan-400/30 group-last:hidden"></div>
    </div>
    <div className="bg-cyan-900/40 dark:bg-cyan-800/40 rounded-2xl p-5 shadow-lg border border-cyan-400/10 flex-1">
      <div className="font-bold text-cyan-200 mb-1 text-lg">{title}</div>
      <div className="text-cyan-100 text-base">{desc}</div>
    </div>
  </div>
);

export default Index;
