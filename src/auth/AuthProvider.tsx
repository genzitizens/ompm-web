import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { login as loginRequest, register as registerRequest } from "./authApi";
import { loadAuthSession, persistAuthSession } from "./authStorage";
import type { AuthResponse, AuthSession, LoginTempAccountRequest, RegisterTempAccountRequest } from "./types";

type AuthContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (payload: LoginTempAccountRequest) => Promise<AuthResponse>;
  register: (payload: RegisterTempAccountRequest) => Promise<AuthResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toSession(response: AuthResponse): AuthSession {
  return {
    token: response.token,
    account: response.account
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(() => loadAuthSession());

  useEffect(() => {
    persistAuthSession(session);
  }, [session]);

  async function login(payload: LoginTempAccountRequest) {
    const response = await loginRequest(payload);
    setSession(toSession(response));
    return response;
  }

  async function register(payload: RegisterTempAccountRequest) {
    const response = await registerRequest(payload);
    setSession(toSession(response));
    return response;
  }

  function logout() {
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: Boolean(session?.token),
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
