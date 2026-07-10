import { CONTACT_LINKS, type Strings } from '../i18n/strings';

interface CoreSectionProps {
  t: Strings;
  online: boolean;
}

/** Section datasheet du core (en flux après la plongée) : identité + specs + contact, visible une fois online. */
export default function CoreSection({ t, online }: CoreSectionProps) {
  return (
    <section id="lc-core" data-screen-label="Core — datasheet">
      {online && (
        <div className="core__sheets selectable" data-screen-label="Identité + specs + contact">
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
