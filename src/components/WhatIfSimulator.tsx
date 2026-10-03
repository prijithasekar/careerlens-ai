"use client";

import { useState } from "react";
import type { Analysis } from "@/lib/schema";

const WEIGHT: Record<string, number> = { critical: 3, important: 2, nice_to_have: 1 };

export default function WhatIfSimulator({ analysis }: { analysis: Analysis }) {
  const [learned, setLearned] = useState<string[]>([]);
  const missing = analysis.missingSkills;

  if (missing.length === 0) return null;

  const totalWeight = missing.reduce((sum, m) => sum + (WEIGHT[m.importance] ?? 1), 0);
  const gap = 100 - analysis.overallMatch;

  const gain = missing
    .filter((m) => learned.includes(m.skill))
    .reduce((sum, m) => sum + (gap * (WEIGHT[m.importance] ?? 1)) / totalWeight, 0);

  const projected = Math.min(100, Math.round(analysis.overallMatch + gain));

  function toggle(skill: string) {
    setLearned((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  return (
    <section className="space-y-3 rounded-xl border p-5">
      <h2 className="text-xl font-semibold">What-if Simulator</h2>
      <p className="text-sm text-gray-600">
        Tick the skills you plan to learn and see how your match could change.
      </p>

      <div className="space-y-2">
        {missing.map((m) => (
          <label
            key={m.skill}
            className="flex cursor-pointer items-center gap-3 rounded-lg border p-2"
          >
            <input
              type="checkbox"
              checked={learned.includes(m.skill)}
              onChange={() => toggle(m.skill)}
            />
            <span className="flex-1">{m.skill}</span>
            <span className="text-xs text-gray-500">{m.importance}</span>
          </label>
        ))}
      </div>

      <div className="rounded-lg bg-indigo-50 p-4 text-center">
        <p className="text-sm text-gray-600">Projected match</p>
        <p className="text-4xl font-bold text-indigo-600">
          {analysis.overallMatch}% → {projected}%
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Rough estimate. Critical skills count more than nice-to-have ones.
        </p>
      </div>
    </section>
  );
}