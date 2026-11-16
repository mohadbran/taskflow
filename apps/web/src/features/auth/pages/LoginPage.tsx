
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Checking session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            TaskFlow
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your tasks
          </p>
        </div>

        <LoginForm
          onSuccess={() => navigate("/dashboard", { replace: true })}
        />

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
