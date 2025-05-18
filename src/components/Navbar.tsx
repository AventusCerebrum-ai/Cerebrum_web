import React from "react";
import { useAuth } from "@/context/AuthContext";
import AuthenticatedNavbar from "./AuthenticatedNavbar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const Navbar: React.FC = () => {
  const { user } = useAuth();

  // If user is authenticated, render the AuthenticatedNavbar
  if (user) {
    return <AuthenticatedNavbar />;
  }

  // Otherwise, render the unauthenticated navbar
  return (
    <nav className="fixed top-0 left-0 w-full z-30 transition-all duration-300 bg-white dark:bg-black ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <a href="/" className="font-semibold text-3xl font-['Varela Round'] flex items-center">
              <span className="text-[#354745] tracking-wider dark:text-[#d0caca]">
                Cerebrum
              </span>
              <span className="text-[#62d5d0] tracking-wider">.ai</span>
            </a>
          </div>

          {/* Navigation Links and Theme Toggle */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="/"
              className="text-gray-600 dark:text-gray-200 hover:text-[#62d5d0] transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-gray-600 dark:text-gray-200 hover:text-[#62d5d0] transition-colors"
            >
              Why CerebrumAI?
            </a>
            <a
              href="/signin"
              className="bg-[#62d5d0]/90 hover:bg-[#62d5d0] text-white font-semibold px-5 py-2 rounded-full shadow transition-all"
            >
              Sign In
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
