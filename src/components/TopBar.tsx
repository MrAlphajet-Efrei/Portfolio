import type { Lang, Strings } from '../i18n/strings';

interface TopBarProps {
  t: Strings;
  lang: Lang;
  onSetLang: (lang: Lang) => void;
  onToggleMenu: () => void;
}

export default function TopBar({ t, lang, onSetLang, onToggleMenu }: TopBarProps) {
  return (
    <div className="topbar">
      <div className="topbar__brand">
        <span className="topbar__led" />
        <span>Y.YANAT — AI CORE</span>
      </div>
      <div className="topbar__actions">
        <div className="topbar__lang">
          <button
            className={`topbar__lang-btn${lang === 'fr' ? ' topbar__lang-btn--active' : ''}`}
            onClick={() => onSetLang('fr')}
          >
            FR
          </button>
          <span className="topbar__slash">/</span>
          <button
            className={`topbar__lang-btn${lang === 'en' ? ' topbar__lang-btn--active' : ''}`}
            onClick={() => onSetLang('en')}
          >
            EN
          </button>
        </div>
        <button className="topbar__menu-btn" onClick={onToggleMenu}>
          {t.ui.menu}
        </button>
      </div>
    </div>
  );
}
