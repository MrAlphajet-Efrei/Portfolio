import type { RefObject } from 'react';
import { CONTACT_LINKS, type Strings } from '../i18n/strings';

interface CoreSectionProps {
  t: Strings;
  online: boolean;
  chargeRef: RefObject<HTMLSpanElement | null>;
  onPowerCore: () => void;
}

/** Section core (en flux après la plongée) : charge du cœur, puis identité + specs + contact. */
export default function CoreSection({ t, online, chargeRef, onPowerCore }: CoreSectionProps) {
  return (
    <section id="lc-core" data-screen-label="Core — chipset">
      <div className="core__stage">
        {!online ? (
          <>
            <div className="core__detected">
              <span className="led led--blink" />
              <span>{t.core.detected}</span>
            </div>
            <div className="core__prompt">
              <div className="core__insufficient">{t.core.insufficient}</div>
              <div className="core__instruction">{t.core.instruction}</div>
              <div className="core__power">
                power <span ref={chargeRef}>0%</span>
              </div>
              <button className="btn-cta" onClick={onPowerCore}>
                {t.core.button}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="core__detected core__detected--online">
              <span className="led led--hot-solid" />
              <span>{t.core.online}</span>
            </div>
            <div className="core__scrollhint">
              <div className="core__scrollhint-label">{t.core.scrollHint}</div>
              <div className="scroll-line" />
            </div>
          </>
        )}
      </div>

      {online && (
        <div className="core__sheets" data-screen-label="Identité + specs + contact">
          <div className="sheet">
            <div className="tag">{t.id.tag}</div>
            <h1 className="sheet__name">{t.id.name}</h1>
            <div className="sheet__title-row">
              <span className="sheet__title-line" />
              <span>{t.id.title}</span>
            </div>
            <p className="sheet__pitch">{t.id.pitch}</p>
            <div className="sheet__sub">{t.id.sub}</div>
          </div>

          <div className="sheet sheet--specs">
            <div className="tag">{t.id.specsTitle}</div>
            <div className="sheet__specs-grid">
              {t.regions.map((region, i) => (
                <div key={region.name} className="spec">
                  <div className="spec__num">spec 0{i + 1}</div>
                  <div className="spec__name">{region.name}</div>
                  <div className="spec__chips">
                    {region.items.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sheet sheet--contact">
            <div className="tag">{t.contact.tag}</div>
            <h2 className="sheet__contact-title">{t.contact.title}</h2>
            <p className="sheet__contact-body">{t.contact.body}</p>
            <div className="sheet__links">
              {CONTACT_LINKS.map((link) => (
                <a key={link.pin} className="pin-link" href={link.href} target="_blank" rel="noopener">
                  {link.pin} · {link.label}
                </a>
              ))}
            </div>
            <div className="sheet__foot">{t.contact.foot}</div>
          </div>
        </div>
      )}
    </section>
  );
}
