import type { Strings } from '../i18n/strings';

interface MenuOverlayProps {
  t: Strings;
  readMode: boolean;
  onJump: (index: number) => void;
  onToggleRead: () => void;
  onClose: () => void;
}

export default function MenuOverlay({ t, readMode, onJump, onToggleRead, onClose }: MenuOverlayProps) {
  return (
    <div className="menu" data-screen-label="Menu — dive to layer">
      <div className="menu__title">{t.ui.diveTo}</div>
      {t.menu.map((label, i) => (
        <button key={label} className="menu__item" onClick={() => onJump(i)}>
          <span className="menu__num">0{i}</span>
          <span className="menu__label">{label}</span>
        </button>
      ))}
      <div className="menu__footer">
        <button className="menu__read-btn" onClick={onToggleRead}>
          {readMode ? t.ui.readOff : t.ui.read}
        </button>
        <button className="menu__close-btn" onClick={onClose}>
          {t.ui.close} · esc
        </button>
      </div>
    </div>
  );
}
