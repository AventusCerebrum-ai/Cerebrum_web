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
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Medtronic.svg",
    alt: "Medtronic",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/9/94/Siemens_Healthineers_logo.svg",
    alt: "Siemens Healthineers",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Bayer_HealthCare_logo.svg",
    alt: "Bayer Healthcare",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/33/GE_HealthCare_Logo.svg",
    alt: "GE Healthcare",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Pfizer_logo.svg",
    alt: "Pfizer",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Johnson_%26_Johnson_Logo.svg",
    alt: "Johnson & Johnson",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Abbott_logo.svg",
    alt: "Abbott",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Boston_Scientific.svg",
    alt: "Boston Scientific",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/55/Novartis_logo.svg",
    alt: "Novartis",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/34/Roche_Logo.svg",
    alt: "Roche",
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

      {/* Marquee animation */}
      
      <div className="w-full overflow-x-hidden relative mt-4">
        <div className="marquee inline-flex gap-12 animate-marquee whitespace-nowrap">
          {companyLogos.map((logo, i) => (
            <img 
              src={logo.src} 
              alt={logo.alt} 
              key={i}
              className="h-10 md:h-12 opacity-80 hover:opacity-100 transition-all duration-300 mx-8 inline-block" 
            />
          ))}
          {/* Second batch to make the marquee infinite */}
          {companyLogos.map((logo, i) => (
            <img 
              src={logo.src} 
              alt={logo.alt} 
              key={`marq2-${i}`}
              className="h-10 md:h-12 opacity-80 hover:opacity-100 transition-all duration-300 mx-8 inline-block" 
            />
          ))}
        </div>
      </div>
      {/* Marquee animation keyframes - slower speed to accommodate more logos */}
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
