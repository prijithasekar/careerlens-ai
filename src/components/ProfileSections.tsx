import type { JobProfile, ResumeProfile } from "@/lib/schema";

const IMPORTANCE: Record<string, string> = {
  critical: "bg-red-100 text-red-800",
  important: "bg-amber-100 text-amber-800",
  nice_to_have: "bg-gray-100 text-gray-700",
};

export default function ProfileSections({
  resume,
  job,
}: {
  resume: ResumeProfile;
  job: JobProfile;
}) {
  return (
    <>
      {/* Resume details */}
      <section className="rounded-xl border p-5 space-y-3">
        <h2 className="text-xl font-semibold">Resume Analysis</h2>
        <p className="font-medium">{resume.name}</p>

        {resume.education.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-500">Education</p>
            {resume.education.map((e, i) => (
              <p key={i} className="text-sm">
                {e.degree}, {e.institution} {e.year ? `(${e.year})` : ""}
              </p>
            ))}
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-gray-500">Skills found</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {resume.skills.map((s) => (
              <span key={s.name} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {resume.projects.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-500">Projects</p>
            {resume.projects.map((p) => (
              <div key={p.title} className="mt-1 rounded-lg bg-gray-50 p-2 text-sm">
                <p className="font-medium">{p.title}</p>
                <p className="text-gray-600">{p.technologies.join(" · ")}</p>
              </div>
            ))}
          </div>
        )}

        {resume.certifications.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-500">Certifications</p>
            <ul className="list-disc pl-5 text-sm">
              {resume.certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {resume.experience.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-500">Experience</p>
            {resume.experience.map((x, i) => (
              <p key={i} className="text-sm">
                {x.role}, {x.company}
              </p>
            ))}
          </div>
        )}
      </section>

      {/* Job requirements */}
      <section className="rounded-xl border p-5 space-y-3">
        <h2 className="text-xl font-semibold">Job Requirements: {job.title}</h2>
        <div className="flex flex-wrap gap-2">
          {job.skills.map((s) => (
            <span
              key={s.name}
              className={`rounded-full px-3 py-1 text-sm ${IMPORTANCE[s.importance]}`}
            >
              {s.name}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Red = critical, yellow = important, gray = nice to have
        </p>
        <p className="text-sm">Experience: {job.experienceRequired}</p>
        <p className="text-sm">Education: {job.educationRequired}</p>
        {job.softSkills.length > 0 && (
          <p className="text-sm">Soft skills: {job.softSkills.join(", ")}</p>
        )}
      </section>

      {/* Skill evidence */}
      <section className="rounded-xl border p-5 space-y-3">
        <h2 className="text-xl font-semibold">Skill Evidence</h2>
        <p className="text-sm text-gray-600">Where in your resume each skill is backed up.</p>
        {resume.skills.map((s) => (
          <div key={s.name} className="rounded-lg bg-gray-50 p-3 text-sm">
            <p className="font-medium">{s.name}</p>
            {s.evidence.length === 0 ? (
              <p className="text-amber-700">Listed, but no project or experience backs it up.</p>
            ) : (
              <ul className="list-disc pl-5 text-gray-700">
                {s.evidence.map((e, i) => (
                  <li key={i}>
                    {e.section}: {e.detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    </>
  );
}