// src/services/artOfChopPdfGenerator.ts
import { jsPDF } from 'jspdf';

/**
 * Generates "The Art of Chop" Master Guide & Checklist PDF,
 * styled to emulate a vintage baseball official scorekeeper's ledger book.
 */
export function generateArtOfChopPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Scorekeeper Ledger Paper Background (Off-White / Cream)
  doc.setFillColor(252, 250, 242);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Scorebook Grid Lines (Emulating Box Score Columns & Rows)
  doc.setLineWidth(0.5);
  doc.setDrawColor(218, 165, 32); // Faded sepia / gold ruling
  
  // Outer Ledger Border
  doc.rect(30, 30, pageWidth - 60, pageHeight - 60);

  // Horizontal Score Row Lines
  for (let y = 110; y < pageHeight - 50; y += 24) {
    doc.line(30, y, pageWidth - 30, y);
  }

  // Vertical Score Column Lines
  doc.line(160, 30, 160, pageHeight - 30);
  doc.line(pageWidth - 160, 30, pageWidth - 160, pageHeight - 30);

  // 3. Scorekeeper Ledger Header Block
  doc.setFillColor(44, 34, 21); // Dark vintage scoreboard brown
  doc.rect(30, 30, pageWidth - 60, 50, 'F');

  doc.setTextColor(255, 248, 220); // Warm parchment text
  doc.setFont('courier', 'bold');
  doc.setFontSize(16);
  doc.text('OFFICIAL SCOREKEEPER\'S LEDGER: THE ART OF CHOP', 45, 60);

  // 4. Content Integration (Ledger Typography)
  let currentY = 105;

  const writeLedgerSection = (title: string, lines: string[]) => {
    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(139, 69, 19); // Saddle brown ink
    doc.text(title, 40, currentY);
    currentY += 18;

    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);

    lines.forEach((line) => {
      doc.text(line, 45, currentY);
      currentY += 24; // Align with scorebook grid rows
    });
    currentY += 10;
  };

  writeLedgerSection('GAME RULES & GOVERNANCE', [
    '• 26-Man Roster Cap: Strict emulation of major league active roster limits.',
    '• Difficulty Governance: Max 3 difficulty changes per season w/ 9-day cooldown.',
    '• Trading Rules: Restricted to bi-weekly Chop Meet weekends (Max 5 trades).',
    '• Manager Card Usage: Capped at 5 strategic deployments per regular season.',
  ]);

  writeLedgerSection('THE HOBBY VAULT & GRADING', [
    '• Binder Storage: Base cards reside in 3D flip-book pages (8 cards per page).',
    '• Refractor Graduation: Cards reaching Refractor+ graduate to acrylic slabs.',
    '• Digital Slab Header: Evaluated by Historical WAR, Rarity, FPI, & Autograph.',
  ]);

  writeLedgerSection('PACK ODDS & BOX TIERS', [
    '• Silver Refractor (Unnumbered): 1:2 to 1:3 packs across retail configurations.',
    '• Atomic Mojo (/150) & Sapphire (/75): Scaled distribution by hobby tier.',
    '• Gold Wave (/25) & Superfractor (1/1): Mythic chase pulls anchored to Topps.',
  ]);

  // Footer Ledger Mark
  doc.setFont('courier', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Scored & Certified by The Baltimore Chop™ Official Scoring Bureau', 45, pageHeight - 45);

  // Trigger Instant PDF Download
  doc.save('The_Art_of_Chop_Scorekeeper_Ledger.pdf');
}
