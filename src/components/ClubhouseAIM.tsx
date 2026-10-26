// src/components/ClubhouseAIM.tsx
import React, { useState } from 'react';
import { AIMChatMessage } from '../types/clubhouse';
import { soundManager } from '../services/audio';

export const ClubhouseAIM: React.FC<{ currentUsername: string; teamName: string }> = ({
  currentUsername,
  teamName,
}) => {
  const [messages, setMessages] = useState<AIMChatMessage[]>([
    {
      messageId: 'm1',
      clubhouseId: 'ch_1',
      senderUserId: 'system',
      senderUsername: 'BuddyBot',
      text: `Welcome to ${teamName}'s Clubhouse! (Max 26 Roster Spots Active)`,
      timestamp: Date.now() - 60000,
    },
    {
      messageId: 'm2',
      clubhouseId: 'ch_1',
      senderUserId: 'user_ace',
      senderUsername: 'CamdenAce',
      text: 'Anyone trading an Atomic Mojo Rickey Henderson? Looking to bolster my leadoff speed.',
      timestamp: Date.now() - 35000,
    },
    {
      messageId: 'm3',
      clubhouseId: 'ch_1',
      senderUserId: 'user_crush',
      senderUsername: 'ChopCrusher99',
      text: 'Just pulled a 1991 Cal Ripken Jr. Heritage refractor! 11.5 WAR beast in the lineup.',
      timestamp: Date.now() - 15000,
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    soundManager.playButtonClick();

    const newMsg: AIMChatMessage = {
      messageId: `msg_${Date.now()}`,
      clubhouseId: 'ch_1',
      senderUserId: 'user_self',
      senderUsername: currentUsername,
      text: inputText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900 border-2 border-slate-700 rounded-xl shadow-2xl overflow-hidden font-mono text-slate-100">
      {/* Retro AIM Window Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-4 py-2 flex items-center justify-between border-b border-blue-700">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold">💬</span>
          <span className="text-xs font-bold tracking-wider text-slate-100">
            AOL Instant Messenger - {teamName} Clubhouse (26/26 Online)
          </span>
        </div>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-slate-700 border border-slate-500 rounded-sm flex items-center justify-center text-[8px]">_</div>
          <div className="w-3 h-3 bg-slate-700 border border-slate-500 rounded-sm flex items-center justify-center text-[8px]">□</div>
          <div className="w-3 h-3 bg-red-600 border border-red-800 rounded-sm flex items-center justify-center text-[8px] text-white">✕</div>
        </div>
      </div>

      {/* Chat Log Viewport */}
      <div className="h-64 bg-white text-slate-900 p-3 overflow-y-auto space-y-2 text-xs">
        {messages.map((msg) => (
          <div key={msg.messageId} className="leading-relaxed">
            <span className={`font-bold ${msg.senderUsername === currentUsername ? 'text-blue-700' : 'text-red-700'}`}>
              {msg.senderUsername}:
            </span>{' '}
            <span className="text-slate-800">{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="bg-slate-200 p-2 flex gap-2 border-t border-slate-300">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message to your 26-man squad..."
          className="flex-1 bg-white border border-slate-400 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-4 py-1.5 rounded shadow"
        >
          Send AIM
        </button>
      </form>
    </div>
  );
};
