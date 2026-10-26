// src/services/checklistPdfGenerator.ts
import { jsPDF } from 'jspdf';
import { PRODUCT_CATALOG, ProductSKU } from '../types/boxProducts';
import { COACH_CARD_REGISTRY } from '../data/coachCardDatabase';

export function generateProductChecklistPDF(selectedSku: ProductSKU) {
  const product = PRODUCT_CATALOG[selectedSku];
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 40;

  // 1. Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 75, 'F');

  doc.setTextColor(245, 158, 11); // Amber 500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('THE BALTIMORE CHOP™ OFFICIAL COLLECTOR CHECKLIST', 40, 35);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Product SKU: ${product.name} | ${product.tokenCost} Vending Tokens`, 40, 55);

  currentY = 95;

  // 2. Product Guarantee Overview Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(40, currentY, pageWidth - 80, 85, 6, 6, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(`Configuration: ${product.packCount} Packs/Box • ${product.cardsPerPack} Cards/Pack • Total ${product.totalCards} Cards`, 55, currentY + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Guarantees: ${product.guarantees.join(' | ')}`, 55, currentY + 39);

  const oddsText = Object.entries(product.hitOdds).map(([k, v]) => `${k} (${v})`).join('  •  ');
  const splitOdds = doc.splitTextToSize(`Published Odds: ${oddsText}`, pageWidth - 110);
  doc.text(splitOdds, 55, currentY + 54);

  currentY += 105;

  // 3. Section Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('MASTER 99-CARD STRATEGIST & COACH CHECKLIST', 40, currentY);
  currentY += 16;

  // 4. Compact 2-column checklist
  const leftColX = 40;
  const rightColX = pageWidth / 2 + 10;
  const colWidth = (pageWidth - 100) / 2;

  const half = Math.ceil(COACH_CARD_REGISTRY.length / 2);
  const leftItems = COACH_CARD_REGISTRY.slice(0, half);
  const rightItems = COACH_CARD_REGISTRY.slice(half);

  const startY = currentY;
  let leftY = startY;
  let rightY = startY;

  leftItems.forEach((card) => {
    if (leftY > pageHeight - 40) {
      doc.addPage();
      leftY = 40;
      rightY = 40;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`THE BALTIMORE CHOP™ — ${product.name} (Continued)`, 40, leftY);
      leftY += 20;
      rightY += 20;
    }

    doc.setDrawColor(148, 163, 184);
    doc.rect(leftColX, leftY - 7, 7, 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`#${card.cardNo} ${card.name}`, leftColX + 12, leftY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`(${card.tier.replace(/_/g, ' ')})`, leftColX + 155, leftY);

    leftY += 12;
  });

  rightItems.forEach((card) => {
    doc.setDrawColor(148, 163, 184);
    doc.rect(rightColX, rightY - 7, 7, 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`#${card.cardNo} ${card.name}`, rightColX + 12, rightY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`(${card.tier.replace(/_/g, ' ')})`, rightColX + 155, rightY);

    rightY += 12;
  });

  doc.save(`The_Baltimore_Chop_${selectedSku}_Checklist.pdf`);
}
