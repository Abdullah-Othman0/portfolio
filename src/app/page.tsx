import Link from "next/link";
import { Icon } from "@/components/icon";
import { GalaxyJourney } from "@/components/galaxy-journey";
import { PLANETS } from "@/components/three/journey-data";

const techGroups = [
  {
    icon: "dns",
    label: "Backend",
    items: ["NestJS", "Node.js", "Express", "Django", "DRF", "Prisma", "TypeORM"],
  },
  {
    icon: "web",
    label: "Frontend",
    items: ["React", "Next.js", "Vue.js", "Tailwind CSS"],
  },
  {
    icon: "smartphone",
    label: "Mobile",
    items: ["Flutter"],
  },
  {
    icon: "database",
    label: "Databases",
    items: ["PostgreSQL", "MySQL", "SQLite", "MongoDB"],
  },
  {
    icon: "cloud",
    label: "Infrastructure",
    items: ["Docker", "Nginx", "Linux"],
  },
  {
    icon: "smart_toy",
    label: "AI",
    items: ["OpenAI API", "Ollama", "RAG Systems", "Vector Search"],
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-svh flex items-center px-6 md:px-16 overflow-hidden bg-transparent">
        {/* Subtle gradient to improve text legibility against the galaxy background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(11,19,38,0.8)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-container mx-auto w-full">
          <div className="max-w-3xl py-24">
          <div className="inline-block px-4 py-1.5 mb-6 glass-card rounded-full">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary font-[var(--font-jetbrains)] text-shadow-strong">
              Available for new projects
            </span>
          </div>
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] leading-[1.05] font-extrabold tracking-[-0.04em] mb-8 text-shadow-strong">
            <span className="block">Building digital products</span>
            <span className="gradient-text">that people actually use.</span>
          </h1>
          <p className="text-lg leading-7 text-on-surface max-w-2xl mb-12 text-shadow-strong">
            I build full-stack systems for web and mobile, from real-time AI
            chat to e-commerce and multi-tenant platforms. 4+ years shipping
            production code for startups and small teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link
              href="/projects"
              className="bg-secondary-container text-on-secondary-container font-bold px-10 py-4 rounded-xl glow-button transition-transform active:scale-95 text-lg text-center"
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="glass-card border border-primary/20 text-primary font-bold px-10 py-4 rounded-xl transition-transform active:scale-95 text-lg text-center"
            >
              Let&apos;s Talk
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* Selected Work: scroll drives the camera from planet to planet.
          Visuals live in the global canvas; this section owns the scroll
          distance, intro/outro beats, and the flight rail. */}
      <GalaxyJourney>
        <div className="sr-only">
          {PLANETS.map((p) => (
            <article key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
              <a href={p.repo}>View source for {p.title}</a>
            </article>
          ))}
        </div>
      </GalaxyJourney>

      {/* Tech Stack */}
      <section
        id="skills"
        className="max-w-container mx-auto px-6 md:px-16 py-20 md:py-32 scroll-mt-24 bg-transparent"
      >
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-on-surface mb-4 text-shadow-strong">
            Core Stack
          </h2>
          <p className="text-base text-on-surface-variant text-shadow-strong">
            The tools behind the systems above, grouped by where they run.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techGroups.map((g) => (
            <div
              key={g.label}
              className="glass-card p-6 rounded-xl group flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <Icon
                  name={g.icon}
                  className="text-2xl text-secondary transition-transform group-hover:scale-110"
                />
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] font-[var(--font-jetbrains)]">
                  {g.label}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-md bg-surface-container-high border border-outline-variant/50 text-on-surface-variant"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-transparent">
        <div className="max-w-container mx-auto px-6 md:px-16 py-20 md:py-32 relative z-10">
          <div className="glass-card rounded-3xl p-8 sm:p-12 md:p-24 relative overflow-hidden text-center">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em] mb-8 text-shadow-strong">
              Need a system built to last?
            </h2>
            <p className="text-lg text-on-surface-variant mb-8 md:mb-12 text-shadow-strong">
              I work with startups and teams that need reliable products, fast
              iteration, and clean engineering foundations. Available for
              freelance development and consulting engagements.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/contact"
                className="bg-primary text-on-primary font-bold px-10 py-4 rounded-xl glow-button transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                Start a Conversation
                <Icon name="mail" />
              </Link>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
