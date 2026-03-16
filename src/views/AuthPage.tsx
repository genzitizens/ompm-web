import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { SectionCard } from "../ui/SectionCard";

type AuthMode = "login" | "register";

type AuthFormState = {
  email: string;
  password: string;
  displayName: string;
};

const initialFormState: AuthFormState = {
  email: "",
  password: "",
  displayName: ""
};

function getAuthErrorMessage(mode: AuthMode, error: unknown) {
  if (error instanceof TypeError) {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  if (mode === "register") {
    return "We could not create your account. Verify your details and try again.";
  }

  return "Unable to log in. Check your email and password, then try again.";
}

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [formState, setFormState] = useState<AuthFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fromPath = location.state?.from?.pathname;

  if (isAuthenticated) {
    return <Navigate to={fromPath && fromPath !== "/auth" ? fromPath : "/dashboard"} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (mode === "register") {
        await register({
          email: formState.email,
          password: formState.password,
          displayName: formState.displayName
        });
      } else {
        await login({
          email: formState.email,
          password: formState.password
        });
      }

      navigate(fromPath && fromPath !== "/auth" ? fromPath : "/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(mode, error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(field: keyof AuthFormState, value: string) {
    setFormState((current) => ({
      ...current,
      [field]: value
    }));
  }

  return (
    <div className="stack stack--auth">
      <SectionCard
        title="Access your split workspace"
        description="Create a temporary account or log in to save bill splits and continue where you left off."
      >
        <div className="auth-layout">
          <div className="auth-panel auth-panel--intro">
            <p className="eyebrow">User Story 1</p>
            <h3>Account and session setup</h3>
            <p>
              Successful authentication stores the backend token and account identity locally so the app can restore
              the session on the next load.
            </p>
            <ul className="checklist">
              <li>Register with email, password, and display name</li>
              <li>Log in with the same credentials later</li>
              <li>Keep the password out of local storage</li>
            </ul>
          </div>

          <div className="auth-panel">
            <div className="auth-toggle" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                className={mode === "login" ? "auth-toggle__button auth-toggle__button--active" : "auth-toggle__button"}
                onClick={() => setMode("login")}
              >
                Log in
              </button>
              <button
                type="button"
                className={
                  mode === "register" ? "auth-toggle__button auth-toggle__button--active" : "auth-toggle__button"
                }
                onClick={() => setMode("register")}
              >
                Create account
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === "register" ? (
                <label className="field">
                  <span>Display name</span>
                  <input
                    type="text"
                    value={formState.displayName}
                    onChange={(event) => updateField("displayName", event.target.value)}
                    required
                  />
                </label>
              ) : null}

              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  required
                />
              </label>

              <label className="field">
                <span>Password</span>
                <input
                  type="password"
                  value={formState.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  required
                />
              </label>

              {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

              <button type="submit" className="button button--primary button--block" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : mode === "register" ? "Create account" : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
