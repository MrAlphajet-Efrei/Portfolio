import { Fragment } from 'react';
import type { NodeId, Strings } from '../i18n/strings';

interface InspectModalProps {
  t: Strings;
  node: NodeId;
  onClose: () => void;
}

/** Modale d'inspection d'un composant majeur (EU-CORE / LLM-ENGINE). */
export default function InspectModal({ t, node, onClose }: InspectModalProps) {
  const data = t.nodes[node];
  return (
    <div className="modal-backdrop" data-screen-label="Composant ouvert" onClick={onClose}>
      <div className="modal selectable" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>
          {t.ui.close} · esc
        </button>
        <div className="tag">{data.tag}</div>
        <h2 className="modal__title">{data.title}</h2>
        <p className="modal__text">{data.context}</p>

        <div className="flow">
          {data.flow.map((step, i) => (
            <Fragment key={step}>
              <div className="flow__node">
                <div className="flow__box">
                  <span className="flow__die" />
                </div>
                <span className="flow__label">{step}</span>
              </div>
              {i < data.flow.length - 1 && (
                <div className="flow__wire">
                  <span className="flow__pulse" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
        <div className="modal__infra">{data.infra}</div>

        <p className="modal__role">{data.role}</p>
        <div className="modal__ach">
          {data.ach.map((achievement) => (
            <div key={achievement} className="ach">
              <span className="ach__arrow">→</span>
              <span>{achievement}</span>
            </div>
          ))}
        </div>

        <div className="modal__stats">
          {data.stats.map((stat) => (
            <div key={stat.l} className="stat">
              <span className="stat__v">{stat.v}</span>
              <span className="stat__l">{stat.l}</span>
            </div>
          ))}
        </div>

        <div className="modal__stack">
          {data.stack.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
