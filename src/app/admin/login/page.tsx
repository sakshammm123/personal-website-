"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check rate limit first
      const rateLimitCheck = await fetch("/api/admin/validate-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!rateLimitCheck.ok) {
        const rateLimitData = await rateLimitCheck.json();
        setError(rateLimitData.error || "Too many login attempts");
        return;
      }

      // Use NextAuth signIn
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      // Log the login attempt (don't wait for it)
      fetch("/api/admin/log-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          success: result?.ok === true,
        }),
      }).catch(() => {
        // Silently fail - logging shouldn't block login
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else if (result?.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="max-w-md w-full space-y-8 p-6 sm:p-8">
        <div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-zinc-50">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Sign in to access admin dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-900/50 p-4 text-red-200 text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 text-base border border-zinc-700 bg-zinc-800 text-zinc-50 placeholder-zinc-400 rounded-t-md focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 focus:z-10"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 text-base border border-zinc-700 bg-zinc-800 text-zinc-50 placeholder-zinc-400 rounded-b-md focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 focus:z-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
