"use server"; // MUST BE LINE 1

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// The Server Action that runs when you hit "Save"
// The Server Action that runs when you hit "Save"
export async function createChild(formData: FormData) {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const ageInput = formData.get("age") as string; 
  const genderInput = formData.get("gender") as string; 

  // 1. Sync the Clerk User to our local Database
  const dbUser = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {},
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
    },
  });

  // 2. Create the child record AND save it to a variable
  const newChild = await prisma.child.create({
    data: {
      userId: dbUser.id,
      name: name,
      age: ageInput ? parseInt(ageInput) : null,
      gender: genderInput, 
    },
  });
  
  // 3. Revalidate and redirect straight to the assessment!
  revalidatePath("/dashboard"); 
  redirect(`/dashboard/child/${newChild.id}/assessment`);
}

// The Page Component
export default async function AddChildPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Child Profile</h1>
        
        <form action={createChild} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Child's Name</label>
            <input 
              name="name" 
              required 
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
              placeholder="e.g. Ravi Kiran"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age (Years)</label>
              <input 
                name="age" 
                type="number" 
                required 
                min="1"
                max="18"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                placeholder="e.g. 5"
              />
            </div>

            {/* 3. The New Gender Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                required
                defaultValue=""
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
              >
                <option value="" disabled>Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save Profile & Start Assessment
            </button>
            
            {/* 4. The Frictionless UX Warning */}
            <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Expected time to complete the following assessment: <strong>~4 minutes</strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}