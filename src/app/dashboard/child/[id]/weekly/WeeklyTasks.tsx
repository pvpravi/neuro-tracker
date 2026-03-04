"use client";

import React from "react";

type WeeklyTask = {
  day: number;
  domain: string;
  task_en: string;
  task_hi: string;
  task_te: string;
  task_ta: string;
  task_kn: string;
  task_ml: string;
  task_or: string;
  task_bn: string;
  task_ur: string;
};

type WeeklyTasksProps = {
  tasks: WeeklyTask[];
};

const languages = [
  { code: "en", label: "English" },
  { code: "te", label: "Telugu" },
];

export function WeeklyTasks({ tasks }: WeeklyTasksProps) {
  const [activeLang, setActiveLang] = React.useState<"en" | "te">("en");
  const [completed, setCompleted] = React.useState<Record<number, boolean>>({});

  const getText = (task: WeeklyTask) => {
    switch (activeLang) {
      case "te":
        return task.task_te || task.task_en;
      default:
        return task.task_en;
    }
  };

  const toggleComplete = (day: number) => {
    setCompleted((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-slate-800">Week 1 Daily Plan</h2>
        <div className="flex gap-2 text-xs">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActiveLang(lang.code as "en" | "te")}
              className={`px-3 py-1 rounded-full border text-xs ${
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

      <div className="grid gap-3 sm:grid-cols-2">
        {tasks.map((task) => (
          <div
            key={task.day}
            className={`rounded-xl border p-4 bg-white shadow-sm flex flex-col justify-between ${
              completed[task.day] ? "opacity-60" : ""
            }`}
          >
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Day {task.day} • {task.domain}
                </span>
              </div>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{getText(task)}</p>
            </div>

            <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={!!completed[task.day]}
                onChange={() => toggleComplete(task.day)}
                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Mark complete for today</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

