import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AppShell } from "./ui/AppShell";
import { AuthPage } from "./views/AuthPage";
import { DashboardPage } from "./views/DashboardPage";
import { HomePage } from "./views/HomePage";
import { NotFoundPage } from "./views/NotFoundPage";
import { ProgramsPage } from "./views/ProgramsPage";
import "./styles.css";

function HomeRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <DashboardPage /> : <HomePage />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <HomeRoute />
      },
      {
        path: "auth",
        element: <AuthPage />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "programs",
            element: <ProgramsPage />
          },
          {
            path: "dashboard",
            element: <DashboardPage />
          }
        ]
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
