import { Link } from "react-router-dom";
import { SectionCard } from "../ui/SectionCard";

export function HomePage() {
  return (
    <div className="stack">
      <SectionCard
        title="Authentication foundation"
        description="User Story 1 is now the first real product slice instead of a generic migration placeholder."
      >
        <div className="feature-grid">
          <div className="feature-tile">
            <span>Account creation</span>
            <p>Users can register with the backend and receive an account payload plus token in one step.</p>
          </div>
          <div className="feature-tile">
            <span>Login persistence</span>
            <p>The app restores the saved token and account identity from local storage on reload.</p>
          </div>
          <div className="feature-tile">
            <span>Protected routes</span>
            <p>Authenticated views stay behind route guards until a session exists.</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Enter the app"
        description="Start by creating an account or logging in, then continue into the dashboard shell."
      >
        <div className="cta-row">
          <Link to="/auth" className="button button--primary">
            Create account or log in
          </Link>
          <Link to="/dashboard" className="button button--secondary">
            Try protected dashboard
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}
