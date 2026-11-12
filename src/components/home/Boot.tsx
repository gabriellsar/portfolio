import { useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/ui';

const END = 70;
const MSGS: [string, string, string][] = [
  ['GS-BOOT v0.3 · gabriellsar', '', 'muted'],
  ['verificando memória', 'ok', 'accent'],
  ['montando /portfolio', 'ok', 'accent'],
  ['carregando tokens', 'ok', 'accent'],
  ['iniciando gabriellsar', 'ok', 'accent'],
  ['PUC-Rio · Eng. de Computação', '2027.2', 'text'],
];

export default function Boot({ location }: { location: string }) {
  const [t, setT] = useState(0);
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('gs-boot') === '1'; sessionStorage.setItem('gs-boot', '1'); } catch { /* sem storage */ }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (seen || reduce) return;
    setShow(true);
    timer.current = setInterval(() => setT((v) => v + 1), 60);
    return () => clearInterval(timer.current);
  }, []);

  useEffect(() => {
    if (t >= END + 7) { clearInterval(timer.current); setShow(false); }
  }, [t]);

  if (!show) return null;
  const skip = () => { clearInterval(timer.current); setShow(false); };
  const cmd = 'whoami'.slice(0, Math.max(0, Math.min(6, t - 28)));
  const name = 'gabriellsar'.slice(0, Math.max(0, Math.min(11, t - 38)));
  const blink = Math.floor(t / 5) % 2 === 0 ? 1 : 0;
  const pct = Math.min(100, Math.round((t / END) * 100));

  return (
    <div className="boot" role="status" aria-live="polite" aria-label="Carregando o portfólio" style={{ opacity: t >= END ? 0 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 11, letterSpacing: '0.14em', color: 'var(--muted)' }}>
        <span>GS-BOOT · TTY1</span><span>{location}</span>
      </div>
      <div className="boot-inner">
        <div className="boot-lines">
          {MSGS.map((m, i) => t >= 2 + i * 4 && (
            <p key={i} className="boot-line">
              <span className="boot-ts">[{(i * 0.117).toFixed(3).padStart(7, ' ')}]</span>
              <span className="boot-label">{m[0]}</span>
              {/* os pontos preenchem o que sobra da linha, então nada estoura no telefone */}
              {m[1] && <span className="boot-dots" aria-hidden="true">{'.'.repeat(80)}</span>}
              {m[1] && <span style={{ flex: 'none', color: `var(--${m[2]})` }}>{m[1]}</span>}
            </p>
          ))}
        </div>
        {t >= 27 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="boot-prompt">
              <span style={{ color: 'var(--accent)' }}>gabriel@arch</span><span style={{ color: 'var(--muted)' }}>:~$</span> {cmd}
              <span style={{ display: 'inline-block', width: 8, height: 16, marginLeft: 2, verticalAlign: -2, background: 'var(--accent)', opacity: t >= 37 ? 0 : blink }} />
            </p>
            {t >= 37 && (
              <p className="boot-name">{name}<span style={{ display: 'inline-block', width: '0.5em', height: '0.82em', marginLeft: '0.06em', verticalAlign: '-0.06em', background: 'var(--accent)', opacity: t >= 49 ? blink : 1 }} /></p>
            )}
          </div>
        )}
      </div>
      <div className="boot-foot">
        <div style={{ flex: '1 1 360px', maxWidth: 520 }}><Progress label="BOOT" value={pct} valueText={`${pct}%`} segments={24} /></div>
        <button type="button" className="gs-btn gs-btn-ghost gs-btn-sm boot-skip" onClick={skip}>Pular<span className="boot-enter" aria-hidden="true"> ⏎</span></button>
      </div>
    </div>
  );
}
