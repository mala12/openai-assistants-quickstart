"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

interface VitalSigns {
  heartRate: number;
  bloodPressure: string;
  respiratoryRate: number;
  temperature: number;
  oxygenSaturation: number;
  coherence: number;
}

interface HistoryPoint {
  time: string;
  location: string;
  measurement: number;
  metric: string;
}

interface SimulationSummary {
  id: string;
  label: string;
  description: string;
  lastRun?: string;
  status: "idle" | "running" | "completed";
  outcome?: string;
}

interface SimulationResult {
  id: string;
  label: string;
  startedAt: string;
  completedAt: string;
  deltas: Array<{ metric: string; value: number; unit: string }>;
  confidence: number;
  notes: string;
}

interface PatientData {
  id: string;
  name: string;
  currentVitals: VitalSigns;
  history: HistoryPoint[];
  keyInsights: string[];
  recommendedActions: string[];
  simulations: SimulationSummary[];
}

function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
}

function usePatientData(patientId: string) {
  const [data, setData] = useState<PatientData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchPatient() {
      try {
        const response = await fetch(`/api/patients/${patientId}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Unable to load patient data (${response.status})`);
        }

        const json: PatientData = await response.json();
        if (isMounted) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!isMounted) return;
        if ((err as Error).name === "AbortError") {
          return;
        }
        console.error("Failed to load patient data", err);
        setError("Unable to load patient data. Try refreshing the page.");
      }
    }

    fetchPatient();
    const interval = setInterval(fetchPatient, 10000);

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, [patientId]);

  return useMemo(() => ({ data, error }), [data, error]);
}

export default function DigitalTwinDashboard({ params }: { params: { patientId: string } }) {
  const { data, error } = usePatientData(params.patientId);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastSimulation, setLastSimulation] = useState<SimulationResult | null>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  const runSimulation = useCallback(
    async (simulation: SimulationSummary) => {
      setIsSimulating(true);
      setSimulationError(null);
      try {
        const response = await fetch("/api/simulations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: params.patientId,
            simulationId: simulation.id,
          }),
        });

        if (!response.ok) {
          throw new Error(`Simulation failed (${response.status})`);
        }

        const json: SimulationResult = await response.json();
        setLastSimulation(json);
      } catch (err) {
        console.error("Failed to run simulation", err);
        setSimulationError(
          (err as Error).message || "An error occurred while running the simulation."
        );
      } finally {
        setIsSimulating(false);
      }
    },
    [params.patientId]
  );

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  if (!data) {
    return <div className={styles.container}>Loading Digital Twin...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Digital Twin Dashboard</h1>
          <p className={styles.subtitle}>
            Patient {data.name} · Twin ID {data.id}
          </p>
        </div>
        <div className={styles.coherence}>
          <span>Quantum Coherence</span>
          <strong>{formatConfidence(data.currentVitals.coherence)}</strong>
        </div>
      </header>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Live Vitals</h2>
          <dl className={styles.metrics}>
            <div>
              <dt>Heart Rate</dt>
              <dd>{data.currentVitals.heartRate} bpm</dd>
            </div>
            <div>
              <dt>Blood Pressure</dt>
              <dd>{data.currentVitals.bloodPressure}</dd>
            </div>
            <div>
              <dt>Respiratory Rate</dt>
              <dd>{data.currentVitals.respiratoryRate} rpm</dd>
            </div>
            <div>
              <dt>Temperature</dt>
              <dd>{data.currentVitals.temperature.toFixed(1)}°C</dd>
            </div>
            <div>
              <dt>SpO₂</dt>
              <dd>{data.currentVitals.oxygenSaturation}%</dd>
            </div>
          </dl>
        </article>

        <article className={styles.card}>
          <h2>Recent Observations</h2>
          <ul className={styles.list}>
            {data.history.slice(0, 6).map((entry) => (
              <li key={`${entry.time}-${entry.metric}`}>
                <span className={styles.listLabel}>{entry.metric}</span>
                <span>{entry.measurement.toFixed(2)}</span>
                <span className={styles.listMeta}>
                  {formatTimestamp(entry.time)} · {entry.location}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.card}>
          <h2>Key Insights</h2>
          <ul className={styles.bulletList}>
            {data.keyInsights.map((insight) => (
              <li key={insight}>{insight}</li>
            ))}
          </ul>
        </article>

        <article className={styles.card}>
          <h2>Recommended Actions</h2>
          <ul className={styles.bulletList}>
            {data.recommendedActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className={styles.simulations}>
        <div className={styles.simulationHeader}>
          <h2>Simulation Controls</h2>
          {simulationError ? <p className={styles.error}>{simulationError}</p> : null}
        </div>

        <div className={styles.simulationGrid}>
          {data.simulations.map((simulation) => (
            <article key={simulation.id} className={styles.simulationCard}>
              <header>
                <h3>{simulation.label}</h3>
                <p>{simulation.description}</p>
              </header>
              <footer>
                <div className={styles.simulationMeta}>
                  <span>Status: {simulation.status}</span>
                  {simulation.lastRun ? <span>Last run {formatTimestamp(simulation.lastRun)}</span> : null}
                </div>
                <button
                  type="button"
                  onClick={() => runSimulation(simulation)}
                  disabled={isSimulating}
                  className={styles.simulationButton}
                >
                  {isSimulating ? "Running..." : "Run Simulation"}
                </button>
              </footer>
            </article>
          ))}
        </div>

        {lastSimulation ? (
          <div className={styles.simulationResult}>
            <h3>Last Simulation Result — {lastSimulation.label}</h3>
            <p className={styles.simulationTimestamp}>
              Started {formatTimestamp(lastSimulation.startedAt)} · Completed {formatTimestamp(lastSimulation.completedAt)} · Confidence {formatConfidence(lastSimulation.confidence)}
            </p>
            <ul className={styles.list}>
              {lastSimulation.deltas.map((delta) => (
                <li key={delta.metric}>
                  <span className={styles.listLabel}>{delta.metric}</span>
                  <span>
                    {delta.value > 0 ? "+" : ""}
                    {delta.value.toFixed(2)} {delta.unit}
                  </span>
                </li>
              ))}
            </ul>
            <p className={styles.notes}>{lastSimulation.notes}</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
