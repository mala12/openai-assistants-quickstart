import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

const steps = [
  {
    title: "Baseline coherence",
    summary:
      "Capture a personal harmonic signature using heart-rate sensors, breath audio, and micro-motion from a gyroscope.",
    detail:
      "The session starts by listening for a few moments to establish healthy resonance: heart rhythm, breathing cadence, and subtle tremor patterns become the reference for later comparisons.",
  },
  {
    title: "Frequency sweep",
    summary:
      "Gently play 174–963 Hz tones while showing matching colors and geometry, then monitor biometric micro-responses.",
    detail:
      "AI watches HRV shifts, facial micro-EMG (if available), and coherence stability while each tone plays, looking for dips or rises in resonance.",
  },
  {
    title: "Resonance disruption detection",
    summary:
      "Identify tones that disrupt coherence versus those that soothe it.",
    detail:
      "Drops in stability suggest biological dissonance that may correlate to pain, while upward shifts indicate comfort or relief.",
  },
  {
    title: "Personalized feedback",
    summary:
      "Generate counter-resonant tones to restore coherence and log a personal profile over time.",
    detail:
      "If 417 Hz triggers dissonance but 528 Hz restores balance, the app leans on the stabilizing tone, pairing it with calming visuals to reinforce relaxation.",
  },
];

const resonanceBands = [
  {
    range: "0.0 – 0.3",
    label: "High dissonance",
    description: "Possible acute pain; strongest incoherence detected in the scan.",
  },
  {
    range: "0.4 – 0.6",
    label: "Moderate instability",
    description: "Mild pain or tension; coherence is present but fragile.",
  },
  {
    range: "0.7 – 1.0",
    label: "Stable coherence",
    description: "Comfort or no pain; body systems are resonating smoothly.",
  },
];

const applications = [
  {
    audience: "Alzheimer's / dementia",
    detection: "Track HRV and skin micro-vibration across tone sequences to surface distress without verbal cues.",
    therapy: "Flag incoherence spikes early so caregivers can intervene before agitation escalates.",
  },
  {
    audience: "Autism / non-verbal children",
    detection: "Blend haptic resonance with gentle visuals to observe overstimulation patterns.",
    therapy: "Tune environments using frequencies that demonstrate calming coherence for the individual.",
  },
  {
    audience: "Post-stroke / locked-in",
    detection: "Use facial EMG and breath entrainment to monitor discomfort.",
    therapy: "Provide a resonance-based communication channel that shows when relief tones are working.",
  },
  {
    audience: "Palliative care",
    detection: "Continuous background coherence monitor for subtle pain spikes.",
    therapy: "Support medication timing by signalling caregivers when PRI dips.",
  },
];

const PainResonancePage = () => {
  const [isDark, setIsDark] = useState(false);
  const pageClassName = [styles.page, isDark ? styles.dark : ""].filter(Boolean).join(" ");

  return (
    <div className={pageClassName}>
      <header className={styles.hero}>
        <p className={styles.kicker}>Pain Resonance Index</p>
        <h1 className={styles.title}>Measuring pain through coherence and resonance</h1>
        <p className={styles.subtitle}>
          A non-verbal, frequency-based approach to detect and soothe pain by tracking
          heart rhythm, breath patterns, and micro-vibrations.
        </p>
        <div className={styles.actions}>
          <Link className={styles.actionLink} href="/">
            ← Back to samples
          </Link>
          <button
            type="button"
            className={styles.actionLink}
            onClick={() => setIsDark((prev) => !prev)}
          >
            {isDark ? "Switch to light mode" : "Switch to dark mode"}
          </button>
          <span className={styles.actionNote}>Designed for non-verbal and cognitively impaired patients.</span>
        </div>
      </header>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>The problem</h2>
          <p>
            Pain is subjective and hard to convey, especially for people with Alzheimer&apos;s disease or
            other conditions that limit verbal communication. Conventional facial-expression or
            behavioral scales rely on caregiver interpretation and miss subtle cues.
          </p>
        </article>
        <article className={styles.card}>
          <h2>The hypothesis</h2>
          <p>
            Pain creates a unique frequency signature—changes in neural oscillations, heart-rate
            variability, skin conductance, and micro-vibration. By watching how these signals lose or
            regain coherence, we can infer pain without spoken input.
          </p>
        </article>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>How the scan works</h2>
          <p>Each session listens, sweeps, and adapts to map resonance patterns into a measurable index.</p>
        </div>
        <div className={styles.stepGrid}>
          {steps.map((step) => (
            <article key={step.title} className={styles.step}>
              <h3>{step.title}</h3>
              <p className={styles.stepSummary}>{step.summary}</p>
              <p className={styles.stepDetail}>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Pain Resonance Index (PRI)</h2>
          <p>A 0–1 coherence score that translates resonance stability into a simple signal for care teams.</p>
        </div>
        <div className={styles.bandGrid}>
          {resonanceBands.map((band) => (
            <div key={band.range} className={styles.band}>
              <div className={styles.bandRange}>{band.range}</div>
              <div className={styles.bandLabel}>{band.label}</div>
              <p className={styles.bandDescription}>{band.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Clinical applications</h2>
          <p>Tailor detection and comfort strategies to each audience and their communication abilities.</p>
        </div>
        <div className={styles.table}>
          <div className={`${styles.tableRow} ${styles.tableHead}`}>
            <div>Patient group</div>
            <div>Detection mode</div>
            <div>Therapeutic use</div>
          </div>
          {applications.map((app) => (
            <div key={app.audience} className={styles.tableRow}>
              <div className={styles.tableCellTitle}>{app.audience}</div>
              <div>{app.detection}</div>
              <div>{app.therapy}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Clinical value and next steps</h2>
          <p>
            The system complements clinical judgement by offering early, objective insight into pain and
            stress. A future integration with a Quantum-Temporal Data Fabric could map coherence trends,
            medication efficacy, and recommend resonant sessions over time.
          </p>
        </div>
        <div className={styles.valueGrid}>
          <article className={styles.valueCard}>
            <h3>Objective measurement</h3>
            <p>Transforms subjective pain into coherence metrics that can be trended and audited.</p>
          </article>
          <article className={styles.valueCard}>
            <h3>Adaptive precision</h3>
            <p>Profiles each individual rather than applying a one-size-fits-all scale.</p>
          </article>
          <article className={styles.valueCard}>
            <h3>Early detection</h3>
            <p>Flags discomfort before behavioral signs appear, especially for non-verbal patients.</p>
          </article>
          <article className={styles.valueCard}>
            <h3>Non-invasive loop</h3>
            <p>Uses gentle sound, light, and vibration for both sensing and soothing.</p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default PainResonancePage;
