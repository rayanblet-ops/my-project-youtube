import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { MOCK_CHAT_MESSAGES } from '../constants';
import { Send, DollarSign, MoreVertical, Smile } from 'lucide-react';

export const LiveChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
       if (Math.random() > 0.7) {
          const newMsg: ChatMessage = {
             id: `m${Date.now()}`,
             user: `User${Math.floor(Math.random() * 1000)}`,
             avatar: `https://picsum.photos/seed/${Math.random()}/100/100`,
             text: ['Привет!', 'Круто!', 'LOL', 'Wow', 'Что за игра?'][Math.floor(Math.random() * 5)],
             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, newMsg]);
       }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
     e.preventDefault();
     if (!inputText.trim()) return;

     const newMsg: ChatMessage = {
        id: `me${Date.now()}`,
        user: 'Вы',
        avatar: 'https://picsum.photos/seed/avatar1/100/100', // Your avatar
        text: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
     };
     setMessages(prev => [...prev, newMsg]);
     setInputText('');
  };

  const handleDonate = () => {
     const amount = prompt('Введите сумму доната (например, 500 ₽):', '500 ₽');
     if (amount) {
        const newMsg: ChatMessage = {
           id: `d${Date.now()}`,
           user: 'Вы',
           avatar: 'https://picsum.photos/seed/avatar1/100/100',
           text: `Спасибо за стрим!`,
           amount: amount,
           color: 'bg-orange-500',
           timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMsg]);
     }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1f1f1f] border-l border-gray-200 dark:border-[#333] rounded-lg overflow-hidden">
       {/* Header */}
       <div className="p-3 border-b border-gray-200 dark:border-[#333] flex justify-between items-center bg-white dark:bg-[#1f1f1f]">
          <div className="font-medium text-black dark:text-white">Чат трансляции</div>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full">
             <MoreVertical className="w-5 h-5 text-black dark:text-white" />
          </button>
       </div>

       {/* Messages List */}
       <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {messages.map((msg) => (
             <div key={msg.id} className={`flex gap-3 text-sm ${msg.amount ? 'bg-gray-100 dark:bg-[#2a2a2a] p-2 rounded-lg' : ''}`}>
                <img src={msg.avatar} className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5" />
                <div className="flex flex-col w-full">
                   <div className="flex items-baseline gap-2">
                      <span className="font-medium text-gray-600 dark:text-gray-300 text-xs">{msg.user}</span>
                      {msg.amount && (
                         <span className={`text-xs font-bold px-1.5 py-0.5 rounded text-white ${msg.color || 'bg-blue-500'}`}>
                            {msg.amount}
                         </span>
                      )}
                   </div>
                   <div className="text-black dark:text-white break-words leading-snug">
                      {msg.text}
                   </div>
                </div>
             </div>
          ))}
          <div ref={chatEndRef} />
       </div>

       {/* Footer Input */}
       <div className="p-3 border-t border-gray-200 dark:border-[#333] bg-white dark:bg-[#1f1f1f]">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
                 <img src="https://picsum.photos/seed/avatar1/100/100" className="w-6 h-6 rounded-full" />
                 <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Вы</span>
             </div>
             <div className="text-xs text-gray-400">{inputText.length}/200</div>
          </div>
          <form onSubmit={handleSendMessage} className="relative">
             <input 
               type="text" 
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               placeholder="Введите сообщение..."
               className="w-full bg-gray-100 dark:bg-[#111] border border-transparent focus:border-blue-500 rounded-full py-2 pl-4 pr-10 text-sm text-black dark:text-white outline-none transition-colors"
               maxLength={200}
             />
             <button 
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-black dark:hover:text-white"
             >
                <Smile className="w-5 h-5" />
             </button>
          </form>
          <div className="flex justify-between items-center mt-2">
             <button 
               onClick={handleDonate}
               className="flex items-center gap-1 text-gray-600 dark:text-[#aaa] hover:text-green-600 dark:hover:text-green-500 font-medium text-sm transition-colors"
             >
                <div className="w-6 h-6 bg-gray-100 dark:bg-[#333] rounded-full flex items-center justify-center">
                   <DollarSign className="w-4 h-4" />
                </div>
                <span>Super Chat</span>
             </button>
             <button 
               onClick={handleSendMessage}
               disabled={!inputText.trim()}
               className="p-2 bg-transparent hover:bg-gray-100 dark:hover:bg-[#333] rounded-full text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
                <Send className="w-5 h-5" />
             </button>
          </div>
       </div>
    </div>
  );
};