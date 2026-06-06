import React from 'react';
import './scss/AdminDashboardReports.scss';

const metrics = [
  { label: 'Total Users', value: '1,284', change: '+34', up: true },
  { label: 'Active Companies', value: '87', change: '+5', up: true },
  { label: 'Live Listings', value: '342', change: '+22', up: true },
  { label: 'Total Applications', value: '5,610', change: '+148', up: true },
  { label: 'Hired This Month', value: '38', change: '+6', up: true },
  { label: 'Rejection Rate', value: '24%', change: '-2%', up: true },
];

const Stats = () => (
  <main className="admin-page">
    <div className="rep-kpi-grid">
      {metrics.map((metric) => (
        <div className="rep-kpi-card" key={metric.label}>
          <div className="rep-kpi-value">{metric.value}</div>
          <div className="rep-kpi-label">{metric.label}</div>
          <span className={`rep-kpi-change ${metric.up ? 'up' : 'down'}`}>
            {metric.up ? '↑' : '↓'} {metric.change} this week
          </span>
        </div>
      ))}
    </div>
  </main>
);

export default Stats;
