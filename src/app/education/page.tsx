import Image from "next/image";
import { education } from "@/data/site";
import ScrollAnimation from "@/components/ScrollAnimation";

export const metadata = {
  title: "Education",
};

export default function EducationPage() {
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
              Academic path
            </p>
          </div>
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-brown-950 md:text-6xl">
            Education
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-brown-400" />
            <p className="text-base text-brown-700 leading-relaxed md:text-lg italic font-serif max-w-2xl">
              A progression from foundational business learning to global exposure and India-focused strategic thinking.
            </p>
          </div>
          <p className="text-brown-700 leading-relaxed md:text-base max-w-3xl">
            This academic path was designed to build a strong business foundation through structured thinking, real-world application, and exposure to diverse industries and markets. Each stage of learning contributed to developing clarity in decision-making, adaptability across contexts, and a practical approach to leadership.
          </p>
        </div>
      </section>

      <div className="decorative-line" />

      {/* ISB */}
      <ScrollAnimation direction="up" delay={0.1}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <section className="border-l-4 border-brown-400 pl-6 md:pl-8 max-w-3xl min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 rounded-lg border border-brown-200/60 bg-white overflow-hidden">
                <Image
                  src={education[0].logo}
                  alt=""
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </div>
              <h2 className="text-2xl font-bold text-brown-900 md:text-3xl">
                {education[0].school}
              </h2>
            </div>
            <a
              href={education[0].website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-brown-600 underline decoration-brown-300 transition-colors hover:text-brown-800 hover:decoration-brown-500 shrink-0"
            >
              Visit website →
            </a>
          </div>
          <p className="mt-1 text-sm font-medium text-brown-600">
            Hyderabad, India
          </p>

          {"programme" in education[0] && (
            <div className="mt-6 rounded-r-lg border-l-4 border-brown-500 bg-cream-100/60 border-y border-r border-brown-200/50 p-5 md:p-6">
              <h3 className="text-lg font-bold text-brown-900 mb-2">
                {education[0].programme}
              </h3>
              <p className="text-brown-700 leading-relaxed md:text-base">
                Dual specialization in Marketing and Strategy, with a focus on structured problem solving, leadership, and India-specific market and distribution dynamics. Learning is complemented by experiential work, including the Experiential Learning Project with Brown Living, a Mumbai-based sustainability platform. The project focused on seller success through growth and integration strategies, translating academic concepts into real business decisions.
              </p>
            </div>
          )}
          </section>
          <aside className="shrink-0 w-full lg:w-80 xl:w-96 mt-8 lg:mt-0">
            <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 rounded-lg border border-brown-200/60 bg-white overflow-hidden">
              <Image
                src="/images/education/ISB%20awards.jpg"
                alt="ISB awards"
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 384px, 384px"
              />
            </div>
          </aside>
        </div>
      </ScrollAnimation>

      <div className="decorative-line" />

      {/* ESSEC */}
      <ScrollAnimation direction="up" delay={0.1}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <section className="border-l-4 border-brown-400 pl-6 md:pl-8 max-w-3xl min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 rounded-lg border border-brown-200/60 bg-white overflow-hidden">
                <Image
                  src={education[1].logo}
                  alt=""
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </div>
              <h2 className="text-2xl font-bold text-brown-900 md:text-3xl">
                {education[1].school}
              </h2>
            </div>
            <a
              href={education[1].website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-brown-600 underline decoration-brown-300 transition-colors hover:text-brown-800 hover:decoration-brown-500 shrink-0"
            >
              Visit website →
            </a>
          </div>
          <p className="mt-1 text-sm font-medium text-brown-600">
            Singapore and Paris
          </p>

          <div className="mt-6 rounded-r-lg border-l-4 border-brown-500 bg-cream-100/60 border-y border-r border-brown-200/50 p-5 md:p-6">
            <h3 className="text-lg font-bold text-brown-900 mb-1">
              {education[1].degree}
            </h3>
            <p className="text-sm font-medium text-brown-600 mb-3">
              Entrepreneurship and Innovation, Entrepreneurship and Sustainability
            </p>
            <p className="text-brown-700 leading-relaxed md:text-base">
              A dual-location program across Singapore and Paris combining academic rigor with hands-on consulting and startup exposure. Worked on consulting and strategy projects with organizations such as Dior, Danone, L&apos;Oréal, Decathlon, and AIDHA, along with early-stage startups across Asia and Europe. These experiences provided insight into global approaches to innovation, entrepreneurship, and operations across markets.
            </p>
          </div>
          </section>
          <aside className="shrink-0 w-full lg:w-80 xl:w-96 mt-8 lg:mt-0">
            <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 rounded-lg border border-brown-200/60 bg-white overflow-hidden">
              <Image
                src="/images/education/Essec.jpg"
                alt="ESSEC"
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 384px, 384px"
              />
            </div>
          </aside>
        </div>
      </ScrollAnimation>

      <div className="decorative-line" />

      {/* Christ University */}
      <ScrollAnimation direction="up" delay={0.1}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <section className="border-l-4 border-brown-400 pl-6 md:pl-8 max-w-3xl min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 rounded-lg border border-brown-200/60 bg-white overflow-hidden">
                <Image
                  src={education[2].logo}
                  alt=""
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </div>
              <h2 className="text-2xl font-bold text-brown-900 md:text-3xl">
                {education[2].school}
              </h2>
            </div>
            <a
              href={education[2].website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-brown-600 underline decoration-brown-300 transition-colors hover:text-brown-800 hover:decoration-brown-500 shrink-0"
            >
              Visit website →
            </a>
          </div>

          <div className="mt-6 rounded-r-lg border-l-4 border-brown-500 bg-cream-100/60 border-y border-r border-brown-200/50 p-5 md:p-6">
            <h3 className="text-lg font-bold text-brown-900 mb-1">
              {education[2].degree}
            </h3>
            <p className="text-sm font-medium text-brown-600 mb-3">
              {education[2].specialisation}
            </p>
            <p className="text-brown-700 leading-relaxed md:text-base">
              An early foundation in business, marketing, and communication, with exposure to diverse and multi-city environments. Actively involved in theatre through ZEALOUS, one of the university&apos;s largest theatre collectives, serving as Social Media Coordinator and performing across cities including Bangalore, Delhi, and Mumbai. Also worked on an innovation project designing a haptic enabled GPS glove for two wheeler riders, aimed at improving road safety by reducing distraction during navigation.
            </p>
          </div>
          </section>
          <aside className="shrink-0 w-full lg:w-80 xl:w-96 mt-8 lg:mt-0">
            <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 rounded-lg border border-brown-200/60 bg-white overflow-hidden">
              <Image
                src="/images/education/christ%20theatre%20award.PNG"
                alt="Christ theatre award"
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 384px, 384px"
              />
            </div>
          </aside>
        </div>
      </ScrollAnimation>

    </div>
  );
}
