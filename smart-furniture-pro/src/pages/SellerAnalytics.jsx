function SellerAnalytics() {
  const bars = [45, 65, 82, 58, 90, 72];
  return (
    <section className="container section">
      <h2>Sales Analytics</h2>
      <div className="info-card">
        <p className="muted">Mock chart for frontend preview</p>
        <div className="chart-bars">
          {bars.map((bar, i) => (
            <div key={i} className="bar-group">
              <div className="bar" style={{ height: `${bar}%` }}></div>
              <span>M{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SellerAnalytics;