"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getDomainDisplayName, DOMAINS } from '@/lib/assessment-data';

interface AssessmentRadarChartProps {
  assessment: {
    patternLogicScore: number;
    spatialConstructiveScore: number;
    sensoryRegulationScore: number;
    repetitiveComfortScore: number;
    taskPersistenceScore: number;
    verbalExpressiveScore: number;
    transitionAdaptabilityScore: number;
    fineMotorScore: number;
  };
}

export function AssessmentRadarChart({ assessment }: AssessmentRadarChartProps) {
  // Transform assessment data into chart format
  const chartData = [
    {
      domain: 'Pattern &\nLogic',
      score: assessment.patternLogicScore,
      fullName: getDomainDisplayName(DOMAINS.PATTERN_LOGIC),
    },
    {
      domain: 'Spatial &\nConstructive',
      score: assessment.spatialConstructiveScore,
      fullName: getDomainDisplayName(DOMAINS.SPATIAL_CONSTRUCTIVE),
    },
    {
      domain: 'Sensory\nRegulation',
      score: assessment.sensoryRegulationScore,
      fullName: getDomainDisplayName(DOMAINS.SENSORY_REGULATION),
    },
    {
      domain: 'Repetitive\nComfort',
      score: assessment.repetitiveComfortScore,
      fullName: getDomainDisplayName(DOMAINS.REPETITIVE_COMFORT),
    },
    {
      domain: 'Task\nPersistence',
      score: assessment.taskPersistenceScore,
      fullName: getDomainDisplayName(DOMAINS.TASK_PERSISTENCE),
    },
    {
      domain: 'Verbal &\nExpressive',
      score: assessment.verbalExpressiveScore,
      fullName: getDomainDisplayName(DOMAINS.VERBAL_EXPRESSIVE),
    },
    {
      domain: 'Transition &\nAdaptability',
      score: assessment.transitionAdaptabilityScore,
      fullName: getDomainDisplayName(DOMAINS.TRANSITION_ADAPTABILITY),
    },
    {
      domain: 'Fine Motor &\nEngagement',
      score: assessment.fineMotorScore,
      fullName: getDomainDisplayName(DOMAINS.FINE_MOTOR),
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900 mb-1">{payload[0].payload.fullName}</p>
          <p className="text-indigo-600 font-bold">Score: {payload[0].value.toFixed(2)} / 10</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
            dataKey="domain" 
            tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
            style={{ whiteSpace: 'pre-line' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 10]} 
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickCount={6}
          />
          <Radar
            name="Assessment Score"
            dataKey="score"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.6}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
