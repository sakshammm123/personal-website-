import { getContactEmail } from "@/lib/siteConfig";
import { siteConfig } from "@/lib/siteConfig";
import { links } from "@/data/site";
import ContactForm from "@/components/ContactForm";
import ScrollAnimation from "@/components/ScrollAnimation";

export default function ContactPage() {
  const rawEmail = getContactEmail() ?? links.contactEmail;
  const email = rawEmail === "contact@email.com" ? "contact@sakshammahajan.com" : rawEmail;

  return (
    <div className="space-y-10">
      {/* Page header */}
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="decorative-dot" />
          <h1 className="text-4xl font-bold text-brown-900 md:text-5xl">
            Get in Touch
          </h1>
        </div>
        <p className="max-w-2xl text-base leading-relaxed text-brown-700 md:text-lg">
          I&apos;d like to hear from you. If you have any inquiries or just want
          to say hi, please use the contact form.
        </p>
      </header>

      <div className="decorative-line" />

      {/* Two-column: Contact info (left) + Form (right) */}
      <ScrollAnimation direction="up" delay={0.1}>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12 lg:items-start">
        {/* Left: Email, Connect, Resume - all in one column */}
        <div className="space-y-6">
          {/* Email */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brown-600 mb-2">
              Email
            </p>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-brown-700 font-medium transition-colors hover:text-brown-900"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-brown-200 bg-cream-100 text-brown-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <span className="underline decoration-brown-300 hover:decoration-brown-500">
                {email}
              </span>
            </a>
          </div>

          {/* Connect - LinkedIn */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brown-600 mb-2">
              Connect
            </p>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-brown-700 font-medium transition-colors hover:text-brown-900"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-brown-200 bg-cream-100 text-brown-600 transition-colors hover:bg-brown-100 hover:border-brown-300 hover:text-brown-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </span>
              <span className="underline decoration-brown-300 hover:decoration-brown-500">
                LinkedIn
              </span>
            </a>
          </div>

          {/* Resume - moved into left column */}
          <div className="pt-4 border-t border-brown-200/60">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brown-600 mb-2">
              Resume
            </p>
            <p className="text-sm leading-relaxed text-brown-700 mb-3">
              Download my resume for detailed information about my experience and
              qualifications.
            </p>
            <a
              href={siteConfig.resumePath}
              download
              className="inline-flex items-center gap-2 text-sm font-medium text-brown-600 underline decoration-brown-300 transition-colors hover:text-brown-800 hover:decoration-brown-500"
            >
              Download resume (PDF)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right: Contact form */}
        <div className="professional-card">
          <div className="flex items-center gap-2 mb-5">
            <div className="decorative-dot" />
            <h2 className="text-xl font-bold text-brown-900">
              Send a message
            </h2>
          </div>
          {email ? (
            <ContactForm email={email} />
          ) : (
            <p className="text-sm text-brown-600">
              Configure NEXT_PUBLIC_CONTACT_EMAIL to enable the contact form.
            </p>
          )}
        </div>
      </div>
      </ScrollAnimation>

      <div className="decorative-line" />

      {/* Privacy note */}
      <ScrollAnimation direction="up" delay={0.1}>
        <p className="text-sm leading-relaxed text-brown-600">
          Your privacy is important. Your message is securely stored and will only be used to respond to your inquiry.
        </p>
      </ScrollAnimation>
    </div>
  );
}
