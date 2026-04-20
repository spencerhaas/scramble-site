// Settings, Preferences, Account, Change phone/code screens

function SettingsScreen({ onBack, onNav }) {
  return (
    <PhoneChrome bg={S_C.creamBg}>
      <AppHeader eyebrow="THE STARTER'S SHACK" title="Settings" left={<button onClick={onBack} style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>{I.back(S_C.darkGray)}</button>}/>

      <div style={{ position: 'absolute', top: 118, bottom: 0, left: 0, right: 0, overflowY: 'auto' }}>
        <SectionHead>ACCOUNT</SectionHead>
        <div>
          <SettingsRow label="Profile" value="Alex Morgan" onClick={() => onNav('profile')}/>
          <SettingsRow label="Account" value="(415) 555-0142" onClick={() => onNav('account')}/>
          <SettingsRow label="Preferences" onClick={() => onNav('preferences')}/>
        </div>

        <SectionHead>GAME</SectionHead>
        <div>
          <SettingsRow label="Home course" value="Pebble Ridge"/>
          <SettingsRow label="Handicap" value="15"/>
          <SettingsRow label="Default pace" value="Average"/>
        </div>

        <SectionHead>NOTIFICATIONS</SectionHead>
        <div>
          <SettingsRow label="Messages" toggle toggled={true}/>
          <SettingsRow label="New matches" toggle toggled={true}/>
          <SettingsRow label="Tee time reminders" toggle toggled={true}/>
          <SettingsRow label="Marketing" toggle toggled={false}/>
        </div>

        <SectionHead>SUPPORT</SectionHead>
        <div>
          <SettingsRow label="Help & FAQs"/>
          <SettingsRow label="Community guidelines"/>
          <SettingsRow label="Terms & privacy"/>
          <SettingsRow label="Rate Scramble"/>
        </div>

        <div style={{ padding: '20px', textAlign: 'center', fontFamily: S_F.pacifico, fontSize: 20, color: S_C.green, opacity: 0.5 }}>
          Scramble
        </div>
        <div style={{ textAlign: 'center', fontFamily: S_F.inter, fontSize: 10, color: S_C.midGray, letterSpacing: 1.5, paddingBottom: 40 }}>
          v1.0 · MADE FOR THE BACK NINE
        </div>
      </div>
    </PhoneChrome>
  );
}

function PreferencesScreen({ onBack }) {
  return (
    <PhoneChrome bg={S_C.creamBg}>
      <AppHeader eyebrow="YOUR GAME" title="Preferences" left={<button onClick={onBack} style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>{I.back(S_C.darkGray)}</button>}/>

      <div style={{ position: 'absolute', top: 118, bottom: 0, left: 0, right: 0, overflowY: 'auto', padding: '14px 20px 40px' }}>
        <div style={{ fontFamily: S_F.playfair, fontStyle: 'italic', fontSize: 14, color: S_C.textSoft, marginBottom: 20, lineHeight: 1.5 }}>
          Help us match you with the right foursome. All of this is visible to other members.
        </div>

        <Eyebrow>PLAY STYLE</Eyebrow>
        <DashedDivider margin="8px 0 12px"/>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
          <Pill active>Casual</Pill>
          <Pill>Competitive</Pill>
          <Pill>Money game</Pill>
        </div>

        <Eyebrow>PACE</Eyebrow>
        <DashedDivider margin="8px 0 12px"/>
        <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
          <Pill>Quick (3.5 hrs)</Pill>
          <Pill active>Average (4 hrs)</Pill>
          <Pill>Relaxed (4.5+)</Pill>
        </div>

        <Eyebrow>WHAT I BRING</Eyebrow>
        <DashedDivider margin="8px 0 12px"/>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
          <Pill active>Coffee</Pill>
          <Pill>Beers</Pill>
          <Pill active>Good chat</Pill>
          <Pill>Spare balls</Pill>
          <Pill>Ball markers</Pill>
        </div>

        <Eyebrow>WHEN I PLAY</Eyebrow>
        <DashedDivider margin="8px 0 12px"/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 22 }}>
          {['S','M','T','W','T','F','S'].map((d, i) => {
            const active = [0, 5, 6].includes(i);
            return (
              <div key={i} style={{
                padding: '12px 0', textAlign: 'center', borderRadius: 6,
                background: active ? S_C.green : S_C.cream,
                border: `1px solid ${active ? S_C.green : S_C.sand}`,
                fontFamily: S_F.playfair, fontSize: 13, fontWeight: 600,
                color: active ? '#fff' : S_C.textSoft,
              }}>{d}</div>
            );
          })}
        </div>

        <Eyebrow>GETTING AROUND</Eyebrow>
        <DashedDivider margin="8px 0 12px"/>
        <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
          <Pill>Walk</Pill>
          <Pill active>Cart</Pill>
          <Pill>Either works</Pill>
        </div>

        <Eyebrow>PROMPT</Eyebrow>
        <DashedDivider margin="8px 0 12px"/>
        <div style={{ padding: '14px 16px', background: S_C.cream, border: `1px dashed ${S_C.sand}`, borderRadius: 6 }}>
          <div style={{ fontFamily: S_F.inter, fontSize: 11, color: S_C.darkGray, marginBottom: 4 }}>Best shot ever?</div>
          <div style={{ fontFamily: S_F.pacifico, fontSize: 16, color: S_C.textSoft, lineHeight: 1.4 }}>
            Approach shot at Bandon #12, stuck it to 4 feet in a side wind.
          </div>
        </div>
      </div>
    </PhoneChrome>
  );
}


function AccountScreen({ onBack, onNav }) {
  return (
    <PhoneChrome bg={S_C.creamBg}>
      <AppHeader eyebrow="THE LOCKER ROOM" title="Account" left={<button onClick={onBack} style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>{I.back(S_C.darkGray)}</button>}/>

      <div style={{ position: 'absolute', top: 118, bottom: 0, left: 0, right: 0, overflowY: 'auto' }}>
        <SectionHead>SIGN-IN</SectionHead>
        <div>
          <SettingsRow label="Phone number" value="(415) 555-0142" onClick={() => onNav('changePhone')}/>
          <SettingsRow label="Change verification" onClick={() => onNav('code')}/>
        </div>

        <SectionHead>PRIVACY</SectionHead>
        <div>
          <SettingsRow label="Hide from nearby search" toggle toggled={false}/>
          <SettingsRow label="Show home course" toggle toggled={true}/>
          <SettingsRow label="Block list" value="0"/>
        </div>

        <SectionHead>CLUBHOUSE EXIT</SectionHead>
        <div>
          <SettingsRow label="Sign out" danger/>
          <SettingsRow label="Delete account" danger/>
        </div>
        <div style={{ height: 40 }}/>
      </div>
    </PhoneChrome>
  );
}

function ChangePhoneScreen({ onBack }) {
  return (
    <PhoneChrome bg={S_C.creamBg}>
      <AppHeader eyebrow="ACCOUNT" title="Change phone" left={<button onClick={onBack} style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>{I.back(S_C.darkGray)}</button>}/>

      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ fontFamily: S_F.playfair, fontStyle: 'italic', fontSize: 14, color: S_C.textSoft, marginBottom: 20, lineHeight: 1.5 }}>
          We'll text a code to your current number first, then to the new one.
        </div>

        <Eyebrow>CURRENT NUMBER</Eyebrow>
        <DashedDivider margin="8px 0 10px"/>
        <div style={{
          padding: '14px 16px', background: S_C.cream, borderRadius: 6, border: `1px solid ${S_C.sand}`,
          fontFamily: S_F.playfair, fontSize: 18, color: S_C.text, marginBottom: 22,
        }}>
          +1 (415) 555-0142
        </div>

        <Eyebrow>NEW NUMBER</Eyebrow>
        <DashedDivider margin="8px 0 10px"/>
        <div style={{
          padding: '14px 16px', background: S_C.cream, borderRadius: 6,
          border: `1.5px dashed ${S_C.green}`,
          fontFamily: S_F.playfair, fontSize: 18, color: S_C.midGray, fontStyle: 'italic',
        }}>
          +1 (___) ___-____
        </div>

        <div style={{ marginTop: 60, fontFamily: S_F.inter, fontSize: 11, color: S_C.midGray, textAlign: 'center', lineHeight: 1.6, letterSpacing: 0.3 }}>
          Changing numbers signs out other devices.<br/>We'll keep your scorecard, rounds, and matches.
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 40, left: 24, right: 24 }}>
        <PrimaryBtn>Send verification code {I.chev('#fff', 16)}</PrimaryBtn>
      </div>
    </PhoneChrome>
  );
}


Object.assign(window, { SettingsScreen, PreferencesScreen, AccountScreen, ChangePhoneScreen });
