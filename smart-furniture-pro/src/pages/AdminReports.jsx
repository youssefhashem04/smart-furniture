function AdminReports() {
  const reports = [
    { id: "REP-1", type: "Monthly Sales", note: "Sales up 11% this month" },
    { id: "REP-2", type: "Complaint Summary", note: "12 complaints pending review" },
    { id: "REP-3", type: "Fraud Monitoring", note: "No critical alerts detected" },
  ];

  return (
    <section className="container section">
      <h2>Reports & Complaints</h2>
      <div className="stats-grid">
        {reports.map((report) => (
          <div key={report.id} className="info-card">
            <p className="section-label">{report.id}</p>
            <h3>{report.type}</h3>
            <p className="muted">{report.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminReports;