import type { RefObject } from 'react';
import type { Strings } from '../i18n/strings';

interface CoreScreenProps {
  screenRef: RefObject<HTMLDivElement | null>;
  t: Strings;
  online: boolean;
  coreInstruction: string;
  chargeRef: RefObject<HTMLSpanElement | null>;
  onPowerCore: () => void;
  onGoSheet: () => void;
}

/**
 * Écran du core (overlay fixe) : apparaît à la profondeur maximale et
 * s'efface à l'overscroll vers la datasheet — l'opacité est pilotée en
 * impératif par le callback onDepth (voir App).
 */
export default function CoreScreen({
  screenRef,
  t,
  online,
  coreInstruction,
  chargeRef,
  onPowerCore,
  onGoSheet,
}: CoreScreenProps) {
  return (
    <div ref={screenRef} className="core-screen" data-screen-label="Core — chipset">
      <div className="core-screen__stage">
        {!online ? (
          <>
            <div className="core__detected">
              <span className="led led--blink" />
              <span>{t.core.detected}</span>
            </div>
            <div className="core__prompt">
              <div className="core__insufficient">{t.core.insufficient}</div>
              <div className="pulse-ring">
                <span className="pulse-ring__dot" />
              </div>
              <div className="core__instruction">{coreInstruction}</div>
              <div className="core__power">
                power <span ref={chargeRef}>0%</span>
              </div>
              <button className="btn-cta" onClick={onPowerCore}>
                {t.core.button}
              </button>
              <div className="core__auto">{t.core.auto}</div>
            </div>
          </>
        ) : (
          <>
            <div className="core__detected core__detected--online">
              <span className="led led--hot-solid" />
              <span>{t.core.online}</span>
            </div>
            <div className="core__scrollhint">
              <button className="btn-dive" onClick={onGoSheet}>
                <span className="blink">▼</span>
                <span>{t.core.scrollHint}</span>
              </button>
              <div className="scroll-line" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
