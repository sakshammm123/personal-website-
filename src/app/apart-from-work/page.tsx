import Image from "next/image";
import ScrollAnimation from "@/components/ScrollAnimation";

export const metadata = {
  title: "Apart from Work",
};

export default function ApartFromWorkPage() {
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
              Beyond work
            </p>
          </div>
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-brown-950 md:text-6xl">
            Apart from Work
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-brown-400" />
            <p className="text-base text-brown-700 leading-relaxed md:text-lg italic font-serif max-w-2xl">
              Apart from professional roles, Saksham places strong value on discipline, perspective, and engagement beyond the workplace. These pursuits provide balance and grounding, and play an important role in shaping how he thinks, learns, and operates across contexts.
            </p>
          </div>
        </div>
      </section>

      <div className="decorative-line" />

      {/* Fitness */}
      <ScrollAnimation direction="up" delay={0.1}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <section className="border-l-4 border-brown-400 pl-6 md:pl-8 max-w-3xl min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="decorative-dot" />
              <h2 className="text-xl font-bold text-brown-900 md:text-2xl">
                Fitness
              </h2>
            </div>
            <div className="rounded-r-lg border-l-2 border-brown-300 bg-cream-100/50 border-y border-r border-brown-200/50 p-5 md:p-6">
              <div className="space-y-4 text-brown-700 leading-relaxed md:text-base">
                <p>
                  Fitness has been a consistent part of Saksham&apos;s life since his early teens and remains an important anchor in his routine. His approach centers around strength training, supported by running from time to time, and emphasizes consistency over intensity. Beyond physical health, fitness serves as a discipline that builds resilience, focus, and mental clarity.
                </p>
                <p>
                  The process of showing up regularly, tracking progress, and improving incrementally mirrors the mindset required for sustained performance in professional settings. It reinforces patience, structure, and the ability to perform under pressure, qualities that carry directly into how he approaches work and decision-making.
                </p>
              </div>
            </div>
          </section>
          <aside className="shrink-0 w-full lg:w-80 xl:w-96 mt-8 lg:mt-0">
            <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 rounded-lg border border-brown-200/60 bg-white overflow-hidden">
              <Image
                src="/images/apart%20from%20work/fitness%20image%20.png"
                alt="Fitness"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1023px) 384px, 384px"
              />
            </div>
          </aside>
        </div>
      </ScrollAnimation>

      <div className="decorative-line" />

      {/* Community engagement */}
      <ScrollAnimation direction="up" delay={0.1}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <section className="border-l-4 border-brown-400 pl-6 md:pl-8 max-w-3xl min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="decorative-dot" />
              <h2 className="text-xl font-bold text-brown-900 md:text-2xl">
                Community Engagement
              </h2>
            </div>
            <div className="rounded-r-lg border-l-2 border-brown-300 bg-cream-100/50 border-y border-r border-brown-200/50 p-5 md:p-6">
              <div className="space-y-4 text-brown-700 leading-relaxed md:text-base">
                <p>
                  Community engagement has been both structured and personal, shaped by a belief that perspective is built through direct involvement. Saksham has worked with organizations such as Earth Saviours Foundation and Prayas Juvenile Aid Centre, and has also contributed as a teacher at The Happy School, engaging closely with individuals and communities in need.
                </p>
                <p>
                  These experiences reinforced the importance of empathy, responsibility, and understanding challenges beyond formal professional environments. Working at the grassroots level offered perspective on how thoughtful action, consistency, and intent can create meaningful impact, grounding his approach to decision-making in real human contexts.
                </p>
              </div>
            </div>
          </section>
          <aside className="shrink-0 w-full lg:w-80 xl:w-96 mt-8 lg:mt-0">
            <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 rounded-lg border border-brown-200/60 bg-white overflow-hidden">
              <Image
                src="/images/apart%20from%20work/social%20Work%20.jpg"
                alt="Community Engagement"
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 384px, 384px"
              />
            </div>
          </aside>
        </div>
      </ScrollAnimation>

      <div className="decorative-line" />

      {/* Debates and Business Competitions */}
      <ScrollAnimation direction="up" delay={0.1}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <section className="border-l-4 border-brown-400 pl-6 md:pl-8 max-w-3xl min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="decorative-dot" />
              <h2 className="text-xl font-bold text-brown-900 md:text-2xl">
                Debates and Business Competitions
              </h2>
            </div>
            <div className="rounded-r-lg border-l-2 border-brown-300 bg-cream-100/50 border-y border-r border-brown-200/50 p-5 md:p-6">
              <div className="space-y-4 text-brown-700 leading-relaxed md:text-base">
                <p>
                  Saksham&apos;s interest in structured thinking and articulation began early through Model United Nations and Indian Parliamentary Debates, with a focus on national and policy-driven issues. Over time, he secured multiple podium finishes, building confidence in research-led argumentation, persuasive communication, and defending positions under pressure.
                </p>
                <p>
                  This interest later extended into business and case competitions during his academic journey. Working in team-based, time-bound settings to solve ambiguous problems strengthened his ability to structure arguments, balance data with narrative, and communicate recommendations clearly to diverse audiences. These experiences continue to influence how he approaches problem-solving, collaboration, and decision-making in high-pressure environments.
                </p>
              </div>
            </div>
          </section>
          <aside className="shrink-0 w-full lg:w-80 xl:w-96 mt-8 lg:mt-0">
            <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 rounded-lg border border-brown-200/60 bg-white overflow-hidden">
              <Image
                src="/images/apart%20from%20work/debate%202.JPG"
                alt="Debates and Business Competitions"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1023px) 384px, 384px"
              />
            </div>
          </aside>
        </div>
      </ScrollAnimation>
    </div>
  );
}
