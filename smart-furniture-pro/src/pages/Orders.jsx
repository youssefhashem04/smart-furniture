function Orders() {
  const orders = [
    { id: "ORD-5001", date: "2026-03-14", status: "Processing", total: 5600 },
    { id: "ORD-5002", date: "2026-03-10", status: "Shipped", total: 9900 },
    { id: "ORD-5003", date: "2026-03-01", status: "Delivered", total: 3400 },
  ];

  return (
    <section className="container section">
      <h2>Track Orders</h2>
      <div className="table-card">
        <table>
          <thead>
            <tr><th>Order ID</th><th>Date</th><th>Status</th><th>Total</th></tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.status}</td>
                <td>EGP {order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Orders;