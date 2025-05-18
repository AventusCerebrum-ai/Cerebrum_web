import React from "react";

const companyLogos = [
  {
    src: "/abbott.png", 
    alt: "Abbott",
  },
  // {
  //   src: "https://upload.wikimedia.org/wikipedia/commons/3/33/Blackford_logo.svg",
  //   alt: "Blackford",
  // },
  // {
  //   src: "https://seeklogo.com/images/S/sectra-logo-EFADC8B1F7-seeklogo.com.png",
  //   alt: "Sectra",
  // },
  // {
  //   src: "https://upload.wikimedia.org/wikipedia/commons/0/01/AstraZeneca.svg",
  //   alt: "AstraZeneca",
  // },
  // {
  //   src: "https://upload.wikimedia.org/wikipedia/commons/0/02/DeepC_Logo.png",
  //   alt: "DeepC",
  // },
  // {
  //   src: "https://seeklogo.com/images/I/inceptra-logo-A3F659E87B-seeklogo.com.png",
  //   alt: "Incepto",
  // },
  // Added medical companies
  {
    src: "/jj.png",
    alt: "Medtronic",
  },
  {
    src: "/i.png",
    alt: "Siemens Healthineers",
  },
  {
    src: "/raptim.png",
    alt: "Bayer Healthcare",
  },
  {
    src: "/plus.png",
    alt: "GE Healthcare",
  },
  {
    src: "/ribox.png",
    alt: "GE Healthcare",
  },
];

const MarqueeCompanies: React.FC = () => (
  <section className="relative w-full py-6 h-[300px] dark:bg-[#111111] ">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3 md:gap-7 items-center justify-around text-center px-2 pb-6">
        <div>
          <span className="text-2xl md:text-3xl font-extrabold text-gradient-primary block text-[#4ceee6] pb-3">32M+</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Lives Impacted</span>
        </div>
        <div>
          <span className="text-2xl md:text-3xl font-extrabold text-gradient-primary block text-[#4ceee6] pb-3">100+</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Countries via 4500+ sites</span>
        </div>
        <div>
          <span className="text-2xl md:text-3xl font-extrabold text-gradient-primary block text-[#4ceee6] pb-3">1B+</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Training Datasets</span>
        </div>
      </div>

      {/* Marquee animation with fixed "Featured in" text */}
      <div className="w-full relative mt-4 flex items-center">
        <div className="hidden md:flex items-center mr-8 z-10 bg-white dark:bg-[#111111] pr-4">
          <h3 className="font-semibold text-xl md:text-2xl text-gray-700 dark:text-gray-300 whitespace-nowrap">Featured in</h3>
        </div>
        <div className="relative overflow-hidden w-full">
          <div className="marquee inline-flex gap-12 animate-marquee whitespace-nowrap">
            {companyLogos.map((logo, i) => (
              <img 
                src={logo.src} 
                alt={logo.alt} 
                key={i}
                className="h-12 md:h-16 opacity-80 hover:opacity-100 transition-all duration-300 mx-8 inline-block" 
              />
            ))}
            {/* Second batch to make the marquee infinite */}
            {companyLogos.map((logo, i) => (
              <img 
                src={logo.src} 
                alt={logo.alt} 
                key={`marq2-${i}`}
                className="h-12 md:h-16 opacity-80 hover:opacity-100 transition-all duration-300 mx-8 inline-block" 
              />
            ))}
          </div>
        </div>
      </div>
      {/* Marquee animation keyframes */}
      <style>
        {`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
        }
        `}
      </style>
    </div>
  </section>
);

export default MarqueeCompanies;
