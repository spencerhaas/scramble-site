// Scramble intake variations — 4 approaches at trimmed scope
// Collects: Name, Age, Gender, Handicap, Home Course
// Brand: Playfair Display + Pacifico + Inter, green #3A7D44

const C = {
  green: '#3A7D44',
  greenDark: '#2d6236',
  greenLight: '#f0f5f1',
  greenTint: '#e3ede5',
  cream: '#faf7f0',
  white: '#ffffff',
  offWhite: '#f7f8fa',
  text: '#1a1a2e',
  textSoft: '#3d4254',
  midGray: '#9ca5b4',
  darkGray: '#5a6377',
  border: '#dfe3ea',
  borderSoft: '#e8ecf1',
  sand: '#e8dcc0',
  fairway: '#c4d8b8',
};

const F = {
  playfair: '"Playfair Display", Georgia, serif',
  pacifico: '"Pacifico", cursive',
  inter: '"Inter", system-ui, sans-serif',
};

const GENDERS = ['Man', 'Woman', 'Non-binary', 'Prefer not to say'];

// ── shared atoms ─────────────────────────────────────────────

function ChevronRight({ size = 22, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <polyline points="9,5 17,12 9,19" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeft({ size = 18, color = '#5a6377' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15 19l-7-7 7-7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GolfBallBtn({ onClick, disabled, size = 54 }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: disabled ? C.borderSoft : C.green,
        border: 'none', cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 120ms',
        boxShadow: disabled ? 'none' : '0 2px 10px rgba(58,125,68,0.25)',
      }}
    >
      <ChevronRight size={22} color={disabled ? C.midGray : '#fff'} />
    </button>
  );
}

// Status bar for mock iPhone
function PhoneChrome({ children, bg = C.white }) {
  return (
    <div style={{
      width: 390, height: 780, borderRadius: 44, overflow: 'hidden',
      background: bg, position: 'relative',
      boxShadow: '0 30px 60px rgba(0,0,0,0.18), 0 0 0 10px #1a1a2e, 0 0 0 11px #2a2a3e',
      fontFamily: F.inter,
    }}>
      {/* status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 50, zIndex: 10,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        padding: '0 28px 8px', pointerEvents: 'none',
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: bg === C.green || bg === C.greenDark ? '#fff' : '#000', fontFamily: '-apple-system, system-ui' }}>9:41</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="17" height="11" viewBox="0 0 17 11"><g fill={bg === C.green || bg === C.greenDark ? '#fff' : '#000'}><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="4.5" y="5" width="3" height="6" rx="0.5"/><rect x="9" y="3" width="3" height="8" rx="0.5"/><rect x="13.5" y="1" width="3" height="10" rx="0.5"/></g></svg>
          <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke={bg === C.green || bg === C.greenDark ? '#fff' : '#000'} fill="none"/><rect x="2" y="2" width="17" height="7" rx="1" fill={bg === C.green || bg === C.greenDark ? '#fff' : '#000'}/></svg>
        </div>
      </div>
      {/* dynamic island */}
      <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 110, height: 32, background: '#000', borderRadius: 20, zIndex: 11 }} />
      {children}
      {/* home indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 130, height: 4, borderRadius: 10,
        background: bg === C.green || bg === C.greenDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)',
        zIndex: 50,
      }} />
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// VARIATION 1: One-question-at-a-time ("Fairway")
// Big typographic, progress dots, playful microcopy
// ═════════════════════════════════════════════════════════════

function VariationOne() {
  const steps = [
    { key: 'name',     label: 'First up — what do we call you?', hint: 'First name only. No nicknames earned yet.', kind: 'text', placeholder: 'Your name', value: 'Marcus' },
    { key: 'age',      label: 'How many birthdays deep?',        hint: 'We only match adults who golf. 21+.',         kind: 'number', placeholder: 'Age', value: '32', suffix: 'years young' },
    { key: 'gender',   label: 'I am a…',                         hint: 'For matching preferences.',                    kind: 'choice', options: GENDERS, value: 'Man' },
    { key: 'handicap', label: "What's your handicap?",           hint: "Be honest. We'll find out on the 3rd hole anyway.", kind: 'number', placeholder: 'Handicap', value: '14', suffix: 'index' },
    { key: 'course',   label: 'Your home course?',               hint: 'Where you\'d bring a first date. Or hide from one.', kind: 'search', placeholder: 'Search courses…', value: 'Pebble Ridge Golf Club' },
  ];
  const [stepIdx, setStepIdx] = React.useState(2); // show gender step by default for visual interest
  const step = steps[stepIdx];
  const progress = ((stepIdx + 1) / steps.length) * 100;

  return (
    <PhoneChrome>
      {/* header with progress */}
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, padding: '0 24px', zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <button style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft />
          </button>
          <span style={{ fontFamily: F.inter, fontSize: 13, color: C.midGray, fontWeight: 500 }}>
            {stepIdx + 1} of {steps.length}
          </span>
        </div>
        {/* progress bar */}
        <div style={{ height: 3, background: C.borderSoft, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: C.green, borderRadius: 2, transition: 'width 300ms' }} />
        </div>
      </div>

      {/* content */}
      <div style={{ position: 'absolute', top: 140, left: 0, right: 0, bottom: 0, padding: '0 28px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F.pacifico, fontSize: 14, color: C.green, marginBottom: 18, letterSpacing: 0.2 }}>
            {stepIdx === 0 ? 'hello there' : stepIdx === steps.length - 1 ? 'last one' : 'nice.'}
          </div>
          <h1 style={{
            fontFamily: F.playfair, fontSize: 34, fontWeight: 600, lineHeight: 1.15,
            color: C.text, margin: 0, marginBottom: 14, letterSpacing: -0.5,
          }}>
            {step.label}
          </h1>
          <p style={{
            fontFamily: F.playfair, fontSize: 14, color: C.midGray,
            fontStyle: 'italic', margin: 0, marginBottom: 42, lineHeight: 1.5,
          }}>
            {step.hint}
          </p>

          {/* field */}
          {step.kind === 'choice' ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {step.options.map((opt) => {
                const active = opt === step.value;
                return (
                  <div key={opt} style={{
                    padding: '12px 20px', borderRadius: 24,
                    background: active ? C.green : 'transparent',
                    border: `1.5px solid ${active ? C.green : C.border}`,
                    fontFamily: F.playfair, fontSize: 16,
                    color: active ? '#fff' : C.textSoft,
                    fontWeight: active ? 600 : 400,
                  }}>{opt}</div>
                );
              })}
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <div style={{
                fontFamily: step.kind === 'number' ? F.inter : F.playfair,
                fontSize: step.kind === 'number' ? 44 : 28,
                fontWeight: step.kind === 'number' ? 300 : 500,
                color: C.text,
                paddingBottom: 14,
                borderBottom: `2px solid ${C.green}`,
                letterSpacing: step.kind === 'number' ? -1 : -0.3,
                display: 'flex', alignItems: 'baseline', gap: 10,
              }}>
                <span>{step.value}</span>
                {step.suffix && <span style={{ fontFamily: F.playfair, fontSize: 16, color: C.midGray, fontStyle: 'italic', fontWeight: 400 }}>{step.suffix}</span>}
              </div>
            </div>
          )}
        </div>

        {/* continue */}
        <div style={{ paddingBottom: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={{
            background: 'transparent', border: 'none',
            fontFamily: F.playfair, fontSize: 14, color: C.midGray,
            fontStyle: 'italic', cursor: 'pointer', padding: 0,
          }}>
            skip for now →
          </button>
          <GolfBallBtn />
        </div>
      </div>
    </PhoneChrome>
  );
}


// ═════════════════════════════════════════════════════════════
// VARIATION 2: Scorecard ("The Card")
// All 5 fields on one screen, styled like a golf scorecard
// Compact, tactile, single scroll but short
// ═════════════════════════════════════════════════════════════

function VariationTwo() {
  const rows = [
    { label: 'NAME',      value: 'Marcus Chen',          n: '01' },
    { label: 'AGE',       value: '32',                   n: '02' },
    { label: 'GENDER',    value: 'Man',                  n: '03' },
    { label: 'HANDICAP',  value: '14',                   n: '04' },
    { label: 'HOME COURSE', value: 'Pebble Ridge GC',   n: '05' },
  ];
  return (
    <PhoneChrome bg={C.cream}>
      {/* header */}
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer' }}>
          <ArrowLeft />
        </button>
        <span style={{ fontFamily: F.inter, fontSize: 12, fontWeight: 600, color: C.green, letterSpacing: 1.5 }}>SCORECARD</span>
        <div style={{ width: 30 }} />
      </div>

      {/* scorecard */}
      <div style={{ position: 'absolute', top: 110, left: 20, right: 20, bottom: 130 }}>
        {/* paper card */}
        <div style={{
          background: '#fffdf7',
          border: `1px solid ${C.sand}`,
          borderRadius: 4,
          padding: '28px 24px 24px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 12px 24px rgba(60,40,20,0.08)',
          position: 'relative',
          height: '100%',
          boxSizing: 'border-box',
        }}>
          {/* torn top */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 6,
            background: `repeating-linear-gradient(90deg, #fffdf7 0 8px, transparent 8px 10px)`,
          }} />

          {/* title block */}
          <div style={{ textAlign: 'center', marginBottom: 4, borderBottom: `2px solid ${C.green}`, paddingBottom: 16 }}>
            <div style={{ fontFamily: F.pacifico, fontSize: 26, color: C.green, marginBottom: 2 }}>
              Scramble
            </div>
            <div style={{ fontFamily: F.playfair, fontSize: 11, letterSpacing: 3, color: C.darkGray, fontWeight: 600, textTransform: 'uppercase' }}>
              Player Card · Round 1
            </div>
          </div>

          {/* rows */}
          <div style={{ paddingTop: 8 }}>
            {rows.map((r, i) => (
              <div key={r.label} style={{
                display: 'flex', alignItems: 'baseline',
                padding: '16px 0',
                borderBottom: i < rows.length - 1 ? `1px dashed ${C.sand}` : 'none',
                gap: 12,
              }}>
                <span style={{ fontFamily: F.inter, fontSize: 10, fontWeight: 700, color: C.green, width: 20, letterSpacing: 0.5 }}>
                  {r.n}
                </span>
                <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 600, color: C.darkGray, letterSpacing: 2, width: 90, textTransform: 'uppercase' }}>
                  {r.label}
                </span>
                <span style={{
                  flex: 1, fontFamily: F.playfair, fontSize: 18, color: C.text,
                  borderBottom: `1px solid ${C.sand}`, paddingBottom: 2, fontWeight: 500,
                }}>
                  {r.value}
                </span>
              </div>
            ))}
          </div>

          {/* signature line */}
          <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
            <div style={{ fontFamily: F.pacifico, fontSize: 18, color: C.text, transform: 'rotate(-4deg)', paddingLeft: 8 }}>
              M. Chen
            </div>
            <div style={{ borderTop: `1px solid ${C.darkGray}`, marginTop: -2, paddingTop: 6, fontFamily: F.inter, fontSize: 9, color: C.midGray, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Signature — let's tee it up
            </div>
          </div>
        </div>
      </div>

      {/* continue button */}
      <div style={{ position: 'absolute', bottom: 40, left: 24, right: 24 }}>
        <button style={{
          width: '100%', padding: '16px', borderRadius: 30,
          background: C.green, border: 'none', color: '#fff',
          fontFamily: F.playfair, fontSize: 17, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          cursor: 'pointer',
          boxShadow: '0 6px 16px rgba(58,125,68,0.28)',
        }}>
          Tee it up <ChevronRight size={18} color="#fff" />
        </button>
      </div>
    </PhoneChrome>
  );
}


// ═════════════════════════════════════════════════════════════
// VARIATION 3: Short stack ("Caddie")
// Conversational, one-screen, caddie-voice microcopy
// All fields visible, flows like a caddie asking questions
// ═════════════════════════════════════════════════════════════

function VariationThree() {
  const FieldRow = ({ qLabel, qHint, input }) => (
    <div style={{ marginBottom: 26 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <div style={{ fontFamily: F.playfair, fontSize: 16, fontWeight: 600, color: C.text, letterSpacing: -0.2 }}>
          {qLabel}
        </div>
        {qHint && <div style={{ fontFamily: F.playfair, fontSize: 12, fontStyle: 'italic', color: C.midGray }}>{qHint}</div>}
      </div>
      {input}
    </div>
  );

  const Input = ({ value, num, placeholder }) => (
    <div style={{
      paddingBottom: 8, borderBottom: `1.5px solid ${value ? C.green : C.border}`,
      fontFamily: num ? F.inter : F.playfair,
      fontSize: num ? 22 : 18,
      fontWeight: num ? 400 : 500,
      color: value ? C.text : C.midGray,
      letterSpacing: num ? -0.5 : -0.2,
    }}>
      {value || placeholder}
    </div>
  );

  const Pill = ({ label, active }) => (
    <div style={{
      padding: '8px 16px', borderRadius: 20,
      background: active ? C.green : 'transparent',
      border: `1.5px solid ${active ? C.green : C.border}`,
      fontFamily: F.playfair, fontSize: 14,
      color: active ? '#fff' : C.textSoft, fontWeight: active ? 600 : 400,
    }}>{label}</div>
  );

  return (
    <PhoneChrome>
      {/* subtle texture — top strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 260,
        background: `linear-gradient(180deg, ${C.greenLight} 0%, ${C.white} 100%)`,
        zIndex: 0,
      }} />

      {/* header */}
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 5 }}>
        <button style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer' }}>
          <ArrowLeft />
        </button>
        <span style={{ fontFamily: F.inter, fontSize: 12, fontWeight: 500, color: C.midGray }}>1 of 2</span>
      </div>

      {/* scroll content */}
      <div style={{ position: 'absolute', top: 100, left: 0, right: 0, bottom: 100, padding: '0 28px', overflowY: 'auto', zIndex: 2 }}>
        <div style={{ fontFamily: F.pacifico, fontSize: 16, color: C.green, marginBottom: 6 }}>
          quick warm-up
        </div>
        <h1 style={{
          fontFamily: F.playfair, fontSize: 28, fontWeight: 700,
          color: C.text, margin: 0, marginBottom: 8, letterSpacing: -0.4, lineHeight: 1.1,
        }}>
          Let's get you on the tee
        </h1>
        <p style={{
          fontFamily: F.playfair, fontSize: 14, color: C.darkGray,
          margin: 0, marginBottom: 34, lineHeight: 1.55, fontStyle: 'italic',
        }}>
          Five quick questions. We'll get the good stuff later — promise.
        </p>

        <FieldRow
          qLabel="What's your name?"
          qHint="first only"
          input={<Input value="Marcus" placeholder="Your name" />}
        />

        <FieldRow
          qLabel="And how old?"
          qHint="21+"
          input={<Input value="32" num placeholder="—" />}
        />

        <FieldRow
          qLabel="You are a…"
          input={
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
              {GENDERS.map((g) => <Pill key={g} label={g} active={g === 'Man'} />)}
            </div>
          }
        />

        <FieldRow
          qLabel="Handicap?"
          qHint="rough number is fine"
          input={<Input value="14" num placeholder="—" />}
        />

        <FieldRow
          qLabel="Home course"
          qHint="where you shoot your best lies"
          input={<Input value="Pebble Ridge Golf Club" placeholder="Search…" />}
        />
      </div>

      {/* bottom CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px 38px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,1) 100%)',
        zIndex: 5,
      }}>
        <button style={{
          width: '100%', padding: '16px', borderRadius: 30,
          background: C.green, border: 'none', color: '#fff',
          fontFamily: F.playfair, fontSize: 16, fontWeight: 600,
          cursor: 'pointer', boxShadow: '0 6px 16px rgba(58,125,68,0.25)',
        }}>
          Next: your vibe
        </button>
      </div>
    </PhoneChrome>
  );
}


// ═════════════════════════════════════════════════════════════
// VARIATION 4: Swipe cards ("Back Nine")
// Deck of cards, each card is a field. Bold editorial feel.
// One card shown; behind it a stack peek
// ═════════════════════════════════════════════════════════════

function VariationFour() {
  return (
    <PhoneChrome bg="#f0f5f1">
      {/* header */}
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 5 }}>
        <button style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer' }}>
          <ArrowLeft />
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0,1,2,3,4].map((i) => (
            <div key={i} style={{
              width: i === 3 ? 20 : 6, height: 6, borderRadius: 3,
              background: i <= 3 ? C.green : '#d0d8d2',
              transition: 'all 200ms',
            }} />
          ))}
        </div>
        <button style={{ background: 'transparent', border: 'none', fontFamily: F.playfair, fontSize: 13, color: C.midGray, fontStyle: 'italic', cursor: 'pointer' }}>
          skip
        </button>
      </div>

      {/* card stack */}
      <div style={{ position: 'absolute', top: 110, left: 0, right: 0, bottom: 140, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* back card */}
        <div style={{
          position: 'absolute', width: 290, height: 400,
          borderRadius: 22, background: C.white,
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          transform: 'translateY(18px) scale(0.94) rotate(-2deg)',
          opacity: 0.85,
        }} />
        {/* middle */}
        <div style={{
          position: 'absolute', width: 300, height: 410,
          borderRadius: 22, background: C.white,
          boxShadow: '0 10px 22px rgba(0,0,0,0.1)',
          transform: 'translateY(8px) scale(0.97) rotate(1.2deg)',
        }} />
        {/* front card */}
        <div style={{
          width: 310, height: 420,
          borderRadius: 24, background: C.white,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)',
          padding: '28px 26px', display: 'flex', flexDirection: 'column',
          position: 'relative',
        }}>
          {/* card number */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontFamily: F.inter, fontSize: 10, fontWeight: 700, color: C.green, letterSpacing: 2 }}>
              CARD 04 / 05
            </span>
            <span style={{ fontFamily: F.pacifico, fontSize: 16, color: C.midGray }}>
              par 3
            </span>
          </div>

          {/* question */}
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontFamily: F.playfair, fontSize: 32, fontWeight: 700,
              color: C.text, margin: 0, marginBottom: 8,
              letterSpacing: -0.5, lineHeight: 1.05,
            }}>
              What's your handicap?
            </h2>
            <p style={{
              fontFamily: F.playfair, fontSize: 13, color: C.midGray,
              margin: 0, marginBottom: 32, fontStyle: 'italic', lineHeight: 1.5,
            }}>
              Sandbaggers will be found out. Round to the nearest number.
            </p>

            {/* big number input */}
            <div style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'center',
              padding: '28px 0 16px',
            }}>
              <span style={{
                fontFamily: F.inter, fontSize: 96, fontWeight: 200,
                color: C.green, lineHeight: 0.9, letterSpacing: -4,
              }}>
                14
              </span>
            </div>

            {/* slider affordance */}
            <div style={{ padding: '0 4px' }}>
              <div style={{
                height: 4, background: C.borderSoft, borderRadius: 2, position: 'relative',
              }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '47%', background: C.green, borderRadius: 2 }} />
                <div style={{
                  position: 'absolute', left: '47%', top: '50%', transform: 'translate(-50%, -50%)',
                  width: 22, height: 22, borderRadius: 11, background: C.green,
                  border: '3px solid #fff', boxShadow: '0 2px 6px rgba(58,125,68,0.35)',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: F.inter, fontSize: 11, color: C.midGray, letterSpacing: 0.5 }}>
                <span>+0 scratch</span>
                <span>36 casual</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bottom swipe row */}
      <div style={{
        position: 'absolute', bottom: 44, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22,
      }}>
        <button style={{
          width: 52, height: 52, borderRadius: 26,
          background: C.white, border: `1.5px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
        }}>
          <ArrowLeft />
        </button>
        <button style={{
          padding: '16px 36px', borderRadius: 30,
          background: C.green, border: 'none', color: '#fff',
          fontFamily: F.playfair, fontSize: 15, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          boxShadow: '0 6px 16px rgba(58,125,68,0.3)',
        }}>
          Lock it in <ChevronRight size={16} color="#fff" />
        </button>
      </div>
    </PhoneChrome>
  );
}


// Export
Object.assign(window, {
  VariationOne, VariationTwo, VariationThree, VariationFour,
  C, F, PhoneChrome,
});
