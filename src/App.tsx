import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import {DoctorProtectedRoute} from "./components/DoctorProtectedRoute";
import { Suspense, lazy, useState, useEffect } from "react";
import ChatbotButton from "./components/ChatbotButton";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import InputPage from "./pages/Dashboard";
import OutputPage from "./pages/Output";
import OutputHistoryPage from "./pages/OutputHistory";
import Enhanced from "./pages/Enhanced";
import Doctor from "./pages/Doctor";
import DoctorResponse from "./pages/DoctorResponse";
import AnalysisSettings from "./pages/AnalysisSettings";
import AccountPage from "./pages/AccountPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import HIPAACompliance from "./pages/HIPAACompliance";
import HelpCenter from "./pages/HelpCenter";
import Documentation from "./pages/Documentation";
import CaseStudies from "./pages/CaseStudies";
import HealthcareBlog from "./pages/HealthcareBlog";
import AuthCallback from "./pages/AuthCallback";
import ReportAnalysis from "./pages/ReportAnalysis";

// Removed Preloader import

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {loading && (
              <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Initializing Cerebrum.ai...</p>
              </div>
            )}
            <BrowserRouter>
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="ml-3">Loading components...</p>
                </div>
              }>
                <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <InputPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/output"
                element={
                  <ProtectedRoute>
                    <OutputPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/output-history"
                element={
                  <ProtectedRoute>
                    <OutputHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AnalysisSettings />
                  </ProtectedRoute>
                }
              />
              <Route path="/enhanced" element={<Enhanced />} />
              <Route
                path="/doctor-response"
                element={
                  <ProtectedRoute>
                    <DoctorResponse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor"
                element={
                    <DoctorProtectedRoute>
                    <Doctor />
                    </DoctorProtectedRoute>
                }
              />
              <Route
                path="/report-analysis"
                element={
                  <ProtectedRoute>
                    <ReportAnalysis />
                  </ProtectedRoute>
                }
              />
              {/* Legal Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/hipaa-compliance" element={<HIPAACompliance />} />
              
              {/* Resource Pages */}
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/blog" element={<HealthcareBlog />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
              </Suspense>
              {/* Add ChatbotButton outside of Routes so it appears on all pages */}
              <ChatbotButton />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
