"use client";

export default function CvActions() {
  return (
    <div className="cv-actions">
      <span>Print or save a PDF copy</span>
      <button type="button" onClick={() => window.print()}>Print / Save as PDF</button>
    </div>
  );
}
