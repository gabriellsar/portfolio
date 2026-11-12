import { useState } from 'react';
import { DataBlock, Tag } from '@/components/ui';
import type { Etapa } from '@/data/trajetoria';

/** Linha do tempo em acordeão: uma etapa aberta por vez. */
export default function Timeline({ items, initial }: { items: Etapa[]; initial?: string }) {
  const [open, setOpen] = useState<string | null>(initial ?? null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((it) => {
        const isOpen = it.id === open;
        const panel = `tl-${it.id}`;
        return (
          <div key={it.id} className="tl-row">
            <p className="tl-date">{it.periodo}</p>
            <div className="tl-body">
              <span aria-hidden="true" className={`tl-dot${isOpen ? ' is-open' : ''}`} />
              <div className="tl-head">
                <div className="tl-head-text">
                  <p className="mono-label" style={{ color: 'var(--accent)' }}>{it.code} · {it.area}</p>
                  <h3 className="tl-org">{it.org}</h3>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 400 }}>{it.role}</p>
                </div>
                <button
                  type="button"
                  className="gs-btn gs-btn-sm tl-toggle"
                  aria-expanded={isOpen}
                  aria-controls={panel}
                  aria-label={`${isOpen ? 'Fechar' : 'Ver'} detalhes: ${it.org}`}
                  onClick={() => setOpen(isOpen ? null : it.id)}
                >
                  <span className="tl-toggle-text">{isOpen ? 'Fechar −' : 'Detalhes +'}</span>
                  <svg className="tl-toggle-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {isOpen ? <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" /> : <path d="M9 3v12M3 9h12" />}
                  </svg>
                </button>
              </div>
              {isOpen && (
                <div className="tl-panel" id={panel}>
                  <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>{it.resumo}</p>
                    {it.feitos && it.feitos.length > 0 && (
                      <>
                        <p className="mono-label">O que fiz</p>
                        <ul className="bullets">{it.feitos.map((f, i) => <li key={i}>{f}</li>)}</ul>
                      </>
                    )}
                    {it.tags && it.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {it.tags.map((t) => <Tag key={t} dot={false}>{t}</Tag>)}
                      </div>
                    )}
                    {it.subs && it.subs.length > 0 && (
                      <div className="tl-subs">
                        {it.subs.map((s) => (
                          <div key={s.id} className="tl-sub">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <h4 style={{ margin: 0, fontSize: 18, lineHeight: 1.3, fontWeight: 400, color: 'var(--text-strong)' }}>{s.role}</h4>
                              <p className="mono-label" style={{ fontSize: 11 }}>{s.periodo}</p>
                            </div>
                            <p className="mono-label">O que fiz</p>
                            <ul className="bullets">{s.feitos.map((f, i) => <li key={i}>{f}</li>)}</ul>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {s.tags.map((t) => <Tag key={t} dot={false}>{t}</Tag>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: '0 1 320px', minWidth: 260 }}>
                    <DataBlock rows={[
                      { k: 'Área', v: it.area },
                      { k: 'Período', v: it.periodo },
                      { k: 'Projeto', v: it.projeto ? <a href={it.projeto.href}>{it.projeto.label}</a> : '—' },
                    ]} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
