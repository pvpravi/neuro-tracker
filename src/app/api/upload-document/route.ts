import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, fileName, childId } = body;

    if (!childId || !text) {
      return NextResponse.json(
        { success: false, error: "Missing childId or text." },
        { status: 400 }
      );
    }

    // 1. AI Analysis
    const systemPrompt = `You are an expert pediatric clinical assistant. 
    Analyze this text and extract into strict JSON:
    {
      "diagnoses": ["list"],
      "keyTriggers": ["list"],
      "summary": "2 sentence summary"
    }`;

    const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const inferenceResponse = await aiResponse.json();
    const aiAnalysisText = inferenceResponse.choices?.[0]?.message?.content || "{}";

    // 2. Save Document
    const savedDoc = await prisma.document.create({
      data: {
        childId,
        title: fileName || "Untitled",
        documentUrl: "local_upload",
        extractedAiData: aiAnalysisText,
      },
    });

    // 3. Auto-fill Child Profile
    try {
      const aiData = JSON.parse(aiAnalysisText.replace(/```json|```/g, ""));
      const child = await prisma.child.findUnique({ where: { id: childId } });
      
      if (child) {
        const merged = Array.from(new Set([...(child.diagnoses || []), ...(aiData.diagnoses || [])]));
        await prisma.child.update({
          where: { id: childId },
          data: { diagnoses: merged },
        });
      }
    } catch (e) { console.error("Auto-fill error:", e); }

    return NextResponse.json({ success: true, id: savedDoc.id });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}