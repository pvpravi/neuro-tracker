import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function ClinicalProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const childId = params.id;

  const child = await prisma.child.findUnique({
    where: { id: childId },
  });

  if (!child) notFound();

  // THE SERVER ACTION TO SAVE THE DATA
  async function updateClinicalProfile(formData: FormData) {
    "use server";

    // Grab all checked boxes as arrays
    const diagnoses = formData.getAll("diagnoses") as string[];
    const primaryConcerns = formData.getAll("concerns") as string[];
    
    // Grab the single dropdown value
    const schoolingStatus = formData.get("schoolingStatus") as any;

    await prisma.child.update({
      where: { id: childId },
      data: {
        diagnoses,
        primaryConcerns,
        schoolingStatus,
      },
    });

    // Refresh the data and send them back to the child's main dashboard
    revalidatePath(`/dashboard/child/${childId}`);
    redirect(`/dashboard`); // Or redirect to wherever your main child hub is
  }

  // Helper arrays for our UI
  const availableDiagnoses = [
    "ADHD", "Autism Spectrum", "Sensory Processing Disorder (SPD)", 
    "OCD", "Anxiety", "Intellectual Disability (ID)", "ODD / PDA", "ARFID / Feeding Disorder"
  ];

  const availableConcerns = [
    "Diet & Feeding", "Meltdowns & Regulation", "Sleep", 
    "Executive Functioning", "Transitions", "Social Connection", 
    "Communication & Speech", "School Avoidance"
  ];

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-8">
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 text-sm mb-2 block transition">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          Clinical Profile for {child.name}
        </h1>
        <p className="text-slate-600">
          This data is strictly private. It helps the SpecialCare AI (Llama) customize strategies specifically for {child.name}&apos;s neurotype and schooling environment.
        </p>
      </div>

      <form action={updateClinicalProfile} className="space-y-8">
        
        {/* DIAGNOSES SECTION */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Formal Diagnoses (Optional)</h2>
          <p className="text-sm text-slate-500 mb-6">Select any formal or suspected diagnoses.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableDiagnoses.map((diagnosis) => (
              <label key={diagnosis} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition">
                <input 
                  type="checkbox" 
                  name="diagnoses" 
                  value={diagnosis}
                  defaultChecked={child.diagnoses?.includes(diagnosis)}
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-slate-700 font-medium">{diagnosis}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SCHOOLING SECTION */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Education & Accommodations</h2>
          <p className="text-sm text-slate-500 mb-6">Does {child.name} have formal school accommodations?</p>
          
          <select 
            name="schoolingStatus"
            defaultValue={child.schoolingStatus}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
          >
            <option value="NOT_APPLICABLE">Not Applicable (Baby / Toddler)</option>
            <option value="GENERAL_ED">General Education (No formal plan)</option>
            <option value="IEP">IEP (Individualized Education Program)</option>
            <option value="SECTION_504">504 Accommodations Plan</option>
            <option value="HOMESCHOOL">Homeschool / Alternative</option>
          </select>
        </div>

        {/* PRIMARY CONCERNS SECTION */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Primary Clinical Concerns</h2>
          <p className="text-sm text-slate-500 mb-6">What are the biggest challenges right now? We will prioritize strategies for these.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableConcerns.map((concern) => (
              <label key={concern} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition">
                <input 
                  type="checkbox" 
                  name="concerns" 
                  value={concern}
                  defaultChecked={child.primaryConcerns?.includes(concern)}
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-slate-700 font-medium">{concern}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-md text-lg"
          >
            Save Clinical Profile
          </button>
        </div>

      </form>
    </div>
  );
}