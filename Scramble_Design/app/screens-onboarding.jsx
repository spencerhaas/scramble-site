// Onboarding + intake screens:
// Home / splash, Phone input, OTP verification, GPS permission

// Minimal editorial golf-green illustration
// Composition (based on a real course photo): dawn sky, layered rolling hills
// with a fall-color tree line, a pond curving through the middle-right, white
// bunker ribbon on the left, big foreground green with a pin + red flag on the right.
function GolfGreenHero({ height = 500 }) {
  return (
    <svg width="100%" height={height} viewBox="0 0 390 620" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <defs>
        {/* dawn sky */}
        <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8d9b8"/>
          <stop offset="0.35" stopColor="#f3cfa8"/>
          <stop offset="0.75" stopColor="#e9c69c"/>
          <stop offset="1" stopColor="#d7b994"/>
        </linearGradient>
        {/* far hills — hazy blue-green */}
        <linearGradient id="farHills" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a9a8f"/>
          <stop offset="1" stopColor="#6e8478"/>
        </linearGradient>
        {/* fall tree line — warm oranges/golds */}
        <linearGradient id="treeRow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c7884a"/>
          <stop offset="0.5" stopColor="#a67336"/>
          <stop offset="1" stopColor="#6b5228"/>
        </linearGradient>
        {/* mid fairway — warm tawny with green ribbons */}
        <linearGradient id="midFw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b8a06a"/>
          <stop offset="1" stopColor="#8e8450"/>
        </linearGradient>
        {/* big foreground green */}
        <linearGradient id="fgGreen2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6aa65a"/>
          <stop offset="0.5" stopColor="#4e8c46"/>
          <stop offset="1" stopColor="#2f6a33"/>
        </linearGradient>
        {/* pond — sky reflection, warm orange at top, cool below */}
        <linearGradient id="pond" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0c59a"/>
          <stop offset="0.35" stopColor="#dcb38a"/>
          <stop offset="1" stopColor="#a98a6a"/>
        </linearGradient>
        {/* mow stripes */}
        <pattern id="mow2" x="0" y="0" width="80" height="30" patternUnits="userSpaceOnUse">
          <rect width="80" height="30" fill="transparent"/>
          <rect x="0" y="0" width="40" height="30" fill="rgba(0,0,0,0.05)"/>
        </pattern>
        {/* soft sun glow */}
        <radialGradient id="sunGlow" cx="0.35" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#fff3dc" stopOpacity="0.8"/>
          <stop offset="1" stopColor="#fff3dc" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* ─── SKY ─── */}
      <rect width="390" height="280" fill="url(#sky2)"/>
      <ellipse cx="140" cy="200" rx="220" ry="140" fill="url(#sunGlow)"/>

      {/* faint distant ridges */}
      <path d="M0 210 Q 40 200 80 208 Q 120 195 160 210 Q 200 220 240 212 Q 280 202 320 214 Q 360 220 390 210 L 390 240 L 0 240 Z" fill="#9eaea4" opacity="0.55"/>

      {/* ─── MID HILLS w/ fall-color tree line ─── */}
      <path d="M0 250 Q 40 236 90 244 Q 140 228 190 242 Q 245 225 300 238 Q 345 226 390 240 L 390 280 L 0 280 Z" fill="url(#farHills)"/>

      {/* tree-line band: hill silhouette topped by rounded tree crowns */}
      <g>
        {/* dark hill base */}
        <path d="M0 268 Q 50 250 100 262 Q 150 240 210 254 Q 270 244 320 256 Q 360 248 390 258 L 390 290 L 0 290 Z" fill="#5e7a5f"/>
        {/* rounded crown blobs — fall trees */}
        <g fill="url(#treeRow)">
          {[[18,255,14],[40,250,16],[64,252,13],[86,248,15],[112,256,14],[138,250,16],[168,246,14],[196,252,13],[224,248,15],[250,252,12],[276,246,14],[302,252,13],[330,248,15],[358,254,13],[380,250,14]].map(([x,y,r],i)=>(
            <circle key={i} cx={x} cy={y} r={r}/>
          ))}
        </g>
        {/* some greener pines poking through */}
        <g fill="#3d5e3f">
          {[[32,252,9],[78,248,10],[150,245,9],[212,250,8],[268,246,10],[344,248,9]].map(([x,y,r],i)=>(
            <circle key={i} cx={x} cy={y} r={r}/>
          ))}
        </g>
        {/* a couple of tall standalone trees in front */}
        <ellipse cx="110" cy="268" rx="12" ry="18" fill="#b57a3a"/>
        <ellipse cx="225" cy="270" rx="10" ry="16" fill="#4d6b3f"/>
        <ellipse cx="260" cy="270" rx="9" ry="15" fill="#8a6a35"/>
      </g>

      {/* ─── MID FAIRWAY band ─── */}
      <path d="M0 284 Q 100 274 200 282 Q 300 290 390 280 L 390 340 L 0 340 Z" fill="url(#midFw)"/>
      {/* stripe of tawny rough */}
      <path d="M0 310 Q 100 302 200 310 Q 300 318 390 306 L 390 335 L 0 335 Z" fill="#8a7a46" opacity="0.55"/>

      {/* ─── POND — curves through, reflecting sky ─── */}
      <path d="M180 315 Q 230 310 290 320 Q 360 328 390 322 L 390 395 Q 360 410 300 400 Q 240 392 200 380 Q 170 362 180 315 Z"
            fill="url(#pond)"/>
      {/* pond edge shimmer */}
      <path d="M195 325 Q 245 322 310 332" stroke="#ffe6c9" strokeWidth="0.8" fill="none" opacity="0.7"/>
      <path d="M220 350 Q 270 348 325 355" stroke="#fff" strokeWidth="0.6" fill="none" opacity="0.4"/>
      {/* reeds on the right edge */}
      <g stroke="#5a6b2c" strokeWidth="1" strokeLinecap="round">
        <line x1="378" y1="385" x2="375" y2="372"/>
        <line x1="383" y1="388" x2="382" y2="374"/>
        <line x1="386" y1="382" x2="388" y2="370"/>
      </g>

      {/* ─── LEFT FAIRWAY ARM + BUNKER RIBBON ─── */}
      <path d="M0 340 Q 60 325 140 335 Q 180 345 180 380 Q 170 420 100 440 Q 40 455 0 450 Z" fill="#6e9a52"/>
      {/* bunker ribbon — white sand curving */}
      <path d="M0 420 Q 50 395 110 402 Q 145 408 175 430 Q 150 442 125 438 Q 100 435 70 448 Q 40 455 10 455 Z"
            fill="#f3e7c8"/>
      <path d="M20 430 Q 60 415 110 420 Q 140 424 160 438" stroke="#d8c89a" strokeWidth="1" fill="none" opacity="0.6"/>
      {/* smaller bunker pocket */}
      <ellipse cx="155" cy="445" rx="20" ry="7" fill="#f3e7c8"/>

      {/* ─── BIG FOREGROUND GREEN ─── */}
      <path d="M0 450 L 390 400 L 390 620 L 0 620 Z" fill="url(#fgGreen2)"/>
      {/* mow lines on the green */}
      <g opacity="0.5">
        <path d="M0 470 L 390 425" stroke="#437a3c" strokeWidth="10" fill="none"/>
        <path d="M0 500 L 390 460" stroke="#4e8848" strokeWidth="14" fill="none"/>
        <path d="M0 540 L 390 500" stroke="#437a3c" strokeWidth="16" fill="none"/>
        <path d="M0 585 L 390 550" stroke="#4e8848" strokeWidth="18" fill="none"/>
      </g>
      {/* subtle curve shadow on the left (depth) */}
      <path d="M0 450 Q 80 460 140 455 Q 140 490 100 520 Q 40 540 0 550 Z" fill="#2f5a33" opacity="0.25"/>

      {/* ─── PIN + RED FLAG (right side, matches photo composition) ─── */}
      {/* cup shadow */}
      <ellipse cx="292" cy="488" rx="8" ry="2.5" fill="#1a2e1f" opacity="0.35"/>
      {/* pin */}
      <line x1="292" y1="486" x2="292" y2="345" stroke="#f4ead0" strokeWidth="1.8" strokeLinecap="round"/>
      {/* triangular flag */}
      <path d="M292 348 L 332 355 L 328 373 L 292 378 Z" fill="#c23a2e"/>
      <path d="M292 350 L 328 357 L 325 372 L 292 376 Z" fill="#9a2a21" opacity="0.5"/>
      {/* cup */}
      <ellipse cx="292" cy="489" rx="4.5" ry="1.8" fill="#111"/>
      <ellipse cx="292" cy="488" rx="4.5" ry="1.5" fill="#222"/>
    </svg>
  );
}

function HomeScreen() {
  return (
    <PhoneChrome bg="#1a1a1a" statusColor="#fff">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* Full-bleed photo — fills the entire phone */}
        <img src="app/home-hero.png" alt=""
             style={{
               position: 'absolute', inset: 0,
               width: '100%', height: '100%', objectFit: 'cover',
               objectPosition: '50% 40%', display: 'block',
             }}/>

        {/* Subtle dark wash overall so whites read crisply */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.35) 100%)',
        }}/>

        {/* Stacked content column */}
        <div style={{
          position: 'absolute', inset: 0, padding: '0 36px 40px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          color: '#fff', textAlign: 'center',
        }}>
          {/* Top spacer — roughly centers logo block vertically on screen */}
          <div style={{ height: 260 }}/>

          {/* Cart logo */}
          <img src="app/logo.png" alt=""
               style={{
                 width: 320, height: 'auto', display: 'block',
                 filter: 'brightness(0) invert(1) drop-shadow(0 4px 12px rgba(0,0,0,0.45))',
               }}/>

          {/* Pacifico wordmark */}
          <div style={{
            fontFamily: S_F.pacifico, fontSize: 54, color: '#fff',
            lineHeight: 1, marginTop: 4,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}>
            Scramble
          </div>

          {/* Tagline */}
          <div style={{
            fontFamily: S_F.inter, fontSize: 17, color: '#fff',
            fontWeight: 400, marginTop: 14, letterSpacing: 0.2,
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}>
            Find your golf crew
          </div>

          {/* spacer before CTAs */}
          <div style={{ flex: 1 }}/>

          {/* Ghost Create Account button */}
          <button style={{
            width: '100%', padding: '15px', borderRadius: 28,
            background: 'rgba(0,0,0,0.18)',
            color: '#fff', border: '1.5px solid rgba(255,255,255,0.9)',
            backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
            fontFamily: S_F.playfair, fontSize: 16, fontWeight: 600,
            cursor: 'pointer',
          }}>
            Create Account
          </button>

          <div style={{
            fontFamily: S_F.playfair, fontSize: 15, color: '#fff',
            marginTop: 14, cursor: 'pointer',
            textShadow: '0 2px 6px rgba(0,0,0,0.5)',
          }}>
            Sign in
          </div>

          <div style={{
            fontFamily: S_F.inter, fontSize: 11, color: 'rgba(255,255,255,0.85)',
            marginTop: 16, letterSpacing: 0.2, lineHeight: 1.5,
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}>
            By continuing, you agree to our <span style={{ fontWeight: 700 }}>Terms</span> and <span style={{ fontWeight: 700 }}>Privacy Policy</span>
          </div>
        </div>
      </div>
    </PhoneChrome>
  );
}

// Phone entry
function PhoneScreen() {
  const [phone, setPhone] = React.useState('(415) 555 01');
  return (
    <PhoneChrome bg={S_C.creamBg}>
      <AppHeader eyebrow="STEP 1 OF 3" title="What's your number?" left={<button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>{I.back(S_C.darkGray)}</button>}/>
      <div style={{ padding: '30px 24px' }}>
        <div style={{ fontFamily: S_F.playfair, fontStyle: 'italic', fontSize: 14, color: S_C.textSoft, marginBottom: 24, lineHeight: 1.5 }}>
          We'll send a verification code to this number.
        </div>

        {/* Paper "receipt" card for phone */}
        <PaperCard style={{ padding: '24px 22px' }}>
          <Eyebrow>PHONE NUMBER</Eyebrow>
          <DashedDivider margin="10px 0 14px"/>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{ fontFamily: S_F.playfair, fontSize: 26, color: S_C.darkGray }}>+1</div>
            <div style={{
              flex: 1, fontFamily: S_F.playfair, fontSize: 26, color: S_C.text,
              letterSpacing: 0.5, borderBottom: `1.5px dashed ${S_C.sand}`, paddingBottom: 6,
            }}>
              {phone}<span style={{ opacity: 0.4 }}>|</span>
            </div>
          </div>
          <div style={{ marginTop: 14, fontFamily: S_F.inter, fontSize: 11, color: S_C.midGray, letterSpacing: 0.3 }}>
            · U.S. numbers supported
          </div>
        </PaperCard>
      </div>

      {/* Keyboard-like keypad */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, background: '#d7d4cb',
        padding: '8px 4px 30px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6,
      }}>
        {['1','2','3','4','5','6','7','8','9','','0','⌫'].map(k => (
          <button key={k} style={{
            padding: '12px 0', background: k === '' ? 'transparent' : '#fff',
            border: 'none', borderRadius: 6,
            fontSize: 22, fontWeight: 400, fontFamily: '-apple-system, system-ui',
            color: '#000',
            boxShadow: k === '' ? 'none' : '0 1px 0 rgba(0,0,0,0.25)',
            cursor: 'pointer',
          }}>{k}</button>
        ))}
      </div>
    </PhoneChrome>
  );
}

// OTP code entry
function CodeScreen() {
  const code = ['4','2','9','1','','',''];
  return (
    <PhoneChrome bg={S_C.creamBg}>
      <AppHeader eyebrow="STEP 2 OF 3" title="Check your messages" left={<button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>{I.back(S_C.darkGray)}</button>}/>
      <div style={{ padding: '30px 24px' }}>
        <div style={{ fontFamily: S_F.playfair, fontStyle: 'italic', fontSize: 14, color: S_C.textSoft, marginBottom: 30, lineHeight: 1.5 }}>
          We sent a 6-digit code to <strong style={{ color: S_C.text, fontStyle: 'normal' }}>(415) 555-0142</strong>.
        </div>

        {/* Code boxes — scorecard style */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          {code.slice(0, 6).map((d, i) => (
            <div key={i} style={{
              width: 46, height: 58, background: S_C.cream,
              border: `1.5px solid ${d ? S_C.green : S_C.sand}`,
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: S_F.playfair, fontSize: 28, fontWeight: 600, color: S_C.text,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              position: 'relative',
            }}>
              {d}
              {!d && i === 4 && <div style={{ position: 'absolute', bottom: 14, width: 2, height: 22, background: S_C.green, animation: 'blink 1s step-end infinite' }}/>}
            </div>
          ))}
        </div>
        <style>{`@keyframes blink { 50% { opacity: 0 } }`}</style>

        <div style={{ textAlign: 'center', fontFamily: S_F.inter, fontSize: 13, color: S_C.darkGray, marginTop: 10 }}>
          Didn't get it? <span style={{ color: S_C.green, fontWeight: 600, textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 3 }}>Resend in 0:28</span>
        </div>

        {/* Tip card */}
        <div style={{ marginTop: 60, padding: '14px 18px', background: S_C.sandSoft, borderRadius: 8, border: `1px dashed ${S_C.sandDeep}` }}>
          <div style={{ fontFamily: S_F.inter, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: S_C.greenDeep, marginBottom: 4 }}>TIP</div>
          <div style={{ fontFamily: S_F.playfair, fontSize: 13, fontStyle: 'italic', color: S_C.text, lineHeight: 1.5 }}>
            This code expires in 10 minutes. Didn't get it? Check your spam folder or request a new one.
          </div>
        </div>
      </div>
    </PhoneChrome>
  );
}

// GPS permission
function GPSScreen() {
  return (
    <PhoneChrome bg={S_C.creamBg}>
      <AppHeader eyebrow="STEP 3 OF 3" title="Help Scramble find golfers near you" left={<button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>{I.back(S_C.darkGray)}</button>}/>

      {/* GPS placeholder — fills the space above the copy */}
      <div style={{
        position: 'absolute', top: 120, left: 24, right: 24, bottom: 232,
        borderRadius: 12, border: `1px dashed ${S_C.sand}`,
        background: S_C.paper,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: S_C.creamBg, border: `1px solid ${S_C.sand}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={S_C.green} strokeWidth="1.75">
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2" fill={S_C.green}/>
            </svg>
          </div>
          <div style={{ marginTop: 12, fontFamily: S_F.inter, fontSize: 10, letterSpacing: 2, color: S_C.darkGray, opacity: 0.6 }}>
            GPS PREVIEW
          </div>
        </div>
      </div>

      {/* Copy + primary action, anchored to bottom quarter */}
      <div style={{ position: 'absolute', bottom: 40, left: 24, right: 24 }}>
        <div style={{ fontFamily: S_F.playfair, fontSize: 18, fontWeight: 700, color: S_C.text, letterSpacing: -0.3, lineHeight: 1.25, whiteSpace: 'nowrap' }}>
          Turn on location to match with golfers nearby
        </div>
        <div style={{ fontFamily: S_F.playfair, fontStyle: 'italic', fontSize: 13, color: S_C.textSoft, marginTop: 8, marginBottom: 18, lineHeight: 1.5 }}>
          We only use it when you're looking for a group. You can toggle it off anytime in settings.
        </div>
        <PrimaryBtn>Turn on location {I.chev('#fff', 16)}</PrimaryBtn>
        <div style={{ textAlign: 'center', marginTop: 14, fontFamily: S_F.inter, fontSize: 13, color: S_C.darkGray, fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>
          Enter a zip code instead
        </div>
      </div>
    </PhoneChrome>
  );
}

Object.assign(window, { HomeScreen, PhoneScreen, CodeScreen, GPSScreen });
