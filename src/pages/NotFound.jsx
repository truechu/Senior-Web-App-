import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="container section-block">
      <div className="empty-cart">
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link className="btn btn-warning" to="/">
          Go home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;

