// src/components/SupportChatbot.tsx
import React, { useState } from 'react';
import { logIssueToCRM } from '../services/crmLogger';

interface SupportChatbotProps {
  userId: string;
  username: string;
  currentScreen: string;
  activeSeason: number;
}

export const SupportChatbot: React.FC<SupportChatbotProps> = ({
  userId,
  username,
  currentScreen,
  activeSeason,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleGenerateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    // 1. Log to CRM
    await logIssueToCRM({
      userId,
      username,
      issueCategory: 'UI_RENDER',
      severity: 'WARNING',
      errorMessage: description,
      gameContext: {
        season: activeSeason,
        activeScreen: currentScreen,
      },
    });

    // 2. Generate clean prompt for AI code fixer
    const promptSummary = `[BUG REPORT / CRM TICKET]
User: ${username} (${userId})
Screen: ${currentScreen}
Season: ${activeSeason}
Issue Description: "${description}"

Please analyze this bug report within the codebase, determine the root cause in the relevant TypeScript file, and write the complete patch/fix for the game engine.`;

    setGeneratedPrompt(promptSummary);
    setIsSubmitting(false);
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="fixed top-14 sm:top-16 right-3 sm:right-6 z-40">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full shadow-2xl border border-amber-300 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 text-xs font-display uppercase tracking-wider cursor-pointer"
        >
          <span>⚾ Scout Support</span>
        </button>
      ) : (
        <div className="w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-4 text-slate-100 flex flex-col gap-3 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="font-bold text-amber-400 text-sm font-display flex items-center gap-1.5">
              <span>⚾</span> Scout CRM Copilot
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-100 text-sm font-bold p-1 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          {!generatedPrompt ? (
            <form onSubmit={handleGenerateTicket} className="flex flex-col gap-2">
              <p className="text-xs text-slate-300">
                Describe the issue you encountered. The Scout will log it to the CRM and format an AI prompt for quick resolution.
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., The refractor upgrade button didn't deduct tokens correctly..."
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 h-24 focus:outline-none focus:border-amber-500 font-mono resize-none"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-xl transition-colors shadow"
              >
                {isSubmitting ? 'Logging to CRM...' : 'Generate Fix Prompt'}
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-emerald-400 font-semibold">✓ Ticket logged & Prompt ready!</p>
              <p className="text-[10px] text-slate-400">
                Copy this prompt and paste it into our chat to apply the fix across the codebase:
              </p>
              <textarea
                readOnly
                value={generatedPrompt}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-[10px] font-mono text-slate-300 h-28 select-all resize-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl transition-colors shadow flex items-center justify-center gap-1.5"
              >
                <span>{copiedNotification ? '✓ Copied to Clipboard!' : 'Copy Prompt to Clipboard'}</span>
              </button>
              <button
                type="button"
                onClick={() => setGeneratedPrompt(null)}
                className="text-slate-400 hover:text-slate-200 text-[10px] underline text-center mt-1"
              >
                Report another issue
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
