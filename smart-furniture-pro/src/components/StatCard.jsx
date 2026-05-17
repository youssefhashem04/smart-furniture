function StatCard({ title, value, hint }) {
  return (
    <div className="stat-card">
      <p className="muted small">{title}</p>
      <h3>{value}</h3>
      <p className="muted small">{hint}</p>
    </div>
  );
}

export default StatCard;