"use server"; // CRITICAL: Tells Next.js this is a backend server action

import { OpenAI } from 'openai';
import { prisma } from '../lib/prisma';

const openai = new OpenAI({ 
  baseURL: "https://openrouter.ai/api/v1", 
  apiKey: process.env.OPENROUTER_API_KEY 
});

export const generateClinicalPlan = async (patientData: any) => {
  try {
    const response = await openai.chat.completions.create({
      // We MUST include the :free tag so it bypasses your $0 balance
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        { 
          role: "system", 
          // Dynamically inserts the child's name if it exists
          content: `You are a clinical guidelines expert. Provide a detailed clinical plan for ${patientData.name || "this patient"} based on their medical history and current symptoms.` 
        },
        { 
          role: "user", 
          // Converts the JS object into a string so the OpenAI SDK doesn't crash
          content: JSON.stringify(patientData) 
        }
      ]
    });

    const plan = response.choices[0]?.message?.content;
    
    if (!plan) {
      throw new Error("AI failed to return a plan.");
    }

    // Save to Prisma database
    await prisma.assessment.create({
      data: {
        childId: patientData.id,
        specialCareReport: plan,
        // createdAt is automatically handled by Prisma's @default(now()), 
        // but it's fine to leave it explicitly here if you prefer!
        createdAt: new Date() 
      }
    });

    return { success: true, plan: plan };

  } catch (error) {
    console.error("Error generating clinical plan:", error);
    throw new Error("Failed to generate clinical plan");
  }
};