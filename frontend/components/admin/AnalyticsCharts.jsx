'use client';

import { BarChart3, TrendingUp, Clock } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, LineChart, Line
} from 'recharts';

// Design tokens
const CATEGORY_COLORS = {
  pothole: '#ef4444',
  streetlight: '#eab308',
  garbage: '#22c55e',
  water: '#3b82f6',
  water_leak: '#3b82f6',
  road_damage: '#ef4444',
  sewage: '#06b6d4',
  other: '#6b7280',
  Pothole: '#ef4444',
  Streetlight: '#eab308',
  Garbage: '#22c55e',
  Water: '#3b82f6',
  Other: '#6b7280'
};

const STATUS_COLORS = {
  pending: '#ef4444',
  'in-progress': '#eab308',
  'in progress': '#eab308',
  resolved: '#22c55e',
  Pending: '#ef4444',
  'In Progress': '#eab308',
  Resolved: '#22c55e'
};

const getCategoryFill = (key) => {
  if (!key) return CATEGORY_COLORS.other;
  return CATEGORY_COLORS[key] || CATEGORY_COLORS[key.toLowerCase()] || CATEGORY_COLORS.other;
};

const getStatusFill = (key) => {
  if (!key) return '#8b8fa8';
  return STATUS_COLORS[key] || STATUS_COLORS[key.toLowerCase()] || STATUS_COLORS[key.toLowerCase().replace('_', '-')] || '#8b8fa8';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1d27] border border-[#2a2d3e] p-3 rounded-md shadow-lg">
        <p className="text-[#f0f0f0] font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color || entry.fill || '#3b82f6' }}>
            {entry.name || 'Count'}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsCharts({ issues = [] }) {
  if (!issues || issues.length === 0) {
    return null;
  }

  // 1. Prepare category data
  const categoryCounts = issues.reduce((acc, issue) => {
    const rawCat = issue.category || 'other';
    const cat = rawCat.toLowerCase();
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.keys(categoryCounts).map(key => {
    const displayName = key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');
    return {
      name: displayName,
      count: categoryCounts[key],
      fill: getCategoryFill(key)
    };
  });

  // 2. Prepare status data
  const statusCounts = issues.reduce((acc, issue) => {
    const rawStatus = issue.status || 'pending';
    const status = rawStatus.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map(key => {
    const displayName = (key === 'in-progress' || key === 'in progress')
      ? 'In Progress'
      : key.charAt(0).toUpperCase() + key.slice(1);
    return {
      name: displayName,
      value: statusCounts[key],
      fill: getStatusFill(key)
    };
  });

  // 3. Prepare issues over time data (grouped by date)
  const timelineMap = issues.reduce((acc, issue) => {
    if (!issue.createdAt) return acc;
    const dateStr = new Date(issue.createdAt).toISOString().split('T')[0];
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {});

  const timeData = Object.keys(timelineMap)
    .sort()
    .slice(-14) // Last 14 active days
    .map(dateStr => {
      const date = new Date(dateStr);
      const label = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
      return {
        date: label,
        count: timelineMap[dateStr]
      };
    });

  // 4. Department resolution data
  const deptMap = issues.reduce((acc, issue) => {
    const dept = issue.assignedDept || 'General';
    if (!acc[dept]) {
      acc[dept] = { total: 0, resolved: 0, totalHours: 0 };
    }
    acc[dept].total += 1;
    if (issue.status === 'resolved') {
      acc[dept].resolved += 1;
      if (issue.resolvedAt && issue.createdAt) {
        const diff = (new Date(issue.resolvedAt) - new Date(issue.createdAt)) / (1000 * 3600);
        if (!isNaN(diff) && diff >= 0) {
          acc[dept].totalHours += diff;
        }
      }
    }
    return acc;
  }, {});

  const deptData = Object.keys(deptMap).map(dept => {
    const stat = deptMap[dept];
    const avgHours = stat.resolved > 0 ? Math.round((stat.totalHours / stat.resolved) * 10) / 10 : 0;
    return {
      name: dept,
      avgHours,
      resolved: stat.resolved,
      total: stat.total
    };
  });

  const totalIssues = issues.length;

  return (
    <section className="bg-[#1a1d27] border border-[#2a2d3e] rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="text-[#3b82f6]" size={24} />
        <h2 className="text-xl font-semibold text-[#f0f0f0]">Analytics Overview</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Bar Chart */}
        <div className="h-[300px] flex flex-col">
          <h3 className="text-sm font-medium text-[#8b8fa8] mb-4 text-center">Issues by Category</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#8b8fa8', fontSize: 12 }} 
                  axisLine={{ stroke: '#2a2d3e' }}
                  tickLine={{ stroke: '#2a2d3e' }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fill: '#8b8fa8', fontSize: 12 }} 
                  axisLine={{ stroke: '#2a2d3e' }}
                  tickLine={{ stroke: '#2a2d3e' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2a2d3e', opacity: 0.4 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="h-[300px] flex flex-col">
          <h3 className="text-sm font-medium text-[#8b8fa8] mb-4 text-center">Issues by Status</h3>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  wrapperStyle={{ fontSize: '12px', color: '#8b8fa8' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-[36px]">
              <span className="text-2xl font-bold text-[#f0f0f0]">{totalIssues}</span>
              <span className="text-xs text-[#8b8fa8]">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Issues Over Time & Department Resolution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-[#2a2d3e]">
        {/* Issues Over Time Line Chart */}
        <div className="h-[300px] flex flex-col">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <TrendingUp className="h-4 w-4 text-[#3b82f6]" />
            <h3 className="text-sm font-medium text-[#8b8fa8]">Issues Reported Over Time</h3>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#8b8fa8', fontSize: 12 }} 
                  axisLine={{ stroke: '#2a2d3e' }}
                  tickLine={{ stroke: '#2a2d3e' }}
                />
                <YAxis 
                  tick={{ fill: '#8b8fa8', fontSize: 12 }} 
                  axisLine={{ stroke: '#2a2d3e' }}
                  tickLine={{ stroke: '#2a2d3e' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Reports" 
                  stroke="#3b82f6" 
                  strokeWidth={2.5} 
                  dot={{ fill: '#3b82f6', r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Resolution Times Bar Chart */}
        <div className="h-[300px] flex flex-col">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <Clock className="h-4 w-4 text-[#22c55e]" />
            <h3 className="text-sm font-medium text-[#8b8fa8]">Department Resolution (Avg Hours)</h3>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#8b8fa8', fontSize: 11 }} 
                  axisLine={{ stroke: '#2a2d3e' }}
                  tickLine={{ stroke: '#2a2d3e' }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={50}
                />
                <YAxis 
                  tick={{ fill: '#8b8fa8', fontSize: 12 }} 
                  axisLine={{ stroke: '#2a2d3e' }}
                  tickLine={{ stroke: '#2a2d3e' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2a2d3e', opacity: 0.4 }} />
                <Bar dataKey="avgHours" name="Avg Hours to Resolve" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
