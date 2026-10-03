"use client";

import { useState } from "react";
import type { Analysis, JobProfile, ResumeProfile } from "@/lib/schema";
import ExtraSections from "@/components/ExtraSections";
import ProfileSections from "@/components/ProfileSections";
import ProgressTracker from "@/components/ProgressTracker";
import WhatIfSimulator from "@/components/WhatIfSimulator";
const LABELS: Record<string, string> = {
  technicalSkills: "Technical Skills",
  tools: "Tools",
  education: "Education",
  projects: "Projects",
  softSkills: "Soft Skills",
};

const TABS = ["Overview", "Roadmap & Progress", "Resume & Job", "Improve & Interview"] as const;
type Tab = (typeof TABS)[number];

function scoreColor(score: number) {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-amber-500";
  return "text-red-600";
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [resume, setResume] = useState<ResumeProfile | null>(null);
  const [job, setJob] = useState<JobProfile | null>(null);
  const [tab, setTab] = useState<Tab>("Overview");

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
      setResume(d2.resume);
      setJob(d2.job);
      setTab("Overview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-6">
      <header className="space-y-1 text-center">
        <h1 className="text-4xl font-bold">CareerLens AI</h1>
        <p className="text-gray-500">
          See how your resume matches your target job, and how to become job-ready.
        </p>
      </header>

      {/* Input section */}
      <section className="space-y-4 rounded-xl border p-5">
        <div>
          <label className="mb-1 block font-medium">1. Upload resume (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">2. Paste job description</label>
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
          {loading ? "Analyzing... (takes up to a minute)" : "Analyze"}
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </section>

      {/* Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Tab bar */}
          <div className="sticky top-0 z-10 flex flex-wrap gap-2 bg-white/90 py-2 backdrop-blur">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  tab === t
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Overview" && (
            <div className="space-y-6">
              <section className="rounded-xl border p-6 text-center">
                <p className="text-gray-500">Overall Match</p>
                <p className={`text-6xl font-bold ${scoreColor(analysis.overallMatch)}`}>
                  {analysis.overallMatch}%
                </p>
              </section>

              <section className="space-y-3 rounded-xl border p-5">
                <h2 className="text-xl font-semibold">Skill Analysis</h2>
                {Object.entries(analysis.breakdown).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm">
                      <span>{LABELS[key] ?? key}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2 rounded bg-gray-200">
                      <div
                        className="h-2 rounded bg-indigo-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </section>

              <section className="space-y-2 rounded-xl border p-5">
                <h2 className="text-xl font-semibold">Matching Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchingSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-green-100 px-3 py-1 text-green-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              <section className="space-y-3 rounded-xl border p-5">
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
                            <WhatIfSimulator analysis={analysis} />
                          </div>
          )}

          {tab === "Roadmap & Progress" && (
            <div className="space-y-6">
              <section className="space-y-3 rounded-xl border p-5">
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

          {tab === "Resume & Job" && resume && job && (
            <div className="space-y-6">
              <ProfileSections resume={resume} job={job} />
            </div>
          )}

          {tab === "Improve & Interview" && (
            <div className="space-y-6">
              <ExtraSections analysis={analysis} />
            </div>
          )}
        </div>
      )}
    </main>
  );
}