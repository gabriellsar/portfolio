import { useCallback, useEffect, useState } from 'react';
import Shell from './Shell';
import type { ProjectLite } from '@/lib/projects';
import { siteText } from '@/data/site';
import { homeHash, t as tr, type Lang } from '@/i18n';

type Theme = 'dark' | 'light';

const TABS = ['topo', 'projetos', 'trajetoria', 'contato'] as const;

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export default function TmuxBar({ lang = 'pt', langHref, isHome, active: activeProp = 'topo', projects, status, email }: {
  lang?: Lang;
  langHref: Record<Lang, string>;
  isHome: boolean;
  active?: string;
  projects: ProjectLite[];
  status: string[];
  email: string;
}) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [active, setActive] = useState(activeProp);
  const [sh, setSh] = useState(false);
  const L = tr(lang);
  const other: Lang = lang === 'pt' ? 'en' : 'pt';

  useEffect(() => { setThemeState(readTheme()); }, []);

  const setTheme = useCallback((t: Theme) => {
    // cores mudam em 200 ms na troca de tema, e só durante a troca
    const root = document.documentElement;
    root.classList.add('theme-anim');
    window.setTimeout(() => root.classList.remove('theme-anim'), 260);
    root.dataset.theme = t;
    try { localStorage.setItem('gs-theme', t); } catch { /* armazenamento indisponível */ }
    setThemeState(t);
  }, []);

  // scrollspy
  useEffect(() => {
    if (!isHome) return;
    const ids = ['projetos', 'trajetoria', 'contato'];
    const onScroll = () => {
      let cur = 'topo';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  // ":" ou Ctrl/Cmd+K abrem o shell
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setSh((v) => !v); return; }
      if (!typing && e.key === ':' && !sh) { e.preventDefault(); setSh(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sh]);

  return (
    <nav className="tmux" aria-label={L.navLabel}>
      <div className="tmux-left">
        <a href={isHome ? '#topo' : homeHash(lang, 'topo')} className="tmux-brand">{sh ? 'CMD' : 'gabriellsar'}</a>
        {TABS.map((id) => {
          const on = id === active;
          return (
            <a key={id} href={isHome ? `#${id}` : homeHash(lang, id)} className="tmux-tab" aria-current={on ? 'location' : undefined}>
              {L.tabs[id]}{on ? '*' : ''}
            </a>
          );
        })}
      </div>
      <div className="tmux-end">
        <div className="tmux-status">
          {status.map((s, i) => (
            <span key={s} style={{ display: 'contents' }}>
              {i > 0 && <span className="sep">│</span>}
              <span>{s}</span>
            </span>
          ))}
        </div>
        <a href={langHref[other]} hrefLang={other === 'en' ? 'en' : 'pt-BR'} lang={other === 'en' ? 'en' : 'pt-BR'} className="tmux-tab tmux-lang lang-switch" data-lang-switch aria-label={L.langSwitch}>
          <span className={`lang-opt${lang === 'pt' ? ' is-on' : ''}`} aria-hidden="true">PT</span>
          <span className="lang-sep" aria-hidden="true">/</span>
          <span className={`lang-opt${lang === 'en' ? ' is-on' : ''}`} aria-hidden="true">EN</span>
        </a>
        <a href={siteText[lang].cv} download className="tmux-tab tmux-cv" aria-label={L.cvAria}>
          <svg className="icon" viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 2v8.5M4.5 7 8 10.5 11.5 7M2.5 13.5h11" />
          </svg>
          <span className="label">{L.cv}</span>
        </a>
      </div>
      <Shell lang={lang} langHref={langHref} open={sh} onClose={() => setSh(false)} projects={projects} isHome={isHome} email={email} theme={theme} onTheme={setTheme} />
    </nav>
  );
}
