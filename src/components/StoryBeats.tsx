import type { RefObject } from 'react';
import type { Strings } from '../i18n/strings';

interface StoryBeatsProps {
  t: Strings;
  beatRefs: RefObject<HTMLDivElement | null>[];
  coreInstruction: string;
  onOpenEu: () => void;
  onOpenLlm: () => void;
  onJumpTo: (index: number) => void;
}

/**
 * Les cinq « story beats » fixes, synchronisés à la profondeur de plongée.
 * L'opacité et la translation du premier enfant sont pilotées en impératif
 * par le callback onDepth du moteur (voir App).
 */
export default function StoryBeats({ t, beatRefs, coreInstruction, onOpenEu, onOpenLlm, onJumpTo }: StoryBeatsProps) {
  return (
    <>
      <div ref={beatRefs[0]} className="beat beat--center" data-screen-label="Surface — ouverture">
        <div className="beat__hero">
          <div className="tag">{t.b0.tag}</div>
          <h1 className="beat__hero-title">{t.b0.title}</h1>
          <p className="beat__hero-body">{t.b0.body}</p>
          <div className="beat__ident">
            <span className="beat__ident-line" />
            <span>
              {t.id.name} · {t.id.title}
            </span>
            <span className="beat__ident-line" />
          </div>
        </div>
        <div className="beat__scrollcue">
          <button className="btn-dive" onClick={() => onJumpTo(1)}>
            <span className="blink">▼</span>
            <span>{t.b0.scroll}</span>
          </button>
          <div className="scroll-line" />
        </div>
      </div>

      <div ref={beatRefs[1]} className="beat beat--right" data-screen-label="Layer 01 — périphérie">
        <div className="beat__card">
          <div className="tag">{t.b1.tag}</div>
          <h2 className="beat__card-title">{t.b1.title}</h2>
          <p className="beat__card-body">{t.b1.body}</p>
          <div className="early">
            {t.early.map((item) => (
              <div key={item.org} className="early__row">
                <span className="early__year">{item.y}</span>
                <div className="early__info">
                  <span className="early__org">
                    {item.org} <span className="early__role">— {item.role}</span>
                  </span>
                  <span className="early__note">{item.note}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-next btn-next--spaced" onClick={() => onJumpTo(2)}>
            <span className="blink">▼</span>
            <span>{t.b1.next}</span>
          </button>
        </div>
      </div>

      <div ref={beatRefs[2]} className="beat beat--right" data-screen-label="Layer 02 — bus principal (V.I.E)">
        <div className="beat__card">
          <div className="tag">{t.b2.tag}</div>
          <h2 className="beat__card-title">{t.b2.title}</h2>
          <p className="beat__card-body">{t.b2.body}</p>
          <div className="beat__stats">
            {t.vieStats.map((stat) => (
              <div key={stat.l} className="stat">
                <span className="stat__v">{stat.v}</span>
                <span className="stat__l">{stat.l}</span>
              </div>
            ))}
          </div>
          <button className="btn-cta" onClick={onOpenEu}>
            {t.b2.cta} →
          </button>
          <button className="btn-next" onClick={() => onJumpTo(3)}>
            <span className="blink">▼</span>
            <span>{t.b2.next}</span>
          </button>
        </div>
      </div>

      <div ref={beatRefs[3]} className="beat" data-screen-label="Layer 03 — zone de puissance (Amaris)">
        <div className="beat__card">
          <div className="tag tag--hot">{t.b3.tag}</div>
          <h2 className="beat__card-title">{t.b3.title}</h2>
          <p className="beat__card-body">{t.b3.body}</p>
          <div className="beat__status">
            <span className="led led--hot" />
            <span>{t.b3.status}</span>
          </div>
          <button className="btn-cta btn-cta--hot" onClick={onOpenLlm}>
            {t.b3.cta} →
          </button>
          <button className="btn-next" onClick={() => onJumpTo(4)}>
            <span className="blink">▼</span>
            <span>{t.b3.next}</span>
          </button>
        </div>
      </div>

      <div ref={beatRefs[4]} className="beat beat--center" data-screen-label="Core approach — annonce">
        <div className="beat__announce">
          <div className="beat__announce-tag">
            <span className="led led--beacon" />
            <span>{t.core.detected}</span>
          </div>
          <div className="beat__announce-instruction">{coreInstruction}</div>
          <div className="dive-chip">
            <span className="blink">▼</span>
            <span>{t.core.approach}</span>
          </div>
        </div>
      </div>
    </>
  );
}
