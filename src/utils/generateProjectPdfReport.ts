import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { TrackedProject, ProjectMilestone, SiteConfig } from '../types/index.ts';

export async function generateProjectPdfReport(
  project: TrackedProject,
  config?: SiteConfig
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // 1. Decorative Header Gradient Bar
  doc.setFillColor(30, 58, 138); // Deep Navy
  doc.rect(0, 0, pageWidth, 8, 'F');
  doc.setFillColor(37, 99, 235); // Royal Blue
  doc.rect(0, 8, pageWidth, 2.5, 'F');

  // 2. Official Header Branding
  let y = 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(config?.contact?.companyName || 'DeRoyalTech Systems Limited', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  y += 5;
  doc.text(`${config?.contact?.physicalAddress || 'Airport City & Spintex Tech Corridor'}, ${config?.contact?.cityCountry || 'Accra, Ghana'}`, margin, y);
  y += 4;
  doc.text(`Direct Lines: ${config?.contact?.phonePrimary || '+233 (0) 30 294 8821'} · Email: ${config?.contact?.emailGeneral || 'support@deroyaltech.com'}`, margin, y);

  // Generate QR Code for live verification
  try {
    const qrDataUrl = await QRCode.toDataURL(`https://deroyal.tech/tracker?id=${project.projectId}`, {
      margin: 1,
      width: 140,
      color: {
        dark: '#1e3a8a',
        light: '#ffffff'
      }
    });
    doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - 26, 14, 26, 26);
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Scan to Verify Online', pageWidth - margin - 26, 43);
  } catch (err) {
    console.warn('QR code generation warning:', err);
  }

  // Divider Line
  y += 14;
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  // 3. Document Title & Project Summary
  y += 9;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('OFFICIAL PROJECT MILESTONE & STATUS REPORT', margin, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} GMT`, margin, y);

  // 4. Executive Summary Box
  y += 7;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'S');

  const col1 = margin + 5;
  const col2 = margin + contentWidth / 2 + 5;
  let boxY = y + 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('PROJECT TRACKING ID:', col1, boxY);
  doc.text('CLIENT & ORGANIZATION:', col2, boxY);

  boxY += 4.5;
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235);
  doc.text(project.projectId, col1, boxY);
  doc.setTextColor(15, 23, 42);
  doc.text(project.clientName || 'Valued Corporate Partner', col2, boxY);

  boxY += 6.5;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('CURRENT STAGE & STATUS:', col1, boxY);
  doc.text('ESTIMATED DELIVERY DATE:', col2, boxY);

  boxY += 4.5;
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`${project.stageLabel || project.stage} (${project.progressPercent}% Complete)`, col1, boxY);
  doc.text(project.estimatedDeliveryDate || 'Scheduled in Sprint Roadmap', col2, boxY);

  boxY += 6;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`LEAD SYSTEMS ARCHITECT: ${project.leadEngineer || 'Senior DevOps Desk'}`, col1, boxY);

  // 5. Progress Visual Bar
  y += 40;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`OVERALL SPRINT PROGRESS: ${project.progressPercent}%`, margin, y);

  doc.setFillColor(226, 232, 240); // Track bg
  doc.roundedRect(margin, y + 2, contentWidth, 4, 1.5, 1.5, 'F');

  const fillWidth = Math.max(4, (contentWidth * Math.min(100, project.progressPercent)) / 100);
  doc.setFillColor(37, 99, 235); // Progress fill
  doc.roundedRect(margin, y + 2, fillWidth, 4, 1.5, 1.5, 'F');

  // 6. Milestones Table Header
  y += 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. SPRINT MILESTONES & VERIFICATION ROADMAP', margin, y);

  y += 5;
  doc.setFillColor(30, 58, 138); // Header row
  doc.rect(margin, y, contentWidth, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('#', margin + 3, y + 4.8);
  doc.text('MILESTONE STAGE & SCOPE', margin + 12, y + 4.8);
  doc.text('TARGET ETA', margin + 105, y + 4.8);
  doc.text('COMPLETED', margin + 135, y + 4.8);
  doc.text('STATUS', margin + 160, y + 4.8);

  y += 7;

  // Render Milestones Rows
  const milestones = project.milestones || [];
  milestones.forEach((m: ProjectMilestone, idx: number) => {
    // Check if new page needed
    if (y > pageHeight - 45) {
      doc.addPage();
      y = 20;
    }

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, contentWidth, 12, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 12, margin + contentWidth, y + 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`${idx + 1}`, margin + 3, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(m.title, margin + 12, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    const shortDesc = doc.splitTextToSize(m.description || 'Verified engineering deliverable.', 90);
    doc.text(shortDesc[0] || '', margin + 12, y + 9.5);

    doc.setFontSize(7.5);
    doc.text(m.targetDate || project.estimatedDeliveryDate || 'Sprint Target', margin + 105, y + 6);
    doc.text(m.completedAt || 'In Execution', margin + 135, y + 6);

    // Status pill
    if (m.status === 'completed') {
      doc.setFillColor(209, 250, 229); // emerald-100
      doc.roundedRect(margin + 158, y + 2.5, 14, 5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(5, 150, 105); // emerald-600
      doc.text('DONE', margin + 160.5, y + 6);
    } else if (m.status === 'in_progress') {
      doc.setFillColor(219, 234, 254); // blue-100
      doc.roundedRect(margin + 158, y + 2.5, 14, 5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(37, 99, 235); // blue-600
      doc.text('ACTIVE', margin + 159.5, y + 6);
    } else {
      doc.setFillColor(241, 245, 249); // slate-100
      doc.roundedRect(margin + 158, y + 2.5, 14, 5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text('PENDING', margin + 159, y + 6);
    }

    y += 12;
  });

  // 7. Client Voice Notes & Transcripts Section
  const allAudioNotes = milestones.flatMap(m => (m.audioNotes || []).map(n => ({ ...n, milestoneTitle: m.title })));
  if (allAudioNotes.length > 0) {
    if (y > pageHeight - 50) {
      doc.addPage();
      y = 20;
    } else {
      y += 8;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('2. APPENDED CLIENT AUDIO TRANSCRIPTS & SPRINT LOGS', margin, y);

    y += 5;
    allAudioNotes.slice(0, 4).forEach((note) => {
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(37, 99, 235);
      doc.text(`[${note.milestoneTitle}] ${note.author} · ${new Date(note.createdAt).toLocaleDateString()}`, margin + 4, y + 5);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const textLines = doc.splitTextToSize(`"${note.transcript}"`, contentWidth - 10);
      doc.text(textLines[0] || '', margin + 4, y + 10);

      y += 16;
    });
  }

  // 8. Official Certification & Verification Sign-Off Footer
  if (y > pageHeight - 35) {
    doc.addPage();
    y = 20;
  } else {
    y += 8;
  }

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('AUTHENTICITY & SYSTEM AUDIT GUARANTEE:', margin, y);

  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('This document represents the immutable sprint telemetry record dispatched by DeRoyalTech Systems Ghana.', margin, y);
  y += 3.5;
  doc.text('Milestone verifications are signed by the Assigned Systems Architect and synced in real-time across cloud nodes.', margin, y);

  // Bottom footer page stamp
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`DeRoyalTech Systems Limited · Accra, Ghana · Project Ref: ${project.projectId} · Document ID: DRT-PDF-${Date.now().toString(36).toUpperCase()}`, margin, pageHeight - 7);

  // Trigger browser download
  const filename = `DRT-Project-Status-${project.projectId}.pdf`;
  doc.save(filename);
}
