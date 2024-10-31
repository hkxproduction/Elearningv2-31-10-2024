"use client";
import React, { useState } from "react"; // Import useState from React
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the validation schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State for loading indicator

  // Set up the form using useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError, // Use setError from useForm
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data) => {
    setLoading(true); // Set loading to true

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email: data.email,
        password: data.password,
      });

      // Save token and redirect
      localStorage.setItem("auth_token", response.data.data.token);
      router.push("/admin/dashboard"); // Redirect to dashboard after successful login
    } catch (err) {
      // Handle errors directly in useForm
      if (err.response) {
        if (err.response.status === 404) {
          setError("email", {
            type: "manual",
            message: "Login endpoint not found.",
          });
        } else if (err.response.status === 401) {
          setError("password", {
            type: "manual",
            message: "Your email and password are incorrect.",
          });
        } else {
          setError("email", {
            type: "manual",
            message:
              err.response.data.message ||
              "An error occurred while logging in.",
          });
        }
      } else if (err.request) {
        setError("email", {
          type: "manual",
          message: "No response from server.",
        });
      } else {
        setError("email", {
          type: "manual",
          message: "An error occurred: " + err.message,
        });
      }
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  return (
    <div className="bg-jecBlue h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96 space-y-6">
        <div className="flex items-center justify-center mb-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <h1 className="text-3xl text-center font-semibold">Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
              })}
              className={`block w-full rounded-md border py-2 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
              className={`block w-full rounded-md border py-2 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <div className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center py-2 px-4 bg-jecBlue text-white rounded-md shadow hover:bg-jecGreen transition duration-300"
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : null}
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
        <div className="text-center">
          <a href="#" className="text-sm text-indigo-600 hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}
