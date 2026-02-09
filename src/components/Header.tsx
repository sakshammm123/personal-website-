"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { person } from "@/data/site";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

const nav = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/education", label: "Education" },
  { href: "/apart-from-work", label: "Apart from Work" },
  { href: "/contact", label: "Contact" }
] as const;

export function Header() {
  const pathname = usePathname();
  const { isMobile } = useDeviceDetection();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="border-b border-brown-200/50 bg-cream-50/95 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 shadow-sm">
        <div className="flex w-full items-center justify-between gap-6 py-4 md:py-6">
          <div className="min-w-0 flex-1">
            <Link 
              href="/" 
              className="block font-semibold text-brown-900 hover:text-brown-700 transition-colors text-lg md:text-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              {person.fullName}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 text-sm text-brown-700 md:flex">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                    active
                      ? "bg-brown-800 text-cream-50"
                      : "hover:bg-brown-100/50 hover:text-brown-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md text-brown-700 hover:bg-brown-100/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-300"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-brown-700 transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-brown-700 mt-1.5 transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-brown-700 mt-1.5 transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-brown-950/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleMobileMenu}
        />

        {/* Mobile Menu */}
        <nav
          className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-cream-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-brown-200/50">
                <Link
                  href="/"
                  className="font-semibold text-brown-900 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {person.fullName}
                </Link>
                <button
                  onClick={toggleMobileMenu}
                  className="w-10 h-10 flex items-center justify-center rounded-md text-brown-700 hover:bg-brown-100/50 transition-colors"
                  aria-label="Close mobile menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Items */}
              <div className="flex-1 overflow-y-auto py-4">
                {nav.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-6 py-4 text-base font-medium transition-colors ${
                        active
                          ? "bg-brown-800 text-cream-50 border-l-4 border-brown-600"
                          : "text-brown-700 hover:bg-brown-100/50 hover:text-brown-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
      </>
    </>
  );
}

