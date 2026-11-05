import { jsPDF } from "jspdf";

export interface CertificateData {
  studentName: string;
  studentClass?: string;
  courseTitle: string;
  certificateId: string;
  completionDate?: string;
}

export function createCertificatePDF(data: CertificateData): Blob {
  // A4 Landscape: 297mm width x 210mm height
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297
  const pageHeight = doc.internal.pageSize.getHeight(); // 210

  // 1. Background subtle fill
  doc.setFillColor(253, 253, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // 2. Outer decorative border
  doc.setDrawColor(99, 102, 241); // Indigo #6366F1
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20, "S");

  // 3. Inner subtle border
  doc.setDrawColor(199, 210, 254); // Light indigo #C7D2FE
  doc.setLineWidth(0.8);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28, "S");

  // 4. Corner decorative accents
  const cornerSize = 10;
  doc.setFillColor(99, 102, 241);
  // Top-left
  doc.rect(14, 14, cornerSize, 2, "F");
  doc.rect(14, 14, 2, cornerSize, "F");
  // Top-right
  doc.rect(pageWidth - 14 - cornerSize, 14, cornerSize, 2, "F");
  doc.rect(pageWidth - 16, 14, 2, cornerSize, "F");
  // Bottom-left
  doc.rect(14, pageHeight - 16, cornerSize, 2, "F");
  doc.rect(14, pageHeight - 14 - cornerSize, 2, cornerSize, "F");
  // Bottom-right
  doc.rect(pageWidth - 14 - cornerSize, pageHeight - 16, cornerSize, 2, "F");
  doc.rect(pageWidth - 16, pageHeight - 14 - cornerSize, 2, cornerSize, "F");

  // 5. Header / Brand
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(99, 102, 241);
  doc.text("DIGIMITRA E-LEARNING PLATFORM", pageWidth / 2, 28, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text("Basic Computer Education & Digital Literacy Initiative", pageWidth / 2, 33, { align: "center" });

  // 6. Main Title
  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text("Certificate of Completion", pageWidth / 2, 48, { align: "center" });

  // Divider under title
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 40, 52, pageWidth / 2 + 40, 52);

  // 7. Presented to text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text("This is proudly presented to", pageWidth / 2, 63, { align: "center" });

  // 8. Student Name
  doc.setFont("times", "bolditalic");
  doc.setFontSize(30);
  doc.setTextColor(17, 24, 39); // Gray-900
  doc.text(data.studentName || "Student", pageWidth / 2, 78, { align: "center" });

  // 9. Student Class
  if (data.studentClass) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(99, 102, 241);
    doc.text(data.studentClass, pageWidth / 2, 86, { align: "center" });
  }

  // 10. Course statement
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text("for successfully completing with distinction the official curriculum for", pageWidth / 2, 98, { align: "center" });

  // 11. Course Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129); // Emerald-600 #10B981
  doc.text(data.courseTitle || "Introduction to Computers", pageWidth / 2, 110, { align: "center" });

  // 12. Verification Seal Badge
  const sealY = 138;
  doc.setFillColor(240, 253, 244); // light green
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(1);
  doc.circle(pageWidth / 2, sealY, 14, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(16, 185, 129);
  doc.text("VERIFIED", pageWidth / 2, sealY - 2, { align: "center" });
  doc.text("DIGIMITRA", pageWidth / 2, sealY + 2, { align: "center" });
  doc.text("OFFICIAL", pageWidth / 2, sealY + 6, { align: "center" });

  // 13. Bottom Details
  const bottomY = 175;

  // Left: Date & Certificate ID
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Date of Issue: ${data.completionDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 30, bottomY);
  
  doc.setFont("courier", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`ID: ${data.certificateId}`, 30, bottomY + 6);

  // Right: Signature
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 95, bottomY - 3, pageWidth - 30, bottomY - 3);

  doc.setFont("times", "italic");
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text("DigiMitra Platform", pageWidth - 62, bottomY - 5, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text("Director of Education", pageWidth - 62, bottomY + 3, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("DigiMitra Academic Council", pageWidth - 62, bottomY + 8, { align: "center" });

  // 14. Footer verification note
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(156, 163, 175);
  doc.text("This official certificate is authenticated and verifiable on the DigiMitra learning platform.", pageWidth / 2, pageHeight - 16, { align: "center" });

  return doc.output("blob");
}

export function downloadCertificatePDF(data: CertificateData, filename?: string) {
  const blob = createCertificatePDF(data);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const safeName = (data.studentName || "student").replace(/[^a-zA-Z0-9_-]/g, "_");
  link.setAttribute("download", filename || `certificate-${safeName}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

