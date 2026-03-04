"use client";

import { useState } from "react";

export default function SeedStrategiesPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  async function startSeeding() {
    setLoading(true);
    addLog("Starting clinical strategy generation...");

    const domains = [
      "SENSORY_REGULATION",
      "COMMUNICATION_CONNECTION",
      "LEARNING_EDUCATION",
      "DIET_FEEDING_DAILY_LIVING",
      "TRANSITION_ADAPTABILITY",
      "SOCIAL_CONNECTION",
      "EXECUTIVE_FUNCTION",
      "MOTOR_SKILLS"
    ];

    for (const domain of domains) {
      addLog(`Generating strategies for ${domain}...`);
      try {
        const res = await fetch("/api/admin/seed-strategies", {
          method: "POST",
          body: JSON.stringify({ domain }),
        });

        const data = await res.json();
        if (data.success) {
          addLog(`✅ Successfully seeded ${data.count} strategies for ${domain}`);
        } else {
          addLog(`❌ Error seeding ${domain}: ${data.error}`);
        }
      } catch (err) {
        addLog(`❌ Critical error for ${domain}`);
      }
    }

    addLog("--- SEEDING COMPLETE ---");
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900 mb-4">SpecialCare Vault Seeder</h1>
        <p className="text-slate-600 mb-8">
          This tool generates 10 neuro-affirming, clinical strategies for each of the 8 core domains. 
          Once generated, these will be stored in your private database as the "Gold Standard" library.
        </p>

        <button
          onClick={startSeeding}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition ${
            loading ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {loading ? "Generating Clinical Library..." : "Generate & Seed Strategy Vault"}
        </button>

        <div className="mt-10 bg-slate-950 rounded-2xl p-6 font-mono text-xs text-emerald-400 h-80 overflow-y-auto">
          {logs.length === 0 && <span className="text-slate-600">// Logs will appear here...</span>}
          {logs.map((log, i) => (
            <div key={i} className="mb-1">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}