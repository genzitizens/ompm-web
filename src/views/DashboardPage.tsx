import { useAuth } from "../auth/AuthProvider";
import { SectionCard } from "../ui/SectionCard";

const metrics = [
  { label: "Auth token", value: "Stored" },
  { label: "Session restore", value: "Ready" },
  { label: "Protected views", value: "02" }
];

export function DashboardPage() {
  const { session } = useAuth();

  return (
    <div className="stack">
      <SectionCard
        title="Authenticated dashboard"
        description="This page is only available after register/login and shows the restored account context."
      >
        <div className="metric-grid">
          {metrics.map((metric) => (
            <div key={metric.label} className="metric-card">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Current session"
        description="The token is persisted locally and the password is not retained after authentication."
      >
        <div className="session-card">
          <div>
            <span>Display name</span>
            <strong>{session?.account.displayName}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{session?.account.email}</strong>
          </div>
          <div>
            <span>Account ID</span>
            <strong>{session?.account.id}</strong>
          </div>
          <div>
            <span>Token preview</span>
            <strong>{session?.token.slice(0, 18)}...</strong>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
