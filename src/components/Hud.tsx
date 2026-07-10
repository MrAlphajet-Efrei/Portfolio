import type { RefObject } from 'react';

interface HudProps {
  powerRef: RefObject<HTMLSpanElement | null>;
  layerRef: RefObject<HTMLSpanElement | null>;
  barRef: RefObject<HTMLDivElement | null>;
  hints: [string, string];
}

/** HUD de plongée (bas-gauche) + aides d'interaction (bas-droite), mis à jour en impératif par le moteur. */
export default function Hud({ powerRef, layerRef, barRef, hints }: HudProps) {
  return (
    <>
      <div className="hud">
        <div className="hud__meta">
          power <span ref={powerRef}>0%</span> · <span ref={layerRef}>surface</span>
        </div>
        <div className="hud__track">
          <div ref={barRef} className="hud__bar" />
        </div>
      </div>
      <div className="hints">
        <span>{hints[0]}</span>
        <span>{hints[1]}</span>
      </div>
    </>
  );
}
