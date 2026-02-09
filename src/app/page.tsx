import Image from "next/image";
import Link from "next/link";
import { education, person, work } from "@/data/site";
import ScrollAnimation from "@/components/ScrollAnimation";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* Hero Section - Impressive and Professional */}
      <section className="relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-brown-100/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-80 sm:h-80 bg-cream-300/30 rounded-full blur-3xl -z-10" />
        
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)] md:items-center lg:gap-8">
          {/* Portrait Image - contained so it doesn't overlap text */}
          <div className="relative animate-fade-in-up animate-delay-200 w-full flex justify-center md:justify-end order-first md:order-none overflow-hidden">
            <div className="relative aspect-[2/3] w-full max-w-md md:max-w-[420px] lg:max-w-[480px] md:aspect-[4/5] shrink-0">
              <div className="relative h-full w-full">
                <Image
                  src="/images/personal/professional-portrait.jpg"
                  alt="Saksham Mahajan - Professional Portrait"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 480px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Name and intro - shifted right so it doesn't sit on the image */}
          <div className="space-y-8 animate-fade-in-up md:pl-6 lg:pl-10 min-w-0">
            <div className="flex items-center gap-3">
              <div className="decorative-dot" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brown-600">
                Professional Profile
              </p>
            </div>
            <div className="space-y-5">
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-brown-950 md:text-6xl lg:text-7xl">
                {person.fullName}
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-brown-400" />
                <p className="text-base uppercase tracking-[0.2em] text-brown-600 font-medium md:text-lg">
                  CUSTOMER STRATEGY • BUSINESS DEVELOPMENT • GROWTH
                </p>
              </div>
            </div>
            <div className="space-y-4 max-w-2xl">
              <p className="text-base leading-relaxed text-brown-800 md:text-lg italic font-serif">
                Welcome to Saksham's Profile.
              </p>
              <p className="text-base leading-relaxed text-brown-700 md:text-lg italic font-serif">
                This space invites you into the mind and experiences of Saksham, where curiosity has shaped his journey across cultures and contexts. It reflects how values, creativity, and innovative problem-solving have influenced the way he thinks, builds, and drives meaningful growth.
              </p>
            </div>
            {/* CTA Buttons - uniform size and color */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-4 w-full sm:w-auto">
              <Link
                href="/work"
                className="inline-flex items-center justify-center min-h-[48px] min-w-[180px] px-8 py-3.5 rounded-md bg-brown-700 text-cream-50 font-semibold text-sm md:text-base transition-all duration-300 hover:bg-brown-800 hover:shadow-lg hover:shadow-brown-900/20 hover:scale-105 active:scale-95"
              >
                View Work
              </Link>
              <Link
                href="/education"
                className="inline-flex items-center justify-center min-h-[48px] min-w-[180px] px-8 py-3.5 rounded-md bg-brown-700 text-cream-50 font-semibold text-sm md:text-base transition-all duration-300 hover:bg-brown-800 hover:shadow-lg hover:shadow-brown-900/20 hover:scale-105 active:scale-95"
              >
                View Education
              </Link>
              <a
                href="/Saksham%20Mahajan%20Resume.pdf"
                download
                className="inline-flex items-center justify-center gap-2 min-h-[48px] min-w-[180px] px-8 py-3.5 rounded-md bg-brown-700 text-cream-50 font-semibold text-sm md:text-base transition-all duration-300 hover:bg-brown-800 hover:shadow-lg hover:shadow-brown-900/20 hover:scale-105 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Separator */}
      <div className="decorative-line" />

      {/* Profile Summary */}
      <div className="flex items-center gap-3">
        <div className="decorative-dot" />
        <h2 className="text-2xl font-bold text-brown-900 md:text-3xl">Profile Summary</h2>
      </div>
      <ScrollAnimation direction="up" delay={0.1}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <section className="space-y-4 min-w-0 flex-1">
            <div className="space-y-4 text-brown-700 leading-relaxed max-w-4xl">
              <p className="text-base md:text-lg">
                Saksham is a growth-oriented general management professional who approaches business through first-principles thinking, customer insight, and execution discipline. His experience across consumer and food service businesses has involved working on problems where strategy must translate cleanly into operations, and where decisions are tested in real market conditions rather than presentations.
              </p>
              <p className="text-base md:text-lg">
                His educational journey across India, Europe, and Singapore has shaped a global yet grounded perspective. Formal training in marketing and management, combined with exposure to diverse academic systems and cultures, has strengthened his ability to structure ambiguity, evaluate trade-offs, and think across functions with clarity and intent.
              </p>
              <p className="text-base md:text-lg">
                Professionally, Saksham has operated in both multinational and entrepreneurial environments. Experience within a global consumer organization reinforced the importance of rigor, process, and cross-market coordination, while hands-on involvement in scaling a food service brand sharpened his bias toward ownership, adaptability, and execution across market entry and operations.
              </p>
              <p className="text-base md:text-lg">
                He is motivated by roles that demand accountability across functions, reward sound judgment under uncertainty, and offer the opportunity to build systems and growth engines that create durable, long-term value.
              </p>
            </div>
          </section>
          <aside className="shrink-0 w-full lg:w-80 xl:w-96 mt-8 lg:mt-0">
            <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 rounded-lg border border-brown-200/60 bg-white overflow-hidden min-h-[200px]" aria-hidden />
          </aside>
        </div>
      </ScrollAnimation>

      {/* Decorative Separator */}
      <div className="decorative-line" />

      {/* Work Summary */}
      <ScrollAnimation direction="up" delay={0.1}>
        <section className="space-y-5">
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="decorative-dot" />
            <h2 className="text-2xl font-bold text-brown-900 md:text-3xl">Work Summary</h2>
          </div>
          <Link className="text-sm text-brown-600 hover:text-brown-800 font-medium transition-colors underline decoration-brown-300 hover:decoration-brown-500" href="/work">
            View all →
          </Link>
        </div>
        <p className="text-base text-brown-700 max-w-3xl">
          Saksham's experience spans two complementary environments that shaped his general management perspective.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {/* Pita Pit Card */}
          <ScrollAnimation direction="up" delay={0.2} className="h-full">
            <div className="professional-card group hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            <div className="relative h-56 w-full mb-6 -mx-6 -mt-6 rounded-t-lg overflow-hidden">
              <Image
                src="/images/work/pita-pit-food-spread.jpg"
                alt="Pita Pit Food Spread"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-900/40 to-transparent" />
            </div>
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-brown-900 mb-2">Pita Pit India</h3>
              <p className="text-sm text-brown-700 leading-relaxed mb-4">
                Worked on the India launch and early scale up of a global QSR brand across two phases, first designing market entry and then owning growth and performance.
              </p>
              <ul className="space-y-2.5 text-sm">
                {work.pitaPitIndia.roles.map((r) => (
                  <li key={r.title} className="flex flex-col border-l-2 border-brown-300 pl-3">
                    <span className="font-semibold text-brown-900">{r.title}</span>
                    <span className="text-brown-600 text-xs">{r.dates}</span>
                  </li>
                ))}
              </ul>
            </div>
            </div>
          </ScrollAnimation>
          
          {/* Beam Suntory Card */}
          <ScrollAnimation direction="up" delay={0.3} className="h-full">
            <div className="professional-card group hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            <div className="relative h-56 w-full mb-6 -mx-6 -mt-6 rounded-t-lg overflow-hidden">
              <Image
                src="/images/work/beansuntory home page .jpg"
                alt="Beam Suntory Home Page"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-900/40 to-transparent" />
            </div>
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-brown-900 mb-2">Beam Suntory, Singapore</h3>
              <p className="text-sm text-brown-700 leading-relaxed mb-4">
                Worked in global supply planning within a large multinational consumer business, gaining exposure to structured operations and cross border coordination at scale.
              </p>
              <ul className="space-y-2.5 text-sm">
                {work.beamSuntory.roles.map((r) => (
                  <li key={r.title} className="flex flex-col border-l-2 border-brown-300 pl-3">
                    <span className="font-semibold text-brown-900">{r.title}</span>
                    <span className="text-brown-600 text-xs">{r.dates}</span>
                  </li>
                ))}
              </ul>
            </div>
            </div>
          </ScrollAnimation>
        </div>
        </section>
      </ScrollAnimation>

      {/* Decorative Separator */}
      <div className="decorative-line" />

      {/* Education Summary */}
      <ScrollAnimation direction="up" delay={0.1}>
        <section className="space-y-5">
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="decorative-dot" />
            <h2 className="text-2xl font-bold text-brown-900 md:text-3xl">Education Summary</h2>
          </div>
          <Link className="text-sm text-brown-600 hover:text-brown-800 font-medium transition-colors underline decoration-brown-300 hover:decoration-brown-500" href="/education">
            Explore education journey →
          </Link>
        </div>
        <p className="text-base text-brown-700 max-w-3xl">
          Saksham's academic journey reflects a progression from foundational business learning to global exposure and India focused strategic thinking.
        </p>
        <div className="grid gap-4">
          {education.map((e, index) => {
            const logoPaths = ["/logos/ISB.png", "/logos/ESSEC.png", "/logos/christ-university.png"];
            const logoPath = logoPaths[index] || null;
            return (
              <ScrollAnimation key={e.school} direction="up" delay={index * 0.1}>
                <div className="professional-card group hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-5">
                  {logoPath && (
                    <div className="relative h-14 w-28 flex-shrink-0 p-2 bg-cream-50 rounded-md border border-brown-200">
                      <Image
                        src={logoPath}
                        alt={`${e.school} Logo`}
                        fill
                        className="object-contain"
                        sizes="112px"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between mb-2">
                      <h3 className="font-bold text-brown-900 text-lg">{e.school}</h3>
                      <p className="text-sm text-brown-600">{e.dates}</p>
                    </div>
                    {"programme" in e ? (
                      <p className="text-sm text-brown-700 font-medium">{e.programme}</p>
                    ) : (
                      <p className="text-sm text-brown-700 font-medium">
                        {e.degree}
                        {"specialisation" in e ? ` — ${e.specialisation}` : ""}
                      </p>
                    )}
                  </div>
                </div>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>
        </section>
      </ScrollAnimation>

      {/* Decorative Separator */}
      <div className="decorative-line" />

      {/* Additional Sections */}
      <ScrollAnimation direction="up" delay={0.1}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Apart from Work */}
          <div className="professional-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="decorative-dot" />
              <h3 className="text-lg font-bold text-brown-900">Apart from Work</h3>
            </div>
            <p className="text-sm text-brown-700 leading-relaxed mb-4">
              Outside work, Saksham values activities that build discipline, perspective, and empathy, including endurance sports, creative pursuits, and community engagement.
            </p>
            <Link 
              href="/apart-from-work"
              className="text-sm text-brown-600 hover:text-brown-800 font-medium transition-colors underline decoration-brown-300 hover:decoration-brown-500"
            >
              Read more →
            </Link>
          </div>

          {/* Contact Section */}
          <div className="professional-card bg-brown-50/50 border-brown-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="decorative-dot bg-brown-500" />
              <h3 className="text-lg font-bold text-brown-900">Contact</h3>
            </div>
            <p className="text-sm text-brown-700 leading-relaxed mb-4">
              Saksham is open to conversations around Business Development, General Management, and Strategy roles.
            </p>
            <Link 
              href="/contact"
              className="inline-block px-6 py-2.5 rounded-md bg-brown-700 text-cream-50 font-semibold transition-all duration-300 hover:bg-brown-800 hover:shadow-lg hover:shadow-brown-900/20 text-sm transform hover:scale-105 active:scale-95"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
}
