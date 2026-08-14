export async function summarizeVideo(videoUrl: string) {
  const response = await fetch(import.meta.env.VITE_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      video_url: videoUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to summarize video");
  }

  return response.text();
}