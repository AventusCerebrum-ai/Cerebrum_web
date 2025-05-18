import React, { useState, useEffect } from 'react';

interface PreloaderProps {
  message?: string;
}

const Preloader: React.FC<PreloaderProps> = ({ message = "Loading..." }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Speed up loading towards the end
        const increment = prev > 80 ? 3 : prev > 60 ? 2 : 1;
        return Math.min(prev + increment, 100);
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4 flex flex-col items-center">
        {/* Logo and brain animation */}
        <div className="relative w-32 h-32 mb-6">
          {/* Pulsating brain circles */}
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-ping-slow"></div>
          <div className="absolute inset-2 rounded-full bg-cyan-500/20 animate-ping-slow animation-delay-300"></div>
          <div className="absolute inset-4 rounded-full bg-cyan-500/30 animate-ping-slow animation-delay-600"></div>
          
          {/* Central brain icon or logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-16 h-16">
              <svg 
                viewBox="0 0 24 24" 
                className="w-16 h-16 text-cyan-500 animate-pulse"
                fill="currentColor"
              >
                <path d="M13.5,2C13.22,2 13,2.22 13,2.5V4H10C8.9,4 8,4.9 8,6V8H4.5C4.22,8 4,8.22 4,8.5V12H2.5C2.22,12 2,12.22 2,12.5V16.5C2,16.78 2.22,17 2.5,17H5.5C5.78,17 6,16.78 6,16.5V12.5C6,12.22 5.78,12 5.5,12H4V9H8V10.5C8,10.78 8.22,11 8.5,11H11.5C11.78,11 12,10.78 12,10.5V8C12,7.45 11.55,7 11,7H10V6H14V7.5C14,7.78 14.22,8 14.5,8H17.5C17.78,8 18,7.78 18,7.5V4.5C18,4.22 17.78,4 17.5,4H14.5C14.22,4 14,4.22 14,4.5V5H13V2.5C13,2.22 12.78,2 12.5,2H13.5M18,9C17.45,9 17,9.45 17,10V11H14.5C14.22,11 14,11.22 14,11.5V14.5C14,14.78 14.22,15 14.5,15H15.5C15.78,15 16,14.78 16,14.5V12H17V14.5C17,14.78 17.22,15 17.5,15H21.5C21.78,15 22,14.78 22,14.5V10.5C22,10.22 21.78,10 21.5,10H18.5C18.22,10 18,10.22 18,10.5V11C18,10.45 18,9 18,9Z" />
              </svg>
              
              {/* Synapse connections animated */}
              <div className="absolute top-0 left-0 w-full h-full">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-synapse"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.3}s`,
                      opacity: 0
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Logo text */}
        <div className="relative mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
            Cerebrum.ai
          </h1>
          <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
        </div>
        
        {/* Loading progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 mb-4 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        
        {/* Loading message */}
        <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">
          {message}
        </div>
      </div>
    </div>
  );
};

export default Preloader;
