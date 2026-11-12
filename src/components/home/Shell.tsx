/**
 * Shell escondido do portfólio. Abre pelo botão :cmd da barra, por ":" ou por Ctrl+K.
 * Comandos: help para a lista. Jogos: sudo play snake · sudo play blocos.
 */
import { Component, createRef } from 'react';
import { Palette } from '@/components/ui';
import type { ProjectLite } from '@/lib/projects';
import { stack } from '@/data/stack';

type Theme = 'dark' | 'light';
type Seg = { t: string; c: string };
type Line =
  | { kind: 'prompt'; text: string }
  | { kind: 'text'; text: string; color: string }
  | { kind: 'link'; text: string; href: string }
  | { kind: 'palette' }
  | { kind: 'art'; rows: { segs: Seg[] }[] };

type Game = 'snake' | 'blocos';
type G = any;

type Props = {
  open: boolean;
  projects: ProjectLite[];
  isHome: boolean;
  email: string;
  theme: Theme;
  onTheme: (t: Theme) => void;
  onClose: () => void;
};
type State = { out: Line[]; hist: string[]; hIdx: number; cmd: string; game: Game | null; g: G };

const BS = '\\';
const CHIPS = ['help', 'whoami', 'ls projetos', 'neofetch', 'cbonsai', 'sudo play snake', 'sudo play blocos', 'exit'];
const COMPLETIONS = ['help', 'whoami', 'ls projetos', 'ls ferramentas', 'cd projetos', 'cd ferramentas', 'cd trajetoria', 'cd contato', 'open p/03', 'tema claro', 'tema escuro', 'neofetch', 'cbonsai', 'sudo play snake', 'sudo play blocos', 'sudo contratar', 'history', 'clear', 'exit', 'date'];
const PAD_KEYS = [
  { label: '←', k: 'ArrowLeft', aria: 'Esquerda' }, { label: '↑', k: 'ArrowUp', aria: 'Cima ou girar' },
  { label: '↓', k: 'ArrowDown', aria: 'Baixo' }, { label: '→', k: 'ArrowRight', aria: 'Direita' },
  { label: 'r', k: 'r', aria: 'Reiniciar' }, { label: 'q', k: 'q', aria: 'Sair do jogo' },
];
const SECTIONS: Record<string, string> = { projetos: 'projetos', ferramentas: 'ferramentas', trajetoria: 'trajetoria', 'trajetória': 'trajetoria', contato: 'contato', '~': 'topo', home: 'topo' };

export default class Shell extends Component<Props, State> {
  state: State = { out: [], hist: [], hIdx: -1, cmd: '', game: null, g: null };
  input = createRef<HTMLInputElement>();
  outEl = createRef<HTMLDivElement>();
  timer: ReturnType<typeof setInterval> | undefined;

  componentDidMount() { if (this.props.open) this.onOpen(); }
  componentWillUnmount() { clearInterval(this.timer); }
  componentDidUpdate(pp: Props, ps: State) {
    if (this.props.open && !pp.open) this.onOpen();
    if (!this.props.open && pp.open) this.stopGame();
    if (this.outEl.current && (ps.out !== this.state.out || ps.g !== this.state.g)) this.outEl.current.scrollTop = this.outEl.current.scrollHeight;
  }
  onOpen() {
    if (!this.state.out.length) this.setState({ out: [this.T('gabriellsar shell · digite help e aperte enter · tab completa · esc fecha', 'muted')] });
    requestAnimationFrame(() => this.input.current?.focus());
  }
  stopGame() { clearInterval(this.timer); if (this.state.game) this.setState({ game: null, g: null }); }
  close() { this.stopGame(); this.setState({ cmd: '' }); this.props.onClose(); }

  T(text: string, color = 'text'): Line { return { kind: 'text', text, color: `var(--${color})` }; }
  pad(s: string, n: number) { return String(s).padEnd(n, ' '); }
  print(lines: Line[]) { this.setState((s) => ({ out: s.out.concat(lines).slice(-160) })); }

  /* ---------- cbonsai ---------- */
  bonsai(seed: number) {
    let s = seed >>> 0;
    const r = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
    const W = 48, H = 13;
    const ch: string[][] = [], co: string[][] = [];
    for (let y = 0; y < H; y++) { ch.push(new Array(W).fill(' ')); co.push(new Array(W).fill('')); }
    const put = (x: number, y: number, c: string, k: string) => { if (x >= 0 && x < W && y >= 0 && y < H) { ch[y][x] = c; co[y][x] = k; } };
    const branch = (x: number, y: number, life: number, dir: number, depth: number) => {
      for (let i = 0; i < life; i++) {
        let dx = dir; if (r() < 0.35) dx += r() < 0.5 ? -1 : 1; dx = Math.max(-1, Math.min(1, dx));
        let dy = r() < 0.7 ? -1 : 0; if (y + dy < 1) dy = 0;
        const c = dy === 0 ? (r() < 0.5 ? '_' : '~') : (dx < 0 ? BS : (dx > 0 ? '/' : '|'));
        x += dx; y += dy; put(x, y, c, 't');
        if (depth < 3 && i > 1 && r() < 0.3) branch(x, y, Math.max(3, Math.floor((life - i) * 0.8)), r() < 0.5 ? -1 : 1, depth + 1);
      }
      for (let k = 0; k < 9 + depth * 3; k++) put(x + Math.floor(r() * 7) - 3, y + Math.floor(r() * 3) - 1, '&', 'l');
    };
    branch(24, H, 12, 0, 0);
    const colors: Record<string, string> = { t: 'var(--caution)', l: 'var(--accent)', '': 'var(--muted)' };
    const rows: { segs: Seg[] }[] = [];
    for (let y = 0; y < H; y++) {
      const line = ch[y].join('').trimEnd();
      if (!line && !rows.length) continue;
      const segs: { k: string; t: string }[] = [];
      let cur: { k: string; t: string } | null = null;
      for (let x = 0; x < line.length; x++) {
        const key = ch[y][x] === ' ' ? '' : co[y][x];
        if (cur && cur.k === key) cur.t += ch[y][x]; else { cur = { k: key, t: ch[y][x] }; segs.push(cur); }
      }
      rows.push({ segs: segs.map((g) => ({ t: g.t, c: colors[g.k] })) });
    }
    rows.push({ segs: [{ t: ' '.repeat(13) + ':' + '_'.repeat(20) + ':', c: 'var(--muted)' }] });
    rows.push({ segs: [{ t: ' '.repeat(14) + BS + '_'.repeat(18) + '/', c: 'var(--muted)' }] });
    return rows;
  }

  /* ---------- blocos ---------- */
  pieces() {
    return [
      { m: [[1, 1, 1, 1]], c: 'var(--accent)' },
      { m: [[1, 1], [1, 1]], c: 'var(--caution)' },
      { m: [[0, 1, 0], [1, 1, 1]], c: 'var(--data-4)' },
      { m: [[1, 0, 0], [1, 1, 1]], c: 'var(--data-2)' },
      { m: [[0, 0, 1], [1, 1, 1]], c: 'var(--signal)' },
      { m: [[0, 1, 1], [1, 1, 0]], c: 'var(--text)' },
      { m: [[1, 1, 0], [0, 1, 1]], c: 'var(--muted)' },
    ];
  }
  rot(m: number[][]) { return m[0].map((_, i) => m.map((row) => row[i]).reverse()); }
  freeCell(W: number, H: number, used: number[][]) {
    let p: number[];
    do { p = [Math.floor(Math.random() * W), Math.floor(Math.random() * H)]; } while (used.some((q) => q[0] === p[0] && q[1] === p[1]));
    return p;
  }
  hit(g: G, m: number[][], x: number, y: number) {
    for (let i = 0; i < m.length; i++) for (let j = 0; j < m[i].length; j++) {
      if (!m[i][j]) continue;
      const bx = x + j, by = y + i;
      if (bx < 0 || bx >= g.W || by >= g.H) return true;
      if (by >= 0 && g.board[by][bx]) return true;
    }
    return false;
  }
  spawn(g: G) {
    const P = this.pieces(), p = P[Math.floor(Math.random() * P.length)];
    g.m = p.m; g.c = p.c; g.x = Math.floor((g.W - p.m[0].length) / 2); g.y = 0;
    if (this.hit(g, g.m, g.x, g.y)) g.over = true;
  }
  lock(g: G) {
    for (let i = 0; i < g.m.length; i++) for (let j = 0; j < g.m[i].length; j++) if (g.m[i][j] && g.y + i >= 0) g.board[g.y + i][g.x + j] = g.c;
    const kept = g.board.filter((row: any[]) => row.some((c) => !c));
    const n = g.H - kept.length;
    while (kept.length < g.H) kept.unshift(new Array(g.W).fill(null));
    g.board = kept; g.score += [0, 40, 100, 300, 1200][n];
    this.spawn(g);
  }

  startGame(kind: Game) {
    clearInterval(this.timer);
    let g: G;
    if (kind === 'snake') {
      g = { W: 24, H: 12, snake: [[6, 6], [5, 6], [4, 6]], dir: [1, 0], next: [1, 0], score: 0, over: false };
      g.food = this.freeCell(g.W, g.H, g.snake);
    } else {
      g = { W: 10, H: 18, board: [], score: 0, over: false };
      for (let i = 0; i < g.H; i++) g.board.push(new Array(g.W).fill(null));
      this.spawn(g);
    }
    this.setState({ game: kind, g, cmd: '' });
    this.timer = setInterval(() => this.tick(), kind === 'snake' ? 110 : 480);
    this.input.current?.focus();
  }
  tick() {
    if (!this.state.g || this.state.g.over) { clearInterval(this.timer); return; }
    const g = { ...this.state.g };
    if (this.state.game === 'snake') {
      const d = g.next, h = [g.snake[0][0] + d[0], g.snake[0][1] + d[1]];
      const dead = h[0] < 0 || h[1] < 0 || h[0] >= g.W || h[1] >= g.H || g.snake.some((q: number[]) => q[0] === h[0] && q[1] === h[1]);
      if (dead) { g.over = true; clearInterval(this.timer); this.setState({ g }); return; }
      const ate = h[0] === g.food[0] && h[1] === g.food[1];
      g.snake = [h].concat(g.snake); if (!ate) g.snake.pop();
      g.dir = d;
      if (ate) { g.score += 10; g.food = this.freeCell(g.W, g.H, g.snake); }
    } else {
      g.board = g.board.map((row: any[]) => row.slice());
      if (!this.hit(g, g.m, g.x, g.y + 1)) g.y++; else this.lock(g);
      if (g.over) clearInterval(this.timer);
    }
    this.setState({ g });
  }
  gameKey(e: { key: string; preventDefault?: () => void }) {
    const k = e.key || '', kind = this.state.game;
    if (!this.state.g || !kind) return;
    const g = { ...this.state.g };
    let handled = true;
    if (k === 'q' || k === 'Q' || k === 'Escape') {
      clearInterval(this.timer);
      this.setState({ game: null, g: null });
      this.print([this.T(`${kind} · pontos ${g.score}`, 'muted')]);
    } else if ((k === 'r' || k === 'R') && g.over) {
      this.startGame(kind);
    } else if (g.over) {
      handled = k.length === 1;
    } else if (kind === 'snake') {
      const map: Record<string, number[]> = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] };
      const nd = map[k];
      if (nd) { if (!(nd[0] === -g.dir[0] && nd[1] === -g.dir[1])) { g.next = nd; this.setState({ g }); } }
      else handled = k.length === 1;
    } else {
      if (k === 'ArrowLeft' || k === 'a') { if (!this.hit(g, g.m, g.x - 1, g.y)) g.x--; }
      else if (k === 'ArrowRight' || k === 'd') { if (!this.hit(g, g.m, g.x + 1, g.y)) g.x++; }
      else if (k === 'ArrowDown' || k === 's') { if (!this.hit(g, g.m, g.x, g.y + 1)) g.y++; }
      else if (k === 'ArrowUp' || k === 'w') {
        const rm = this.rot(g.m);
        if (!this.hit(g, rm, g.x, g.y)) g.m = rm;
        else if (!this.hit(g, rm, g.x - 1, g.y)) { g.m = rm; g.x--; }
        else if (!this.hit(g, rm, g.x + 1, g.y)) { g.m = rm; g.x++; }
      } else if (k === ' ') {
        g.board = g.board.map((row: any[]) => row.slice());
        while (!this.hit(g, g.m, g.x, g.y + 1)) g.y++;
        this.lock(g);
        if (g.over) clearInterval(this.timer);
      } else handled = k.length === 1;
      this.setState({ g });
    }
    if (handled && e.preventDefault) e.preventDefault();
  }

  /* ---------- comandos ---------- */
  complete(cur: string) {
    const c = String(cur || '').toLowerCase();
    if (!c) return;
    const m = COMPLETIONS.filter((x) => x.indexOf(c) === 0);
    if (!m.length) return;
    if (m.length === 1) { this.setState({ cmd: m[0] }); return; }
    let p = m[0];
    m.forEach((x) => { while (x.indexOf(p) !== 0) p = p.slice(0, -1); });
    this.print([{ kind: 'prompt', text: cur }, this.T(m.join('    '), 'muted')]);
    this.setState({ cmd: p });
  }

  goTo(id: string) {
    this.close();
    if (this.props.isHome) {
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 30);
    } else {
      window.location.href = id === 'topo' ? '/' : `/#${id}`;
    }
  }

  exec(raw: string) {
    const T = (t: string, c?: string) => this.T(t, c);
    const cmd = String(raw || '').trim();
    let lc = cmd.toLowerCase().split(' ').filter(Boolean).join(' ');
    const hist = cmd ? this.state.hist.concat([cmd]).slice(-50) : this.state.hist;
    this.setState({ cmd: '', hIdx: -1, hist });
    if (lc === 'cd bonsai' || lc === 'bonsai') lc = 'cbonsai';
    if (lc === 'sudo play tetrix' || lc === 'sudo play tetris') lc = 'sudo play blocos';
    if (lc === 'fastfetch') lc = 'neofetch';
    const a = lc.split(' ');
    const out: Line[] = [{ kind: 'prompt', text: cmd }];
    const mail = this.props.email.startsWith('[') ? '#contato' : `mailto:${this.props.email}`;
    if (!cmd) { this.print(out); return; }
    if (lc === 'clear') { this.setState({ out: [] }); return; }
    if (lc === 'exit' || lc === 'quit' || lc === 'q') { this.close(); return; }

    if (lc === 'help') {
      const P = (c: string, d: string) => T('  ' + this.pad(c, 22) + d, 'text');
      out.push(T('comandos', 'muted'), P('whoami', 'quem sou eu'), P('ls projetos', 'todos os projetos'), P('ls ferramentas', 'stack principal'), P('cd <seção>', 'projetos · ferramentas · trajetoria · contato'), P('open p/03', 'estudo de caso do WindAnalyzer'), P('tema claro|escuro', 'troca o tema'), P('neofetch', 'info do sistema'), P('cbonsai', 'planta uma árvore'), P('sudo play snake', 'cobrinha'), P('sudo play blocos', 'blocos caindo (alias: tetrix)'), P('sudo contratar', ';)'), P('history · clear · exit', ''), T('tab completa · ↑ histórico · esc fecha', 'muted'));
    } else if (lc === 'whoami') {
      out.push(T('gabriellsar · Eng. de Computação · PUC-Rio · 2027.2', 'text-strong'), T('tcc     alocação preditiva de recursos em nuvem', 'text'), T('fase    PF I → PF II (dez/26–jun/27)', 'text'), T('busca   estágio em dados e IA', 'accent'));
    } else if (lc === 'ls' || lc === 'ls projetos' || lc === 'ls -l') {
      const all = this.props.projects;
      out.push(T('total ' + all.length, 'muted'));
      all.forEach((p) => out.push(T(this.pad(p.code, 7) + this.pad(p.title, 32) + p.base, 'text')));
    } else if (lc === 'ls ferramentas' || lc === 'ls ~/stack') {
      stack.forEach((d) => out.push(T(this.pad(d.dir + '/', 12) + d.items.filter((i) => !i.startsWith('[')).join(' · '))));
    } else if (a[0] === 'cd') {
      const id = SECTIONS[a[1] || '~'];
      if (id) { this.print(out); this.goTo(id); return; }
      out.push(T('cd: diretório não encontrado: ' + a[1], 'signal'));
    } else if (a[0] === 'open') {
      const q = (a[1] || '').toLowerCase();
      const p = this.props.projects.find((x) => x.code.toLowerCase() === q || x.title.toLowerCase() === q);
      if (p && p.caseStudy) out.push({ kind: 'link', text: `→ abrir ${p.code} · ${p.title}`, href: p.href });
      else out.push(T((q || '?').toUpperCase() + ' ainda não tem visão ampliada', 'muted'));
    } else if (a[0] === 'tema') {
      const nt: Theme | null = (a[1] === 'claro' || a[1] === 'light') ? 'light' : ((a[1] === 'escuro' || a[1] === 'dark') ? 'dark' : null);
      if (nt) { this.props.onTheme(nt); out.push(T('tema → ' + a[1], 'muted')); }
      else out.push(T('uso: tema claro|escuro', 'caution'));
    } else if (lc === 'neofetch') {
      const th = this.props.theme === 'dark' ? 'escuro' : 'claro';
      out.push(T('gabriel@arch', 'accent'), T('------------', 'line-strong'), T('OS      Arch Linux'), T('WM      Hyprland'), T('Uni     PUC-Rio · Eng. de Computação'), T('Foco    ML aplicado · dados · nuvem'), T(`Tema    gabriellsar (${th})`), { kind: 'palette' });
    } else if (lc === 'cbonsai') {
      const seed = Math.floor(Math.random() * 99999);
      out.push({ kind: 'art', rows: this.bonsai(seed) }, T('cbonsai · seed ' + seed, 'muted'));
    } else if (lc === 'sudo play snake' || lc === 'sudo play blocos') {
      this.print(out);
      this.startGame(lc === 'sudo play snake' ? 'snake' : 'blocos');
      return;
    } else if (a[0] === 'play') {
      out.push(T('permissão negada. tente: sudo ' + lc, 'signal'));
    } else if (lc === 'sudo contratar' || lc === 'sudo hire-me') {
      out.push(T('[sudo] senha para gabriel: ••••••••', 'muted'), T('acesso concedido.', 'accent'), { kind: 'link', text: '→ abrir e-mail', href: mail });
    } else if (a[0] === 'sudo') {
      out.push(T('gabriel não está no arquivo sudoers. este incidente será reportado.', 'caution'));
    } else if (lc === 'history') {
      hist.forEach((h, i) => out.push(T(String(i + 1).padStart(4, ' ') + '  ' + h)));
    } else if (a[0] === 'echo') {
      out.push(T(cmd.slice(5)));
    } else if (lc === 'date') {
      out.push(T(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })));
    } else if (a[0] === 'rm') {
      out.push(T('boa tentativa.', 'signal'));
    } else if (['vim', 'nvim', 'vi', 'emacs', 'nano'].includes(a[0])) {
      out.push(T('nenhum editor por aqui. e não, você não vai ficar preso.', 'muted'));
    } else {
      out.push(T('zsh: command not found: ' + a[0] + '  · tente help', 'signal'));
    }
    this.print(out);
  }

  onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (this.state.game) { this.gameKey(e); return; }
    if (e.key === 'Enter') { e.preventDefault(); this.exec(this.state.cmd); }
    else if (e.key === 'Escape') { e.preventDefault(); this.close(); }
    else if (e.key === 'Tab') { e.preventDefault(); this.complete(this.state.cmd); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const hh = this.state.hist; if (!hh.length) return;
      let ii = this.state.hIdx < 0 ? hh.length : this.state.hIdx;
      ii = e.key === 'ArrowUp' ? Math.max(0, ii - 1) : ii + 1;
      if (ii >= hh.length) this.setState({ hIdx: -1, cmd: '' }); else this.setState({ hIdx: ii, cmd: hh[ii] });
    }
  };

  cells() {
    const G = this.state.g, kind = this.state.game;
    if (!G) return [];
    const grid: string[][] = [];
    for (let y = 0; y < G.H; y++) grid.push(new Array(G.W).fill('var(--surface)'));
    if (kind === 'snake') {
      G.snake.forEach((p: number[], i: number) => { grid[p[1]][p[0]] = i === 0 ? 'var(--text-strong)' : 'var(--accent)'; });
      grid[G.food[1]][G.food[0]] = 'var(--signal)';
    } else {
      for (let y = 0; y < G.H; y++) for (let x = 0; x < G.W; x++) if (G.board[y][x]) grid[y][x] = G.board[y][x];
      if (!G.over) for (let i = 0; i < G.m.length; i++) for (let j = 0; j < G.m[i].length; j++) if (G.m[i][j] && G.y + i >= 0) grid[G.y + i][G.x + j] = G.c;
    }
    return grid.flat();
  }

  render() {
    const { open } = this.props;
    const { out, game, g, cmd } = this.state;
    const prompt = <><span style={{ color: 'var(--accent)' }}>gabriel@arch</span><span style={{ color: 'var(--muted)' }}>:~$</span></>;
    return (
      <div id="gs-shell" className="sh" role="dialog" aria-label="Terminal do portfólio" hidden={!open} onClick={() => this.input.current?.focus()}>
        <div className="sh-out" ref={this.outEl} aria-live="polite">
          {out.map((o, i) => {
            if (o.kind === 'prompt') return <p key={i}>{prompt} <span style={{ color: 'var(--text-strong)' }}>{o.text}</span></p>;
            if (o.kind === 'text') return <p key={i} style={{ color: o.color }}>{o.text}</p>;
            if (o.kind === 'link') return <a key={i} href={o.href} style={{ alignSelf: 'flex-start', color: 'var(--accent)', textDecoration: 'none' }}>{o.text}</a>;
            if (o.kind === 'palette') return <div key={i} style={{ margin: '6px 0' }}><Palette /></div>;
            return (
              <pre key={i} className="sh-art" aria-label="Bonsai em ASCII">
                {o.rows.map((rw, j) => <span key={j} style={{ display: 'block' }}>{rw.segs.map((sg, k) => <span key={k} style={{ color: sg.c }}>{sg.t}</span>)}</span>)}
              </pre>
            );
          })}
          {game && g && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 0' }}>
              <p style={{ color: 'var(--text-strong)' }}>
                {game} · pontos {g.score}{' '}
                <span style={{ color: 'var(--muted)' }}>· {game === 'snake' ? 'setas ou WASD movem · q sai' : '← → movem · ↑ gira · ↓ desce · espaço solta · q sai'}</span>
              </p>
              <div className="game-grid" role="img" aria-label={`${game} · pontos ${g.score}`} style={{ gridTemplateColumns: `repeat(${g.W}, 14px)` }}>
                {this.cells().map((c, i) => <span key={i} style={{ background: c }} />)}
              </div>
              {g.over && <p style={{ color: 'var(--signal)' }}>fim de jogo · r reinicia · q sai</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {PAD_KEYS.map((p) => (
                  <button key={p.k} type="button" className="gs-btn gs-btn-sm" aria-label={p.aria} style={{ minWidth: 44 }}
                    onClick={() => { this.gameKey({ key: p.k }); this.input.current?.focus(); }}>{p.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="sh-chips">
          {CHIPS.map((c) => (
            <button key={c} type="button" className="gs-btn gs-btn-sm gs-btn-ghost" onClick={() => { this.exec(c); this.input.current?.focus(); }}>{c}</button>
          ))}
        </div>
        <div className="sh-input">
          <label htmlFor="gs-shell-in" style={{ whiteSpace: 'nowrap' }}>{prompt}</label>
          <input
            id="gs-shell-in"
            ref={this.input}
            value={cmd}
            onChange={(e) => { if (!game) this.setState({ cmd: e.target.value }); }}
            onKeyDown={this.onKey}
            autoComplete="off"
            spellCheck={false}
            placeholder={game ? `jogando ${game} · q sai` : 'help'}
          />
        </div>
      </div>
    );
  }
}
