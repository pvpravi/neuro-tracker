import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { initialStrategies } from "@/lib/clinical-data";

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();

    const strategiesToSeed = initialStrategies.filter(s => s.domain === domain);

    if (strategiesToSeed.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: "No local strategies for this domain yet." });
    }

    const created = await Promise.all(
      strategiesToSeed.map((s) =>
        prisma.clinicalStrategy.create({
          data: {
            domain: s.domain,
            title: s.title,
            description: s.description,
            ageGroup: s.ageGroup,
            intensity: s.intensity,
            source: "Medha Labs Pre-Vetted Library",
          },
        })
      )
    );

    return NextResponse.json({ success: true, count: created.length });
  } catch (error: any) {
    console.error("Backend Error Details:", error); // This prints to your terminal
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}