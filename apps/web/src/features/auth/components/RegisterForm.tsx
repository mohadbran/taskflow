
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ApiError } from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";

import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/auth.schema";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({
  onSuccess,
}: RegisterFormProps) {
  const { register: registerUser } = useAuth();

  const [serverError, setServerError] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);

    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      onSuccess?.();
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
      } else {
        setServerError("Unable to create account. Please try again.");
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {serverError && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Full name
        </label>

        <input
          id="name"
          type="text"
          autoComplete="name"
          {...register("name")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="John Doe"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Email address
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="you@example.com"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="At least 8 characters"
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Confirm password
        </label>

        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Repeat your password"
        />

        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
