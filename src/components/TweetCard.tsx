import React from "react";
import { Twitter } from "lucide-react";

type TweetCardProps = {
  avatar: string;
  name: string;
  username: string;
  time: string;
  content: string;
  link: string;
};

const TweetCard: React.FC<TweetCardProps> = ({
  avatar,
  name,
  username,
  time,
  content,
  link,
}) => (
  <div className="dark:bg-gray-800  rounded-xl p-4 shadow-md text-left min-w-[270px] max-w-xs animate-scale-in transition-all hover:scale-[1.023] border-4 border-[#64d0d5]/20">
    <div className="flex items-center gap-3 mb-2">
      <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover border-[4px] border-[#64d0d5]/20"/>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <span className="font-bold text-primary mr-1 text-white">cerebrum.ai</span>
          <Twitter size={18} className="text-[#1DA1F2] ml-1" />
        </div>
        <span className="text-xs text-gray-400">{username} &bull; {time}</span>
      </div>
    </div>
    <div className="text-[15px] text-gray-700 dark:text-gray-300 leading-snug mb-2">
      {content}
    </div>
    <a href={link} className="text-xs text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
      View on X
    </a>
  </div>
);

export default TweetCard;
