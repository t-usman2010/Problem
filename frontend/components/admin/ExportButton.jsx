'use client';

import { Download } from 'lucide-react';

export default function ExportButton({ issues, filename = 'issues-export' }) {
  const exportToCSV = () => {
    if (!issues || issues.length === 0) return;

    // Define columns
    const headers = ['Title', 'Category', 'Status', 'Reporter', 'Location', 'Date'];
    
    // Create rows
    const rows = issues.map(issue => [
      `"${(issue.title || '').replace(/"/g, '""')}"`,
      `"${issue.category || ''}"`,
      `"${issue.status || ''}"`,
      `"${(issue.reporter?.name || 'Anonymous').replace(/"/g, '""')}"`,
      `"${(issue.address || '').replace(/"/g, '""')}"`,
      `"${new Date(issue.createdAt).toLocaleDateString()}"`
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className="flex items-center gap-2 px-3 py-2 bg-[#1a1d27] border border-[#2a2d3e] rounded-lg text-[#f0f0f0] hover:bg-[#2a2d3e] transition-colors text-sm font-medium"
      title="Export to CSV"
    >
      <Download size={16} className="text-[#8b8fa8]" />
      <span>Export</span>
    </button>
  );
}
