import type { Analysis } from "@/lib/schema";

const STATUS: Record<string, { label: string; cls: string }> = {
  good: { label: "Good", cls: "bg-green-100 text-green-800" },
  needs_improvement: { label: "Needs improvement", cls: "bg-yellow-100 text-yellow-800" },
  missing: { label: "Missing", cls: "bg-red-100 text-red-800" },
};

const HEALTH_KEYS = [
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["achievements", "Achievements"],
  ["quantifiedResults", "Quantified results"],
  ["atsKeywords", "ATS keywords"],
] as const;

export default function ExtraSections({ analysis }: { analysis: Analysis }) {
  const { resumeHealth, ats, projectRecommendations, interviewPrep } = analysis;

  return (
    <>
      {/* ATS */}
      <section className="rounded-xl border p-5 space-y-3">
        <h2 className="text-xl font-semibold">ATS Compatibility</h2>
        <div className="flex justify-between text-sm">
          <span>Score</span>
          <span>{ats.score}%</span>
        </div>
        <div className="h-3 rounded bg-gray-200">
          <div className="h-3 rounded bg-emerald-500" style={{ width: `${ats.score}%` }} />
        </div>
        {ats.issues.length > 0 && (
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            {ats.issues.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Resume health */}
      <section className="rounded-xl border p-5 space-y-3">
        <h2 className="text-xl font-semibold">Resume Health</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {HEALTH_KEYS.map(([key, label]) => {
            const s = STATUS[resumeHealth[key]];
            return (
              <div key={key} className="flex items-center justify-between rounded-lg border p-2">
                <span>{label}</span>
                <span className={`rounded-full px-3 py-1 text-xs ${s.cls}`}>{s.label}</span>
              </div>
            );
          })}
        </div>
        {resumeHealth.suggestions.length > 0 && (
          <div className="space-y-3 pt-2">
            <p className="font-medium">Suggested wording improvements</p>
            <p className="text-xs text-gray-500">
              AI suggestions only. Review them yourself and keep only what is true for you.
            </p>
            {resumeHealth.suggestions.map((s, i) => (
              <div key={i} className="rounded-lg bg-gray-50 p-3 text-sm space-y-1">
                <p className="text-red-700">Before: {s.before}</p>
                <p className="text-green-700">After: {s.after}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Project recommendations */}
      <section className="rounded-xl border p-5 space-y-3">
        <h2 className="text-xl font-semibold">Recommended Projects</h2>
        {projectRecommendations.map((p) => (
          <div key={p.title} className="rounded-lg bg-purple-50 p-3">
            <p className="font-medium">{p.title}</p>
            <p className="text-sm text-gray-700">{p.why}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.skillsDemonstrated.map((s) => (
                <span key={s} className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Interview prep */}
      <section className="rounded-xl border p-5 space-y-4">
        <h2 className="text-xl font-semibold">Interview Preparation</h2>
        {(
          [
            ["Technical Questions", interviewPrep.technical],
            ["Project Questions", interviewPrep.project],
            ["HR Questions", interviewPrep.hr],
          ] as const
        ).map(([title, questions]) => (
          <div key={title}>
            <p className="font-medium">{title}</p>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}