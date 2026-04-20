// Lineup (browse golfers), Profile detail, Foursome (match group)

// Mock golfer data — characterful bios
const GOLFERS = [
  { id: 1, name: 'Marcus Chen', age: 34, hcp: 8, home: 'Pebble Ridge GC', dist: 2.1, img: 'fairway', bio: "Former college golfer, now D1 dad. Early tee times, solid clip, buys the beers.", play: 'Competitive', pace: 'Quick', prompt: "Best shot ever?", answer: "Hole-in-one on a blind par 3. Nobody believed me until I brought the ball to the bar.", handles: 'Big Slice Energy' },
  { id: 2, name: 'Sarah Patel', age: 29, hcp: 14, home: 'Cypress Pines GC', dist: 3.8, img: 'dogleg', bio: "Weekend warrior. Brings dad jokes and extra sunscreen. No mulligans after the 3rd hole.", play: 'Casual', pace: 'Average', prompt: "Favorite course snack?", answer: "Halfway-house cheeseburger, no lettuce. Fight me.", handles: 'Putts & Giggles' },
  { id: 3, name: 'Diego Ramirez', age: 41, hcp: 3, home: 'Oak Hollow Muni', dist: 5.2, img: 'green', bio: "Scratch-ish. Plays 3x a week. Will teach you how to read a green without being a jerk about it.", play: 'Competitive', pace: 'Quick', prompt: "Drink of choice on 19?", answer: "Old fashioned. But I'll do a light beer on the back nine.", handles: 'D. Ram' },
  { id: 4, name: 'Jamie Wu', age: 27, hcp: 22, home: 'Sunnyside Public', dist: 1.4, img: 'links', bio: "Just picked it up last year. Hitting 'em pure on Tuesdays, topping everything on Saturdays.", play: 'Casual', pace: 'Slower', prompt: "Learning to…", answer: "stop aiming at the pin when I should aim at the center of the green. Working on it.", handles: 'Fairway Newcomer' },
  { id: 5, name: 'Tom "Hollywood" O\'Brien', age: 52, hcp: 11, home: 'Meadowbrook G&CC', dist: 4.0, img: 'tee', bio: "Retired, plays every morning, tells the same story on every tee box. You'll love it by the 9th time.", play: 'Casual', pace: 'Average', prompt: "Biggest golf lie?", answer: "I only slice because of wind.", handles: 'Hollywood' },
  { id: 6, name: 'Priya Okafor', age: 31, hcp: 18, home: 'Willow Bend GC', dist: 7.8, img: 'island', bio: "Golf + negroni + good music. Happy to host you at Willow if you can putt.", play: 'Casual', pace: 'Average', prompt: "First tee ritual?", answer: "Deep breath. Short waggle. Hit and hope.", handles: 'Priya O' },
];

function LineupScreen({ onOpenGolfer, onTab }) {
  return (
    <PhoneChrome bg={S_C.creamBg}>
      <AppHeader
        eyebrow="THIS WEEK'S MATCHES"
        title="Your foursome, curated"
        left={<ScrambleLogo size={24}/>}
      />

      {/* Week context line */}
      <div style={{
        padding: '14px 20px 10px',
        fontFamily: S_F.playfair, fontStyle: 'italic', fontSize: 13,
        color: S_C.textSoft, lineHeight: 1.5,
      }}>
        Three golfers near you, matched on handicap. Tap in, say hello, lock in the tee time.
      </div>

      {/* Scroll list */}
      <div style={{ position: 'absolute', top: 160, bottom: 84, left: 0, right: 0, overflowY: 'auto', padding: '4px 16px 20px' }}>
        {GOLFERS.slice(0, 3).map((g, i) => (
          <div key={g.id} onClick={() => onOpenGolfer(g)} style={{
            background: S_C.cream,
            border: `1px solid ${S_C.sand}`,
            borderRadius: 8,
            marginBottom: 12,
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(60,40,20,0.06)',
          }}>
            {/* Course illustration header */}
            <div style={{ height: 100, position: 'relative', borderBottom: `1px dashed ${S_C.sand}` }}>
              <CourseIllustration variant={`match-${i}`} height={100}/>
              <div style={{
                position: 'absolute', top: 8, right: 10,
                background: S_C.cream, borderRadius: 4, padding: '3px 8px',
                fontFamily: S_F.inter, fontSize: 9, fontWeight: 700, letterSpacing: 1.3, color: S_C.greenDeep,
                border: `1px solid ${S_C.sand}`,
              }}>
                {g.home.split(' ').slice(0, 2).join(' ').toUpperCase()}
              </div>
            </div>
            {/* Scorecard-style row */}
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={g.name} size={44}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontFamily: S_F.playfair, fontSize: 16, fontWeight: 600, color: S_C.text }}>{g.name}</div>
                </div>
                <div style={{ fontFamily: S_F.inter, fontSize: 11, color: S_C.darkGray, marginTop: 2 }}>
                  Age {g.age} · {g.play} · {g.pace} pace
                </div>
              </div>
              {/* Handicap scorecard box */}
              <div style={{
                width: 46, padding: '4px 0', textAlign: 'center',
                border: `1.5px solid ${S_C.sand}`, borderRadius: 4,
                background: S_C.paper,
              }}>
                <div style={{ fontFamily: S_F.inter, fontSize: 8, fontWeight: 700, letterSpacing: 1.2, color: S_C.darkGray }}>HCP</div>
                <div style={{ fontFamily: S_F.playfair, fontSize: 18, fontWeight: 700, color: S_C.green, lineHeight: 1 }}>{g.hcp}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TabBar active="lineup" onTab={onTab}/>
    </PhoneChrome>
  );
}


// Golfer Profile Detail
function GolferScreen({ golfer, onBack, onMessage }) {
  const [liked, setLiked] = React.useState(false);
  const g = golfer || GOLFERS[0];
  return (
    <PhoneChrome bg={S_C.creamBg}>
      {/* Hero course illustration */}
      <div style={{ height: 260, position: 'relative' }}>
        <CourseIllustration variant={g.img} height={260}/>
        {/* overlay top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, padding: '50px 20px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button onClick={onBack} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,253,247,0.92)', border: `1px solid ${S_C.sand}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>{I.back(S_C.text)}</button>
          <button onClick={() => setLiked(!liked)} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,253,247,0.92)', border: `1px solid ${S_C.sand}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>{I.heart(liked ? S_C.red : S_C.text, 18, liked ? S_C.red : 'none')}</button>
        </div>
        {/* course chip */}
        <div style={{
          position: 'absolute', bottom: 14, left: 20,
          background: S_C.cream, borderRadius: 4, padding: '4px 10px',
          fontFamily: S_F.inter, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: S_C.greenDeep,
          border: `1px solid ${S_C.sand}`,
        }}>
          {g.home.toUpperCase()}
        </div>
      </div>

      {/* Scorecard body */}
      <div style={{
        position: 'absolute', top: 228, left: 0, right: 0, bottom: 0,
        background: S_C.cream,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '22px 20px 100px',
        overflowY: 'auto',
      }}>
        {/* Name row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <Avatar name={g.name} size={64}/>
          <div style={{ flex: 1, paddingTop: 4 }}>
            <div style={{ fontFamily: S_F.playfair, fontSize: 24, fontWeight: 700, color: S_C.text, letterSpacing: -0.3, lineHeight: 1.15 }}>
              {g.name}
            </div>
            <div style={{ fontFamily: S_F.inter, fontSize: 12, color: S_C.darkGray, marginTop: 4, letterSpacing: 0.3 }}>
              @{g.handles.toLowerCase().replace(/\s+/g, '_')}
            </div>
          </div>
        </div>

        {/* Scorecard strip */}
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: S_C.sand, border: `1px solid ${S_C.sand}`, borderRadius: 6, overflow: 'hidden' }}>
          {[
            ['AGE', g.age],
            ['HCP', g.hcp],
            ['STYLE', g.play.slice(0, 4).toUpperCase()],
            ['PACE', g.pace.toUpperCase()],
          ].map(([k, v]) => (
            <div key={k} style={{ background: S_C.paper, padding: '10px 4px', textAlign: 'center' }}>
              <div style={{ fontFamily: S_F.inter, fontSize: 8, fontWeight: 700, letterSpacing: 1.2, color: S_C.darkGray, marginBottom: 2 }}>{k}</div>
              <div style={{ fontFamily: S_F.playfair, fontSize: 18, fontWeight: 700, color: S_C.green }}>{v}</div>
            </div>
          ))}
        </div>

        {/* About */}
        <div style={{ marginTop: 22 }}>
          <Eyebrow>ABOUT</Eyebrow>
          <DashedDivider margin="8px 0 12px"/>
          <div style={{ fontFamily: S_F.playfair, fontSize: 15, lineHeight: 1.5, color: S_C.textSoft, fontStyle: 'italic' }}>
            "{g.bio}"
          </div>
        </div>

        {/* Prompt / Answer */}
        <div style={{ marginTop: 20 }}>
          <Eyebrow>{g.prompt.toUpperCase()}</Eyebrow>
          <DashedDivider margin="8px 0 12px"/>
          <div style={{
            fontFamily: S_F.playfair, fontStyle: 'italic', fontSize: 15, color: S_C.text, lineHeight: 1.5,
            padding: '0 4px',
          }}>
            "{g.answer}"
          </div>
        </div>

        {/* Availability card */}
        <div style={{ marginTop: 22, padding: '14px 16px', background: S_C.greenLight, borderRadius: 6, border: `1px solid ${S_C.fairway}` }}>
          <div style={{ fontFamily: S_F.inter, fontSize: 10, fontWeight: 700, letterSpacing: 2, color: S_C.greenDeep }}>NEXT TEE TIME</div>
          <div style={{ fontFamily: S_F.playfair, fontSize: 17, fontWeight: 600, color: S_C.text, marginTop: 4 }}>
            Saturday · 8:14 AM · {g.home}
          </div>
          <div style={{ fontFamily: S_F.inter, fontSize: 11, color: S_C.darkGray, marginTop: 2 }}>
            Looking for 2 more · $42 cart + green
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 20px 30px',
        background: S_C.cream, borderTop: `1px dashed ${S_C.sand}`,
        display: 'flex', gap: 10,
      }}>
        <button onClick={onMessage} style={{
          flex: '0 0 auto', padding: '14px 18px', borderRadius: 28,
          background: 'transparent', color: S_C.green,
          border: `1.5px solid ${S_C.green}`, cursor: 'pointer',
          fontFamily: S_F.playfair, fontSize: 15, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>{I.chat(S_C.green, 18)} Say hi</button>
        <PrimaryBtn style={{ flex: 1 }}>Request tee time {I.chev('#fff', 16)}</PrimaryBtn>
      </div>
    </PhoneChrome>
  );
}


// Foursome — confirmed match/group
function FoursomeScreen({ onTab }) {
  const four = [GOLFERS[0], GOLFERS[1], GOLFERS[2], { name: 'You', hcp: 15, home: '', img: '' }];
  return (
    <PhoneChrome bg={S_C.creamBg}>
      <AppHeader eyebrow="THE FOURSOME" title="Saturday · 8:14 AM" left={<ScrambleLogo size={24}/>} right={<button style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>{I.bell(S_C.darkGray, 20)}</button>}/>

      <div style={{ position: 'absolute', top: 146, bottom: 84, left: 0, right: 0, overflowY: 'auto', padding: '14px 16px 20px' }}>
        {/* Course hero */}
        <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${S_C.sand}`, position: 'relative', marginBottom: 16 }}>
          <CourseIllustration variant="fairway" height={140}/>
          <div style={{ padding: '12px 14px', background: S_C.cream, borderTop: `1px dashed ${S_C.sand}` }}>
            <div style={{ fontFamily: S_F.playfair, fontSize: 17, fontWeight: 700, color: S_C.text }}>Pebble Ridge Golf Club</div>
            <div style={{ fontFamily: S_F.inter, fontSize: 11, color: S_C.darkGray, marginTop: 3 }}>
              1800 Oceanview Dr · 18 holes, par 72 · Walking ok
            </div>
          </div>
        </div>

        {/* Scorecard header for foursome */}
        <Eyebrow align="center">THE CARD</Eyebrow>
        <DashedDivider margin="6px 0 0"/>

        <PaperCard style={{ marginTop: 12, padding: '4px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 48px 48px', padding: '8px 16px', borderBottom: `1px dashed ${S_C.sand}` }}>
            <div style={{ fontFamily: S_F.inter, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: S_C.darkGray }}>PLAYER</div>
            <div style={{ fontFamily: S_F.inter, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: S_C.darkGray, textAlign: 'center' }}>HCP</div>
            <div style={{ fontFamily: S_F.inter, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: S_C.darkGray, textAlign: 'center' }}>CART</div>
          </div>
          {four.map((p, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 48px 48px', alignItems: 'center',
              padding: '11px 16px', borderBottom: i < 3 ? `1px dashed ${S_C.borderSoft}` : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={p.name} size={34}/>
                <div>
                  <div style={{ fontFamily: S_F.playfair, fontSize: 14, fontWeight: 600, color: S_C.text }}>{p.name}{p.name === 'You' && <span style={{ fontFamily: S_F.pacifico, fontSize: 12, color: S_C.green, marginLeft: 6 }}>(you)</span>}</div>
                </div>
              </div>
              <div style={{ fontFamily: S_F.playfair, fontSize: 16, fontWeight: 700, color: S_C.green, textAlign: 'center' }}>{p.hcp}</div>
              <div style={{ textAlign: 'center' }}>
                {i < 2 ? <div style={{ fontFamily: S_F.pacifico, fontSize: 11, color: S_C.textSoft }}>cart</div>
                       : <div style={{ fontFamily: S_F.pacifico, fontSize: 11, color: S_C.textSoft }}>walk</div>}
              </div>
            </div>
          ))}
        </PaperCard>

        {/* Logistics */}
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: S_C.cream, padding: '12px 14px', borderRadius: 6, border: `1px solid ${S_C.sand}` }}>
            <div style={{ fontFamily: S_F.inter, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: S_C.darkGray }}>TEE TIME</div>
            <div style={{ fontFamily: S_F.playfair, fontSize: 18, fontWeight: 700, color: S_C.text, marginTop: 2 }}>8:14 AM</div>
            <div style={{ fontFamily: S_F.inter, fontSize: 10, color: S_C.darkGray }}>Arrive by 7:44</div>
          </div>
          <div style={{ background: S_C.cream, padding: '12px 14px', borderRadius: 6, border: `1px solid ${S_C.sand}` }}>
            <div style={{ fontFamily: S_F.inter, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: S_C.darkGray }}>YOUR SHARE</div>
            <div style={{ fontFamily: S_F.playfair, fontSize: 18, fontWeight: 700, color: S_C.text, marginTop: 2 }}>$42</div>
            <div style={{ fontFamily: S_F.inter, fontSize: 10, color: S_C.darkGray }}>Split 4 ways</div>
          </div>
        </div>

        {/* Group chat CTA */}
        <button style={{
          width: '100%', marginTop: 16, padding: '14px', borderRadius: 8,
          background: S_C.cream, border: `1px dashed ${S_C.green}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: S_F.playfair, fontSize: 14, fontWeight: 500, color: S_C.green, cursor: 'pointer',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {I.chat(S_C.green, 18)} Group chat · 12 messages
          </span>
          {I.chev(S_C.green, 14)}
        </button>
      </div>

      <TabBar active="foursome" onTab={onTab}/>
    </PhoneChrome>
  );
}


Object.assign(window, { GOLFERS, LineupScreen, GolferScreen, FoursomeScreen });
