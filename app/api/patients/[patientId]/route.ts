import { NextResponse } from "next/server";

type Metric = "Inflammation Index" | "Metabolic Flexibility" | "Cardio Resilience" | "Cellular Regeneration";

type PatientRecord = {
  id: string;
  name: string;
  baseVitals: {
    heartRate: number;
    systolic: number;
    diastolic: number;
    respiratoryRate: number;
    temperature: number;
    oxygenSaturation: number;
  };
  keyInsights: string[];
  recommendedActions: string[];
  history: Array<{
    time: string;
    location: string;
    measurement: number;
    metric: Metric;
  }>;
  simulations: Array<{
    id: string;
    label: string;
    description: string;
  }>;
};

type PatientResponse = {
  id: string;
  name: string;
  currentVitals: {
    heartRate: number;
    bloodPressure: string;
    respiratoryRate: number;
    temperature: number;
    oxygenSaturation: number;
    coherence: number;
  };
  history: PatientRecord["history"];
  keyInsights: string[];
  recommendedActions: string[];
  simulations: Array<{
    id: string;
    label: string;
    description: string;
    status: "idle";
    lastRun: string;
  }>;
};

const PATIENTS: Record<string, PatientRecord> = {
  "patient-001": {
    id: "patient-001",
    name: "Ada Lovelace",
    baseVitals: {
      heartRate: 68,
      systolic: 118,
      diastolic: 76,
      respiratoryRate: 14,
      temperature: 36.7,
      oxygenSaturation: 98,
    },
    keyInsights: [
      "Chrono-synced circadian rhythm following light therapy",
      "Cellular regeneration metrics improving 4% week-over-week",
      "Inflammation index stabilized within optimal range",
    ],
    recommendedActions: [
      "Maintain current light/dark entrainment schedule",
      "Introduce 30-minute guided breathing sessions twice daily",
      "Schedule follow-up regenerative scan in 72 hours",
    ],
    history: Array.from({ length: 12 }).map((_, index) => ({
      time: new Date(Date.now() - index * 3600 * 1000).toISOString(),
      location: index % 3 === 0 ? "Clinic" : "Home Sensor",
      measurement: 0.8 + Math.sin(index / 2) * 0.05 - index * 0.002,
      metric: (index % 4 === 0
        ? "Inflammation Index"
        : index % 4 === 1
        ? "Metabolic Flexibility"
        : index % 4 === 2
        ? "Cardio Resilience"
        : "Cellular Regeneration") as Metric,
    })),
    simulations: [
      {
        id: "regeneration",
        label: "Regenerative Therapy",
        description: "Projects stem-cell stimulation response with micronutrient pairing.",
      },
      {
        id: "cardio",
        label: "Cardiovascular Stress Test",
        description: "Simulates high-intensity interval training over 8-week horizon.",
      },
      {
        id: "longevity",
        label: "Longevity Protocol",
        description: "Evaluates telomere preservation interventions and sleep modulation.",
      },
    ],
  },
  "patient-002": {
    id: "patient-002",
    name: "Nikola Tesla",
    baseVitals: {
      heartRate: 72,
      systolic: 124,
      diastolic: 80,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 97,
    },
    keyInsights: [
      "Magnetic resonance therapy reduced oxidative stress markers",
      "Deep sleep cycles increased by 12% over past 48 hours",
      "Neuroplasticity response trending toward optimal coherence",
    ],
    recommendedActions: [
      "Continue pulsed electromagnetic field therapy on 48-hour cadence",
      "Introduce adaptive fasting window aligned with circadian trough",
      "Schedule high-resolution neural scan next week",
    ],
    history: Array.from({ length: 12 }).map((_, index) => ({
      time: new Date(Date.now() - index * 5400 * 1000).toISOString(),
      location: index % 2 === 0 ? "Lab" : "Home Sensor",
      measurement: 0.75 + Math.cos(index / 3) * 0.08 - index * 0.0015,
      metric: (index % 4 === 0
        ? "Metabolic Flexibility"
        : index % 4 === 1
        ? "Cardio Resilience"
        : index % 4 === 2
        ? "Cellular Regeneration"
        : "Inflammation Index") as Metric,
    })),
    simulations: [
      {
        id: "resonance",
        label: "Resonant Frequency Tuning",
        description: "Calibrates electromagnetic therapy schedules for maximal coherence.",
      },
      {
        id: "nootropic",
        label: "Nootropic Synergy",
        description: "Tests combined neurotrophic compounds for cognitive uplift.",
      },
      {
        id: "vascular",
        label: "Vascular Optimization",
        description: "Simulates endothelial response to targeted light therapy.",
      },
    ],
  },
};

function jitter(base: number, variance: number) {
  return parseFloat((base + (Math.random() - 0.5) * variance).toFixed(2));
}

export async function GET(
  _request: Request,
  context: { params: { patientId: string } }
): Promise<NextResponse<PatientResponse | { error: string }>> {
  const patient = PATIENTS[context.params.patientId];

  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  const coherence = Math.max(0.78, Math.min(0.99, 0.9 + (Math.random() - 0.5) * 0.08));
  const systolic = jitter(patient.baseVitals.systolic, 6);
  const diastolic = jitter(patient.baseVitals.diastolic, 4);

  const response: PatientResponse = {
    id: patient.id,
    name: patient.name,
    currentVitals: {
      heartRate: jitter(patient.baseVitals.heartRate, 5),
      bloodPressure: `${systolic}/${diastolic}`,
      respiratoryRate: jitter(patient.baseVitals.respiratoryRate, 3),
      temperature: jitter(patient.baseVitals.temperature, 0.6),
      oxygenSaturation: jitter(patient.baseVitals.oxygenSaturation, 1),
      coherence,
    },
    history: patient.history,
    keyInsights: patient.keyInsights,
    recommendedActions: patient.recommendedActions,
    simulations: patient.simulations.map((simulation) => ({
      ...simulation,
      status: "idle" as const,
      lastRun: new Date(Date.now() - Math.random() * 12 * 3600 * 1000).toISOString(),
    })),
  };

  return NextResponse.json(response);
}
