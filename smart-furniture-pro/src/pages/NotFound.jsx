import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="container section">
      <div className="empty-state">
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-dark">
          Back Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;