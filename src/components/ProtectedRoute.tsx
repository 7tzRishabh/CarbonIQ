import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
