import React from "react";
import { FiBriefcase, FiFileText, FiMessageSquare, FiBell } from "react-icons/fi";
import { usePlatformAdmin } from "../../../../../../context/PlatformAdminContext";
import "./dashboard.scss";

const iconMap = { FiBriefcase, FiFileText, FiMessageSquare, FiBell };

function StatCard({ icon: Icon, value, label, theme }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-icon--${theme}`}>
        <Icon />
      </div>
      <div className="stat-meta">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </article>
  );
}

 function Dashboard() {
  const { data } = usePlatformAdmin();
  const stats = data.userDashboardCards.map((card) => ({
    ...card,
    icon: iconMap[card.icon] || FiBriefcase,
    theme: "yellow",
  }));

  return (
    <main className="dash">
      <section className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </section>

      <section className="panels">
        <div className="panel">
          <header className="panel-head">
            <h3 className="panel-title">Unfinished Jobs</h3>
          </header>
          <div className="empty">
            <div className="empty-title">No jobs found.</div>
          </div>
        </div>

        <div className="panel">
          <header className="panel-head">
            <h3 className="panel-title">Pending Assessments</h3>
          </header>
          <div className="empty">
            <div className="empty-title">No assessments found.</div>
          </div>
        </div>
      </section>
    </main>
  );
}
export default Dashboard;