import { SignUp } from "@clerk/nextjs";

<p className="text-[10px] text-slate-500 mt-4 text-center max-w-xs">
  By signing up, you agree to our Terms of Service and Privacy Policy. 
  You acknowledge that you are responsible for the clinical data you upload.
</p>

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <SignUp 
        path="/sign-up" 
        routing="path" 
        signInUrl="/sign-in" 
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}