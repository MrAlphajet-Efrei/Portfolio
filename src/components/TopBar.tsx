import logoMini from '../assets/logo-yy-mini.svg';
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
        <img className="topbar__logo" src={logoMini} alt="YY" />
        <span>AI Software Engineer</span>
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
