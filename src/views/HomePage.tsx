import { Link } from "react-router-dom";
import { SectionCard } from "../ui/SectionCard";

export function HomePage() {
  return (
    <div className="stack">
      <SectionCard
        title="Welcome"
        description="Choose Log in or Create account to continue."
      >
        <div className="cta-row">
          <Link to="/auth" className="button button--primary">
            Log in
          </Link>
          <Link to="/auth?mode=register" className="button button--secondary">
            Create account
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}
