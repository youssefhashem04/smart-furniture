function AdminSellers() {
  const sellers = [
    { id: 1, name: "Cairo Comfort", status: "Approved" },
    { id: 2, name: "Delta Gaming", status: "Pending" },
    { id: 3, name: "Alex Furnish", status: "Approved" },
  ];

  return (
    <section className="container section">
      <h2>Seller Verification</h2>
      <div className="table-card">
        <table>
          <thead>
            <tr><th>ID</th><th>Seller</th><th>Status</th><th>Approve</th><th>Decline</th></tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id}>
                <td>{seller.id}</td>
                <td>{seller.name}</td>
                <td>{seller.status}</td>
                <td><button className="mini-btn">Approve</button></td>
                <td><button className="mini-btn danger">Decline</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminSellers;