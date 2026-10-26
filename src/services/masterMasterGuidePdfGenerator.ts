// src/services/masterMasterGuidePdfGenerator.ts
import { jsPDF } from 'jspdf';
import { PRODUCT_CATALOG } from '../types/boxProducts';

/**
 * Generates the complete Master Onboarding & Game Design Guide PDF 
 * with structural styling, hit odds, rules, and beta onboarding info.
 */
export function generateMasterGameGuidePDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 40;

  // 1. Cover / Top Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 80, 'F');

  doc.setTextColor(245, 158, 11); // Amber 500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('THE BALTIMORE CHOP™', 40, 38);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Master Game Design, Rules, Hobby Database & Beta Onboarding Guide', 40, 58);

  currentY = 100;

  // Section 1: Executive Summary
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('1. Executive Summary & Core Philosophy', 40, currentY);
  currentY += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const summaryText = 
    'The Baltimore Chop™ is an elite cross-platform baseball card battler, 26-man franchise manager, ' +
    'and hobby slab collector. Built with a strict anti-pay-to-win philosophy, real-money purchases are ' +
    'capped at a 10% maximum tactical convenience lift, ensuring that deep sabermetric understanding, ' +
    'pitcher stamina management, and baseball IQ always decide championships.';
  
  const splitSummary = doc.splitTextToSize(summaryText, pageWidth - 80);
  doc.text(splitSummary, 40, currentY);
  currentY += (splitSummary.length * 14) + 20;

  // Section 2: Game Modes & Navigation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Core Game Modes & Navigation Deck', 40, currentY);
  currentY += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const modes = [
    '• At-Bat Arena: 3-pitch counter-card showdown with low-sinker Baltimore Chop physics.',
    '• The Clubhouse: Retro AOL Instant Messenger (AIM) chat for up to 26 friends per team.',
    '• The Chop Meet: Bi-weekly trading event weekends (every 2nd and 4th weekend of the month).',
    '• The Chop Binder & Slabs: 3D flip-book base vault graduating to Gem Mint 10 / Pristine 10 acrylic slabs.',
    '• Hobby Outpost: Pack & box rips from Hangers up to Chop Delight breakers with authentic Topps odds.',
  ];

  modes.forEach((mode) => {
    doc.text(mode, 45, currentY);
    currentY += 16;
  });

  currentY += 15;

  // Section 3: Strict Governance & Rules
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Strict Game Rules & Governance', 40, currentY);
  currentY += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const rules = [
    '• Manager Cards: Locked per season, restricted to exactly 5 tactical deployments before locking for playoffs.',
    '• Trading Limits: Max 5 items inbound/outbound per trade; automated IP/subnet collusion audits active.',
    '• Difficulty Governance: Max 3 difficulty changes per 162-game season with an enforced 9-day cooldown.',
    '• Banking Ledger: Transparent double-entry mini-banking vault tracking every token credit and debit.',
  ];

  rules.forEach((rule) => {
    doc.text(rule, 45, currentY);
    currentY += 16;
  });

  currentY += 18;

  // Section 4: Hobby Box SKUs & Odds Matrix
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('4. Official Hobby Outpost Box Catalog & Odds', 40, currentY);
  currentY += 18;

  Object.values(PRODUCT_CATALOG).forEach((product) => {
    if (currentY > doc.internal.pageSize.getHeight() - 60) {
      doc.addPage();
      currentY = 40;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${product.name} (${product.tokenCost} Tokens) — ${product.packCount} Packs, ${product.cardsPerPack} Cards/Pack`, 45, currentY);
    currentY += 13;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Guarantees: ${product.guarantees.join(' • ')}`, 55, currentY);
    currentY += 15;
  });

  // Trigger Instant PDF Download
  doc.save('The_Baltimore_Chop_Master_Game_Guide.pdf');
}
