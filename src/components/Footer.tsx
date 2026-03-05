export default function Footer() {
    return (
      <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm mb-4">
            © {new Date().getFullYear()} Special Care by Medha Labs. All rights reserved.
          </p>
          <p className="text-[10px] text-slate-400 leading-relaxed max-w-3xl mx-auto">
            DISCLAIMER: Special Care is an educational and organizational tool. It does not provide medical, clinical, or legal advice. 
            The AI-generated roadmaps and reports are for informational purposes only and should be reviewed by qualified 
            healthcare professionals. We do not guarantee the accuracy of AI-extracted data from clinical documents.
          </p>
        </div>
      </footer>
    );
  }