import { extractText, getDocumentProxy } from "unpdf";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("resume") as File | null;

  if (!file || file.type !== "application/pdf") {
    return Response.json({ error: "Please upload a PDF resume." }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: "PDF must be under 5 MB." }, { status: 400 });
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocumentProxy(buffer);
  const { text } = await extractText(pdf, { mergePages: true });

  if (text.trim().length < 100) {
    return Response.json(
      { error: "Couldn't read text from this PDF. It may be a scanned image." },
      { status: 422 }
    );
  }

  return Response.json({ text });
}