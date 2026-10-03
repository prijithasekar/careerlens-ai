"use client";

import { useState } from "react";
import type { Analysis } from "@/lib/schema";
import ProgressTracker from "@/components/ProgressTracker";
const LABELS: Record<string, string> = {
  technicalSkills: "Technical Skills",
  tools: "Tools",
  education: "Education",
  projects: "Projects",
  softSkills: "Soft Skills",
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  async function handleAnalyze() {
    setError("");
    setAnalysis(null);
    if (!file) return setError("Please upload your resume PDF.");
    if (jd.trim().length < 50) return setError("Please paste the full job description.");

    setLoading(true);
    try {
      const form = new FormData();
      form.append("resume", file);
      const r1 = await fetch("/api/parse-resume", { method: "POST", body: form });
      const d1 = await r1.json();
      if (!r1.ok) throw new Error(d1.error);

      const r2 = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: d1.text, jobDescription: jd }),
      });
      const d2 = await r2.json();
      if (!r2.ok) throw new Error(d2.error);
      setAnalysis(d2.analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-8">
      <header className="text-center space-y-1">
        <h1 className="text-4xl font-bold">CareerLens AI</h1>
        <p className="text-gray-500">See how your resume matches your target job.</p>
      </header>

      {/* Input section */}
      <section className="rounded-xl border p-5 space-y-4">
        <div>
          <label className="block font-medium mb-1">1. Upload resume (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">2. Paste job description</label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={8}
            className="w-full rounded-lg border p-3"
            placeholder="Paste the full job description here..."
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Analyzing... (takes ~30 seconds)" : "Analyze"}
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </section>

      {/* Results */}
      {analysis && (
        <div className="space-y-6">
          <section className="rounded-xl border p-6 text-center">
            <p className="text-gray-500">Overall Match</p>
            <p className="text-6xl font-bold text-indigo-600">{analysis.overallMatch}%</p>
          </section>

          <section className="rounded-xl border p-5 space-y-3">
            <h2 className="text-xl font-semibold">Skill Analysis</h2>
            {Object.entries(analysis.breakdown).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm">
                  <span>{LABELS[key] ?? key}</span>
                  <span>{value}%</span>
                </div>
                <div className="h-2 rounded bg-gray-200">
                  <div className="h-2 rounded bg-indigo-500" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-xl border p-5 space-y-2">
            <h2 className="text-xl font-semibold">Matching Skills</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.matchingSkills.map((s) => (
                <span key={s} className="rounded-full bg-green-100 px-3 py-1 text-green-800">
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-xl border p-5 space-y-3">
            <h2 className="text-xl font-semibold">Missing Skills</h2>
            {analysis.missingSkills.map((m) => (
              <div key={m.skill} className="rounded-lg bg-red-50 p-3">
                <p className="font-medium text-red-800">
                  {m.skill} <span className="text-xs">({m.importance})</span>
                </p>
                <p className="text-sm text-gray-700">{m.why}</p>
              </div>
            ))}
          </section>

          <section className="rounded-xl border p-5 space-y-3">
            <h2 className="text-xl font-semibold">Your Learning Roadmap</h2>
            {analysis.roadmap.map((w) => (
              <div key={w.week} className="rounded-lg bg-indigo-50 p-3">
                <p className="font-medium">
                  Week {w.week}: {w.title}
                </p>
                <p className="text-sm text-gray-600">{w.topics.join(" · ")}</p>
                <p className="text-sm">Task: {w.task}</p>
              </div>
            ))}
          </section>
                    <ProgressTracker analysis={analysis} />
        </div>
      )}
    </main>
  );
}