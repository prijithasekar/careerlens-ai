import { callAI } from "@/lib/ai";
import { ANALYSIS_PROMPT, JOB_PROMPT, RESUME_PROMPT } from "@/lib/prompts";
import { AnalysisSchema, JobProfileSchema, ResumeProfileSchema } from "@/lib/schema";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription || jobDescription.trim().length < 50) {
      return Response.json(
        { error: "Please provide a resume and a job description (at least a few lines)." },
        { status: 400 }
      );
    }

    // Calls 1 and 2 are independent, so run them in parallel
    const [resume, job] = await Promise.all([
      callAI(RESUME_PROMPT, resumeText, ResumeProfileSchema),
      callAI(JOB_PROMPT, jobDescription, JobProfileSchema),
    ]);

    // Call 3 compares them
    const analysis = await callAI(
      ANALYSIS_PROMPT,
      JSON.stringify({ resume, job }),
      AnalysisSchema
    );

    return Response.json({ resume, job, analysis });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}