// lightweight API helper - posts to local server route /api/ai
export async function sendToAI(messageOrTranscript) {
  const normalized = Array.isArray(messageOrTranscript)
    ? messageOrTranscript[messageOrTranscript.length - 1]?.content ?? ""
    : messageOrTranscript ?? "";

  try {
    const resp = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: normalized,
        transcript: Array.isArray(messageOrTranscript) ? messageOrTranscript : undefined,
      }),
    });

    if (!resp.ok) {
      const errorBody = await resp.json().catch(() => ({}));
      throw new Error(errorBody?.error || `Request failed: ${resp.status}`);
    }

    return await resp.json();
  } catch (e) {
    console.error("AI error", e);
    return { error: e.message || "network" };
  }
}