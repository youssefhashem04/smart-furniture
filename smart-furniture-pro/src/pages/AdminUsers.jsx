import { mockUsers } from "../data/products";

function AdminUsers() {
  return (
    <section className="container section">
      <h2>Manage Users</h2>
      <div className="table-card">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Role</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td><button className="mini-btn">Review</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminUsers;
