import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const { email } = body || {};

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if subscriber already exists
    const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        {
          success: true,
          isDuplicate: true,
          message: "You're already subscribed.",
        },
        { status: 200 }
      );
    }

    try {
      await NewsletterSubscriber.create({
        email: normalizedEmail,
        subscribedAt: new Date(),
        isActive: true,
      });

      return NextResponse.json(
        {
          success: true,
          message: "You're subscribed! We'll keep you updated.",
        },
        { status: 201 }
      );
    } catch (createErr) {
      // Handle race condition duplicate key error safely
      if (createErr?.code === 11000) {
        return NextResponse.json(
          {
            success: true,
            isDuplicate: true,
            message: "You're already subscribed.",
          },
          { status: 200 }
        );
      }
      throw createErr;
    }
  } catch (error) {
    // Fail safely: Never expose database credentials or internal errors
    console.error("Newsletter subscription error:", error?.message || "Internal error");
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
