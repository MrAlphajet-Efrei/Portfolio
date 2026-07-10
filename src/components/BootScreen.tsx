import type { RefObject } from 'react';

interface BootScreenProps {
  preRef: RefObject<HTMLDivElement | null>;
  pctRef: RefObject<HTMLDivElement | null>;
  preBarRef: RefObject<HTMLDivElement | null>;
  stepRef: RefObject<HTMLDivElement | null>;
  firstStep: string;
  skipHint: string;
  onSkip: () => void;
}

/** Écran de boot : la progression est pilotée en impératif (refs) par App ; un clic passe la séquence. */
export default function BootScreen({ preRef, pctRef, preBarRef, stepRef, firstStep, skipHint, onSkip }: BootScreenProps) {
  return (
    <div ref={preRef} className="boot" data-screen-label="Boot sequence" onClick={onSkip}>
      <div className="boot__panel">
        <div className="boot__tag">
          <span className="boot__led" />
          <span>boot sequence</span>
        </div>
        <div ref={pctRef} className="boot__pct">
          0%
        </div>
        <div className="boot__track">
          <div ref={preBarRef} className="boot__bar" />
        </div>
        <div ref={stepRef} className="boot__step">
          {firstStep}
        </div>
      </div>
      <div className="boot__skip">{skipHint}</div>
    </div>
  );
}
