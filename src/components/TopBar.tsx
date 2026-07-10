import logoMini from '../assets/logo-yy-mini.svg';
import type { Lang, Strings } from '../i18n/strings';

interface TopBarProps {
  t: Strings;
  lang: Lang;
  readMode: boolean;
  isMobile: boolean;
  onSetLang: (lang: Lang) => void;
  onToggleRead: () => void;
  onGoContact: () => void;
  onToggleMenu: () => void;
}

export default function TopBar({ t, lang, readMode, isMobile, onSetLang, onToggleRead, onGoContact, onToggleMenu }: TopBarProps) {
  return (
    <div className="topbar">
      <div className="topbar__brand">
        <img className="topbar__logo" src={logoMini} alt="YY" />
        {!isMobile && <span>AI Software Engineer</span>}
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
        {!isMobile && (
          <button className="topbar__nav-btn topbar__nav-btn--light" onClick={onGoContact}>
            {t.ui.contact}
          </button>
        )}
        <button className="topbar__read-btn" onClick={onToggleRead}>
          {readMode ? t.ui.navDive : t.ui.navRead}
        </button>
        <button className="topbar__menu-btn" onClick={onToggleMenu}>
          {t.ui.menu}
        </button>
      </div>
    </div>
  );
}
