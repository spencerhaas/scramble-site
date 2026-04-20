// Messages list, DM conversation, Profile/me, Settings, Preferences, Account, Change phone

function MessagesScreen({ onOpenDM, onTab }) {
  const threads = [
    { with: GOLFERS[0], last: "See you at the 1st tee at 8!", time: '9:42a', unread: 0, typing: false },
    { with: GOLFERS[2], last: "I can make Saturday work. Let's do it.", time: 'Yest', unread: 2, typing: false },
    { with: GOLFERS[1], last: 'typing…', time: '7:30a', unread: 0, typing: true },
    { with: GOLFERS[3], last: "Haha the lesson paid off 😅 birdie on 7", time: 'Mon', unread: 0, typing: false },
    { with: GOLFERS[5], last: "Willow Bend has a 2:20 slot next wknd — join?", time: 'Mon', unread: 1, typing: false },
    { with: GOLFERS[4], last: "Same story on the 9th, I swear…", time: 'Sun', unread: 0, typing: false },
  ];
  return (
    <PhoneChrome bg={S_C.cream}>
      <AppHeader eyebrow="THE CLUBHOUSE" title="Messages" left={<ScrambleLogo size={24}/>}/>

      {/* Search */}
      <div style={{ padding: '12px 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', background: S_C.creamBg, borderRadius: 8, border: `1px solid ${S_C.sand}`,
        }}>
          {I.search(S_C.midGray, 16)}
          <span style={{ fontFamily: S_F.playfair, fontStyle: 'italic', fontSize: 14, color: S_C.midGray }}>Search players & chats</span>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 212, bottom: 84, left: 0, right: 0, overflowY: 'auto' }}>
        {threads.map((t, i) => (
          <div key={i} onClick={() => onOpenDM(t.with)} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 20px', cursor: 'pointer',
            borderBottom: `1px dashed ${S_C.borderSoft}`,
            background: t.unread ? 'rgba(58,125,68,0.03)' : 'transparent',
          }}>
            <Avatar name={t.with.name} size={48}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: S_F.playfair, fontSize: 15, fontWeight: t.unread ? 700 : 600, color: S_C.text }}>{t.with.name}</div>
                <div style={{ fontFamily: S_F.inter, fontSize: 11, color: S_C.darkGray }}>{t.time}</div>
              </div>
              <div style={{
                fontFamily: S_F.inter, fontSize: 13, color: t.typing ? S_C.green : S_C.darkGray,
                marginTop: 2, fontStyle: t.typing ? 'italic' : 'normal',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                fontWeight: t.unread ? 500 : 400,
              }}>{t.last}</div>
            </div>
            {t.unread > 0 && (
              <div style={{
                minWidth: 20, height: 20, borderRadius: 10, background: S_C.green, color: '#fff',
                fontFamily: S_F.inter, fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px',
              }}>{t.unread}</div>
            )}
          </div>
        ))}
      </div>

      <TabBar active="messages" onTab={onTab}/>
    </PhoneChrome>
  );
}


function DMScreen({ golfer, onBack }) {
  const g = golfer || GOLFERS[0];
  const messages = [
    { from: 'them', text: "Hey! Saw we both play Pebble Ridge. Up for Saturday?", time: '9:14a' },
    { from: 'me', text: "Yeah! What time were you thinking?", time: '9:16a' },
    { from: 'them', text: "8:14 tee time. There's 2 of us, looking for a 3rd & 4th.", time: '9:17a' },
    { from: 'them', text: "You play competitive or casual?", time: '9:17a' },
    { from: 'me', text: "Casual. I'm 15 hcp on a good day, 22 on a bad one 😅", time: '9:20a' },
    { from: 'them', text: "Ha. Same. We're all around there. You're in.", time: '9:22a' },
    { from: 'them', text: "See you at the 1st tee at 8!", time: '9:42a' },
  ];
  return (
    <PhoneChrome bg={S_C.creamBg}>
      {/* Header — paper with player strip */}
      <div style={{ paddingTop: 56, paddingBottom: 12, paddingLeft: 14, paddingRight: 14, background: S_C.cream, borderBottom: `1px dashed ${S_C.sand}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}>{I.back(S_C.darkGray)}</button>
          <Avatar name={g.name} size={38}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: S_F.playfair, fontSize: 15, fontWeight: 700, color: S_C.text }}>{g.name}</div>
            <div style={{ fontFamily: S_F.inter, fontSize: 10, color: S_C.green, fontWeight: 600, letterSpacing: 0.3 }}>
              · Active now · {g.home}
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}>{I.flag(S_C.green, 22)}</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ position: 'absolute', top: 110, bottom: 82, left: 0, right: 0, overflowY: 'auto', padding: '16px 14px 8px' }}>
        {/* Intro stamp */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{
            display: 'inline-block', padding: '6px 12px',
            background: S_C.sandSoft, borderRadius: 4, border: `1px dashed ${S_C.sandDeep}`,
            fontFamily: S_F.inter, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: S_C.greenDeep,
          }}>MATCHED ON SCRAMBLE · MON 9:12A</div>
        </div>

        {messages.map((m, i) => {
          const mine = m.from === 'me';
          return (
            <div key={i} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
              <div style={{
                maxWidth: '78%',
                padding: '9px 14px',
                background: mine ? S_C.green : S_C.cream,
                color: mine ? '#fff' : S_C.text,
                border: mine ? 'none' : `1px solid ${S_C.sand}`,
                borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                fontFamily: S_F.playfair, fontSize: 14, lineHeight: 1.4,
                boxShadow: mine ? '0 2px 6px rgba(58,125,68,0.2)' : '0 1px 3px rgba(60,40,20,0.04)',
              }}>
                {m.text}
              </div>
            </div>
          );
        })}
        {/* Tee time card message */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 10 }}>
          <div style={{
            maxWidth: '82%', padding: 0,
            background: S_C.cream, border: `1px solid ${S_C.green}`,
            borderRadius: 10, overflow: 'hidden',
          }}>
            <div style={{ padding: '6px 10px', background: S_C.green, color: '#fff', fontFamily: S_F.inter, fontSize: 9, fontWeight: 700, letterSpacing: 1.5 }}>
              TEE TIME INVITE
            </div>
            <div style={{ padding: '10px 14px' }}>
              <div style={{ fontFamily: S_F.playfair, fontSize: 15, fontWeight: 700, color: S_C.text }}>Sat · 8:14 AM · Pebble Ridge</div>
              <div style={{ fontFamily: S_F.inter, fontSize: 11, color: S_C.darkGray, marginTop: 3 }}>$42 · 2/4 confirmed</div>
              <button style={{
                marginTop: 10, padding: '8px 16px', background: S_C.green, color: '#fff',
                border: 'none', borderRadius: 18, fontFamily: S_F.playfair, fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
              }}>Accept invite</button>
            </div>
          </div>
        </div>
      </div>

      {/* Composer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 14px 28px', background: S_C.cream, borderTop: `1px dashed ${S_C.sand}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <button style={{ width: 34, height: 34, borderRadius: '50%', background: S_C.greenLight, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {I.plus(S_C.green, 18)}
        </button>
        <div style={{
          flex: 1, padding: '9px 14px', background: S_C.creamBg, borderRadius: 18, border: `1px solid ${S_C.sand}`,
          fontFamily: S_F.playfair, fontStyle: 'italic', fontSize: 14, color: S_C.midGray,
        }}>Message Marcus…</div>
        <button style={{ width: 38, height: 38, borderRadius: '50%', background: S_C.green, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {I.send('#fff', 18)}
        </button>
      </div>
    </PhoneChrome>
  );
}


function ProfileScreen({ onTab, onNav }) {
  return (
    <PhoneChrome bg={S_C.creamBg}>
      <AppHeader eyebrow="MEMBER CARD" title="Your profile" left={<ScrambleLogo size={24}/>} right={<button style={{background:'none',border:'none',padding:0,cursor:'pointer'}} onClick={() => onNav('settings')}>{I.settings(S_C.darkGray, 20)}</button>}/>

      <div style={{ position: 'absolute', top: 118, bottom: 84, left: 0, right: 0, overflowY: 'auto' }}>
        {/* Member card — scorecard feel */}
        <div style={{ padding: '18px 20px 10px' }}>
          <PaperCard style={{ padding: 0, overflow: 'hidden' }}>
            {/* header strip */}
            <div style={{
              padding: '10px 16px', background: S_C.greenDeep, color: S_C.cream,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ fontFamily: S_F.pacifico, fontSize: 17 }}>Scramble</div>
              <div style={{ fontFamily: S_F.inter, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, opacity: 0.9 }}>
                MEMBER · EST 2025
              </div>
            </div>
            <div style={{ padding: '18px 18px 14px', display: 'flex', gap: 14, alignItems: 'center' }}>
              <Avatar name="Alex Morgan" size={64}/>
              <div>
                <div style={{ fontFamily: S_F.playfair, fontSize: 20, fontWeight: 700, color: S_C.text }}>Alex Morgan</div>
                <div style={{ fontFamily: S_F.pacifico, fontSize: 16, color: S_C.green, marginTop: 2, lineHeight: 1 }}>Alex Morgan</div>
                <div style={{ fontFamily: S_F.inter, fontSize: 11, color: S_C.darkGray, marginTop: 6 }}>
                  Since July '25 · Pebble Ridge GC
                </div>
              </div>
            </div>

            {/* stats strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: `1px dashed ${S_C.sand}` }}>
              {[['HCP', 15], ['RDS', 24], ['4MS', 8], ['MILES', 112]].map(([k, v], i) => (
                <div key={k} style={{ padding: '12px 4px', textAlign: 'center', borderLeft: i ? `1px dashed ${S_C.borderSoft}` : 'none' }}>
                  <div style={{ fontFamily: S_F.inter, fontSize: 8, fontWeight: 700, letterSpacing: 1.2, color: S_C.darkGray }}>{k}</div>
                  <div style={{ fontFamily: S_F.playfair, fontSize: 20, fontWeight: 700, color: S_C.green, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </PaperCard>
        </div>

        {/* Next tee time — easy entry */}
        <div style={{ padding: '4px 20px 0' }}>
          <div style={{
            padding: '14px 16px', background: S_C.greenLight,
            borderRadius: 6, border: `1px solid ${S_C.fairway}`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: S_F.inter, fontSize: 10, fontWeight: 700, letterSpacing: 2, color: S_C.greenDeep }}>NEXT TEE TIME</div>
              <div style={{ fontFamily: S_F.playfair, fontSize: 17, fontWeight: 600, color: S_C.text, marginTop: 4 }}>
                Saturday · 8:14 AM
              </div>
              <div style={{ fontFamily: S_F.playfair, fontStyle: 'italic', fontSize: 12, color: S_C.textSoft, marginTop: 2 }}>
                Pebble Ridge GC — with Marcus, Sarah, Diego
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, color: S_C.greenDeep,
            }}>{I.chev(S_C.greenDeep, 18)}</div>
          </div>
        </div>

        {/* Recent rounds */}
        <SectionHead>RECENT ROUNDS</SectionHead>
        <div style={{ padding: '0 20px' }}>
          {[
            ['Sat, Aug 9', 'Pebble Ridge GC', 87, 'Marcus, Sarah, Diego'],
            ['Sun, Jul 27', 'Oak Hollow Muni', 92, 'Jamie, Tom'],
            ['Sat, Jul 19', 'Cypress Pines GC', 84, 'Sarah, Priya, Diego'],
          ].map(([d, course, score, ppl], i) => (
            <div key={i} style={{
              padding: '12px 14px', background: S_C.cream, border: `1px solid ${S_C.sand}`,
              borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 42, padding: '4px 0', textAlign: 'center',
                border: `1.5px solid ${S_C.sand}`, borderRadius: 4, background: S_C.paper,
              }}>
                <div style={{ fontFamily: S_F.inter, fontSize: 7, fontWeight: 700, letterSpacing: 1, color: S_C.darkGray }}>SCORE</div>
                <div style={{ fontFamily: S_F.playfair, fontSize: 17, fontWeight: 700, color: S_C.green, lineHeight: 1 }}>{score}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: S_F.playfair, fontSize: 14, fontWeight: 600, color: S_C.text }}>{course}</div>
                <div style={{ fontFamily: S_F.inter, fontSize: 10, color: S_C.darkGray, marginTop: 2 }}>{d} · w/ {ppl}</div>
              </div>
            </div>
          ))}
        </div>

        <SectionHead>YOUR HOME</SectionHead>
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ border: `1px solid ${S_C.sand}`, borderRadius: 8, overflow: 'hidden' }}>
            <CourseIllustration variant="fairway" height={120}/>
            <div style={{ padding: '12px 14px', background: S_C.cream, borderTop: `1px dashed ${S_C.sand}` }}>
              <div style={{ fontFamily: S_F.playfair, fontSize: 15, fontWeight: 700, color: S_C.text }}>Pebble Ridge Golf Club</div>
              <div style={{ fontFamily: S_F.inter, fontSize: 11, color: S_C.darkGray, marginTop: 3 }}>Member since July '25 · 18 rounds played</div>
            </div>
          </div>
        </div>
      </div>

      <TabBar active="profile" onTab={onTab}/>
    </PhoneChrome>
  );
}


Object.assign(window, { MessagesScreen, DMScreen, ProfileScreen });
