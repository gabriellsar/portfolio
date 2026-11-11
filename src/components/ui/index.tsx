import { Fragment, useMemo, type ReactNode } from 'react';

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

/* ---------- Tag ---------- */
export type Tone = 'neutral' | 'accent' | 'signal' | 'caution';
export function Tag({ tone = 'neutral', dot = true, children }: { tone?: Tone; dot?: boolean; children: ReactNode }) {
  return (
    <span className={cx('gs-tag', `gs-tag-${tone}`)}>
      {dot && <span className="gs-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

/* ---------- Card ---------- */
export function Card({
  id, title, aside, meta, mark = true, flat, children,
}: {
  id?: string; title?: ReactNode; aside?: ReactNode; meta?: { k: string; v: ReactNode }[];
  mark?: boolean; flat?: boolean; children?: ReactNode;
}) {
  return (
    <div className={cx('gs-card', flat && 'gs-card-flat')}>
      {mark && <span className="gs-card-mark" aria-hidden="true" />}
      {(id || aside) && (
        <div className="gs-card-top">
          {id ? <span className="gs-label">{id}</span> : <span />}
          {aside}
        </div>
      )}
      {title && <h3 className="gs-card-title">{title}</h3>}
      {children && <div className="gs-card-body">{children}</div>}
      {meta && (
        <dl className="gs-card-meta">
          {meta.map((m, i) => (
            <Fragment key={i}><dt>{m.k}</dt><dd>{m.v}</dd></Fragment>
          ))}
        </dl>
      )}
    </div>
  );
}

/* ---------- DataBlock ---------- */
export type DataRow = { k: string; v: ReactNode; tone?: 'signal' | 'caution' | 'muted' };
export function DataBlock({ title, rows }: { title?: string; rows: DataRow[] }) {
  return (
    <div className="gs-datablock">
      {title && <p className="gs-label gs-datablock-title">{title}</p>}
      <dl className="gs-data">
        {rows.map((r, i) => (
          <Fragment key={i}>
            <dt>{r.k}</dt>
            <dd className={r.tone ? `gs-tone-${r.tone}` : undefined}>{r.v}</dd>
          </Fragment>
        ))}
      </dl>
    </div>
  );
}

/* ---------- SectionHeader ---------- */
export function SectionHeader({ address, title, aside, as: Tag = 'h2' }: {
  address?: string; title: ReactNode; aside?: string; as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <div className="gs-sh">
      <Tag className="gs-sh-title">
        {address && <span className="gs-sh-addr">{address}</span>}
        {title}
      </Tag>
      {aside && <span className="gs-label">{aside}</span>}
    </div>
  );
}

/* ---------- Stat ---------- */
export function Stat({ label, value, delta, trend = 'flat', note }: {
  label: string; value: ReactNode; delta?: string; trend?: 'up' | 'down' | 'flat'; note?: string;
}) {
  const tone = trend === 'up' ? 'positive' : trend === 'down' ? 'signal' : 'muted';
  const glyph = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—';
  return (
    <div className="gs-stat">
      <p className="gs-label">{label}</p>
      <p className="gs-stat-value">{value}</p>
      {(delta || note) && (
        <p className="gs-stat-foot">
          {delta && <span className={`gs-tone-${tone}`}><span aria-hidden="true">{glyph} </span>{delta}</span>}
          {note && <span className="gs-stat-note">{note}</span>}
        </p>
      )}
    </div>
  );
}

/* ---------- Progress (segmentado) ---------- */
export function Progress({ value, max = 100, segments = 20, label, valueText, tone = 'accent' }: {
  value: number; max?: number; segments?: number; label?: string; valueText?: string; tone?: 'accent' | 'caution' | 'signal';
}) {
  const v = Math.max(0, Math.min(max, value));
  const on = Math.round((v / max) * segments);
  return (
    <div className={cx('gs-progress', `gs-progress-${tone}`)}>
      <div className="gs-progress-head">
        <span className="gs-label">{label}</span>
        <span className="gs-label">{valueText ?? `${Math.round((v / max) * 100)}%`}</span>
      </div>
      <div
        className="gs-progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={v}
        aria-label={label || 'Progresso'}
        style={{ gridTemplateColumns: `repeat(${segments}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: segments }, (_, i) => <span key={i} className={cx('gs-seg', i < on && 'gs-seg-on')} />)}
      </div>
    </div>
  );
}

/* ---------- Heightmap ---------- */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}
const pad0 = (n: number, w: number) => String(n).padStart(w, '0');
export function Heightmap({ cols = 56, rows = 14, seed = 42, marker = true, caption = true, peak = false, label = 'Mapa de altura gerado por ruído' }: {
  cols?: number; rows?: number; seed?: number; marker?: boolean; caption?: boolean | string; peak?: boolean; label?: string;
}) {
  const data = useMemo(() => {
    const r = rng(seed);
    const p1 = r() * 6.283, p2 = r() * 6.283, p3 = r() * 6.283;
    const height = (c: number) => rows * 0.38 + rows * 0.18 * Math.sin(c * 0.19 + p1) + rows * 0.1 * Math.sin(c * 0.43 + p2) + rows * 0.06 * Math.sin(c * 1.07 + p3);
    let peak = 0, peakH = -1;
    for (let c = 0; c < cols; c++) { const h = height(c); if (h > peakH) { peakH = h; peak = c; } }
    const dots: { x: number; y: number; r: number; k: string; o: number }[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const t = height(x) - (rows - 1 - y);
        if (t < 0) dots.push({ x, y, r: 1, k: 'gs-hm-dot', o: 1 });
        else if (t < 1.1) dots.push({ x, y, r: 4.5, k: 'gs-hm-on', o: 1 });
        else dots.push({ x, y, r: Math.max(1.5, 4 - t * 0.35), k: 'gs-hm-on', o: Math.max(0.16, 0.7 - t * 0.07) });
      }
    }
    return { dots, px: peak, py: rows - 1 - Math.floor(peakH), ph: Math.floor(peakH) };
  }, [cols, rows, seed]);
  return (
    <figure className="gs-hm">
      {caption !== false && (
        <figcaption className="gs-hm-cap">
          <span>{typeof caption === 'string' ? caption : `FIG — HEIGHTMAP · ${cols}×${rows}`}</span>
          <span>SEED 0x{seed.toString(16).toUpperCase()}</span>
        </figcaption>
      )}
      <svg viewBox={`0 0 ${cols * 10} ${rows * 10}`} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
        {data.dots.map((d, i) => (
          <circle key={i} cx={d.x * 10 + 5} cy={d.y * 10 + 5} r={d.r} className={d.k} fillOpacity={d.o} />
        ))}
        {marker && <circle cx={data.px * 10 + 5} cy={data.py * 10 + 5} r={8} className="gs-hm-mark" />}
      </svg>
      {marker && peak && <p className="gs-hm-peak">PICO x:{pad0(data.px, 3)} y:{pad0(data.ph, 2)}</p>}
    </figure>
  );
}

/* ---------- Paleta (neofetch) ---------- */
const PALETTE = [
  'bg', 'surface', 'line', 'line-strong', 'control', 'muted', 'text', 'text-strong',
  'accent-subtle', 'accent', 'data-2', 'data-4', 'caution-subtle', 'caution', 'signal-subtle', 'signal',
];
export function Palette({ label }: { label?: string }) {
  return (
    <div className="palette" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {PALETTE.map((c, i) => (
        <span key={c} style={{ background: `var(--${c})`, boxShadow: i === 0 ? 'inset 0 0 0 1px var(--line)' : undefined }} />
      ))}
    </div>
  );
}
