import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const publicLinks = [{ to: "/", label: "Overview" }];
const privateLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/programs", label: "Programs" }
];

export function AppShell() {
  const { isAuthenticated, logout, session } = useAuth();
  const links = isAuthenticated ? [...publicLinks, ...privateLinks] : publicLinks;

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__content">
          <p className="eyebrow">OMPM Web</p>
          <h1>Split bills, keep the account session, and move the flow to the browser.</h1>
          <p className="hero__lede">
            The first web slice handles account creation, login, and local session restore against the backend auth
            endpoints.
          </p>
        </div>

        <div className="hero__actions">
          <nav className="nav">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) => (isActive ? "nav__link nav__link--active" : "nav__link")}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="session-bar">
            {isAuthenticated ? (
              <>
                <div className="session-bar__meta">
                  <span>Signed in as</span>
                  <strong>{session?.account.displayName || session?.account.email}</strong>
                </div>
                <button type="button" className="button button--secondary" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <NavLink to="/auth" className="button button--primary">
                Create account / Log in
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
