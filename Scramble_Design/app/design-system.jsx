// Scramble shared design system + SVG illustrations
// Paper-scorecard vibe carried through the whole app

const S_C = {
  green: '#3A7D44',
  greenDark: '#2d6236',
  greenDeep: '#1f4427',
  greenLight: '#f0f5f1',
  greenTint: '#e3ede5',
  fairway: '#c4d8b8',
  cream: '#fffdf7',
  creamBg: '#faf7f0',
  paper: '#fbf8ef',
  white: '#ffffff',
  text: '#1a1a2e',
  textSoft: '#3d4254',
  midGray: '#9ca5b4',
  darkGray: '#5a6377',
  border: '#dfe3ea',
  borderSoft: '#e8ecf1',
  sand: '#e8dcc0',
  sandSoft: '#f0e6cd',
  sandDeep: '#c9b88a',
  sky: '#cee2ef',
  water: '#9bc5d9',
  red: '#c74a3a',
};

const S_F = {
  playfair: '"Playfair Display", Georgia, serif',
  pacifico: '"Pacifico", cursive',
  inter: '"Inter", system-ui, sans-serif',
};

// ── Scramble logo (flag + pin, on a ball) ──────────────────
function ScrambleLogo({ size = 40, color = S_C.green, flag = S_C.green }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="40" r="16" fill="#fff" stroke={color} strokeWidth="2" />
      {/* dimples */}
      {[[25,36],[30,34],[35,36],[22,42],[30,42],[38,42],[26,47],[34,47]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.2" fill={color} fillOpacity="0.25"/>
      ))}
      {/* flagpole */}
      <line x1="42" y1="40" x2="42" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* triangle flag */}
      <path d="M42 10 L56 14 L42 19 Z" fill={flag} />
    </svg>
  );
}

// Wordmark
function ScrambleWordmark({ size = 28, color = S_C.green }) {
  return (
    <span style={{ fontFamily: S_F.pacifico, fontSize: size, color, lineHeight: 1, letterSpacing: 0.5 }}>
      Scramble
    </span>
  );
}

// ── Paper card wrapper ──────────────────────────────────────
function PaperCard({ children, style = {}, dashed = false }) {
  return (
    <div style={{
      background: S_C.cream,
      border: `1px solid ${S_C.sand}`,
      borderRadius: 6,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 20px rgba(60,40,20,0.08)',
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(180,150,100,0.035) 0%, transparent 30%),
        radial-gradient(circle at 80% 70%, rgba(180,150,100,0.035) 0%, transparent 30%)
      `,
      ...style,
    }}>
      {children}
    </div>
  );
}

// dashed divider (scorecard-y)
function DashedDivider({ color = S_C.sand, margin = '12px 0' }) {
  return <div style={{ margin, height: 1, backgroundImage: `linear-gradient(90deg, ${color} 50%, transparent 50%)`, backgroundSize: '6px 1px' }} />;
}

// Eyebrow label (small caps header)
function Eyebrow({ children, color = S_C.green, size = 11, align = 'left' }) {
  return (
    <div style={{
      fontFamily: S_F.inter, fontSize: size, fontWeight: 700,
      color, letterSpacing: 2.5, textAlign: align,
    }}>{children}</div>
  );
}

// Pill / tag
function Pill({ children, active = false, small = false, color = S_C.green }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: small ? '4px 10px' : '7px 14px',
      borderRadius: 20,
      background: active ? color : 'transparent',
      border: `1.5px solid ${active ? color : S_C.border}`,
      fontFamily: S_F.playfair, fontSize: small ? 12 : 13,
      color: active ? '#fff' : S_C.textSoft,
      fontWeight: active ? 600 : 400,
      whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

// Primary button (pill)
function PrimaryBtn({ children, onClick, disabled, icon, style = {} }) {
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      width: '100%', padding: '15px', borderRadius: 28,
      background: disabled ? S_C.borderSoft : S_C.green,
      color: disabled ? S_C.midGray : '#fff',
      border: 'none', cursor: disabled ? 'default' : 'pointer',
      fontFamily: S_F.playfair, fontSize: 16, fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      boxShadow: disabled ? 'none' : '0 6px 16px rgba(58,125,68,0.25)',
      transition: 'all 150ms',
      ...style,
    }}>{children}{icon}</button>
  );
}

// Icons
const I = {
  back: (c = S_C.darkGray) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chev: (c = '#fff', s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><polyline points="9,5 17,12 9,19" stroke={c} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevDown: (c = S_C.midGray, s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><polyline points="5,9 12,17 19,9" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check: (c = '#fff', s = 12) => <svg width={s} height={s} viewBox="0 0 12 12"><path d="M2 6 L5 9 L10 3" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>,
  x: (c = S_C.darkGray, s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={c} strokeWidth="2.2" strokeLinecap="round"/></svg>,
  plus: (c = S_C.green, s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke={c} strokeWidth="2.4" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke={c} strokeWidth="2.4" strokeLinecap="round"/></svg>,
  flag: (c = S_C.green, s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><line x1="12" y1="3" x2="12" y2="21" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M12 3 L20 7 L12 11" stroke={c} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" fill={c}/><line x1="8" y1="21" x2="16" y2="21" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  chat: (c = S_C.green, s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  user: (c = S_C.green, s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  heart: (c = S_C.green, s = 18, fill = 'none') => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill}><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" stroke={c} strokeWidth="2" strokeLinejoin="round"/></svg>,
  send: (c = '#fff', s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 12l18-8-6 18-3-8-9-2z" stroke={c} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/></svg>,
  search: (c = S_C.midGray, s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke={c} strokeWidth="2"/><line x1="15.5" y1="15.5" x2="21" y2="21" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  pin: (c = S_C.green, s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2 C7 2 4 5 4 10 C4 16 12 22 12 22 C12 22 20 16 20 10 C20 5 17 2 12 2 Z" fill={c}/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>,
  settings: (c = S_C.green, s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="2"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  bell: (c = S_C.darkGray, s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M6 8a6 6 0 0112 0c0 7 3 7 3 9H3c0-2 3-2 3-9z" stroke={c} strokeWidth="2" strokeLinejoin="round"/><path d="M10 21a2 2 0 004 0" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  filter: (c = S_C.darkGray, s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 6h18M6 12h12M10 18h4" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
};


// ══════════════════════════════════════════════════════════════
// MINIMAL GOLF COURSE ILLUSTRATIONS (SVG, scorecard-style)
// Each: 300x160 or similar ratio, layered like a topo map
// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
// COURSE BACKDROP — rotates across three stock photos
// ══════════════════════════════════════════════════════════════

const COURSE_PHOTOS = ['app/course1.png', 'app/course2.png', 'app/course3.png'];

function pickCoursePhoto(variant) {
  // If variant is an explicit index like "match-0", use it directly to guarantee uniqueness.
  const m = /^match-(\d+)$/.exec(String(variant || ''));
  if (m) return COURSE_PHOTOS[Number(m[1]) % COURSE_PHOTOS.length];
  // Otherwise hash the variant name so the same key always gets the same photo
  const s = String(variant || 'fairway');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return COURSE_PHOTOS[Math.abs(h) % COURSE_PHOTOS.length];
}

function CourseIllustration({ variant = 'fairway', height = 180, width = '100%' }) {
  const src = pickCoursePhoto(variant);
  return (
    <div style={{ width, height, overflow: 'hidden', position: 'relative', background: S_C.paper }}>
      <img src={src} alt=""
           style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
    </div>
  );
}

// Top-down fairway with bunkers + green + pin
function IllustrationFairway({ height, width }) {
  return (
    <svg viewBox="0 0 300 180" width={width} height={height} preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <defs>
        <pattern id="rough1" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill={S_C.fairway} opacity="0.5"/>
          <circle cx="1" cy="1" r="0.4" fill={S_C.green} opacity="0.4"/>
        </pattern>
      </defs>
      <rect width="300" height="180" fill={S_C.paper}/>
      {/* rough bands */}
      <path d="M0 0 Q 80 30 160 40 Q 240 50 300 40 L 300 0 Z" fill="url(#rough1)" />
      <path d="M0 180 Q 100 160 200 165 Q 260 168 300 160 L 300 180 Z" fill="url(#rough1)"/>
      {/* fairway */}
      <path d="M40 160 Q 50 130 80 110 Q 130 85 180 85 Q 240 85 260 60 L 250 50 Q 220 70 180 70 Q 130 70 85 95 Q 55 115 25 155 Z" fill={S_C.fairway}/>
      {/* green */}
      <ellipse cx="255" cy="52" rx="30" ry="22" fill={S_C.green} opacity="0.85"/>
      <ellipse cx="255" cy="52" rx="22" ry="15" fill="#6ea86f" opacity="0.8"/>
      {/* pin */}
      <line x1="258" y1="52" x2="258" y2="24" stroke={S_C.text} strokeWidth="1.3"/>
      <path d="M258 26 L270 30 L258 34 Z" fill={S_C.red}/>
      {/* bunkers */}
      <ellipse cx="200" cy="95" rx="16" ry="8" fill={S_C.sandDeep}/>
      <ellipse cx="230" cy="72" rx="12" ry="6" fill={S_C.sandDeep}/>
      <ellipse cx="90" cy="135" rx="14" ry="7" fill={S_C.sandDeep}/>
      {/* tee */}
      <rect x="30" y="148" width="22" height="10" rx="2" fill={S_C.sandSoft}/>
      <circle cx="41" cy="153" r="2.5" fill={S_C.text}/>
      {/* yardage marker */}
      <text x="148" y="115" fontFamily={S_F.inter} fontSize="8" fill={S_C.text} opacity="0.5" fontWeight="600">388 YDS · PAR 4</text>
    </svg>
  );
}

function IllustrationDogleg({ height, width }) {
  return (
    <svg viewBox="0 0 300 180" width={width} height={height} preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <rect width="300" height="180" fill={S_C.paper}/>
      {/* trees border */}
      <g fill={S_C.greenDeep} opacity="0.7">
        {[15,35,55,75].map(y => <circle key={y} cx="18" cy={y} r="6"/>)}
        {[145,165].map(y => <circle key={y} cx="18" cy={y} r="6"/>)}
        {[15,160].map(x => <circle key={x} cx={x} cy="165" r="6"/>)}
      </g>
      {/* fairway — dogleg left */}
      <path d="M50 160 L 110 160 Q 150 160 170 130 L 185 70 Q 188 45 215 40 L 260 40 L 260 25 Q 175 25 170 55 L 155 120 Q 145 145 115 145 L 50 145 Z" fill={S_C.fairway}/>
      {/* green */}
      <ellipse cx="250" cy="40" rx="24" ry="14" fill={S_C.green} opacity="0.85"/>
      {/* pin */}
      <line x1="245" y1="40" x2="245" y2="18" stroke={S_C.text} strokeWidth="1.3"/>
      <path d="M245 20 L256 24 L245 28 Z" fill={S_C.red}/>
      {/* water */}
      <path d="M200 80 Q 220 75 230 90 Q 235 105 215 108 Q 195 105 200 80 Z" fill={S_C.water} opacity="0.8"/>
      <path d="M205 90 Q 215 88 220 95" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.6"/>
      {/* bunkers */}
      <ellipse cx="170" cy="100" rx="10" ry="5" fill={S_C.sandDeep}/>
      <ellipse cx="235" cy="55" rx="9" ry="4" fill={S_C.sandDeep}/>
      {/* tee */}
      <rect x="55" y="150" width="18" height="8" rx="2" fill={S_C.sandSoft}/>
      <text x="130" y="172" fontFamily={S_F.inter} fontSize="8" fill={S_C.text} opacity="0.5" fontWeight="600">DOGLEG LEFT · 420 YDS</text>
    </svg>
  );
}

function IllustrationIsland({ height, width }) {
  return (
    <svg viewBox="0 0 300 180" width={width} height={height} preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <rect width="300" height="180" fill={S_C.water} opacity="0.7"/>
      <rect width="300" height="180" fill={S_C.paper} opacity="0.15"/>
      {/* ripples */}
      {[30, 60, 100, 140].map(y => (
        <path key={y} d={`M${10 + y} ${y} Q ${60+y} ${y-3} ${100+y} ${y}`} stroke="#fff" strokeWidth="0.6" fill="none" opacity="0.5"/>
      ))}
      {/* tee island */}
      <ellipse cx="40" cy="90" rx="28" ry="18" fill={S_C.fairway}/>
      <rect x="30" y="85" width="20" height="10" rx="2" fill={S_C.sandSoft}/>
      {/* green island */}
      <ellipse cx="230" cy="90" rx="48" ry="35" fill={S_C.fairway}/>
      <ellipse cx="230" cy="88" rx="30" ry="22" fill={S_C.green} opacity="0.9"/>
      <ellipse cx="225" cy="92" rx="18" ry="10" fill={S_C.sandDeep} opacity="0.6"/>
      {/* pin */}
      <line x1="238" y1="86" x2="238" y2="56" stroke={S_C.text} strokeWidth="1.3"/>
      <path d="M238 58 L250 62 L238 66 Z" fill={S_C.red}/>
      {/* dashed flight path */}
      <path d="M50 88 Q 140 40 220 85" stroke={S_C.text} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.4"/>
      <text x="95" y="160" fontFamily={S_F.inter} fontSize="8" fill={S_C.text} opacity="0.5" fontWeight="600">ISLAND GREEN · 155 YDS · PAR 3</text>
    </svg>
  );
}

function IllustrationTee({ height, width }) {
  return (
    <svg viewBox="0 0 300 180" width={width} height={height} preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <rect width="300" height="180" fill={S_C.paper}/>
      {/* horizon */}
      <rect y="0" width="300" height="80" fill={S_C.sky}/>
      <rect y="80" width="300" height="100" fill={S_C.fairway}/>
      {/* distant trees */}
      <g fill={S_C.greenDeep} opacity="0.6">
        <path d="M0 78 Q 20 62 40 78 Q 60 58 80 78 Q 100 65 120 78 Q 140 60 160 78 Q 180 68 200 78 Q 220 55 240 78 Q 260 68 280 78 L 300 78 L 300 90 L 0 90 Z" />
      </g>
      {/* fairway */}
      <path d="M0 180 L 0 90 L 300 90 L 300 180 Z" fill={S_C.fairway}/>
      <path d="M80 180 L 130 90 L 170 90 L 220 180 Z" fill="#b5cfa7" opacity="0.7"/>
      {/* tee box */}
      <rect x="130" y="155" width="40" height="14" rx="2" fill={S_C.sandSoft}/>
      {/* tee */}
      <line x1="150" y1="155" x2="150" y2="145" stroke={S_C.text} strokeWidth="1.2"/>
      <circle cx="150" cy="143" r="3" fill="#fff" stroke={S_C.text} strokeWidth="1"/>
      {/* sun */}
      <circle cx="245" cy="35" r="14" fill="#f4d79b" opacity="0.8"/>
    </svg>
  );
}

function IllustrationLinks({ height, width }) {
  return (
    <svg viewBox="0 0 300 180" width={width} height={height} preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <rect width="300" height="180" fill={S_C.sandSoft}/>
      {/* dune shapes */}
      <path d="M0 120 Q 40 90 80 110 Q 120 130 160 105 Q 200 80 240 100 Q 280 115 300 100 L 300 180 L 0 180 Z" fill={S_C.fairway}/>
      <path d="M0 160 Q 50 140 100 155 Q 150 170 200 150 Q 250 135 300 150 L 300 180 L 0 180 Z" fill="#b5cfa7"/>
      {/* grass tufts */}
      {[[40,100],[100,115],[170,95],[230,105],[270,110]].map(([x,y],i)=>(
        <g key={i}>
          <line x1={x} y1={y} x2={x-2} y2={y-6} stroke={S_C.green} strokeWidth="0.8"/>
          <line x1={x} y1={y} x2={x} y2={y-7} stroke={S_C.green} strokeWidth="0.8"/>
          <line x1={x} y1={y} x2={x+2} y2={y-6} stroke={S_C.green} strokeWidth="0.8"/>
        </g>
      ))}
      {/* sky */}
      <rect y="0" width="300" height="90" fill={S_C.sky} opacity="0.6"/>
      {/* ocean strip */}
      <path d="M0 80 Q 60 75 120 82 Q 180 88 240 80 Q 280 76 300 82 L 300 95 L 0 95 Z" fill={S_C.water} opacity="0.7"/>
      {/* small flag */}
      <line x1="220" y1="115" x2="220" y2="95" stroke={S_C.text} strokeWidth="1"/>
      <path d="M220 97 L228 100 L220 103 Z" fill={S_C.red}/>
    </svg>
  );
}

function IllustrationGreen({ height, width }) {
  return (
    <svg viewBox="0 0 300 180" width={width} height={height} preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <rect width="300" height="180" fill={S_C.paper}/>
      {/* green rings — topographic */}
      <ellipse cx="150" cy="90" rx="130" ry="70" fill={S_C.fairway}/>
      <ellipse cx="150" cy="90" rx="100" ry="55" fill="#b8d5a8"/>
      <ellipse cx="150" cy="90" rx="75" ry="42" fill={S_C.green} opacity="0.9"/>
      <ellipse cx="150" cy="90" rx="55" ry="30" fill="#5a9662"/>
      {/* hole */}
      <circle cx="148" cy="87" r="4" fill={S_C.text}/>
      {/* pin */}
      <line x1="148" y1="87" x2="148" y2="40" stroke={S_C.text} strokeWidth="1.4"/>
      <path d="M148 42 L164 47 L148 52 Z" fill={S_C.red}/>
      {/* ball */}
      <circle cx="140" cy="95" r="3.5" fill="#fff" stroke={S_C.text} strokeWidth="0.8"/>
      {/* topo contour labels */}
      <text x="40" y="90" fontFamily={S_F.inter} fontSize="7" fill={S_C.darkGray} opacity="0.6" fontWeight="600">THE GREEN</text>
    </svg>
  );
}

Object.assign(window, {
  S_C, S_F, I,
  ScrambleLogo, ScrambleWordmark, PaperCard, DashedDivider, Eyebrow, Pill, PrimaryBtn,
  CourseIllustration,
});
