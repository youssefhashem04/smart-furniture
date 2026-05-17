import { products } from "../data/products";

function SellerProducts() {
  return (
    <section className="container section">
      <div className="section-top-grid">
        <div>
          <p className="section-label">Seller Panel</p>
          <h2>Manage Products</h2>
        </div>
        <button className="btn btn-dark">Add New Product</button>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr><th>Name</th><th>Category</th><th>Stock</th><th>Price</th><th>Action</th></tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>EGP {product.price}</td>
                <td><button className="mini-btn">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default SellerProducts;