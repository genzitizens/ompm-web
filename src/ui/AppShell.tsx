import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const publicLinks = [{ to: "/", label: "Overview" }];
const privateLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/programs", label: "Programs" }
];

export function AppShell() {
  const { isAuthenticated, logout, session } = useAuth();
  const location = useLocation();
  const links = isAuthenticated ? [...publicLinks, ...privateLinks] : publicLinks;
  const isAuthRoute = location.pathname === "/auth";

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__content">
          <p className="eyebrow">OMPM Web</p>
          <h1>Split bills in one place.</h1>
          <p className="hero__lede">Sign in to continue or create an account.</p>
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
              <>
                <NavLink to="/auth" className="button button--primary" aria-current={isAuthRoute ? "page" : undefined}>
                  Log in
                </NavLink>
                <NavLink
                  to="/auth?mode=register"
                  className="button button--secondary"
                  aria-current={isAuthRoute ? "page" : undefined}
                >
                  Create account
                </NavLink>
              </>
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
