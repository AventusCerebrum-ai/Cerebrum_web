import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  History,
  User,
  Settings,
  LogOut,
  Bell,
  Stethoscope,
  FileText,
} from "lucide-react";

const AuthenticatedNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [show, setShow] = useState(true);
  const [lastY, setLastY] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 10);

      if (currentY > lastY) {
        setShow(false); // Hide when scrolling down
      } else {
        setShow(true); // Show when scrolling up
      }

      setLastY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-30 transition-all duration-300
       bg-white dark:bg-black
        ${show ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="font-semibold text-3xl font-['Varela Round'] flex items-center">
              <span className="text-[#354745] tracking-wider dark:text-[#d0caca]">
                Cerebrum
              </span>
              <span className="text-[#62d5d0] tracking-wider">.ai</span>
            </span>
          </div>

          {/* Navigation Options */}
          <div className="hidden md:flex md:items-center space-x-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/dashboard")} 
              className="text-gray-600 dark:text-gray-200 hover:text-[#62d5d0] hover:bg-transparent"
            >
              Dashboard
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate("/output-history")} 
              className="text-gray-600 dark:text-gray-200 hover:text-[#62d5d0] hover:bg-transparent"
            >
              <History size={18} className="mr-2" />
              History
            </Button>

            <Button 
              variant="ghost" 
              onClick={() => navigate("/report-analysis")} 
              className="text-gray-600 dark:text-gray-200 hover:text-[#62d5d0] hover:bg-transparent"
            >
              <FileText size={18} className="mr-2" />
              Report Analysis
            </Button>
            
            {localStorage.getItem("userRole") === "doctor" && (
              <Button 
                variant="ghost" 
                onClick={() => navigate("/doctor")} 
                className="text-gray-600 dark:text-gray-200 hover:text-[#62d5d0] hover:bg-transparent"
              >
                <Stethoscope size={18} className="mr-2" />
                Doctor Portal
              </Button>
            )}
            
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarFallback className="bg-[#62d5d0]/30 text-[#354745] dark:bg-[#62d5d0]/20 dark:text-gray-200">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard size={16} className="mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/account")}>
                  <User size={16} className="mr-2" />
                  My Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings size={16} className="mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthenticatedNavbar;
