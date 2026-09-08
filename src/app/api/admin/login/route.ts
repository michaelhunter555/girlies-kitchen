import { NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieOptions,
  softValidateCredentials,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "");
    const password = String(body.password || "");
    const result = softValidateCredentials(email, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const token = await createSessionToken(result.email);
    const response = NextResponse.json({
      ok: true,
      email: result.email,
      mode: "soft-auth",
      note: "Firebase Auth will replace this soft login later.",
    });
    response.cookies.set(sessionCookieOptions(token));
    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 400 });
  }
}
