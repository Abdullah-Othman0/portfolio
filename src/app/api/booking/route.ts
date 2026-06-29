import { NextRequest, NextResponse } from "next/server";
import {
  validateForm,
  sanitizeInput,
  BookingFormData,
} from "@/components/booking/validation";

const OWNER_EMAIL = "abdullahoth210@gmail.com";
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${OWNER_EMAIL}`;

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "127.0.0.1";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipHits.get(ip);

  if (!record || now > record.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) return false;

  record.count++;
  return true;
}

function buildHtmlEmail(data: BookingFormData, submittedAt: string): string {
  const fields = [
    { label: "Name", value: sanitizeInput(data.name) },
    { label: "Email", value: sanitizeInput(data.email) },
    { label: "Company", value: data.company ? sanitizeInput(data.company) : "—" },
    { label: "Subject", value: sanitizeInput(data.subject) },
    { label: "Preferred Date", value: sanitizeInput(data.preferredDate) },
    { label: "Preferred Time", value: sanitizeInput(data.preferredTime) },
    { label: "Message", value: data.message ? sanitizeInput(data.message) : "—" },
    { label: "Submitted At", value: submittedAt },
  ];

  const rows = fields
    .map(
      (f) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0;font-weight:600;color:#333;white-space:nowrap;vertical-align:top">${f.label}</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0;color:#555">${f.value}</td></tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1)">
    <div style="background:#1a1a2e;padding:24px 32px">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600">New Meeting Booking</h1>
    </div>
    <div style="padding:32px">
      <p style="margin:0 0 20px;color:#666;font-size:14px">Someone has requested a meeting through your portfolio.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>
    </div>
    <div style="background:#fafafa;padding:16px 32px;border-top:1px solid #eee;text-align:center">
      <p style="margin:0;color:#999;font-size:12px">Portfolio Meeting Booking System</p>
    </div>
  </div>
</body>
</html>`.trim();
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { status: "error", message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: BookingFormData;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (body._honey) {
    return NextResponse.json({
      status: "success",
      message: "Your meeting request has been sent. The portfolio owner will follow up.",
    });
  }

  const errors = validateForm(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { status: "error", message: "Validation failed", errors },
      { status: 400 }
    );
  }

  const submittedAt = new Date().toISOString();
  const htmlEmail = buildHtmlEmail(body, submittedAt);

  try {
    const formData = new FormData();
    formData.append("name", sanitizeInput(body.name));
    formData.append("email", sanitizeInput(body.email));
    if (body.company) formData.append("company", sanitizeInput(body.company));
    formData.append("subject", sanitizeInput(body.subject));
    formData.append("preferredDate", sanitizeInput(body.preferredDate));
    formData.append("preferredTime", sanitizeInput(body.preferredTime));
    if (body.message) formData.append("message", sanitizeInput(body.message));
    formData.append("submittedAt", submittedAt);
    formData.append("_subject", `New Meeting Booking: ${sanitizeInput(body.subject)}`);
    formData.append("_template", "table");
    formData.append("_message", htmlEmail);

    const res = await fetch(FORMSUBMIT_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error("FormSubmit.co returned", res.status, await res.text().catch(() => ""));
      return NextResponse.json(
        { status: "error", message: "Failed to send booking request. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Your meeting request has been sent. The portfolio owner will follow up.",
    });
  } catch (err) {
    console.error("Booking submission error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to send booking request. Please try again." },
      { status: 500 }
    );
  }
}
