import { cookies } from "next/headers";

const COOKIE_NAME = "gk_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getAuthSecret() {
  return (
    process.env.NEXTAUTH_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    "girlies-kitchen-dev-soft-auth"
  );
}

function bytesToHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function encodeBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return bytesToHex(signature);
}

function safeEqualHex(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export type AdminSession = {
  email: string;
  loggedInAt: string;
};

export async function createSessionToken(email: string) {
  const session: AdminSession = {
    email: email.trim().toLowerCase(),
    loggedInAt: new Date().toISOString(),
  };
  const payload = encodeBase64Url(JSON.stringify(session));
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<AdminSession | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = await sign(payload);
  if (!safeEqualHex(signature, expected)) return null;

  try {
    const json = JSON.parse(decodeBase64Url(payload));
    if (!json?.email || typeof json.email !== "string") return null;
    return json as AdminSession;
  } catch {
    return null;
  }
}

/**
 * Soft login for now. Any non-empty email/password works unless
 * ADMIN_EMAIL + ADMIN_PASSWORD are both set, then those are required.
 * Swap this for Firebase Auth later.
 */
export function softValidateCredentials(email: string, password: string) {
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  if (!trimmedEmail || !trimmedPassword) {
    return { ok: false as const, error: "Email and password are required" };
  }

  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD?.trim();

  if (expectedEmail && expectedPassword) {
    if (
      trimmedEmail.toLowerCase() !== expectedEmail ||
      trimmedPassword !== expectedPassword
    ) {
      return { ok: false as const, error: "Invalid email or password" };
    }
  }

  return { ok: true as const, email: trimmedEmail.toLowerCase() };
}

export async function getAdminSession() {
  const jar = await cookies();
  return verifySessionToken(jar.get(COOKIE_NAME)?.value);
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

export function clearSessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export { COOKIE_NAME };
