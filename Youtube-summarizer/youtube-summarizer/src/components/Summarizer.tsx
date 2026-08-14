import { useState } from "react";
import { Play, Loader2 } from "lucide-react";

export default function Summarizer() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await fetch(import.meta.env.VITE_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_url: url,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      // If your Make response is:
      // { "translation": "..." }
      setSummary(data.translation);

    } catch (err) {
      console.error(err);
      setError("Unable to summarize video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl">

      <div className="flex items-center gap-3 mb-6">
        <Play className="text-red-600" size={38} />
        <h1 className="text-3xl font-bold">
          YouTube Video Summarizer
        </h1>
      </div>

      <input
        type="text"
        placeholder="Paste YouTube URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border rounded-lg p-4 text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      <button
        onClick={handleSummarize}
        disabled={loading}
        className="w-full mt-5 bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg transition flex justify-center items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Summarizing...
          </>
        ) : (
          "Summarize Video"
        )}
      </button>

      {error && (
        <div className="mt-5 bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {summary && (
        <div className="mt-8">

          <h2 className="text-2xl font-semibold mb-3">
            Summary
          </h2>

          <div className="bg-slate-100 rounded-xl p-5 whitespace-pre-wrap leading-8">
            {summary}
          </div>

        </div>
      )}
    </div>
  );
}