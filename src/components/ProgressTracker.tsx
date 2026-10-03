"use client";

import { useState } from "react";
import type { Analysis } from "@/lib/schema";

type Entry = { id: number; label: string; date: string; score: number };

const KEY = "careerlens-progress";

export default function ProgressTracker({ analysis }: { analysis: Analysis }) {
  const [entries, setEntries] = useState<Entry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch {
      return [];
    }
  });
  const [label, setLabel] = useState("");

  function save() {
    const entry: Entry = {
      id: Date.now(),
      label: label.trim() || "My target job",
      date: new Date().toLocaleDateString(),
      score: analysis.overallMatch,
    };
    const next = [...entries, entry];
    setEntries(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function clearAll() {
    setEntries([]);
    localStorage.removeItem(KEY);
  }

  const labels = Array.from(new Set(entries.map((e) => e.label)));

  return (
    <section className="rounded-xl border p-5 space-y-3">
      <h2 className="text-xl font-semibold">Career Progress Tracker</h2>
      <p className="text-sm text-gray-600">
        Save this result, improve your skills, analyze again, and see your score grow.
        Saved only in this browser.
      </p>

      <div className="flex gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Job name (e.g. Full Stack Intern)"
          className="flex-1 rounded-lg border p-2"
        />
        <button onClick={save} className="rounded-lg bg-indigo-600 px-4 py-2 text-white">
          Save {analysis.overallMatch}%
        </button>
      </div>

      {labels.map((l) => {
        const list = entries.filter((e) => e.label === l);
        return (
          <div key={l} className="rounded-lg bg-gray-50 p-3 space-y-1">
            <p className="font-medium">{l}</p>
            {list.map((e, i) => {
              const prev = list[i - 1];
              const diff = prev ? e.score - prev.score : null;
              return (
                <p key={e.id} className="text-sm">
                  {e.date}: {e.score}%{" "}
                  {diff !== null && (
                    <span className={diff >= 0 ? "text-green-700" : "text-red-700"}>
                      ({diff >= 0 ? "+" : ""}
                      {diff})
                    </span>
                  )}
                </p>
              );
            })}
          </div>
        );
      })}

      {entries.length > 0 && (
        <button onClick={clearAll} className="text-sm text-red-600 underline">
          Clear history
        </button>
      )}
    </section>
  );
}