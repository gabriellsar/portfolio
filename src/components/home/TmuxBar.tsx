import { useCallback, useEffect, useState } from 'react';
import Shell from './Shell';
import type { ProjectLite } from '@/lib/projects';

type Theme = 'dark' | 'light';

const TABS = [
  { id: 'topo', label: '0:home' },
  { id: 'projetos', label: '1:projetos' },
  { id: 'trajetoria', label: '2:trajetória' },
  { id: 'contato', label: '3:contato' },
];

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export default function TmuxBar({ isHome, active: activeProp = 'topo', projects, status, email }: {
  isHome: boolean;
  active?: string;
  projects: ProjectLite[];
  status: string[];
  email: string;
}) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [active, setActive] = useState(activeProp);
  const [sh, setSh] = useState(false);

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

  const dark = theme === 'dark';
  return (
    <nav className="tmux" aria-label="Principal">
      <div className="tmux-left">
        <a href={isHome ? '#topo' : '/'} className="tmux-brand">{sh ? 'CMD' : 'gabriellsar'}</a>
        {TABS.map((t) => {
          const on = t.id === active;
          return (
            <a key={t.id} href={isHome ? `#${t.id}` : t.id === 'topo' ? '/' : `/#${t.id}`} className="tmux-tab" aria-current={on ? 'location' : undefined}>
              {t.label}{on ? '*' : ''}
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
        <button type="button" className="tmux-tab tmux-theme" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={dark ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}>
          <span className="dot" aria-hidden="true" style={{ background: dark ? 'transparent' : 'var(--text-strong)' }} />
          {dark ? 'tema: escuro' : 'tema: claro'}
        </button>
      </div>
      <Shell open={sh} onClose={() => setSh(false)} projects={projects} isHome={isHome} email={email} theme={theme} onTheme={setTheme} />
    </nav>
  );
}
