import { Icon } from "@/components/icon";

const languages = [
  { name: "TypeScript", value: 92 },
  { name: "Python / Django", value: 84 },
  { name: "Dart / Flutter", value: 88 },
];

const ecosystem = [
  "React",
  "Next.js",
  "NestJS",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "Redis",
];

const stats = [
  { icon: "rocket_launch", value: "8+", label: "Production systems shipped" },
  {
    icon: "layers",
    value: "4",
    label: "Platforms built across healthcare, AI, commerce, and education",
  },
  {
    icon: "school",
    value: "3",
    label: "Years building curriculum and production software",
  },
];

const journey = [
  {
    role: "Coding Curriculum Developer",
    meta: "Baseet | 2023–2025",
    desc: "Developed programming curricula and technical learning content focused on practical software engineering skills. Built structured material covering frontend development, backend architecture, APIs, and problem solving for students transitioning into production-level development.",
    quoteLabel: "// Key Result",
    quote:
      "Reduced onboarding friction for new developers through structured, project-based learning paths.",
  },
  {
    role: "Software Engineer",
    meta: "Picook Solutions | 2022–2026",
    desc: "Built WordPress systems, full-stack web applications, and mobile products for client projects across multiple industries. Worked on API integrations, frontend implementation, backend services, and deployment workflows while maintaining delivery timelines.",
    quoteLabel: "// Achievement",
    quote:
      "Delivered multi-platform client projects without sacrificing maintainability or release speed.",
  },
  {
    role: "Computer Science Graduate",
    meta: "Misr Higher Institution for Computers and Commerce | 2020–2024",
    desc: "Studied software engineering fundamentals, databases, networking, and system design while building independent projects outside the classroom. Focused heavily on practical implementation and production-oriented development workflows.",
    quoteLabel: "// Origin",
    quote:
      "Most of my engineering experience came from building and shipping outside coursework.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-12 pb-32 px-4">
      <div className="max-w-container mx-auto glass-surface rounded-[32px] overflow-hidden">
        {/* Hero */}
        <section className="px-6 md:px-16 py-12 md:py-24 mb-8 md:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] leading-[1.05] font-extrabold tracking-[-0.04em] text-primary mb-8">
                Designing systems <br />
                <span className="text-secondary">for reliability.</span>
              </h1>
              <div className="space-y-6 text-on-surface-variant text-lg leading-7 max-w-2xl">
                <p>
                  I&apos;m Abdullah Othman, a full-stack engineer focused on
                  building maintainable products with strong technical
                  foundations. I work across frontend, backend, mobile, and
                  infrastructure, with experience shipping real-time
                  applications, commerce systems, healthcare tools, and learning
                  platforms.
                </p>
                <p>
                  I prefer simple architecture over unnecessary abstraction. I
                  optimize for clear code, predictable systems, and products
                  that remain easy to extend six months later. Most of my work
                  starts with understanding operational constraints before
                  choosing tools or frameworks.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="aspect-square rounded-2xl overflow-hidden glass-card p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Abdullah Othman"
                  className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
                  src="/assets/profile.jpeg"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-secondary/10 blur-[80px] rounded-full" />
            </div>
          </div>
        </section>

        {/* Engineering Arsenal */}
        <section className="px-6 md:px-16 mb-20 md:mb-32">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-on-surface mb-4">
              Engineering Arsenal
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary font-semibold font-[var(--font-jetbrains)]">
              Languages · Platforms · Infrastructure
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="md:col-span-2 lg:col-span-3 glass-card p-6 md:p-8 rounded-xl transition-all duration-500">
              <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-6 flex items-center gap-3">
                <Icon name="terminal" /> Languages
              </h3>
              <div className="space-y-6">
                {languages.map((l) => (
                  <div key={l.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)]">
                        {l.name}
                      </span>
                      <span className="text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)] text-secondary">
                        {l.value}%
                      </span>
                    </div>
                    <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary shadow-[0_0_10px_rgba(76,215,246,0.5)]"
                        style={{ width: `${l.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-3 glass-card p-6 md:p-8 rounded-xl transition-all duration-500">
              <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-6 flex items-center gap-3">
                <Icon name="layers" /> Ecosystem
              </h3>
              <div className="flex flex-wrap gap-3">
                {ecosystem.map((e) => (
                  <span
                    key={e}
                    className="px-4 py-2 bg-surface-variant border border-outline-variant text-on-surface-variant text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)] rounded-lg hover:border-secondary transition-colors"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>

            {stats.map((s) => (
              <div
                key={s.label}
                className="md:col-span-1 lg:col-span-2 glass-card p-6 rounded-xl flex flex-col justify-center items-center text-center"
              >
                <Icon name={s.icon} className="text-secondary text-4xl mb-4" />
                <h4 className="text-3xl font-semibold tracking-[-0.01em]">
                  {s.value}
                </h4>
                <p className="text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)] text-on-surface-variant">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Journey */}
        <section className="px-6 md:px-16 mb-20 md:mb-32">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-on-surface mb-4">
              Professional Journey
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary font-semibold font-[var(--font-jetbrains)]">
              The Evolution of My Expertise
            </p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px timeline-line opacity-30" />
            <div className="space-y-16 md:space-y-24">
              {journey.map((j, i) => {
                const reversed = i % 2 === 1;
                return (
                  <div
                    key={j.role}
                    className={`relative flex flex-col md:flex-row items-center justify-between ${
                      reversed ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`hidden md:block w-[45%] ${
                        reversed ? "text-left pl-12" : "text-right pr-12"
                      }`}
                    >
                      <h3 className="text-3xl font-semibold tracking-[-0.01em] text-on-surface">
                        {j.role}
                      </h3>
                      <p className="text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)] text-secondary mb-4">
                        {j.meta}
                      </p>
                      <p className="text-on-surface-variant text-base">
                        {j.desc}
                      </p>
                    </div>
                    <div className="z-10 w-4 h-4 rounded-full bg-secondary glow-sm border-4 border-background ring-4 ring-secondary/20" />
                    <div className="md:hidden w-full text-center mt-6 px-2">
                      <h3 className="text-2xl font-semibold tracking-[-0.01em] text-on-surface">
                        {j.role}
                      </h3>
                      <p className="text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)] text-secondary mb-4">
                        {j.meta}
                      </p>
                      <p className="text-on-surface-variant text-base">
                        {j.desc}
                      </p>
                      <div className="glass-card p-5 rounded-xl mt-6 text-left">
                        <code className="text-sm text-secondary block mb-2 font-[var(--font-jetbrains)]">
                          {j.quoteLabel}
                        </code>
                        <p className="text-sm italic text-on-surface-variant font-[var(--font-jetbrains)]">
                          &ldquo;{j.quote}&rdquo;
                        </p>
                      </div>
                    </div>
                    <div
                      className={`hidden md:block w-[45%] ${
                        reversed ? "pr-12" : "pl-12"
                      }`}
                    >
                      <div
                        className={`glass-card p-6 rounded-xl ${
                          reversed
                            ? "border-l-4 border-secondary/40"
                            : "border-r-4 border-secondary/40"
                        }`}
                      >
                        <code className="text-sm text-secondary block mb-2 font-[var(--font-jetbrains)]">
                          {j.quoteLabel}
                        </code>
                        <p className="text-sm italic text-on-surface-variant font-[var(--font-jetbrains)]">
                          &ldquo;{j.quote}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-16 mb-12 md:mb-24">
          <div className="glass-card p-8 sm:p-12 md:p-16 rounded-2xl text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em] text-on-surface mb-6">
              Looking for a technical partner?
            </h2>
            <p className="text-lg text-on-surface-variant mb-12 max-w-2xl mx-auto">
              I help teams build reliable products with clean architecture and
              practical engineering decisions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="https://drive.google.com/file/d/1Ry4B7P2Fbh0wayY0T2lw1-3AevRy1H-R/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-secondary text-on-secondary text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)] rounded-xl hover:glow-sm transition-all duration-300 inline-block text-center"
              >
                Download Résumé
              </a>
              <a
                href="/contact"
                className="px-8 py-4 border border-secondary text-secondary text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)] rounded-xl hover:bg-secondary/5 transition-all duration-300 inline-block text-center"
              >
                Schedule a Consultation
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
