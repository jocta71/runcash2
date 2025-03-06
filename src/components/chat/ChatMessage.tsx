import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessage as ChatMessageType } from './types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const [isNew, setIsNew] = useState(true);
  
  // Efeito para remover a classe de animação após a animação terminar
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={`flex flex-col ${isNew ? 'animate-fade-in' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        <Avatar className="h-8 w-8 rounded-lg bg-gray-700 flex-shrink-0">
          {message.isModerator ? (
            <div className="h-8 w-8 rounded-lg bg-indigo-800 flex items-center justify-center">
              <ShieldCheck size={16} className="text-vegas-green" />
            </div>
          ) : message.isAdmin ? (
            <div className="h-8 w-8 rounded-lg bg-[#1A191F] flex items-center justify-center">
              <span className="text-vegas-gold text-xs">★</span>
            </div>
          ) : (
            <AvatarFallback className="bg-[#1A191F] text-xs text-white rounded-lg">
              {message.sender.substring(0, 2)}
            </AvatarFallback>
          )}
        </Avatar>
        <span className={`text-sm font-semibold ${
          message.isModerator 
            ? 'bg-gradient-to-b from-[#00ff00] to-[#34db53] bg-clip-text text-transparent' 
            : message.isAdmin 
              ? 'text-vegas-gold' 
              : 'text-white'
        }`}>
          {message.sender}
        </span>
        {message.isModerator && (
          <div className="flex items-center gap-1">
            <span className="bg-gradient-to-b from-[#00ff00] to-[#34db53] text-xs px-1.5 py-0.5 rounded text-black font-medium">Moderator</span>
            <span className="text-purple-500">
              <div className="p-1 bg-[#1A191F] rounded-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#8B5CF6" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </span>
          </div>
        )}
        {message.isAdmin && (
          <span className="bg-vegas-gold text-xs px-1 rounded text-black">Admin</span>
        )}
      </div>
      <div className="ml-10">
        <p className={`text-sm text-gray-300 p-2 rounded-lg max-w-[85%] inline-block
          ${message.isModerator 
            ? 'bg-[#1A1625] border border-[#33333359] shadow-[0_0_8px_0px_rgba(139,92,246,0.3)]' 
            : message.isAdmin 
              ? 'bg-[#1e1c22] border border-[#33333359]' 
              : 'bg-[#1e1c26]'}`}>
          {message.message}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
