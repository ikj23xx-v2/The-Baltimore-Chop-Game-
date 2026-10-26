// src/components/HolidayPackCanvasRenderer.tsx
import React, { useEffect, useRef } from 'react';

export interface HolidayCardCanvasProps {
  cardName: string;
  catalogId: string;
  holidayTheme: 'SPRING_OPENING_DAY' | 'SUMMER_FIRECRACKER' | 'OCTOBER_HALLOWEEN' | 'WINTER_SNOWFLAKE';
  serialLimit: number | null;
  isSSP?: boolean; // Super Short Print with hidden holiday icons
  hiddenElement?: 'ELF' | 'SNOWMAN' | 'REINDEER' | 'PUMPKIN';
}

export const HolidayCardCanvasRenderer: React.FC<HolidayCardCanvasProps> = ({
  cardName,
  catalogId,
  holidayTheme,
  serialLimit,
  isSSP = false,
  hiddenElement = 'SNOWMAN',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions for high-DPI acrylic slab card render
    const width = 320;
    const height = 450;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // 1. Base Card Background (Topps Holiday / Update Frost Stock)
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    if (holidayTheme === 'WINTER_SNOWFLAKE') {
      bgGradient.addColorStop(0, '#0f172a'); // Deep winter navy
      bgGradient.addColorStop(0.5, '#1e293b');
      bgGradient.addColorStop(1, '#020617');
    } else if (holidayTheme === 'OCTOBER_HALLOWEEN') {
      bgGradient.addColorStop(0, '#18181b'); // Spooky dark charcoal
      bgGradient.addColorStop(0.5, '#27272a');
      bgGradient.addColorStop(1, '#09090b');
    } else {
      bgGradient.addColorStop(0, '#334155');
      bgGradient.addColorStop(1, '#0f172a');
    }

    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Foil Border Frame (Metallic Red, Green, Silver, and Gold Holiday Borders)
    ctx.lineWidth = 6;
    const borderGradient = ctx.createLinearGradient(0, 0, width, height);
    if (holidayTheme === 'WINTER_SNOWFLAKE') {
      borderGradient.addColorStop(0.0, '#cbd5e1'); // Silver frost
      borderGradient.addColorStop(0.3, '#16a34a'); // Holiday green
      borderGradient.addColorStop(0.7, '#dc2626'); // Holiday red
      borderGradient.addColorStop(1.0, '#fbbf24'); // Gold foil accent
    } else {
      borderGradient.addColorStop(0, '#fbbf24');
      borderGradient.addColorStop(0.5, '#f59e0b');
      borderGradient.addColorStop(1, '#b45309');
    }
    ctx.strokeStyle = borderGradient;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // Inner fine gold pinstripe
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.strokeRect(18, 18, width - 36, height - 36);

    // 3. Glitter & Snowflake / Sparkle Effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let i = 0; i < 45; i++) {
      const x = (Math.sin(i * 99) * 0.5 + 0.5) * (width - 40) + 20;
      const y = (Math.cos(i * 33) * 0.5 + 0.5) * (height - 40) + 20;
      const size = (i % 3) + 1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Player Silhouette / Placeholder Portrait Art Frame
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(35, 60, width - 70, 200);
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 60, width - 70, 200);

    // Stylized silhouette representation inside portrait box
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(width / 2, 130, 35, 0, Math.PI * 2); // Head
    ctx.fill();
    ctx.fillRect(width / 2 - 45, 175, 90, 75); // Shoulders/Jersey

    // 5. Hidden SSP Easter Egg (Hidden Elf, Snowman, or Reindeer etched in background)
    if (isSSP) {
      ctx.save();
      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = 'rgba(251, 191, 36, 0.35)'; // Ghostly translucent metallic gold
      let icon = '⛄';
      if (hiddenElement === 'ELF') icon = '🧝';
      if (hiddenElement === 'REINDEER') icon = '🦌';
      if (hiddenElement === 'PUMPKIN') icon = '🎃';
      
      // Positioned subtly in the corner of the portrait box
      ctx.fillText(icon, 45, 88);
      ctx.restore();
    }

    // 6. Card Header & Typography (Scorekeeper Ledger Font Style)
    ctx.fillStyle = '#fff8dc';
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(cardName.toUpperCase(), width / 2, 290);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '10px "Courier New", monospace';
    ctx.fillText(`THE BALTIMORE CHOP™ • ${catalogId}`, width / 2, 312);

    // Serial Number Badge
    if (serialLimit) {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
      ctx.fillRect(width / 2 - 50, 335, 100, 22);
      ctx.strokeStyle = '#daa520';
      ctx.strokeRect(width / 2 - 50, 335, 100, 22);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 10px "Courier New", monospace';
      ctx.fillText(`SERIAL #${Math.floor(Math.random() * serialLimit) + 1} / ${serialLimit}`, width / 2, 350);
    }

    // Holiday Ribbon Badge
    ctx.fillStyle = holidayTheme === 'WINTER_SNOWFLAKE' ? '#dc2626' : '#16a34a';
    ctx.fillRect(width / 2 - 70, 375, 140, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px "Courier New", monospace';
    ctx.fillText(holidayTheme === 'WINTER_SNOWFLAKE' ? '❄️ WINTER HOLIDAY EDITION' : '🎃 SPOOKY HALLOWEEN SSP', width / 2, 391);

  }, [cardName, catalogId, holidayTheme, serialLimit, isSSP, hiddenElement]);

  return (
    <div className="flex flex-col items-center p-3 bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl">
      <canvas
        ref={canvasRef}
        style={{ width: '220px', height: '310px' }}
        className="rounded-xl shadow-inner border border-slate-700 cursor-pointer transition-transform hover:scale-105"
      />
      <div className="mt-2 text-center">
        <span className="text-[10px] font-mono text-amber-400 font-bold block">
          {isSSP ? '✨ SSP HIDDEN EASTER EGG ACTIVE' : 'HOLIDAY FOIL REFRACTOR'}
        </span>
        <span className="text-[9px] text-slate-400 font-mono">
          {hiddenElement ? `Hidden Object: ${hiddenElement}` : ''}
        </span>
      </div>
    </div>
  );
};
