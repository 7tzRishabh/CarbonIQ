import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Coach from "./pages/Coach";
import Leaderboard from "./pages/Leaderboard";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Placeholder from "./pages/Placeholder";

import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/app/*" element={
              <AppLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="calculator" element={<Calculator />} />
                  <Route path="coach" element={<Coach />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="leaderboard" element={<Leaderboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Placeholder title="Settings" />} />
                  <Route path="*" element={<Dashboard />} />
                </Routes>
              </AppLayout>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}
