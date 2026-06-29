"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Icon } from "@/components/icon";
import { validateForm, validateField, type BookingFormData, type ValidationErrors, FIELD_LIMITS } from "./validation";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface MeetingFormProps {
  isOpen: boolean;
  onSuccess?: () => void;
}

export default function MeetingForm({ isOpen, onSuccess }: MeetingFormProps) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setErrors({});
      setServerError("");
    } else {
      abortRef.current?.abort();
    }
  }, [isOpen]);

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleChange = useCallback(
    (field: string) => {
      if (errors[field]) clearFieldError(field);
    },
    [errors, clearFieldError]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as unknown as BookingFormData;

    const validationErrors = validateForm(data);
    setErrors(validationErrors);
    setServerError("");

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");

    abortRef.current = new AbortController();
    const timeoutId = setTimeout(() => abortRef.current?.abort(), 15000);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: abortRef.current.signal,
      });

      clearTimeout(timeoutId);
      const result = await res.json();

      if (!res.ok) {
        if (result.errors) {
          setErrors(result.errors);
          setStatus("idle");
          return;
        }
        throw new Error(result.message || "Request failed");
      }

      setStatus("success");
      form.reset();
      setTimeout(() => {
        setStatus("idle");
        onSuccess?.();
      }, 2000);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        setServerError("Request timed out. Please try again.");
      } else {
        setServerError("Failed to send booking request. Please try again.");
      }
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const inputClasses =
    "w-full rounded-lg border border-[#424754] bg-[#060e20] px-4 py-3 text-[#dae2fd] text-base outline-none transition-all focus:border-[#4cd7f6] focus:shadow-[0_0_10px_rgba(76,215,246,0.2),inset_0_0_5px_rgba(76,215,246,0.1)]";
  const inputErrorClasses =
    "w-full rounded-lg border border-[#ffb4ab] bg-[#060e20] px-4 py-3 text-[#dae2fd] text-base outline-none";
  const labelClasses =
    "text-xs uppercase tracking-[0.1em] font-semibold font-mono text-[#c2c6d6] ml-1 block mb-2";
  const errorClasses = "mt-1 ml-1 text-xs text-[#ffb4ab]";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="bk-name" className={labelClasses}>
            Full Name <span className="text-[#ffb4ab]">*</span>
          </label>
          <input
            id="bk-name"
            name="name"
            type="text"
            placeholder="John Doe"
            maxLength={FIELD_LIMITS.name.max}
            className={errors.name ? inputErrorClasses : inputClasses}
            onChange={() => handleChange("name")}
          />
          {errors.name && <p className={errorClasses}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="bk-email" className={labelClasses}>
            Email <span className="text-[#ffb4ab]">*</span>
          </label>
          <input
            id="bk-email"
            name="email"
            type="email"
            placeholder="john@example.com"
            maxLength={FIELD_LIMITS.email.max}
            className={errors.email ? inputErrorClasses : inputClasses}
            onChange={() => handleChange("email")}
          />
          {errors.email && <p className={errorClasses}>{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="bk-company" className={labelClasses}>
          Company
        </label>
        <input
          id="bk-company"
          name="company"
          type="text"
          placeholder="Acme Inc."
          maxLength={FIELD_LIMITS.company.max}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="bk-subject" className={labelClasses}>
          Meeting Subject <span className="text-[#ffb4ab]">*</span>
        </label>
        <input
          id="bk-subject"
          name="subject"
          type="text"
          placeholder="Project Consultation"
          maxLength={FIELD_LIMITS.subject.max}
          className={errors.subject ? inputErrorClasses : inputClasses}
          onChange={() => handleChange("subject")}
        />
        {errors.subject && <p className={errorClasses}>{errors.subject}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="bk-date" className={labelClasses}>
            Preferred Date <span className="text-[#ffb4ab]">*</span>
          </label>
          <input
            id="bk-date"
            name="preferredDate"
            type="date"
            className={errors.preferredDate ? inputErrorClasses : inputClasses}
            onChange={() => handleChange("preferredDate")}
          />
          {errors.preferredDate && <p className={errorClasses}>{errors.preferredDate}</p>}
        </div>
        <div>
          <label htmlFor="bk-time" className={labelClasses}>
            Preferred Time <span className="text-[#ffb4ab]">*</span>
          </label>
          <input
            id="bk-time"
            name="preferredTime"
            type="time"
            className={errors.preferredTime ? inputErrorClasses : inputClasses}
            onChange={() => handleChange("preferredTime")}
          />
          {errors.preferredTime && <p className={errorClasses}>{errors.preferredTime}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="bk-message" className={labelClasses}>
          Message / Agenda
        </label>
        <textarea
          id="bk-message"
          name="message"
          rows={4}
          placeholder="What would you like to discuss?"
          maxLength={FIELD_LIMITS.message.max}
          className={`${inputClasses} resize-none`}
        />
      </div>

      {serverError && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-center gap-2 rounded-lg bg-[#ffb4ab]/15 px-4 py-3 text-sm text-[#ffb4ab]"
        >
          <Icon name="error" className="text-[18px] shrink-0" />
          {serverError}
        </div>
      )}

      {status === "success" && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 rounded-lg bg-[#03b5d3]/20 px-4 py-3 text-sm text-[#03b5d3]"
        >
          <Icon name="check_circle" className="text-[18px] shrink-0" />
          Your meeting request has been sent. The portfolio owner will follow up.
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={`flex w-full items-center justify-center gap-3 rounded-lg px-10 py-4 text-xs font-semibold uppercase tracking-[0.1em] font-mono transition-all duration-300 active:scale-95 ${
            status === "success"
              ? "bg-[#03b5d3] text-[#00424e]"
              : status === "error"
                ? "bg-[#ffb4ab]/15 text-[#ffb4ab]"
                : "bg-[#adc6ff] text-[#002e6a] hover:shadow-[0_0_25px_rgba(76,215,246,0.4)]"
          } ${status !== "idle" ? "opacity-80" : ""}`}
        >
          {status === "idle" && (
            <>
              Send Booking Request
              <Icon name="calendar_month" className="text-[18px]" />
            </>
          )}
          {status === "submitting" && (
            <>
              <Icon name="sync" className="text-[18px] animate-spin" />
              Sending...
            </>
          )}
          {status === "success" && (
            <>
              <Icon name="check_circle" className="text-[18px]" />
              Booking Sent Successfully
            </>
          )}
          {status === "error" && (
            <>
              <Icon name="error" className="text-[18px]" />
              Failed — Retry
            </>
          )}
        </button>
      </div>
    </form>
  );
}
