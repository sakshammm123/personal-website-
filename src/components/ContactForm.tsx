"use client";

import { useState } from "react";
import { getSessionId } from "@/lib/analytics-utils";

interface ContactFormProps {
  email: string;
}

export default function ContactForm({ email }: ContactFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    website: "", // Honeypot field
  });
  const [errors, setErrors] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors("");
    setIsSubmitting(true);

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrors("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      const sessionId = getSessionId();
      const conversationId = localStorage.getItem("sakshamai:conversationId");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          website: formData.website, // Honeypot
          sessionId,
          conversationId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.error || "Failed to submit. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      setFormData({ firstName: "", lastName: "", email: "", message: "", website: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      setErrors("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-800 text-sm">
          {errors}
        </div>
      )}

      {isSuccess && (
        <div className="rounded-md bg-green-50 border border-green-200 p-4 text-green-800 text-sm">
          Thank you for your message! We will get back to you soon.
        </div>
      )}

      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-brown-600"
          >
            First name
          </label>
          <input
            type="text"
            id="first-name"
            required
            className="w-full rounded-md border border-brown-200 bg-cream-50 px-4 py-2.5 text-base text-brown-900 placeholder-brown-400 focus:border-brown-400 focus:outline-none focus:ring-2 focus:ring-brown-200"
            placeholder="Your first name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="last-name"
            className="block text-sm font-medium text-brown-600"
          >
            Last name
          </label>
          <input
            type="text"
            id="last-name"
            required
            className="w-full rounded-md border border-brown-200 bg-cream-50 px-4 py-2.5 text-base text-brown-900 placeholder-brown-400 focus:border-brown-400 focus:outline-none focus:ring-2 focus:ring-brown-200"
            placeholder="Your last name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-brown-600"
        >
          Email <span className="text-brown-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          required
          className="w-full rounded-md border border-brown-200 bg-cream-50 px-4 py-2.5 text-base text-brown-900 placeholder-brown-400 focus:border-brown-400 focus:outline-none focus:ring-2 focus:ring-brown-200"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-brown-600"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          required
          className="w-full resize-none rounded-md border border-brown-200 bg-cream-50 px-4 py-2.5 text-base text-brown-900 placeholder-brown-400 focus:border-brown-400 focus:outline-none focus:ring-2 focus:ring-brown-200"
          placeholder="What would you like to talk about?"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-brown-700 px-8 py-3.5 font-semibold text-cream-50 text-sm md:text-base transition-all duration-300 hover:bg-brown-800 hover:shadow-lg hover:shadow-brown-900/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
