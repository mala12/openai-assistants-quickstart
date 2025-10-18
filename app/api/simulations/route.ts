import { NextResponse } from "next/server";

type SimulationPayload = {
  patientId?: string;
  simulationId?: string;
};

type SimulationResult = {
  id: string;
  label: string;
  startedAt: string;
  completedAt: string;
  deltas: Array<{ metric: string; value: number; unit: string }>;
  confidence: number;
  notes: string;
};

const SIMULATION_LABELS: Record<string, string> = {
  regeneration: "Regenerative Therapy",
  cardio: "Cardiovascular Stress Test",
  longevity: "Longevity Protocol",
  resonance: "Resonant Frequency Tuning",
  nootropic: "Nootropic Synergy",
  vascular: "Vascular Optimization",
};

function generateResult(simulationId: string): SimulationResult {
  const start = Date.now();
  const duration = 2_000 + Math.random() * 2_500;
  const completedAt = new Date(start + duration).toISOString();
  const startedAt = new Date(start).toISOString();

  const deltaCount = 3 + Math.floor(Math.random() * 2);
  const metrics = [
    "Inflammation Index",
    "Cellular Regeneration",
    "Metabolic Flexibility",
    "Cardio Resilience",
    "Neural Plasticity",
  ];

  const deltas = Array.from({ length: deltaCount }).map((_, index) => ({
    metric: metrics[index % metrics.length],
    value: parseFloat(((Math.random() - 0.4) * 5).toFixed(2)),
    unit: "%",
  }));

  const confidence = Math.max(0.72, Math.min(0.98, 0.85 + (Math.random() - 0.5) * 0.12));
  const label = SIMULATION_LABELS[simulationId] ?? "Custom Simulation";

  return {
    id: simulationId,
    label,
    startedAt,
    completedAt,
    deltas,
    confidence,
    notes:
      "Observer agent verified coherence within acceptable threshold. Suggested follow-up: validate intervention sequence with clinician.",
  };
}

export async function POST(request: Request) {
  const payload = (await request.json()) as SimulationPayload;

  if (!payload.patientId || !payload.simulationId) {
    return NextResponse.json(
      { error: "patientId and simulationId are required" },
      { status: 400 }
    );
  }

  // Simulate downstream orchestration delay.
  await new Promise((resolve) => setTimeout(resolve, 600));

  const result = generateResult(payload.simulationId);
  return NextResponse.json(result);
}
