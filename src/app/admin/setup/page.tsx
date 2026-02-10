"use client";

import { useState } from "react";

export default function AdminSetupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || data.details?.join(", ") || "Setup failed" });
        return;
      }
      setMessage({ type: "success", text: "Admin account created. You can now log in at /admin/login" });
      setUsername("");
      setPassword("");
    } catch (err) {
      setMessage({ type: "error", text: "Request failed. Check the console." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell shell-main flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-brown-200 bg-cream-50 p-6 shadow-sm">
        <h1 className="mb-2 text-xl font-semibold text-brown-900">Create Admin Account</h1>
        <p className="mb-4 text-sm text-brown-600">
          One-time setup. Set ALLOW_ADMIN_SETUP=true in Vercel, then set it back to false after creating the account.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-brown-800">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className="w-full rounded border border-brown-300 px-3 py-2 text-brown-900 focus:border-brown-500 focus:outline-none focus:ring-1 focus:ring-brown-500"
              placeholder="admin"
            />
            <p className="mt-1 text-xs text-brown-500">Letters, numbers, underscores, hyphens only. Min 3 characters.</p>
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-brown-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={12}
              className="w-full rounded border border-brown-300 px-3 py-2 text-brown-900 focus:border-brown-500 focus:outline-none focus:ring-1 focus:ring-brown-500"
              placeholder="••••••••••••"
            />
            <p className="mt-1 text-xs text-brown-500">
              Min 12 characters, with uppercase, lowercase, number, and special character.
            </p>
          </div>
          {message && (
            <p className={`text-sm ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-brown-700 px-4 py-2 font-medium text-white hover:bg-brown-800 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create Admin Account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-brown-500">
          <a href="/admin/login" className="underline hover:text-brown-700">Go to login</a>
        </p>
      </div>
    </div>
  );
}
