import React from "react";
import { Mail, Link, Twitter, Github, Linkedin, Instagram, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EnhancedFooter = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-12 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800  text-gray-700 dark:text-gray-400 backdrop-blur-m">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
          {/* Company Info */}
          <div className="flex flex-col space-y-3">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className="font-semibold text-2xl font-['Varela Round'] flex items-center">
                <span className="text-[#354745] tracking-wider dark:text-[#d0caca]">
                  Cerebrum
                </span>
                <span className="text-[#62d5d0] tracking-wider">.ai</span>
              </span>
            </div>
            <p className="text-sm mt-2">
              Advanced multimodal AI medical triage system combining text, images, and behavioral data for personalized care.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://twitter.com/cerebrumAI" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://github.com/Cerebrum-Ai/Cerebrum-web-frontend.git" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com/company/cerebrumAI" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="https://instagram.com/cerebrumAI" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-base mb-3 text-[#354745] dark:text-gray-200">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a onClick={() => navigate("/")} className="hover:text-[#62d5d0] cursor-pointer transition-colors">Home</a></li>
              <li><a onClick={() => navigate("/dashboard")} className="hover:text-[#62d5d0] cursor-pointer transition-colors">Dashboard</a></li>
              <li><a onClick={() => navigate("/account")} className="hover:text-[#62d5d0] cursor-pointer transition-colors">My Account</a></li>
              <li><a onClick={() => navigate("/settings")} className="hover:text-[#62d5d0] cursor-pointer transition-colors">Settings</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-base mb-3 text-[#354745] dark:text-gray-200">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a onClick={() => navigate("/help-center")} className="hover:text-[#62d5d0] cursor-pointer transition-colors">Help Center</a></li>
              <li><a onClick={() => navigate("/documentation")} className="hover:text-[#62d5d0] cursor-pointer transition-colors">Documentation</a></li>
              <li><a onClick={() => navigate("/case-studies")} className="hover:text-[#62d5d0] cursor-pointer transition-colors">Case Studies</a></li>
              <li><a onClick={() => navigate("/blog")} className="hover:text-[#62d5d0] cursor-pointer transition-colors">Healthcare Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-base mb-3 text-[#354745] dark:text-gray-200">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-[#62d5d0]" />
                <span>India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-[#62d5d0]" />
                <a href="mailto:info@cerebrum.ai" className="hover:text-[#62d5d0] transition-colors">test1@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-[#62d5d0]" />
                <a href="tel:+18001234567" className="hover:text-[#62d5d0] transition-colors">8976290496</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              &copy; {year} CerebrumAI Technologies, Inc. All rights reserved.
            </p>
            <div className="flex space-x-6 text-xs">
              <a onClick={() => navigate("/privacy-policy")} className="hover:text-[#62d5d0] cursor-pointer transition-colors">Privacy Policy</a>
              <a onClick={() => navigate("/terms-of-service")} className="hover:text-[#62d5d0] cursor-pointer transition-colors">Terms of Service</a>
              <a onClick={() => navigate("/cookie-policy")} className="hover:text-[#62d5d0] cursor-pointer transition-colors">Cookie Policy</a>
              <a onClick={() => navigate("/hipaa-compliance")} className="hover:text-[#62d5d0] cursor-pointer transition-colors">HIPAA Compliance</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EnhancedFooter;
