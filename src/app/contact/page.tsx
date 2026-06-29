"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import BookingModal from "@/components/booking/booking-modal";
import MeetingForm from "@/components/booking/meeting-form";

const CONTACT_ENDPOINT = "https://formsubmit.co/ajax/abdullahoth210@gmail.com";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [bookingOpen, setBookingOpen] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...data,
          _subject: `Portfolio contact: ${data.subject || data.name}`,
          _template: "table",
        }),
      });
      if (!res.ok) throw new Error(`Send failed (${res.status})`);
      setStatus("sent");
      form.reset();
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const inputClasses =
    "w-full bg-surface-container-lowest border-0 border-b border-outline-variant py-3 px-4 text-on-surface text-base rounded-t-lg outline-none transition-all focus:border-secondary focus:shadow-[0_0_10px_rgba(76,215,246,0.2),inset_0_0_5px_rgba(76,215,246,0.1)]";
  const labelClasses =
    "text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)] text-on-surface-variant ml-1 block mb-2";

  return (
    <div className="pt-12 pb-32 px-4">
      <div className="max-w-container mx-auto glass-surface rounded-[32px] overflow-hidden p-5 sm:p-8 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Identity */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-8">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-semibold font-[var(--font-jetbrains)] mb-4 block">
                Available for freelance
              </span>
              <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] leading-[1.05] font-extrabold tracking-[-0.04em] text-primary mb-6 [text-shadow:0_0_10px_rgba(173,198,255,0.3)]">
                Build Something Reliable.
              </h1>
              <p className="text-lg text-on-surface-variant max-w-md">
                Have a product idea, scaling issue, or system that needs
                rebuilding? I&apos;m open to freelance work, consulting, and
                long-term engineering collaborations.
              </p>
            </div>
            <div className="space-y-10 mt-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 glass-card rounded-lg flex items-center justify-center text-secondary">
                  <Icon name="alternate_email" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)] text-on-surface-variant">
                    Email
                  </p>
                  <a
                    href="mailto:abdullahoth210@gmail.com"
                    className="text-lg text-on-surface hover:text-secondary transition-colors break-all"
                  >
                    abdullahoth210@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 glass-card rounded-lg flex items-center justify-center text-secondary">
                  <Icon name="share" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)] text-on-surface-variant mb-2">
                    Connect elsewhere
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="https://github.com/Abdullah-Othman0"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-on-surface-variant hover:text-secondary transition-all hover:glow-sm"
                    >
                      <Icon name="code" className="text-[20px]" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/abdullah-i-othman/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-on-surface-variant hover:text-secondary transition-all hover:glow-sm"
                    >
                      <Icon name="link" className="text-[20px]" />
                    </a>
                    <a
                      href="mailto:abdullahoth210@gmail.com"
                      aria-label="Email"
                      className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-on-surface-variant hover:text-secondary transition-all hover:glow-sm"
                    >
                      <Icon name="alternate_email" className="text-[20px]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 mt-6 lg:mt-0">
            <div className="glass-card p-5 sm:p-8 md:p-12 rounded-xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full" />
              <form onSubmit={onSubmit} className="relative z-10 space-y-6 md:space-y-8">
                {/* Honeypot: hidden from humans, bots that fill it get rejected by FormSubmit */}
                <input
                  type="text"
                  name="_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <label htmlFor="name" className={labelClasses}>
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      className={inputClasses}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClasses}>
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className={inputClasses}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className={labelClasses}>
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Project Inquiry"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="message" className={labelClasses}>
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell me about your vision..."
                    className={`${inputClasses} resize-none`}
                    required
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={status !== "idle"}
                    className={`w-full md:w-auto px-10 py-4 text-xs uppercase tracking-[0.1em] font-semibold font-[var(--font-jetbrains)] rounded-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 ${
                      status === "sent"
                        ? "bg-secondary-container text-on-secondary-container"
                        : status === "error"
                          ? "bg-error/15 text-error"
                          : "bg-primary text-on-primary hover:shadow-[0_0_25px_rgba(76,215,246,0.4)]"
                    } ${status !== "idle" ? "opacity-80" : ""}`}
                  >
                    {status === "idle" && (
                      <>
                        Initialize Request
                        <Icon name="send" className="text-[18px]" />
                      </>
                    )}
                    {status === "sending" && (
                      <>
                        <Icon name="sync" className="text-[18px] animate-spin" />
                        Sending...
                      </>
                    )}
                    {status === "sent" && (
                      <>
                        <Icon name="check_circle" className="text-[18px]" />
                        Transmitted Successfully
                      </>
                    )}
                    {status === "error" && (
                      <>
                        <Icon name="error" className="text-[18px]" />
                        Transmission Failed — Retry Shortly
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6 border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#4cd7f6]/10 px-10 py-4 text-xs font-semibold uppercase tracking-[0.1em] font-mono text-[#4cd7f6] transition-all duration-300 hover:bg-[#4cd7f6]/20 hover:shadow-[0_0_25px_rgba(76,215,246,0.3)] active:scale-95"
              >
                <Icon name="calendar_month" className="text-[18px]" />
                Book a Meeting
              </button>
            </div>

            <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)}>
              <MeetingForm isOpen={bookingOpen} onSuccess={() => setBookingOpen(false)} />
            </BookingModal>

            <div className="mt-8 flex items-center justify-between px-4 flex-wrap gap-4">
              <div className="flex items-center gap-3 text-on-tertiary-fixed-variant">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-secondary-container" />
                  <div className="w-2 h-2 rounded-full bg-primary-container" />
                </div>
                <span className="text-sm uppercase tracking-widest opacity-60 font-[var(--font-jetbrains)]">
                  Status: Terminal Ready
                </span>
              </div>
              <div className="text-sm text-on-tertiary-fixed-variant italic font-[var(--font-jetbrains)]">
                Lat: 34.0522° N, Lon: 118.2437° W
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
