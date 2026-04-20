// Scorecard intake — interactive prototype
// 5 fields: Name (first only), Age, Gender, Handicap, Home Course
// Signature auto-writes in Pacifico as name is typed

const C = {
  green: '#3A7D44',
  greenDark: '#2d6236',
  greenLight: '#f0f5f1',
  cream: '#fffdf7',
  creamBg: '#faf7f0',
  white: '#ffffff',
  text: '#1a1a2e',
  textSoft: '#3d4254',
  midGray: '#9ca5b4',
  darkGray: '#5a6377',
  border: '#dfe3ea',
  borderSoft: '#e8ecf1',
  sand: '#e8dcc0',
  sandSoft: '#f0e6cd',
};

const F = {
  playfair: '"Playfair Display", Georgia, serif',
  pacifico: '"Pacifico", cursive',
  inter: '"Inter", system-ui, sans-serif',
};

// Mock course search
const MOCK_COURSES = [
  'Pebble Ridge Golf Club',
  'Pebble Creek Country Club',
  'Pebblebrook Golf Course',
  'Cypress Pines GC',
  'Cypress Hills Country Club',
  'Meadowbrook Golf & CC',
  'Oak Hollow Municipal',
  'Pine Valley Links',
  'Sunnyside Public Course',
  'Willow Bend GC',
];
const GENDERS = ['Man', 'Woman', 'Non-binary', 'Prefer not to say'];

function ArrowLeft({ color = '#5a6377' }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function ChevronRight({ color = '#fff', size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><polyline points="9,5 17,12 9,19" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function Check({ color = '#fff' }) {
  return <svg width="14" height="14" viewBox="0 0 12 12"><path d="M2 6 L5 9 L10 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>;
}

// Torn paper top-edge SVG
function TornEdge({ top = true }) {
  return (
    <svg width="100%" height="8" viewBox="0 0 320 8" preserveAspectRatio="none" style={{ display: 'block', position: 'absolute', [top ? 'top' : 'bottom']: top ? -1 : -1, left: 0, transform: top ? 'none' : 'scaleY(-1)' }}>
      <path d="M0 0 L0 5 L10 3 L18 6 L28 2 L38 5 L50 3 L60 6 L72 2 L84 5 L96 3 L108 6 L120 2 L132 5 L144 3 L156 6 L168 2 L180 5 L192 3 L204 6 L216 2 L228 5 L240 3 L252 6 L264 2 L276 5 L288 3 L300 6 L310 2 L320 5 L320 0 Z" fill="#faf7f0"/>
    </svg>
  );
}

// Phone chrome (same as before, simplified)
function PhoneChrome({ children, bg = C.creamBg }) {
  return (
    <div style={{
      width: 390, height: 820, borderRadius: 48, overflow: 'hidden',
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
        <span style={{ fontSize: 15, fontWeight: 600, color: '#000', fontFamily: '-apple-system, system-ui' }}>9:41</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="17" height="11" viewBox="0 0 17 11"><g fill="#000"><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="4.5" y="5" width="3" height="6" rx="0.5"/><rect x="9" y="3" width="3" height="8" rx="0.5"/><rect x="13.5" y="1" width="3" height="10" rx="0.5"/></g></svg>
          <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke="#000" fill="none"/><rect x="2" y="2" width="17" height="7" rx="1" fill="#000"/></svg>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 110, height: 32, background: '#000', borderRadius: 20, zIndex: 11 }} />
      {children}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 130, height: 4, borderRadius: 10, background: 'rgba(0,0,0,0.3)', zIndex: 50,
      }} />
    </div>
  );
}


// ── Row component for the scorecard ──────────────────────────

function ScoreRow({ n, label, children, active, onClick }) {
  const filled = !!children && children !== '—' && children !== '';
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'baseline',
        padding: '13px 4px',
        borderBottom: `1px dashed ${C.sand}`,
        gap: 10, cursor: 'pointer',
        background: active ? 'rgba(58,125,68,0.04)' : 'transparent',
        marginLeft: -4, marginRight: -4, paddingLeft: 8, paddingRight: 8,
        borderRadius: active ? 6 : 0,
        transition: 'background 120ms',
      }}
    >
      <span style={{
        fontFamily: F.inter, fontSize: 9, fontWeight: 700,
        color: filled ? C.green : C.midGray,
        width: 16, letterSpacing: 0.5,
      }}>
        {n}
      </span>
      <span style={{
        fontFamily: F.inter, fontSize: 10, fontWeight: 700,
        color: C.darkGray, letterSpacing: 1.8, width: 78,
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
      <span style={{
        flex: 1, fontFamily: F.playfair, fontSize: 17,
        color: filled ? C.text : C.midGray,
        fontWeight: filled ? 500 : 400,
        fontStyle: filled ? 'normal' : 'italic',
        borderBottom: `1px solid ${C.sand}`, paddingBottom: 3,
        minHeight: 22, letterSpacing: -0.2,
      }}>
        {filled ? children : '—'}
      </span>
    </div>
  );
}


// ── Individual field editors (shown beneath card) ────────────

function FieldEditor({ field, state, setState, onDone }) {
  const input = React.useRef(null);
  React.useEffect(() => { input.current?.focus(); }, [field]);

  if (field === 'name') {
    return (
      <EditorShell title="What's your name?" hint="First name only. Last names are earned on the 19th hole." onDone={onDone} canContinue={!!state.name.trim()}>
        <input
          ref={input}
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value.slice(0, 20) })}
          onKeyDown={(e) => e.key === 'Enter' && state.name.trim() && onDone()}
          placeholder="Your first name"
          style={editorInputStyle(F.playfair, 24)}
        />
      </EditorShell>
    );
  }
  if (field === 'age') {
    return (
      <EditorShell title="How old?" hint="21+ only. We'll send you a birthday eagle emoji." onDone={onDone} canContinue={state.age && +state.age >= 18 && +state.age <= 99}>
        <input
          ref={input}
          value={state.age}
          onChange={(e) => setState({ ...state, age: e.target.value.replace(/\D/g, '').slice(0, 2) })}
          onKeyDown={(e) => e.key === 'Enter' && state.age && onDone()}
          placeholder="—"
          inputMode="numeric"
          style={editorInputStyle(F.inter, 32, 300)}
        />
      </EditorShell>
    );
  }
  if (field === 'gender') {
    return (
      <EditorShell title="You are a…" onDone={onDone} canContinue={!!state.gender}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
          {GENDERS.map((g) => {
            const active = state.gender === g;
            return (
              <button
                key={g}
                onClick={() => { setState({ ...state, gender: g }); setTimeout(onDone, 180); }}
                style={{
                  padding: '10px 16px', borderRadius: 22,
                  background: active ? C.green : 'transparent',
                  border: `1.5px solid ${active ? C.green : C.border}`,
                  fontFamily: F.playfair, fontSize: 15, fontWeight: active ? 600 : 400,
                  color: active ? '#fff' : C.textSoft, cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >{g}</button>
            );
          })}
        </div>
      </EditorShell>
    );
  }
  if (field === 'handicap') {
    const canContinue = state.handicap !== '' || state.handicapUnknown;
    return (
      <EditorShell
        title="What's your handicap?"
        hint="Be honest. We'll find out on the 3rd hole anyway."
        onDone={onDone}
        canContinue={canContinue}
      >
        <input
          ref={input}
          value={state.handicapUnknown ? '' : state.handicap}
          onChange={(e) => setState({ ...state, handicap: e.target.value.replace(/[^0-9.+-]/g, '').slice(0, 4), handicapUnknown: false })}
          onKeyDown={(e) => e.key === 'Enter' && canContinue && onDone()}
          placeholder={state.handicapUnknown ? "New to golf" : "e.g. 14"}
          inputMode="decimal"
          disabled={state.handicapUnknown}
          style={{
            ...editorInputStyle(F.inter, 28, 300),
            color: state.handicapUnknown ? C.midGray : C.text,
            fontStyle: state.handicapUnknown ? 'italic' : 'normal',
          }}
        />
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setState({ ...state, openExplainer: true })}
            style={{
              background: 'transparent', border: 'none', padding: 0,
              fontFamily: F.playfair, fontSize: 13, color: C.green,
              fontStyle: 'italic', cursor: 'pointer',
              textDecoration: 'underline', textDecorationThickness: '1px',
              textUnderlineOffset: 3,
            }}
          >
            How do I determine my handicap?
          </button>
        </div>
      </EditorShell>
    );
  }
  if (field === 'course') {
    const q = state.course;
    const results = q.length >= 2
      ? MOCK_COURSES.filter(c => c.toLowerCase().includes(q.toLowerCase())).slice(0, 4)
      : [];
    const pick = (c) => { setState({ ...state, course: c, courseLocked: true }); };
    return (
      <EditorShell title="Home course?" hint="Where you shoot your best lies." onDone={onDone} canContinue={state.courseLocked}>
        <div style={{ position: 'relative' }}>
          <input
            ref={input}
            value={state.course}
            onChange={(e) => setState({ ...state, course: e.target.value, courseLocked: false })}
            placeholder="Search courses…"
            style={editorInputStyle(F.playfair, 18)}
          />
          {results.length > 0 && !state.courseLocked && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: '#fff', borderRadius: 10, marginTop: 6,
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 5,
            }}>
              {results.map((c) => (
                <div key={c} onClick={() => pick(c)} style={{
                  padding: '10px 14px', fontFamily: F.playfair, fontSize: 14, color: C.text,
                  borderBottom: `1px solid ${C.borderSoft}`, cursor: 'pointer',
                }}>{c}</div>
              ))}
            </div>
          )}
        </div>
        {state.courseLocked && (
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px dashed ${C.sand}` }}>
            <div style={{
              fontFamily: F.inter, fontSize: 10, fontWeight: 700,
              color: C.darkGray, letterSpacing: 1.8, marginBottom: 10,
            }}>
              I'M A…
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { k: true,  label: 'Member' },
                { k: false, label: 'Regular guest' },
              ].map(o => {
                const sel = state.courseMember === o.k;
                return (
                  <button key={String(o.k)}
                    onClick={() => setState({ ...state, courseMember: o.k })}
                    style={{
                      flex: 1, padding: '10px 12px', borderRadius: 10,
                      border: `1.5px solid ${sel ? C.green : C.borderSoft}`,
                      background: sel ? 'rgba(58,125,68,0.08)' : '#fff',
                      fontFamily: F.playfair, fontSize: 14, fontWeight: sel ? 600 : 500,
                      color: sel ? C.green : C.text, cursor: 'pointer',
                      transition: 'all 120ms',
                    }}>
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </EditorShell>
    );
  }
  return null;
}

function editorInputStyle(family, fontSize, weight = 500) {
  return {
    width: '100%', padding: '10px 0', border: 'none',
    borderBottom: `2px solid ${C.green}`,
    background: 'transparent', outline: 'none',
    fontFamily: family, fontSize, fontWeight: weight,
    color: C.text, letterSpacing: -0.3,
    boxSizing: 'border-box',
  };
}

function EditorShell({ title, hint, children, onDone, canContinue }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '20px 20px 0 0',
      padding: '24px 22px 22px',
      boxShadow: '0 -8px 24px rgba(0,0,0,0.1)',
      animation: 'editorSlide 220ms ease-out',
    }}>
      <style>{`
        @keyframes editorSlide {
          from { transform: translateY(30%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div style={{ fontFamily: F.pacifico, fontSize: 13, color: C.green, marginBottom: 4 }}>
        fill me in
      </div>
      <h3 style={{
        fontFamily: F.playfair, fontSize: 22, fontWeight: 700,
        color: C.text, margin: 0, marginBottom: hint ? 4 : 16, letterSpacing: -0.3,
      }}>{title}</h3>
      {hint && (
        <p style={{
          fontFamily: F.playfair, fontSize: 13, fontStyle: 'italic',
          color: C.midGray, margin: 0, marginBottom: 18, lineHeight: 1.5,
        }}>{hint}</p>
      )}
      <div style={{ marginBottom: 20 }}>{children}</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={canContinue ? onDone : undefined}
          style={{
            padding: '10px 22px', borderRadius: 24,
            background: canContinue ? C.green : C.borderSoft,
            border: 'none', color: canContinue ? '#fff' : C.midGray,
            fontFamily: F.playfair, fontSize: 15, fontWeight: 600,
            cursor: canContinue ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: canContinue ? '0 4px 12px rgba(58,125,68,0.25)' : 'none',
            transition: 'all 150ms',
          }}
        >
          Done
          <Check color={canContinue ? '#fff' : C.midGray} />
        </button>
      </div>
    </div>
  );
}


// ── Main Scorecard screen ─────────────────────────────────────

function ScorecardIntake() {
  const [state, setState] = React.useState({
    name: '', age: '', gender: '',
    handicap: '', handicapUnknown: false,
    course: '', courseLocked: false, courseMember: null,
    openExplainer: false,
  });
  const [activeField, setActiveField] = React.useState('name');
  const [celebrating, setCelebrating] = React.useState(false);

  const handicapDisplay = state.handicapUnknown
    ? 'New to golf'
    : state.handicap;

  const ROWS = [
    { n: '01', label: 'NAME',        key: 'name',     display: state.name },
    { n: '02', label: 'AGE',         key: 'age',      display: state.age },
    { n: '03', label: 'GENDER',      key: 'gender',   display: state.gender },
    { n: '04', label: 'HANDICAP',    key: 'handicap', display: handicapDisplay },
    { n: '05', label: 'HOME COURSE', key: 'course',   display: state.courseLocked ? (
      <span>
        {state.course}
        {state.courseMember !== null && (
          <span style={{
            marginLeft: 8, fontFamily: F.inter, fontSize: 8, fontWeight: 700,
            letterSpacing: 1.5, color: state.courseMember ? C.green : C.darkGray,
            border: `1px solid ${state.courseMember ? C.green : C.borderSoft}`,
            padding: '2px 6px', borderRadius: 3,
            verticalAlign: 2,
          }}>
            {state.courseMember ? 'MEMBER' : 'GUEST'}
          </span>
        )}
      </span>
    ) : '' },
  ];

  const isComplete = ROWS.every(r => !!r.display);

  const advanceTo = (key) => setActiveField(key);

  const onFieldDone = () => {
    const order = ['name', 'age', 'gender', 'handicap', 'course'];
    const idx = order.indexOf(activeField);
    const isFilled = (k) => {
      if (k === 'course') return state.courseLocked;
      if (k === 'handicap') return state.handicap !== '' || state.handicapUnknown;
      return !!state[k];
    };
    for (let i = 1; i <= order.length; i++) {
      const next = order[(idx + i) % order.length];
      if (!isFilled(next)) { setActiveField(next); return; }
    }
    setActiveField(null);
  };

  const submit = () => {
    setCelebrating(true);
  };

  const reset = () => {
    setState({ name: '', age: '', gender: '', handicap: '', handicapUnknown: false, course: '', courseLocked: false, courseMember: null, openExplainer: false });
    setActiveField('name');
    setCelebrating(false);
  };

  return (
    <PhoneChrome>
      {/* header */}
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 5 }}>
        <button style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer' }}>
          <ArrowLeft />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: 2.5 }}>{window.__headerLabel || 'CHECK-IN'}</span>
        </div>
        <div style={{ width: 30, textAlign: 'right' }}>
          <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 600, color: C.midGray }}>
            {ROWS.filter(r => r.display).length}/5
          </span>
        </div>
      </div>

      {/* scorecard paper */}
      <div style={{
        position: 'absolute', top: 96, left: 18, right: 18,
        bottom: activeField ? 'auto' : 120,
        transition: 'bottom 220ms',
      }}>
        <div style={{
          background: C.cream,
          border: `1px solid ${C.sand}`,
          borderRadius: 4,
          padding: '24px 22px 20px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 14px 28px rgba(60,40,20,0.1)',
          position: 'relative',
          fontFamily: F.playfair,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(180,150,100,0.04) 0%, transparent 30%),
            radial-gradient(circle at 80% 70%, rgba(180,150,100,0.04) 0%, transparent 30%)
          `,
        }}>
          <TornEdge top />

          {/* title block */}
          <div style={{ textAlign: 'center', borderBottom: `2px solid ${C.green}`, paddingBottom: 14, marginBottom: 6 }}>
            <div style={{ fontFamily: F.pacifico, fontSize: 28, color: C.green, lineHeight: 1, marginBottom: 4 }}>
              Scramble
            </div>
            <div style={{ fontFamily: F.playfair, fontSize: 10, letterSpacing: 3, color: C.darkGray, fontWeight: 600, textTransform: 'uppercase' }}>
              Player Card · Round 1
            </div>
          </div>

          {/* rows */}
          <div style={{ paddingTop: 2 }}>
            {ROWS.map((r) => (
              <ScoreRow
                key={r.key}
                n={r.n}
                label={r.label}
                active={activeField === r.key}
                onClick={() => advanceTo(r.key)}
              >
                {r.display}
              </ScoreRow>
            ))}
          </div>

          {/* signature block */}
          <div style={{ marginTop: 18, paddingTop: 4 }}>
            <div style={{
              minHeight: 40, display: 'flex', alignItems: 'flex-end',
              paddingLeft: 10, paddingBottom: 2,
            }}>
              <span style={{
                fontFamily: F.pacifico,
                fontSize: state.name ? 26 : 20,
                color: state.name ? C.text : 'rgba(0,0,0,0.15)',
                transform: 'rotate(-4deg)',
                transformOrigin: 'left bottom',
                transition: 'all 200ms',
                letterSpacing: 0.5,
                whiteSpace: 'nowrap',
              }}>
                {state.name || 'your signature'}
              </span>
            </div>
            <div style={{ borderTop: `1px solid ${C.darkGray}`, paddingTop: 5 }}>
              <div style={{
                fontFamily: F.inter, fontSize: 9, fontWeight: 600,
                color: C.midGray, letterSpacing: 1.5, textTransform: 'uppercase',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span>Signature — let's tee it up</span>
                {state.name && (
                  <span style={{ fontFamily: F.pacifico, fontSize: 11, color: C.green, textTransform: 'none', letterSpacing: 0 }}>
                    ✓ signed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* sticky CTA when no editor open */}
      {!activeField && !celebrating && (
        <div style={{
          position: 'absolute', bottom: 32, left: 20, right: 20, zIndex: 8,
        }}>
          <button
            onClick={isComplete ? submit : () => advanceTo(ROWS.find(r => !r.display)?.key || 'name')}
            style={{
              width: '100%', padding: '16px', borderRadius: 30,
              background: isComplete ? C.green : C.borderSoft,
              border: 'none',
              color: isComplete ? '#fff' : C.darkGray,
              fontFamily: F.playfair, fontSize: 16, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer',
              boxShadow: isComplete ? '0 8px 20px rgba(58,125,68,0.3)' : 'none',
              transition: 'all 200ms',
            }}
          >
            {isComplete ? (
              <>Tee it up <ChevronRight size={16} /></>
            ) : (
              <>Next: {ROWS.find(r => !r.display)?.label.toLowerCase()}</>
            )}
          </button>
        </div>
      )}

      {/* field editor sheet */}
      {activeField && !celebrating && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }}>
          <FieldEditor
            field={activeField}
            state={state}
            setState={setState}
            onDone={onFieldDone}
          />
        </div>
      )}

      {/* celebration overlay */}
      {celebrating && <Celebration state={state} onReset={reset} />}

      {/* handicap explainer screen */}
      {state.openExplainer && (
        <HandicapExplainer
          state={state}
          setState={setState}
          onClose={() => setState({ ...state, openExplainer: false })}
        />
      )}
    </PhoneChrome>
  );
}


// ── Handicap explainer screen ─────────────────────────────────

function HandicapExplainer({ state, setState, onClose }) {
  const [shoot18, setShoot18] = React.useState(state.shoot18 || '');
  const [newGolfer, setNewGolfer] = React.useState(state.handicapUnknown);

  const save = () => {
    if (newGolfer) {
      setState({ ...state, handicapUnknown: true, handicap: '', shoot18: '', openExplainer: false });
    } else if (shoot18) {
      // rough estimate: handicap ≈ shoot18 - 72 (course rating)
      const est = Math.max(0, Math.min(36, Math.round(+shoot18 - 72)));
      setState({ ...state, handicap: String(est), handicapUnknown: false, shoot18, openExplainer: false });
    } else {
      onClose();
    }
  };

  const canSave = newGolfer || (shoot18 && +shoot18 >= 60 && +shoot18 <= 150);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30, background: '#fff',
      animation: 'slideUp 260ms ease-out',
      display: 'flex', flexDirection: 'column',
      fontFamily: F.playfair, overflow: 'hidden',
    }}>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>

      {/* header */}
      <div style={{ padding: '60px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#5a6377" strokeWidth="2.2" strokeLinecap="round"/></svg>
        </button>
        <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: 2.5 }}>HELP</span>
        <div style={{ width: 30 }} />
      </div>

      {/* body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 28px' }}>
        <div style={{ fontFamily: F.pacifico, fontSize: 16, color: C.green, marginBottom: 6 }}>
          a quick primer
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: C.text, margin: 0, marginBottom: 14, letterSpacing: -0.4, lineHeight: 1.15 }}>
          What's a handicap?
        </h2>
        <p style={{ fontSize: 15, color: C.darkGray, lineHeight: 1.6, margin: 0, marginBottom: 16 }}>
          It's a number that represents how many strokes over par you typically shoot. A scratch golfer is <span style={{ fontFamily: F.inter, fontWeight: 600 }}>0</span>; a weekend warrior is usually <span style={{ fontFamily: F.inter, fontWeight: 600 }}>15–25</span>.
        </p>

        <div style={{ background: C.greenLight, borderRadius: 10, padding: '14px 16px', marginBottom: 22 }}>
          <div style={{ fontFamily: F.inter, fontSize: 10, fontWeight: 700, color: C.green, letterSpacing: 1.8, marginBottom: 6 }}>
            THE MATH (ROUGHLY)
          </div>
          <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>
            Take your best few 18-hole scores, subtract the course rating (usually ~72), average them. That's your handicap index.
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.borderSoft}`, paddingTop: 22 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0, marginBottom: 10, letterSpacing: -0.2 }}>
            Don't know yours? No sweat.
          </h3>
          <p style={{ fontSize: 13, color: C.midGray, fontStyle: 'italic', margin: 0, marginBottom: 16, lineHeight: 1.5 }}>
            Tell us roughly what you shoot on 18 and we'll estimate it for you.
          </p>

          {/* shoot18 input */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 600, color: C.darkGray, letterSpacing: 1.2, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              I usually shoot
            </label>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <input
                value={shoot18}
                onChange={(e) => { setShoot18(e.target.value.replace(/\D/g, '').slice(0, 3)); setNewGolfer(false); }}
                placeholder="e.g. 95"
                inputMode="numeric"
                disabled={newGolfer}
                style={{
                  ...editorInputStyle(F.inter, 26, 400),
                  flex: 1,
                  color: newGolfer ? C.midGray : C.text,
                  borderBottomColor: newGolfer ? C.border : C.green,
                }}
              />
              <span style={{ fontFamily: F.playfair, fontSize: 14, color: C.midGray, fontStyle: 'italic' }}>on 18 holes</span>
            </div>
            {shoot18 && !newGolfer && +shoot18 >= 60 && +shoot18 <= 150 && (
              <div style={{ marginTop: 10, fontFamily: F.playfair, fontSize: 13, color: C.green, fontStyle: 'italic' }}>
                ≈ handicap of <strong style={{ fontStyle: 'normal' }}>{Math.max(0, Math.min(36, Math.round(+shoot18 - 72)))}</strong>
              </div>
            )}
          </div>

          {/* new golfer checkbox */}
          <button
            onClick={() => { setNewGolfer(!newGolfer); if (!newGolfer) setShoot18(''); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              background: newGolfer ? C.greenLight : 'transparent',
              border: `1.5px solid ${newGolfer ? C.green : C.border}`,
              borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
              textAlign: 'left', transition: 'all 150ms',
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: 4,
              background: newGolfer ? C.green : 'transparent',
              border: `1.5px solid ${newGolfer ? C.green : C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {newGolfer && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6 L5 9 L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>}
            </div>
            <div>
              <div style={{ fontFamily: F.playfair, fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 2 }}>
                I don't know — I'm new
              </div>
              <div style={{ fontFamily: F.playfair, fontSize: 12, color: C.midGray, fontStyle: 'italic' }}>
                New to golf, or haven't really played
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* footer */}
      <div style={{ padding: '14px 20px 34px', borderTop: `1px solid ${C.borderSoft}`, background: '#fff' }}>
        <button
          onClick={canSave ? save : undefined}
          style={{
            width: '100%', padding: '15px', borderRadius: 28,
            background: canSave ? C.green : C.borderSoft,
            border: 'none', color: canSave ? '#fff' : C.midGray,
            fontFamily: F.playfair, fontSize: 16, fontWeight: 600,
            cursor: canSave ? 'pointer' : 'default',
            boxShadow: canSave ? '0 6px 16px rgba(58,125,68,0.25)' : 'none',
          }}
        >
          {newGolfer ? 'Got it' : canSave ? 'Use this' : 'Save'}
        </button>
      </div>
    </div>
  );
}


function Celebration({ state, onReset }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20,
      background: 'rgba(26,26,46,0.92)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 40,
      animation: 'fadeIn 300ms ease-out',
      backdropFilter: 'blur(8px)',
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pop { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
      <div style={{
        animation: 'pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 100ms both',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>⛳️</div>
        <div style={{ fontFamily: F.pacifico, fontSize: 28, color: '#fff', marginBottom: 8 }}>
          You're in, {state.name}
        </div>
        <div style={{ fontFamily: F.playfair, fontSize: 15, color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', maxWidth: 280, lineHeight: 1.5, margin: '0 auto 28px' }}>
          Card signed. Let's find your foursome.
        </div>
        <button onClick={onReset} style={{
          padding: '12px 28px', borderRadius: 24,
          background: 'transparent', border: '1.5px solid rgba(255,255,255,0.4)',
          color: '#fff', fontFamily: F.playfair, fontSize: 14, cursor: 'pointer',
        }}>
          Reset demo
        </button>
      </div>
    </div>
  );
}


Object.assign(window, { ScorecardIntake, C, F });
