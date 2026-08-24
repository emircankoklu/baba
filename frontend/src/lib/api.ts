/**
 * API client for the Birthday Django backend.
 *
 * Automatically detects whether running locally or on PythonAnywhere / production.
 */

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    if (
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      // In production / PythonAnywhere, use relative path to current domain
      return "";
    }
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
}

// ─── TypeScript Interfaces ───────────────────────────────────────────────────

export interface BirthdayConfig {
  friends_name: string;
  main_heading: string;
  birth_date?: string | null;
  celebration_message: string;
  background_music: string | null;
}

export interface MemoryPhoto {
  id: number;
  image: string;
  alt_text: string;
  description: string;
  order: number;
}

export interface GiftNotePayload {
  sender_name: string;
  message: string;
  gift_type?: string;
}

export interface GiftNoteResponse {
  id: number;
  sender_name: string;
  message: string;
  gift_type: string;
  created_at: string;
}

// ─── Fetch Functions ─────────────────────────────────────────────────────────

/**
 * Fetch the singleton birthday configuration.
 * Endpoint: GET /api/config/
 */
export async function fetchConfig(): Promise<BirthdayConfig> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/config/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch config: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetch all memory photos, ordered by the `order` field.
 * Endpoint: GET /api/memories/
 */
export async function fetchMemories(): Promise<MemoryPhoto[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/memories/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch memories: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

/**
 * Send a secret gift note from a visitor to the birthday person.
 * Endpoint: POST /api/gift-notes/
 */
export async function sendGiftNote(
  payload: GiftNotePayload
): Promise<GiftNoteResponse> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/gift-notes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.detail ||
        errorData.message ||
        `Not gönderilemedi (${res.status})`
    );
  }

  return res.json();
}

/**
 * Helper to get the full URL for a media file from Django.
 * Handles both absolute URLs and relative paths seamlessly.
 */
export function getMediaUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getBaseUrl();
  return `${baseUrl}${normalizedPath}`;
}
