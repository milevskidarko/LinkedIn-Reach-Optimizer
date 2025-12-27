"use client";
import { useState } from "react";
import Link from "next/link";
import { Sparkles, Copy } from "lucide-react";

const TONES = ["Professional", "Casual", "Friendly", "Bold", "Neutral"];
const EMOJI_LEVELS = [
  { label: "None 🙂", value: 0 },
  { label: "Light 😄", value: 1 },
  { label: "Heavy 🤯", value: 2 },
];

export default function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [emojiLevel, setEmojiLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    analysis?: string;
    error?: string;
  } | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, tone, emoji_level: emojiLevel }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-zinc-900 dark:via-black dark:to-purple-900 px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-300/30 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-300/30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>

      <nav className="max-w-6xl mx-auto mb-8 flex justify-between items-center relative z-10">
        <h1 className="font-bold text-2xl text-indigo-700 dark:text-indigo-400">LinkedIn Reach Optimizer</h1>
        <Link
          href="/history"
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          History
        </Link>

      </nav>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 relative z-10">
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-3xl shadow-xl p-6 flex flex-col gap-6 border border-zinc-200 dark:border-zinc-700 transition hover:shadow-2xl">
          <div>
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
              Optimize your LinkedIn post
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Get AI-powered suggestions before you publish 🚀
            </p>
          </div>

          <textarea
            className="min-h-[160px] rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 p-4 focus:ring-2 focus:ring-blue-500 outline-none transition hover:shadow-md"
            placeholder="Paste your LinkedIn draft here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div>
            <p className="text-xs font-medium mb-2 text-zinc-600 dark:text-zinc-400">Tone</p>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${tone === t
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium mb-2 text-zinc-600 dark:text-zinc-400">Emoji intensity</p>
            <div className="flex gap-2">
              {EMOJI_LEVELS.map((e) => (
                <button
                  key={e.value}
                  onClick={() => setEmojiLevel(e.value)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${emojiLevel === e.value
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 transition shadow-lg"
          >
            <Sparkles size={18} />
            {loading ? "Analyzing..." : "Analyze Reach"}
          </button>
        </div>

        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-zinc-200 dark:border-zinc-700 transition hover:shadow-2xl min-h-[300px]">
          {!result && (
            <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
              AI suggestions will appear here
            </div>
          )}

          {result?.error && (
            <div className="text-red-500 font-medium">{result.error}</div>
          )}

          {result?.analysis && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-zinc-800 dark:text-zinc-200">Suggestions</h3>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(result.analysis ?? "")
                  }
                  className="flex items-center gap-1 text-sm px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
                >
                  <Copy size={14} /> Copy
                </button>
              </div>

              <div className="whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                {result.analysis}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
