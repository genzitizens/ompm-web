import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="not-found">
      <p className="eyebrow">404</p>
      <h2>That page does not exist.</h2>
      <Link to="/" className="button button--primary">
        Return home
      </Link>
    </div>
  );
}
