'use client';

import { BarChart3, TrendingUp, Clock } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import { motion } from 'motion/react';

// Design tokens
const CATEGORY_COLORS = {
  pothole: '#f85149',
  streetlight: '#d29922',
  garbage: '#3fb950',
  water: '#58a6ff',
  water_leak: '#58a6ff',
  road_damage: '#f85149',
  sewage: '#39d2c0',
  other: '#7d8590',
  Pothole: '#f85149',
  Streetlight: '#d29922',
  Garbage: '#3fb950',
  Water: '#58a6ff',
  Other: '#7d8590'
};

const STATUS_COLORS = {
  pending: '#f85149',
  'in-progress': '#d29922',
  'in progress': '#d29922',
  resolved: '#3fb950',
  Pending: '#f85149',
  'In Progress': '#d29922',
  Resolved: '#3fb950'
};

const getCategoryFill = (key) => {
  if (!key) return CATEGORY_COLORS.other;
  return CATEGORY_COLORS[key] || CATEGORY_COLORS[key.toLowerCase()] || CATEGORY_COLORS.other;
};

const getStatusFill = (key) => {
  if (!key) return '#7d8590';
  return STATUS_COLORS[key] || STATUS_COLORS[key.toLowerCase()] || STATUS_COLORS[key.toLowerCase().replace('_', '-')] || '#7d8590';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1117] border border-[#21262d] p-3 sm:p-4 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-[#f0f6fc] font-semibold mb-1 text-xs sm:text-sm">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-[11px] sm:text-xs font-medium" style={{ color: entry.color || entry.fill || '#58a6ff' }}>
            {entry.name || 'Count'}: <span className="font-bold">{entry.value}</span>
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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 sm:p-7 mb-8 overflow-hidden"
    >
      <div className="flex items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
        <div className="p-2 rounded-xl bg-[#58a6ff]/10 shrink-0">
          <BarChart3 className="text-[#58a6ff]" size={20} />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-[#f0f6fc]">Analytics Overview</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Category Bar Chart */}
        <div className="h-[280px] sm:h-[300px] flex flex-col">
          <h3 className="text-xs font-semibold text-[#7d8590] mb-3 sm:mb-4 text-center uppercase tracking-wider">Issues by Category</h3>
          <div className="flex-1 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 5, right: 15, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#7d8590', fontSize: 10 }} 
                  axisLine={{ stroke: '#21262d' }}
                  tickLine={{ stroke: '#21262d' }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={55}
                />
                <YAxis 
                  tick={{ fill: '#7d8590', fontSize: 10 }} 
                  axisLine={{ stroke: '#21262d' }}
                  tickLine={{ stroke: '#21262d' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#21262d', opacity: 0.3 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="h-[280px] sm:h-[300px] flex flex-col">
          <h3 className="text-xs font-semibold text-[#7d8590] mb-3 sm:mb-4 text-center uppercase tracking-wider">Issues by Status</h3>
          <div className="flex-1 relative w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
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
                  wrapperStyle={{ fontSize: '11px', color: '#7d8590' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-[36px]">
              <span className="text-2xl sm:text-3xl font-black text-[#f0f6fc]">{totalIssues}</span>
              <span className="text-[10px] text-[#7d8590] uppercase tracking-wider font-semibold">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Issues Over Time & Department Resolution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-[#21262d]">
        {/* Issues Over Time Line Chart */}
        <div className="h-[280px] sm:h-[300px] flex flex-col">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <TrendingUp className="h-3.5 w-3.5 text-[#58a6ff]" />
            <h3 className="text-xs font-semibold text-[#7d8590] uppercase tracking-wider">Issues Reported Over Time</h3>
          </div>
          <div className="flex-1 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData} margin={{ top: 10, right: 15, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#7d8590', fontSize: 10 }} 
                  axisLine={{ stroke: '#21262d' }}
                  tickLine={{ stroke: '#21262d' }}
                />
                <YAxis 
                  tick={{ fill: '#7d8590', fontSize: 10 }} 
                  axisLine={{ stroke: '#21262d' }}
                  tickLine={{ stroke: '#21262d' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Reports" 
                  stroke="#58a6ff" 
                  strokeWidth={2.5} 
                  dot={{ fill: '#58a6ff', r: 3.5, strokeWidth: 0 }} 
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#58a6ff', fill: '#0d1117' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Resolution Times Bar Chart */}
        <div className="h-[280px] sm:h-[300px] flex flex-col">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Clock className="h-3.5 w-3.5 text-[#3fb950]" />
            <h3 className="text-xs font-semibold text-[#7d8590] uppercase tracking-wider">Dept Resolution (Avg Hours)</h3>
          </div>
          <div className="flex-1 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 15, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#7d8590', fontSize: 9.5 }} 
                  axisLine={{ stroke: '#21262d' }}
                  tickLine={{ stroke: '#21262d' }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={45}
                />
                <YAxis 
                  tick={{ fill: '#7d8590', fontSize: 10 }} 
                  axisLine={{ stroke: '#21262d' }}
                  tickLine={{ stroke: '#21262d' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#21262d', opacity: 0.3 }} />
                <Bar dataKey="avgHours" name="Avg Hours to Resolve" fill="#3fb950" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
