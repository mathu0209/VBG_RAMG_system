import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FileText, Table } from 'lucide-react';

export const ReportExporter = ({ reportType = 'Worker Report', title = 'Official Report', data = [] }) => {

  const exportPDF = () => {
    const doc = new jsPDF();

    // Header banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('GOVERNMENT OF INDIA • MGNREGS', 14, 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${reportType.toUpperCase()} — Generated on ${new Date().toLocaleDateString()}`, 14, 23);

    // Data table
    const tableColumn = data.length > 0 ? Object.keys(data[0]) : ['Field', 'Value'];
    const tableRows = data.map(item => Object.values(item));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 38,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 }
    });

    doc.save(`${reportType.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, reportType);
    XLSX.writeFile(workbook, `${reportType.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.xlsx`);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportPDF}
        className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
      >
        <FileText className="w-3.5 h-3.5" />
        Export PDF
      </button>

      <button
        onClick={exportExcel}
        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
      >
        <Table className="w-3.5 h-3.5" />
        Export Excel
      </button>
    </div>
  );
};
