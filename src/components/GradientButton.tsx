import React from "react";

interface GradientButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  text?: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  onClick,
  disabled = false,
  text = "Get Started For Free",
}) => {
  return (
    <div className="relative inline-flex items-center justify-center gap-4 group">
      <div className="absolute inset-0 duration-1000 opacity-60 transitiona-all bg-gradient-to-r from-[#62d5d0] via-[#4a9c98] to-[#2d7a77] rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200" />
      <button
        onClick={onClick}
        disabled={disabled}
        className="group relative inline-flex items-center justify-center text-base rounded-xl px-8 py-3 font-semibold transition-all duration-200
          bg-gray-900 text-white dark:bg-gray-800 dark:text-white
          hover:bg-gray-800 dark:hover:bg-gray-700
          hover:shadow-lg hover:-translate-y-0.5 hover:shadow-[#62d5d0]/20
          disabled:opacity-50 disabled:cursor-not-allowed
          light:bg-[#e0f7fa] light:text-[#0e3a47] light:hover:bg-[#b6e6ef]"
      >
        {text}
        <svg
          aria-hidden="true"
          viewBox="0 0 10 10"
          height={10}
          width={10}
          fill="none"
          className="mt-0.5 ml-2 -mr-1 stroke-current stroke-2"
        >
          <path
            d="M0 5h7"
            className="transition opacity-0 group-hover:opacity-100"
          />
          <path
            d="M1 1l4 4-4 4"
            className="transition group-hover:translate-x-[3px]"
          />
        </svg>
      </button>
    </div>
  );
};

export default GradientButton;
