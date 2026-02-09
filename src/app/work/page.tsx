import Link from "next/link";
import Image from "next/image";
import { work } from "@/data/site";
import ScrollAnimation from "@/components/ScrollAnimation";

export const metadata = {
  title: "Work",
};

export default function WorkPage() {
  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {/* Hero-style header (landing aesthetic) */}
      <section className="relative">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 bg-brown-100/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-cream-300/30 rounded-full blur-3xl -z-10" />
        <div className="space-y-5 max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="decorative-dot" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brown-600">
              Experience
            </p>
          </div>
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-brown-950 md:text-6xl">
            Work
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-brown-400" />
            <p className="text-base text-brown-700 leading-relaxed md:text-lg italic font-serif max-w-2xl">
              Building clarity in ambiguity through structured thinking, data-backed decisions, and consistent execution.
            </p>
          </div>
          <p className="text-brown-700 leading-relaxed md:text-base max-w-3xl">
            This work experience spans growth-stage and large-scale organizations, focusing on translating strategy into execution. Across roles, the emphasis has been on designing systems, grounding decisions in data, and enabling teams to perform reliably in complex operating environments.
          </p>
        </div>
      </section>

      <div className="decorative-line" />

      {/* Pita Pit – editorial block with left accent */}
      <ScrollAnimation direction="up" delay={0.1}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <section className="border-l-4 border-brown-400 pl-6 md:pl-8 max-w-3xl min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 rounded-lg border border-brown-200/60 bg-white overflow-hidden">
                <Image
                  src={work.pitaPitIndia.logo}
                  alt=""
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </div>
              <h2 className="text-2xl font-bold text-brown-900 md:text-3xl">
                {work.pitaPitIndia.company}
              </h2>
            </div>
            <a
              href={work.pitaPitIndia.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-brown-600 underline decoration-brown-300 transition-colors hover:text-brown-800 hover:decoration-brown-500 shrink-0"
            >
              Official website →
            </a>
          </div>
          <p className="mt-1 text-sm font-medium text-brown-600">
            {work.pitaPitIndia.industry} · {work.pitaPitIndia.location}
          </p>
          <p className="mt-0.5 text-sm text-brown-600">
            {work.pitaPitIndia.globalPresence}
          </p>

          <div className="mt-8 space-y-8">
            <div className="border-l-2 border-brown-300 pl-5">
              <h3 className="text-lg font-bold text-brown-900">
                {work.pitaPitIndia.roles[0].title}
              </h3>
              <p className="mt-1 text-sm font-medium text-brown-600">
                {work.pitaPitIndia.roles[0].dates}
              </p>
              <div className="mt-4 space-y-4 text-brown-700 leading-relaxed md:text-base">
                <p>
                  During the market entry phase, Saksham worked on designing the go-to-market strategy for NCR. Initial expansion plans emphasized high footfall mall locations, but early performance data highlighted misalignment with customer demand and unit economics.
                </p>
                <p>
                  Through analysis of customer cohorts, delivery behavior, and location-level demand, the strategy evolved toward targeted micro markets such as offices, gyms, universities, food courts, and residential clusters. This phase focused on demand validation, SOP development, format pilots, and building a scalable go-to-market roadmap.
                </p>
                <p>
                  This work laid the foundation for a more economically viable and repeatable expansion model.
                </p>
              </div>
            </div>

            <div className="border-l-2 border-brown-300 pl-5">
              <h3 className="text-lg font-bold text-brown-900">
                {work.pitaPitIndia.roles[1].title}
              </h3>
              <p className="mt-1 text-sm font-medium text-brown-600">
                {work.pitaPitIndia.roles[1].dates}
              </p>
              <div className="mt-4 space-y-4 text-brown-700 leading-relaxed md:text-base">
                <p>
                  As the business moved from validation to scale, Saksham took ownership of growth and performance across multiple outlets. His focus shifted to outlet-level economics, demand generation, aggregator partnerships, and operational efficiency.
                </p>
                <p>
                  He worked closely with operations, marketing, and external partners to ensure that growth was supported by systems rather than short-term tactics. Decisions around staffing, menu design, promotions, and capacity planning were increasingly driven by data rather than intuition.
                </p>
                <p>
                  This phase reinforced his belief that scale is only sustainable when systems, incentives, and people are aligned.
                </p>
              </div>
            </div>

            <div className="rounded-r-lg border-l-4 border-brown-500 bg-brown-50/50 border-y border-r border-brown-200/50 p-5 md:p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="decorative-dot bg-brown-500" />
                <h3 className="text-lg font-bold text-brown-900">
                  Key learnings from Pita Pit
                </h3>
              </div>
              <div className="space-y-4 text-brown-700 leading-relaxed md:text-base">
                <p>
                  Pita Pit shaped Saksham&apos;s understanding of leadership in ambiguous environments. As a younger leader working with frontline teams, he learned the importance of listening, co-creating processes, and earning trust through judgment rather than authority.
                </p>
                <p>
                  The experience cemented his view that sustainable growth comes from systems that support people, not control them.
                </p>
              </div>
            </div>
          </div>
          </section>
          <aside className="shrink-0 w-full lg:w-80 xl:w-96 mt-8 lg:mt-0">
            <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 rounded-lg border border-brown-200/60 bg-white overflow-hidden">
              <Image
                src="/images/work/pita-pit-storefront.PNG"
                alt="Pita Pit storefront"
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 384px, 384px"
              />
            </div>
          </aside>
        </div>
      </ScrollAnimation>

      <div className="decorative-line" />

      {/* Beam Suntory */}
      <ScrollAnimation direction="up" delay={0.1}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <section className="border-l-4 border-brown-400 pl-6 md:pl-8 max-w-3xl min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 rounded-lg border border-brown-200/60 bg-white overflow-hidden">
                <Image
                  src={work.beamSuntory.logo}
                  alt=""
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </div>
              <h2 className="text-2xl font-bold text-brown-900 md:text-3xl">
                {work.beamSuntory.company}
              </h2>
            </div>
            <a
              href={work.beamSuntory.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-brown-600 underline decoration-brown-300 transition-colors hover:text-brown-800 hover:decoration-brown-500 shrink-0"
            >
              Official website →
            </a>
          </div>
          <p className="mt-1 text-sm font-medium text-brown-600">
            {work.beamSuntory.industry} · {work.beamSuntory.location}
          </p>
          <p className="mt-0.5 text-sm text-brown-600">
            {work.beamSuntory.globalRank}
          </p>

          <div className="mt-8 space-y-8">
            <div className="border-l-2 border-brown-300 pl-5">
              <h3 className="text-lg font-bold text-brown-900">
                {work.beamSuntory.roles[0].title}
              </h3>
              <p className="mt-1 text-sm font-medium text-brown-600">
                {work.beamSuntory.roles[0].dates}
              </p>
              <div className="mt-4 space-y-4 text-brown-700 leading-relaxed md:text-base">
                <p>
                  At Beam Suntory, Saksham worked in global supply planning across Southeast Asia and Travel Retail. The role involved managing stock allocation, mitigating risk, and coordinating across markets with varying demand patterns and constraints.
                </p>
                <p>
                  This environment emphasized precision, discipline, and communication. Small misalignments could create downstream impact across multiple markets, reinforcing the importance of robust processes and clear stakeholder alignment.
                </p>
              </div>
            </div>

            <div className="rounded-r-lg border-l-4 border-brown-500 bg-brown-50/50 border-y border-r border-brown-200/50 p-5 md:p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="decorative-dot bg-brown-500" />
                <h3 className="text-lg font-bold text-brown-900">
                  Learning from scale
                </h3>
              </div>
              <div className="space-y-4 text-brown-700 leading-relaxed md:text-base">
                <p>
                  Beyond systems and data, Saksham observed that scale works only when teams trust the process and each other. Training teams on analytical tools and aligning cross-functional stakeholders was as important as the tools themselves.
                </p>
                <p>
                  This experience complemented his entrepreneurial exposure, adding depth to his understanding of leadership in large organizations.
                </p>
              </div>
            </div>
          </div>
          </section>
          <aside className="shrink-0 w-full lg:w-80 xl:w-96 mt-8 lg:mt-0">
            <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 rounded-lg border border-brown-200/60 bg-white overflow-hidden">
              <Image
                src="/images/work/Beam_Suntory_.jpg"
                alt="Beam Suntory"
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 384px, 384px"
              />
            </div>
          </aside>
        </div>
      </ScrollAnimation>

      <div className="decorative-line" />

      {/* Closing – landing-style block */}
      <ScrollAnimation direction="up" delay={0.1}>
        <section className="max-w-3xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="decorative-dot" />
            <h2 className="text-2xl font-bold text-brown-900 md:text-3xl">
              What these experiences shaped
            </h2>
          </div>
          <div className="space-y-4 text-brown-700 leading-relaxed md:text-lg">
            <p>
              Pita Pit taught Saksham how to build structure where none existed. Beam Suntory showed him how to operate within structure at scale.
            </p>
            <p>
              Together, they shaped a balanced general management mindset grounded in systems thinking, commercial discipline, and people-centred execution.
            </p>
          </div>
          <p>
            <Link
              href="/education"
              className="inline-flex items-center gap-2 text-sm font-medium text-brown-600 underline decoration-brown-300 transition-colors hover:text-brown-800 hover:decoration-brown-500"
            >
              Next: Education →
            </Link>
          </p>
        </section>
      </ScrollAnimation>
    </div>
  );
}
