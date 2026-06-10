"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";

type Category = "All" | "Full Stack" | "Frontend" | "Backend" | "Mobile";

type Project = {
  title: string;
  category: Exclude<Category, "All">;
  description: string;
  tags: string[];
  icon: string;
  primaryLabel: string;
  primaryIcon: string;
  primaryHref: string;
  img?: string;
  code?: string;
};

const projects: Project[] = [
  {
    title: "Nebula Chat",
    category: "Full Stack",
    description:
      "A messaging platform where users chat with custom AI personas alongside real people in one conversation. Replies stream back token by token over Socket.IO, and a pluggable provider swaps between local Ollama models and OpenAI with no code changes.",
    tags: ["NESTJS", "REACT", "SOCKETIO"],
    icon: "forum",
    primaryLabel: "View Repo",
    primaryIcon: "rocket_launch",
    primaryHref: "https://github.com/Abdullah-Othman0/chatter",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnH53PAwSyiYk3-DDnieZr-2Kca-uJmG9wGWHJmnmTJTwwYHLZ54Q7hnslO6vEWc6niiV0fdvJPfgBgK5EZBTcqyHe3RcTB2hIMhQHRRL0ATHFPiFM_YzO7Afla2aBiVbOT2_2v5H4SdD-juul--z9Du4zOVfMYctoPKNyrBjo8NG7d2n4cccBJ5Q_kZgvPKaY2jKfgUibHqbK9XZW_q18lMLwy1W5TzTRH6eF1DyHPCMYnaWeyNQ9jcMLvr2sBV_TVplU34yLvHok",
  },
  {
    title: "Vanguard Commerce",
    category: "Frontend",
    description:
      "A storefront covering the full purchase flow: catalog, cart, Stripe checkout, and an admin back office for managing products and orders. Hardened with rate-limiting and JWT auth so it can handle real customer traffic and payments safely.",
    tags: ["NEXTJS", "STRIPE", "NESTJS"],
    icon: "shopping_bag",
    primaryLabel: "View Repo",
    primaryIcon: "rocket_launch",
    primaryHref: "https://github.com/Abdullah-Othman0/nn-ecommerce",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuhtpX8IiaIUYHkvnSrf2KQohLXCQcmulb5dKFu7QtSZl9AKbJDlOxoU1EBKs-BD0ivhRyKX_WD4y3MntEF8LmgHP0DstI4jTEVuJYP9EhaHydLna7WBhfuBhIgpiu4I-ET93gerQoJbMGssM30P8n_VC4P0FyIsX2zCJhLh5cD1HsnqTLl0o-8YT6hTstE3JC8RwuqfQ3zvFN7rIa0fycDSo-d5YYpSFKy3Mqj9_DPGXoWQ1JdcdXXWypEYobfeC1ZkbTSBhzKIpk",
  },
  {
    title: "Atlas LMS",
    category: "Backend",
    description:
      "A learning platform that lets schools sell video courses, run quizzes, and track enrollment and revenue from one admin dashboard. Stripe handles course purchases server-side, with GeoIP tracking and Excel exports giving instructors a clear view of student activity.",
    tags: ["DJANGO", "STRIPE", "DOCKER"],
    icon: "school",
    primaryLabel: "Backend Repo",
    primaryIcon: "rocket_launch",
    primaryHref: "https://github.com/Abdullah-Othman0/anmo_backend",
    code: `class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def purchase(self, request, pk=None):
        course = self.get_object()
        intent = stripe.PaymentIntent.create(
            amount=course.price_cents,
            currency='usd',
            metadata={'course_id': course.id,
                      'user_id': request.user.id},
        )
        return Response({'client_secret': intent.client_secret})`,
  },
  {
    title: "Arbiter Live",
    category: "Mobile",
    description:
      "A live scoring and voting system for in-person card games, running on the same codebase across Windows desktop and mobile. Local persistence keeps the game running through Wi-Fi drops, with QR scanning syncing results once devices reconnect.",
    tags: ["FLUTTER", "BLOC", "SQLITE"],
    icon: "smartphone",
    primaryLabel: "View Repo",
    primaryIcon: "rocket_launch",
    primaryHref: "https://github.com/Abdullah-Othman0/gm_dashboard",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEdDkMt-YyWBVfrqZnXhC43I-l6tgxv_vt65rTU-lmFzZdLGF0S1ywhyeXi8pG1hMRFY4yW2HGUixeEcV1unAtmZK7x9uxPDD0ZKnb1ivG0iRX8A6WjYLEvQRCnZx9Cvb0_QfffXla7XYYu3Mx-5tcUjzuXf75oB5NvDs0BxJ8p4PRC3Jyh53RQAjj09C4L4rer4VRoj5GeCYL8kwjmXQfx4pxJwqqPQskEHnck9nU95O1PtzGxSVQkEiOoDdZ3RdOOU_xMDBWsB3X",
  },
  {
    title: "MedRef Pro",
    category: "Mobile",
    description:
      "A reference app for medical professionals: check drug interactions before prescribing, and look up normal blood-test ranges in seconds. Backed by Firebase, so the reference database updates without an app release.",
    tags: ["FLUTTER", "FIREBASE", "BLOC"],
    icon: "vaccines",
    primaryLabel: "View Repo",
    primaryIcon: "rocket_launch",
    primaryHref: "https://github.com/Abdullah-Othman0/mab",
    code: `class DrugConflictCubit extends Cubit<ConflictState> {
  Future<void> check(List<Drug> selected) async {
    emit(ConflictLoading());
    final hits = await repo.findConflicts(selected);
    emit(hits.isEmpty
        ? ConflictClear()
        : ConflictFound(hits));
  }
}`,
  },
  {
    title: "CareBook MD",
    category: "Mobile",
    description:
      "A booking app that lets patients search hospitals and specialists, then schedule and track appointments from their phone. Appointment history is cached locally, so it stays available offline.",
    tags: ["FLUTTER", "DIO", "SQLITE"],
    icon: "local_hospital",
    primaryLabel: "View Repo",
    primaryIcon: "rocket_launch",
    primaryHref: "https://github.com/Abdullah-Othman0/hospital-main",
    code: `class AppointmentRepository {
  Future<Appointment> book({
    required Doctor doctor,
    required DateTime slot,
  }) async {
    final res = await api.post('/appointments', {
      'doctorId': doctor.id,
      'slot': slot.toIso8601String(),
    });
    await db.cacheAppointment(res.data);
    return Appointment.fromJson(res.data);
  }
}`,
  },
  {
    title: "Swift Storefront",
    category: "Frontend",
    description:
      "A modern storefront front end with animated product carousels, search, and a wishlist, backed by a lightweight Node API. Cart and favorites persist client-side, while TanStack Query keeps product data in sync with the server.",
    tags: ["REACT", "VITE", "ZUSTAND"],
    icon: "storefront",
    primaryLabel: "Live Demo",
    primaryIcon: "rocket_launch",
    primaryHref: "https://github.com/Abdullah-Othman0/node-react",
    code: `export const useCartStore = create((set) => ({
  items: [],
  add: (product) =>
    set((s) => ({ items: [...s.items, product] })),
  remove: (id) =>
    set((s) => ({
      items: s.items.filter((i) => i.id !== id),
    })),
}));`,
  },
];

const filters: Category[] = ["All", "Full Stack", "Frontend", "Backend", "Mobile"];

export default function ProjectsPage() {
  const [active, setActive] = useState<Category>("All");
  const visible = projects.filter(
    (p) => active === "All" || p.category === active
  );

  return (
    <div className="pt-12 pb-32 px-4">
      <div className="max-w-container mx-auto glass-surface rounded-[32px] overflow-hidden py-24">
        <header className="px-6 md:px-16 mb-16">
          <h1 className="text-[40px] sm:text-6xl md:text-[72px] leading-[1.05] md:leading-[80px] font-extrabold tracking-[-0.04em] text-primary mb-4">
            Selected Projects
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            A collection of systems focused on reliability, scale, and
            maintainable architecture.
          </p>
        </header>

        <section className="px-6 md:px-16 mb-12">
          <div className="flex flex-wrap gap-4 items-center">
            {filters.map((f) => {
              const isActive = active === f;
              return (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className={`px-6 py-2 rounded-full border text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)] transition-all ${
                    isActive
                      ? "bg-primary-container text-on-primary-container border-primary-container"
                      : "border-outline-variant text-on-surface-variant hover:border-secondary"
                  }`}
                >
                  {f === "All" ? "ALL" : f.toUpperCase()}
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {visible.map((p) => (
            <article
              key={p.title}
              className="glass-card rounded-xl overflow-hidden flex flex-col"
            >
              <div className="relative group">
                <div className="h-64 md:h-80 w-full overflow-hidden bg-surface-container-high">
                  {p.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.img}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="relative h-full w-full bg-surface-container-lowest p-6 flex flex-col">
                      <div className="flex gap-1.5 mb-4">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                        <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                      </div>
                      <pre className="text-sm text-secondary font-[var(--font-jetbrains)] overflow-hidden whitespace-pre-wrap">
                        <code>{p.code}</code>
                      </pre>
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-dim to-transparent opacity-40 pointer-events-none" />
                    </div>
                  )}
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-surface-dim/80 backdrop-blur-md border border-secondary/30 text-secondary px-3 py-1 rounded text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)]">
                    {p.category.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-3xl font-semibold tracking-[-0.01em] text-on-surface">
                    {p.title}
                  </h3>
                  <div className="bg-surface-container-highest p-1.5 rounded-lg flex items-center justify-center">
                    <Icon
                      name={p.icon}
                      filled
                      className="text-secondary text-sm"
                    />
                  </div>
                </div>
                <p className="text-on-surface-variant mb-6 flex-1">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="bg-surface-container-low border border-outline-variant text-on-surface-variant px-3 py-1 rounded text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a
                    href={p.primaryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-secondary-container text-on-secondary-container py-3 rounded-lg font-bold text-center flex items-center justify-center gap-2 transition-all hover:bg-secondary active:scale-95"
                  >
                    <Icon name={p.primaryIcon} className="text-[20px]" />
                    {p.primaryLabel}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
