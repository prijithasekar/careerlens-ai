import { z } from "zod";

const Importance = z.enum(["critical", "important", "nice_to_have"]);

// ---------- Call 1: resume parsing ----------
export const ResumeProfileSchema = z.object({
  name: z.string(),
  contact: z.object({
    email: z.string().optional(),
    phone: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
  }),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.string().optional(),
    })
  ),
  skills: z.array(
    z.object({
      name: z.string(),
      category: z.enum(["language", "framework", "tool", "database", "concept", "soft"]),
      evidence: z.array(
        z.object({
          section: z.enum(["skills", "projects", "experience", "certifications", "education"]),
          detail: z.string(),
        })
      ),
    })
  ),
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
    })
  ),
  certifications: z.array(z.string()),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      description: z.string(),
    })
  ),
});

// ---------- Call 2: job description parsing ----------
export const JobProfileSchema = z.object({
  title: z.string(),
  skills: z.array(
    z.object({
      name: z.string(),
      category: z.enum(["language", "framework", "tool", "database", "concept", "soft"]),
      importance: Importance,
    })
  ),
  experienceRequired: z.string(),
  educationRequired: z.string(),
  softSkills: z.array(z.string()),
});

// ---------- Call 3: comparison + everything built on it ----------
const Pct = z.number().min(0).max(100);

export const AnalysisSchema = z.object({
  overallMatch: Pct,
  breakdown: z.object({
    technicalSkills: Pct,
    tools: Pct,
    education: Pct,
    projects: Pct,
    softSkills: Pct,
  }),
  matchingSkills: z.array(z.string()),
  missingSkills: z.array(
    z.object({
      skill: z.string(),
      importance: Importance,
      why: z.string(),
    })
  ),
  roadmap: z.array(
    z.object({
      week: z.number(),
      title: z.string(),
      topics: z.array(z.string()),
      task: z.string(),
    })
  ),
  resumeHealth: z.object({
    skills: z.enum(["good", "needs_improvement", "missing"]),
    projects: z.enum(["good", "needs_improvement", "missing"]),
    achievements: z.enum(["good", "needs_improvement", "missing"]),
    quantifiedResults: z.enum(["good", "needs_improvement", "missing"]),
    atsKeywords: z.enum(["good", "needs_improvement", "missing"]),
    suggestions: z.array(z.object({ before: z.string(), after: z.string() })),
  }),
  ats: z.object({
    score: Pct,
    issues: z.array(z.string()),
  }),
  projectRecommendations: z.array(
    z.object({
      title: z.string(),
      why: z.string(),
      skillsDemonstrated: z.array(z.string()),
    })
  ),
  interviewPrep: z.object({
    technical: z.array(z.string()),
    project: z.array(z.string()),
    hr: z.array(z.string()),
  }),
});

export type ResumeProfile = z.infer<typeof ResumeProfileSchema>;
export type JobProfile = z.infer<typeof JobProfileSchema>;
export type Analysis = z.infer<typeof AnalysisSchema>;
