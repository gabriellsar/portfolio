/**
 * Shell escondido do portfólio. Abre pelo botão :cmd da barra, por ":" ou por Ctrl+K.
 * Comandos: help para a lista. Jogos: sudo play snake · sudo play blocos.
 */
import { Component, createRef } from 'react';
import { Palette } from '@/components/ui';
import type { ProjectLite } from '@/lib/projects';
import { stackFor } from '@/data/stack';
import { homeHash, type Lang } from '@/i18n';

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
  lang: Lang;
  langHref: Record<Lang, string>;
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
const CHIPS: Record<Lang, string[]> = {
  pt: ['help', 'whoami', 'ls projetos', 'neofetch', 'cbonsai', 'sudo play snake', 'sudo play blocos', 'exit'],
  en: ['help', 'whoami', 'ls projects', 'neofetch', 'cbonsai', 'sudo play snake', 'sudo play blocks', 'exit'],
};
const COMPLETIONS: Record<Lang, string[]> = {
  pt: ['help', 'whoami', 'ls projetos', 'ls ferramentas', 'cd projetos', 'cd ferramentas', 'cd trajetoria', 'cd contato', 'open p/03', 'tema claro', 'tema escuro', 'lang en', 'neofetch', 'cbonsai', 'sudo play snake', 'sudo play blocos', 'sudo contratar', 'history', 'clear', 'exit', 'date'],
  en: ['help', 'whoami', 'ls projects', 'ls tools', 'cd projects', 'cd tools', 'cd experience', 'cd contact', 'open p/03', 'theme light', 'theme dark', 'lang pt', 'neofetch', 'cbonsai', 'sudo play snake', 'sudo play blocks', 'sudo hire-me', 'history', 'clear', 'exit', 'date'],
};
const PAD_KEYS = [
  { label: '←', k: 'ArrowLeft' }, { label: '↑', k: 'ArrowUp' }, { label: '↓', k: 'ArrowDown' },
  { label: '→', k: 'ArrowRight' }, { label: 'r', k: 'r' }, { label: 'q', k: 'q' },
];
const SECTIONS: Record<string, string> = {
  projetos: 'projetos', ferramentas: 'ferramentas', trajetoria: 'trajetoria', 'trajetória': 'trajetoria', contato: 'contato', '~': 'topo', home: 'topo',
  projects: 'projetos', tools: 'ferramentas', stack: 'ferramentas', experience: 'trajetoria', journey: 'trajetoria', contact: 'contato',
};
/** Comandos em inglês viram o comando canônico (em português), nos dois idiomas. */
const ALIASES: Record<string, string> = {
  'ls projects': 'ls projetos', 'ls tools': 'ls ferramentas', 'ls stack': 'ls ferramentas',
  'sudo play blocks': 'sudo play blocos', 'sudo play tetrix': 'sudo play blocos', 'sudo play tetris': 'sudo play blocos',
  'sudo hire-me': 'sudo contratar', 'sudo hire': 'sudo contratar', 'cd bonsai': 'cbonsai', bonsai: 'cbonsai', fastfetch: 'neofetch',
};

const M = {
  pt: {
    intro: 'gabriellsar shell · digite help e aperte enter · tab completa · esc fecha',
    helpTitle: 'comandos',
    help: [
      ['whoami', 'quem sou eu'], ['ls projetos', 'todos os projetos'], ['ls ferramentas', 'stack principal'],
      ['cd <seção>', 'projetos · ferramentas · trajetoria · contato'], ['open p/03', 'estudo de caso do WindAnalyzer'],
      ['tema claro|escuro', 'troca o tema'], ['lang en', 'read in English'], ['neofetch', 'info do sistema'], ['cbonsai', 'planta uma árvore'],
      ['sudo play snake', 'cobrinha'], ['sudo play blocos', 'blocos caindo (alias: tetrix)'], ['sudo contratar', ';)'], ['history · clear · exit', ''],
    ],
    helpFoot: 'tab completa · ↑ histórico · esc fecha',
    whoami: ['gabriellsar · Eng. de Computação · PUC-Rio · 2027.2', 'tcc     alocação preditiva de recursos em nuvem', 'fase    PF I → PF II (dez/26–jun/27)', 'busca   estágio em dados e IA'],
    cdErr: 'cd: diretório não encontrado: ',
    open: 'abrir',
    noCase: ' ainda não tem visão detalhada',
    themeUsage: 'uso: tema claro|escuro',
    themeTo: 'tema → ',
    langUsage: 'uso: lang pt|en',
    langSame: 'você já está em português',
    langTo: 'idioma → ',
    neo: ['Uni     PUC-Rio · Eng. de Computação', 'Foco    ML aplicado · dados · nuvem'],
    themeLine: 'Tema    ',
    themeName: { dark: 'escuro', light: 'claro' },
    denied: 'permissão negada. tente: sudo ',
    sudoPw: '[sudo] senha para gabriel: ••••••••',
    granted: 'acesso concedido.',
    openMail: '→ abrir e-mail',
    sudoers: 'gabriel não está no arquivo sudoers. este incidente será reportado.',
    locale: 'pt-BR',
    rm: 'boa tentativa.',
    editor: 'nenhum editor por aqui. e não, você não vai ficar preso.',
    notFound: '  · tente help',
    score: 'pontos',
    snakeHint: 'setas ou WASD movem · q sai',
    blocksHint: '← → movem · ↑ gira · ↓ desce · espaço solta · q sai',
    over: 'fim de jogo · r reinicia · q sai',
    playing: (g: string) => `jogando ${g} · q sai`,
    dialog: 'Terminal do portfólio',
    bonsai: 'Bonsai em ASCII',
    pad: ['Esquerda', 'Cima ou girar', 'Baixo', 'Direita', 'Reiniciar', 'Sair do jogo'],
    games: { snake: 'snake', blocos: 'blocos' },
  },
  en: {
    intro: 'gabriellsar shell · type help and press enter · tab completes · esc closes',
    helpTitle: 'commands',
    help: [
      ['whoami', 'who I am'], ['ls projects', 'all projects'], ['ls tools', 'main stack'],
      ['cd <section>', 'projects · tools · experience · contact'], ['open p/03', 'WindAnalyzer case study'],
      ['theme light|dark', 'switch the theme'], ['lang pt', 'ler em português'], ['neofetch', 'system info'], ['cbonsai', 'grow a tree'],
      ['sudo play snake', 'snake'], ['sudo play blocks', 'falling blocks (alias: tetris)'], ['sudo hire-me', ';)'], ['history · clear · exit', ''],
    ],
    helpFoot: 'tab completes · ↑ history · esc closes',
    whoami: ['gabriellsar · Computer Engineering · PUC-Rio · 2027.2', 'thesis  predictive cloud resource allocation', 'phase   Final Project I → II (Dec 2026–Jun 2027)', 'seeking data & AI internship'],
    cdErr: 'cd: no such directory: ',
    open: 'open',
    noCase: ' has no case study yet',
    themeUsage: 'usage: theme light|dark',
    themeTo: 'theme → ',
    langUsage: 'usage: lang pt|en',
    langSame: "you're already reading in English",
    langTo: 'language → ',
    neo: ['Uni     PUC-Rio · Computer Engineering', 'Focus   applied ML · data · cloud'],
    themeLine: 'Theme   ',
    themeName: { dark: 'dark', light: 'light' },
    denied: 'permission denied. try: sudo ',
    sudoPw: '[sudo] password for gabriel: ••••••••',
    granted: 'access granted.',
    openMail: '→ open e-mail',
    sudoers: 'gabriel is not in the sudoers file. this incident will be reported.',
    locale: 'en-US',
    rm: 'nice try.',
    editor: "no editors around here. and no, you won't get stuck.",
    notFound: '  · try help',
    score: 'score',
    snakeHint: 'arrows or WASD move · q quits',
    blocksHint: '← → move · ↑ rotates · ↓ drops one · space drops · q quits',
    over: 'game over · r restarts · q quits',
    playing: (g: string) => `playing ${g} · q quits`,
    dialog: 'Portfolio terminal',
    bonsai: 'ASCII bonsai',
    pad: ['Left', 'Up or rotate', 'Down', 'Right', 'Restart', 'Quit game'],
    games: { snake: 'snake', blocos: 'blocks' },
  },
};

export default class Shell extends Component<Props, State> {
  state: State = { out: [], hist: [], hIdx: -1, cmd: '', game: null, g: null };
  input = createRef<HTMLInputElement>();
  outEl = createRef<HTMLDivElement>();
  timer: ReturnType<typeof setInterval> | undefined;

  get m() { return M[this.props.lang] ?? M.pt; }

  componentDidMount() { if (this.props.open) this.onOpen(); }
  componentWillUnmount() { clearInterval(this.timer); }
  componentDidUpdate(pp: Props, ps: State) {
    if (this.props.open && !pp.open) this.onOpen();
    if (!this.props.open && pp.open) this.stopGame();
    if (this.outEl.current && (ps.out !== this.state.out || ps.g !== this.state.g)) this.outEl.current.scrollTop = this.outEl.current.scrollHeight;
  }
  onOpen() {
    if (!this.state.out.length) this.setState({ out: [this.T(this.m.intro, 'muted')] });
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
      this.print([this.T(`${this.m.games[kind]} · ${this.m.score} ${g.score}`, 'muted')]);
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
    const m = COMPLETIONS[this.props.lang].filter((x) => x.indexOf(c) === 0);
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
      window.location.href = homeHash(this.props.lang, id);
    }
  }

  exec(raw: string) {
    const T = (t: string, c?: string) => this.T(t, c);
    const cmd = String(raw || '').trim();
    let lc = cmd.toLowerCase().split(' ').filter(Boolean).join(' ');
    const hist = cmd ? this.state.hist.concat([cmd]).slice(-50) : this.state.hist;
    this.setState({ cmd: '', hIdx: -1, hist });
    const M = this.m;
    if (ALIASES[lc]) lc = ALIASES[lc];
    if (lc.startsWith('theme ')) lc = 'tema ' + lc.slice(6);
    if (lc.startsWith('idioma ') || lc === 'idioma') lc = 'lang' + lc.slice(6);
    const a = lc.split(' ');
    const out: Line[] = [{ kind: 'prompt', text: cmd }];
    const mail = this.props.email.startsWith('[') ? '#contato' : `mailto:${this.props.email}`;
    if (!cmd) { this.print(out); return; }
    if (lc === 'clear') { this.setState({ out: [] }); return; }
    if (lc === 'exit' || lc === 'quit' || lc === 'q') { this.close(); return; }

    if (lc === 'help') {
      const P = (c: string, d: string) => T('  ' + this.pad(c, 22) + d, 'text');
      out.push(T(M.helpTitle, 'muted'), ...M.help.map(([c, d]) => P(c, d)), T(M.helpFoot, 'muted'));
    } else if (lc === 'whoami') {
      out.push(T(M.whoami[0], 'text-strong'), T(M.whoami[1], 'text'), T(M.whoami[2], 'text'), T(M.whoami[3], 'accent'));
    } else if (lc === 'ls' || lc === 'ls projetos' || lc === 'ls -l') {
      const all = this.props.projects;
      out.push(T('total ' + all.length, 'muted'));
      all.forEach((p) => out.push(T(this.pad(p.code, 7) + this.pad(p.title, 32) + p.base, 'text')));
    } else if (lc === 'ls ferramentas' || lc === 'ls ~/stack') {
      stackFor(this.props.lang).forEach((d) => out.push(T(this.pad(d.dir + '/', 12) + d.items.filter((i) => !i.startsWith('[')).join(' · '))));
    } else if (a[0] === 'cd') {
      const id = SECTIONS[a[1] || '~'];
      if (id) { this.print(out); this.goTo(id); return; }
      out.push(T(M.cdErr + a[1], 'signal'));
    } else if (a[0] === 'open') {
      const q = (a[1] || '').toLowerCase();
      const p = this.props.projects.find((x) => x.code.toLowerCase() === q || x.title.toLowerCase() === q);
      if (p && p.caseStudy) out.push({ kind: 'link', text: `→ ${M.open} ${p.code} · ${p.title}`, href: p.href });
      else out.push(T((q || '?').toUpperCase() + M.noCase, 'muted'));
    } else if (a[0] === 'tema') {
      const nt: Theme | null = (a[1] === 'claro' || a[1] === 'light') ? 'light' : ((a[1] === 'escuro' || a[1] === 'dark') ? 'dark' : null);
      if (nt) { this.props.onTheme(nt); out.push(T(M.themeTo + a[1], 'muted')); }
      else out.push(T(M.themeUsage, 'caution'));
    } else if (a[0] === 'lang') {
      const to: Lang | null = ['en', 'english', 'inglês', 'ingles'].includes(a[1]) ? 'en' : ['pt', 'pt-br', 'português', 'portugues', 'portuguese'].includes(a[1]) ? 'pt' : null;
      if (!to) out.push(T(M.langUsage, 'caution'));
      else if (to === this.props.lang) out.push(T(M.langSame, 'muted'));
      else {
        out.push(T(M.langTo + to, 'muted'));
        this.print(out);
        window.location.href = this.props.langHref[to] + (this.props.isHome ? window.location.hash : '');
        return;
      }
    } else if (lc === 'neofetch') {
      const th = M.themeName[this.props.theme];
      out.push(T('gabriel@arch', 'accent'), T('------------', 'line-strong'), T('OS      Arch Linux'), T('WM      Hyprland'), T(M.neo[0]), T(M.neo[1]), T(`${M.themeLine}gabriellsar (${th})`), { kind: 'palette' });
    } else if (lc === 'cbonsai') {
      const seed = Math.floor(Math.random() * 99999);
      out.push({ kind: 'art', rows: this.bonsai(seed) }, T('cbonsai · seed ' + seed, 'muted'));
    } else if (lc === 'sudo play snake' || lc === 'sudo play blocos') {
      this.print(out);
      this.startGame(lc === 'sudo play snake' ? 'snake' : 'blocos');
      return;
    } else if (a[0] === 'play') {
      out.push(T(M.denied + lc, 'signal'));
    } else if (lc === 'sudo contratar' || lc === 'sudo hire-me') {
      out.push(T(M.sudoPw, 'muted'), T(M.granted, 'accent'), { kind: 'link', text: M.openMail, href: mail });
    } else if (a[0] === 'sudo') {
      out.push(T(M.sudoers, 'caution'));
    } else if (lc === 'history') {
      hist.forEach((h, i) => out.push(T(String(i + 1).padStart(4, ' ') + '  ' + h)));
    } else if (a[0] === 'echo') {
      out.push(T(cmd.slice(5)));
    } else if (lc === 'date') {
      out.push(T(new Date().toLocaleString(M.locale, { timeZone: 'America/Sao_Paulo' })));
    } else if (a[0] === 'rm') {
      out.push(T(M.rm, 'signal'));
    } else if (['vim', 'nvim', 'vi', 'emacs', 'nano'].includes(a[0])) {
      out.push(T(M.editor, 'muted'));
    } else {
      out.push(T('zsh: command not found: ' + a[0] + M.notFound, 'signal'));
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
    const M = this.m;
    const gname = game ? M.games[game] : '';
    const prompt = <><span style={{ color: 'var(--accent)' }}>gabriel@arch</span><span style={{ color: 'var(--muted)' }}>:~$</span></>;
    return (
      <div id="gs-shell" className="sh" role="dialog" aria-label={M.dialog} hidden={!open} onClick={() => this.input.current?.focus()}>
        <div className="sh-out" ref={this.outEl} aria-live="polite">
          {out.map((o, i) => {
            if (o.kind === 'prompt') return <p key={i}>{prompt} <span style={{ color: 'var(--text-strong)' }}>{o.text}</span></p>;
            if (o.kind === 'text') return <p key={i} style={{ color: o.color }}>{o.text}</p>;
            if (o.kind === 'link') return <a key={i} href={o.href} style={{ alignSelf: 'flex-start', color: 'var(--accent)', textDecoration: 'none' }}>{o.text}</a>;
            if (o.kind === 'palette') return <div key={i} style={{ margin: '6px 0' }}><Palette /></div>;
            return (
              <pre key={i} className="sh-art" aria-label={M.bonsai}>
                {o.rows.map((rw, j) => <span key={j} style={{ display: 'block' }}>{rw.segs.map((sg, k) => <span key={k} style={{ color: sg.c }}>{sg.t}</span>)}</span>)}
              </pre>
            );
          })}
          {game && g && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 0' }}>
              <p style={{ color: 'var(--text-strong)' }}>
                {gname} · {M.score} {g.score}{' '}
                <span style={{ color: 'var(--muted)' }}>· {game === 'snake' ? M.snakeHint : M.blocksHint}</span>
              </p>
              <div className="game-grid" role="img" aria-label={`${gname} · ${M.score} ${g.score}`} style={{ gridTemplateColumns: `repeat(${g.W}, 14px)` }}>
                {this.cells().map((c, i) => <span key={i} style={{ background: c }} />)}
              </div>
              {g.over && <p style={{ color: 'var(--signal)' }}>{M.over}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {PAD_KEYS.map((p, i) => (
                  <button key={p.k} type="button" className="gs-btn gs-btn-sm" aria-label={M.pad[i]} style={{ minWidth: 44 }}
                    onClick={() => { this.gameKey({ key: p.k }); this.input.current?.focus(); }}>{p.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="sh-chips">
          {CHIPS[this.props.lang].map((c) => (
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
            placeholder={game ? M.playing(gname) : 'help'}
          />
        </div>
      </div>
    );
  }
}
