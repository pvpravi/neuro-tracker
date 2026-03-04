"use client";

import React from "react";

type LanguageCode = "en" | "te";

type LocalizedText = {
  text_en: string;
  text_hi: string;
  text_te: string;
  text_ta: string;
  text_kn: string;
  text_ml: string;
  text_or: string;
  text_bn: string;
  text_ur: string;
};

type RatingQuestion = {
  id: string;
  domain: string;
} & LocalizedText;

type NarrativeQuestion = {
  id: string;
  domain: string;
} & LocalizedText;

type DomainGroup = {
  domain: string;
  rating: RatingQuestion | null;
  questions: NarrativeQuestion[];
};

type AssessmentQuestionsProps = {
  groups: DomainGroup[];
};

const languages: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "te", label: "Telugu" },
];

function getLocalizedText(item: LocalizedText, lang: LanguageCode) {
  switch (lang) {
    case "te":
      return item.text_te || item.text_en;
    default:
      return item.text_en;
  }
}

export function AssessmentQuestions({ groups }: AssessmentQuestionsProps) {
  const [activeLang, setActiveLang] = React.useState<LanguageCode>("en");

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-500">
          Choose your preferred language for question text. You can answer in any language.
        </p>
        <div className="flex flex-wrap gap-1 text-[11px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActiveLang(lang.code)}
              className={`px-2.5 py-1 rounded-full border ${
                activeLang === lang.code
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.domain} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">{group.domain}</h2>

          {group.rating && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {getLocalizedText(group.rating, activeLang)}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label
                    key={value}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 cursor-pointer hover:border-indigo-500 hover:text-indigo-600"
                  >
                    <input
                      type="radio"
                      name={group.rating!.id}
                      value={value}
                      className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                      required
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-400">
                1 = Very challenging right now · 5 = Feels well‑supported right now
              </p>
            </div>
          )}

          <div className="space-y-5">
            {group.questions.map((q, index) => (
              <div key={q.id}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {index + 1}. {getLocalizedText(q, activeLang)}
                </label>
                <textarea
                  name={q.id}
                  required
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                  placeholder="Provide as much detail as possible..."
                ></textarea>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

