import { CONTACT_LINKS, type ExperienceNode, type Strings } from '../i18n/strings';

interface DatasheetProps {
  t: Strings;
}

function NodeSection({ node, hot }: { node: ExperienceNode; hot?: boolean }) {
  return (
    <div className="ds-section ds-section--node">
      <div className={`tag tag--rule${hot ? ' tag--hot tag--rule-hot' : ''}`}>{node.tag}</div>
      <h2 className="ds-node__title">{node.title}</h2>
      <p className="ds-node__text">{node.context}</p>
      <p className="ds-node__text">{node.role}</p>
      <div className="ds-node__ach">
        {node.ach.map((achievement) => (
          <div key={achievement} className="ach">
            <span className={`ach__arrow${hot ? ' ach__arrow--hot' : ''}`}>→</span>
            <span>{achievement}</span>
          </div>
        ))}
      </div>
      <div className="ds-node__chips">
        {node.stack.map((tech) => (
          <span key={tech} className={`chip${hot ? ' chip--hot' : ''}`}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Mode datasheet : tout le contenu en lecture directe, sans la plongée. */
export default function Datasheet({ t }: DatasheetProps) {
  return (
    <main className="datasheet selectable" data-screen-label="Datasheet — lecture directe">
      <header className="datasheet__header">
        <div className="tag">{t.ui.readTag}</div>
        <h1 className="datasheet__name">{t.id.name}</h1>
        <div className="datasheet__title">{t.id.title}</div>
        <p className="datasheet__pitch">{t.id.pitch}</p>
        <div className="datasheet__sub">{t.id.sub}</div>
      </header>

      <div className="ds-section">
        <div className="tag tag--rule">{t.b1.tag}</div>
        {t.early.map((item) => (
          <div key={item.org} className="ds-early-row">
            <span className="ds-early-row__year">{item.y}</span>
            <div className="ds-early-row__info">
              <span className="ds-early-row__org">{item.org}</span>
              <span className="ds-early-row__role">{item.role}</span>
            </div>
          </div>
        ))}
      </div>

      <NodeSection node={t.nodes.eu} />
      <NodeSection node={t.nodes.llm} hot />

      <div className="ds-section ds-section--specs">
        <div className="tag tag--rule">{t.id.specsTitle}</div>
        {t.regions.map((region) => (
          <div key={region.name} className="ds-spec-group">
            <span className="ds-spec-group__name">{region.name}</span>
            <div className="ds-spec-group__chips">
              {region.items.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="ds-section">
        <div className="tag tag--rule">{t.contact.tag}</div>
        <div className="ds-links">
          {CONTACT_LINKS.map((link) => (
            <a key={link.pin} className="pin-link" href={link.href} target="_blank" rel="noopener">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
