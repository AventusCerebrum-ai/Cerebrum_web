import React from "react";
import TweetCard from "./TweetCard";

const tweets = [
  {
    avatar: "/favicon.ico",
    name: "CerebrumAI",
    username: "@cerebrum_ai",
    time: "2d",
    content: "Excited to announce our AI-empowered stroke triage is reducing treatment times and improving patient outcomes. Explore our new real-world results and collaborative projects!",
    link: "https://twitter.com/",
  },
  {
    avatar: "/favicon.ico",
    name: "CerebrumAI",
    username: "@cerebrum_ai",
    time: "3d",
    content: "CerebrumAI’s solutions are now trusted by top global hospital groups. AI + behavioral data is transforming digital health for everyone.",
    link: "https://twitter.com/"
  }
];

const news = [
  {
    image: "/ai_tweet.jpeg",
    title: "AI Helps Doctors Treat Stroke Faster: CerebrumAI Study",
    highlight: "Significant real-world impact: improved diagnosis & outcomes via AI-powered triage.",
    details: "In resource-limited settings, timely treatment of acute stroke is critical. CerebrumAI's latest peer-reviewed study demonstrates that AI support leads to faster and more accurate stroke triage, with improved patient outcomes and reduced disparities.",
    cta: "See Study Details",
    link: "#"
  },
  {
    image: "lung_tweet.jpeg",
    title: "PenRAD Imaging Network Deploys AI to Detect Lung Cancer Early",
    highlight: "AI solutions help UK’s NHS PenRAD identify lung cancer sooner.",
    details: "CerebrumAI’s chest CT AI has been deployed for early lung cancer detection, enabling more lives to be saved. Read how hospitals are accelerating diagnosis at scale.",
    cta: "Read News",
    link: "#"
  },

];

const LatestDevelopments: React.FC = () => (
  <section className="relative z-10 h-screen flex items-center justify-center py-4 md:py-8 px-4 md:px-8  transition-colors">
    <div className="max-w-6xl mx-auto">
      <h3 className="text-center mb-10 text-3xl md:text-4xl font-semibold text-gradient-primary tracking-tight">Explore Our Latest Developments</h3>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-7 transition-all">
        {/* Tweets */}
        <div className="flex flex-col gap-5 md:col-span-1 w-full animate-fade-in">
          {tweets.map((tweet, idx) =>
            <TweetCard {...tweet} key={idx} />
          )}
        </div>

        {/* News Cards */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {news.map((item, idx) => (
            <div
              key={item.title}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-4 border-[#64d0d5]/20  px-6 pt-7 pb-8 flex flex-col justify-between min-h-[316px] overflow-hidden transition-all hover:scale-[1.023] animate-scale-in"
              style={{ animationDelay: `${100 * idx}ms` }}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs bg-fuchsia-200/70 rounded px-2 py-1 font-semibold text-[#262142]">{item.title}</span>
                </div>
                <span className="block font-semibold text-[#354745] dark:text-[#ffffff] text-lg mb-1">{item.highlight}</span>
                <span className="block text-[#506f71] dark:text-[#cbeef7] text-base mb-3">{item.details}</span>
              </div>
              <div className="flex gap-2 items-end justify-between mt-auto">
                <img src={item.image} alt="dev news" className="w-[94px] h-[94px] object-cover rounded-lg border-2 border-[#64d0d5]/20 shadow-md" />
                <a href={item.link} className="inline-block self-end rounded-md border border-[#64d0d5] text-[#000000] dark:text-[#cdf6f7] px-4 py-2 text-sm font-semibold transition hover:bg-[#64d0d5]/30 dark:hover:bg-[#64d0d5]/30 shadow">{item.cta}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default LatestDevelopments;
