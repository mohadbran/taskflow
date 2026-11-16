
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
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
            Create account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Get started with TaskFlow
          </p>
        </div>

        <RegisterForm
          onSuccess={() => navigate("/dashboard", { replace: true })}
        />

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
