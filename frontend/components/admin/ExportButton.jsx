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
      className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border border-[#21262d] rounded-xl text-[#f0f6fc] hover:bg-[#1c2128] hover:border-[#30363d] transition-all duration-200 text-sm font-semibold"
      title="Export to CSV"
    >
      <Download size={16} className="text-[#7d8590]" />
      <span>Export</span>
    </button>
  );
}
