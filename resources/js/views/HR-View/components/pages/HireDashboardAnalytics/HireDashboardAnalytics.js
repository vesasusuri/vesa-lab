import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaClock, FaPercent, FaUsers } from 'react-icons/fa';
import { fetchHrAnalytics } from '../../../../../api/hrApi';
import './HireDashboardAnalytics.scss';

const ICON_MAP = { FaUsers, FaPercent, FaClock, FaBriefcase };

const FALLBACK_STATS = [
  { label: 'Total Applications', value: '—', icon: 'FaUsers'     },
  { label: 'Conversion Rate',    value: '—', icon: 'FaPercent'   },
  { label: 'Avg. Time to Hire',  value: '—', icon: 'FaClock'     },
  { label: 'Active Jobs',        value: '—', icon: 'FaBriefcase' },
];

const HireDashboardAnalytics = () => {
  const [range,    setRange]   = useState('6mo');
  const [data,     setData]    = useState(null);
  const [loading,  setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchHrAnalytics()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [range]);

  const stats   = data?.stats   || FALLBACK_STATS;
  const byJob   = data?.byJob   || [];
  const funnel  = data?.funnel  || [];
  const monthly = data?.monthly || [];

  const maxApps    = byJob.length   ? Math.max(...byJob.map((j) => j.apps))   : 1;
  const maxMonthly = monthly.length ? Math.max(...monthly.map((m) => m.apps), 1) : 1;

  return (
    <section className="hire-analytics-section">
      <div className="hire-analytics-wrapper">

        <div className="hire-analytics-header">
          <div>
            <h1>Analytics</h1>
            <p>Track your hiring performance and trends.</p>
          </div>
          <div className="hire-analytics-range">
            {['30d', '3mo', '6mo', '1yr'].map((r) => (
              <button
                key={r}
                className={`hire-range-btn${range === r ? ' active' : ''}`}
                onClick={() => setRange(r)}
              >{r}</button>
            ))}
          </div>
        </div>

        {}
        <div className="hire-analytics-stats">
          {stats.map((s) => {
            const Icon = ICON_MAP[s.icon] || FaUsers;
            return (
              <div key={s.label} className="hire-analytics-stat">
                <div className="hire-analytics-stat-top">
                  <span className="hire-analytics-stat-label">{s.label}</span>
                  <div className="hire-analytics-stat-icon">
                    <Icon aria-hidden="true" />
                  </div>
                </div>
                <span className="hire-analytics-stat-value">
                  {loading ? '…' : s.value}
                </span>
              </div>
            );
          })}
        </div>

        <div className="hire-analytics-row">

          {}
          <div className="hire-analytics-card">
            <h3>Applications by Job</h3>
            {loading && <p className="hire-analytics-empty">Loading…</p>}
            {!loading && byJob.length === 0 && (
              <p className="hire-analytics-empty">No application data yet.</p>
            )}
            {!loading && byJob.length > 0 && (
              <div className="hire-bar-chart">
                {byJob.map((j) => (
                  <div key={j.title} className="hire-bar-row">
                    <span className="hire-bar-label">{j.title}</span>
                    <div className="hire-bar-track">
                      <div
                        className={`hire-bar-fill${j.apps === maxApps ? ' peak' : ''}`}
                        style={{ width: `${(j.apps / maxApps) * 100}%` }}
                      />
                    </div>
                    <span className="hire-bar-value">{j.apps}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="hire-analytics-card">
            <h3>Hiring Funnel</h3>
            {loading && <p className="hire-analytics-empty">Loading…</p>}
            {!loading && funnel.length > 0 && (
              <div className="hire-funnel">
                {funnel.map((f, i) => (
                  <div key={f.label} className="hire-funnel-step">
                    <div className="hire-funnel-row-header">
                      <span className="hire-funnel-label">{f.label}</span>
                      <span className="hire-funnel-count">{f.value}</span>
                    </div>
                    <div className="hire-funnel-track">
                      <div
                        className={`hire-funnel-fill step-${i}`}
                        style={{ width: funnel[0].value > 0 ? `${(f.value / funnel[0].value) * 100}%` : '0%' }}
                      />
                    </div>
                    {i < funnel.length - 1 && f.value > 0 && (
                      <span className="hire-funnel-pct">
                        {Math.round((funnel[i + 1].value / f.value) * 100)}% moved to next stage
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {}
        <div className="hire-analytics-card hire-analytics-card--full">
          <h3>Applications Over Time</h3>
          {loading && <p className="hire-analytics-empty">Loading…</p>}
          {!loading && (
            <div className="hire-trend-chart">
              {monthly.map((m, i) => {
                const isCurrent = i === monthly.length - 1;
                return (
                  <div key={m.month} className={`hire-trend-col${isCurrent ? ' current' : ''}`}>
                    <span className="hire-trend-value">{m.apps}</span>
                    <div className="hire-trend-track">
                      <div
                        className="hire-trend-fill"
                        style={{ height: `${(m.apps / maxMonthly) * 100}%` }}
                      />
                    </div>
                    <span className="hire-trend-month">{m.month}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default HireDashboardAnalytics;
