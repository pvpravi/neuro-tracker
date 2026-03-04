import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log('🧹 Clearing old vault data...');
    await prisma.clinicalStrategy.deleteMany({});

    console.log('🌱 Seeding SpecialCare Clinical Vault...');

    const strategies = [
      // --- EDUCATION & IEP ACCOMMODATIONS ---
      {
        title: "The 'Cool Down' Pass",
        domain: "Education & IEP",
        intensity: "Low",
        ageGroup: "School Age (5-18)", // <-- Added!
        description: "Provide the child with a visual card they can hand to the teacher to leave the room for 5 minutes without needing to explain why or ask permission verbally. Reduces selective mutism triggers during high anxiety."
      },
      {
        title: "Sensory-Friendly Seating",
        domain: "Education & IEP",
        intensity: "Medium",
        ageGroup: "School Age (5-18)", // <-- Added!
        description: "Request preferential seating in the IEP. Not necessarily at the front, but away from humming lights, hallway doors, and high-traffic areas to prevent auditory and visual burnout."
      },
      {
        title: "Homework Volume Reduction",
        domain: "Education & IEP",
        intensity: "High",
        ageGroup: "School Age (5-18)", // <-- Added!
        description: "Advocate for an IEP accommodation that grades the child on mastery rather than volume. If they can demonstrate a math concept in 3 problems, they do not need to do 20. Protects home hours for nervous system recovery."
      },

      // --- ADHD & EXECUTIVE FUNCTIONING ---
      {
        title: "The Dopamine Menu",
        domain: "ADHD & Executive Functioning",
        intensity: "Low",
        ageGroup: "All Ages", // <-- Added!
        description: "Create a visual 'menu' of high-dopamine, regulating activities (e.g., jumping on a trampoline, listening to a specific song, eating a crunchy snack) that the child can pick from when their brain feels 'stuck' or under-stimulated."
      },
      {
        title: "Micro-Tasking & Body Doubling",
        domain: "ADHD & Executive Functioning",
        intensity: "Medium",
        ageGroup: "All Ages", // <-- Added!
        description: "Instead of 'Clean your room', break it into: 'Put 3 blue things in the bin'. Sit quietly in the room doing your own task (body doubling) to provide a gentle, non-judgmental anchor for their focus."
      },
      {
        title: "Visual Time Horizons",
        domain: "ADHD & Executive Functioning",
        intensity: "Low",
        ageGroup: "All Ages", // <-- Added!
        description: "Use a visual 'Time Timer' (where the red disappears as time passes) instead of a digital clock. ADHD nervous systems struggle with 'time blindness'; this makes the passing of time a concrete visual object."
      },

      // --- DIET, FEEDING & ARFID ---
      {
        title: "Zero-Pressure Food Mapping",
        domain: "Diet & Feeding",
        intensity: "Low",
        ageGroup: "All Ages", // <-- Added!
        description: "Put a new or challenging food on the table, but completely remove the expectation to eat it. Allow the child to poke it, smell it, or dissect it with a fork. Sensory familiarity must happen before chewing."
      },
      {
        title: "Food Chaining",
        domain: "Diet & Feeding",
        intensity: "Medium",
        ageGroup: "All Ages", // <-- Added!
        description: "If the child only eats McDonald's fries, introduce a slightly different brand of fast-food fries, then frozen oven fries, then a different shape of oven fries. Make microscopic changes to safe foods to expand the palate."
      },
      {
        title: "Deconstructed Meals",
        domain: "Diet & Feeding",
        intensity: "Low",
        ageGroup: "All Ages", // <-- Added!
        description: "Never mix foods for a child with sensory aversions. Serve tacos completely deconstructed: meat in one pile, cheese in another, shell separate. Predictability equals safety for the nervous system."
      },

      // --- ANXIETY, OCD & BEHAVIOR ---
      {
        title: "Front-Loading Transitions",
        domain: "Anxiety & OCD",
        intensity: "Low",
        ageGroup: "All Ages", // <-- Added!
        description: "Anxiety spikes in the unknown. 'Front-load' the child by explaining exactly what a new environment will look, sound, and smell like before leaving the house. Look at Google Maps photos of the building together."
      },
      {
        title: "Somatic Check-Ins",
        domain: "Anxiety & OCD",
        intensity: "Medium",
        ageGroup: "All Ages", // <-- Added!
        description: "When anxiety loops start, shift focus from the brain to the body. Ask: 'Is your heart beating fast? Does your tummy feel tight?' Connecting to the physical sensation interrupts the OCD/anxiety cognitive loop."
      },
      {
        title: "The 'No-Demand' Zone",
        domain: "Anxiety & OCD",
        intensity: "High",
        ageGroup: "All Ages", // <-- Added!
        description: "When PDA (Pathological Demand Avoidance) or severe anxiety peaks, create a 30-minute block where absolutely zero demands are placed on the child. No questions, no requests, just pure, safe presence."
      },

      // --- INTELLECTUAL DISABILITY (ID) & ADLs ---
      {
        title: "Errorless Learning for Routines",
        domain: "Intellectual Disability",
        intensity: "Medium",
        ageGroup: "All Ages", // <-- Added!
        description: "When teaching a new hygiene task (like handwashing), physically guide the child's hands through the motion successfully before they have a chance to do it incorrectly. Prevents frustration and builds immediate muscle memory."
      },
      {
        title: "Visual ADL Sequencing",
        domain: "Intellectual Disability",
        intensity: "Low",
        ageGroup: "All Ages", // <-- Added!
        description: "Tape a laminated, step-by-step picture sequence directly to the bathroom mirror showing the 4 exact steps for brushing teeth. Reduces working memory load and promotes independence."
      }
    ];

    for (const strategy of strategies) {
      await prisma.clinicalStrategy.create({
        data: strategy
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `✅ Successfully injected ${strategies.length} clinical strategies into the vault!` 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}