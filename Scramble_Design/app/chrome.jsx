// Screen shells: PhoneChrome + common components

function PhoneChrome({ children, bg = S_C.creamBg, statusColor = '#000' }) {
  return (
    <div style={{
      width: 390, height: 820, borderRadius: 48, overflow: 'hidden',
      background: bg, position: 'relative',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 8px #1a1a2e, 0 0 0 9px #2a2a3e',
      fontFamily: S_F.inter,
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 50, zIndex: 10,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        padding: '0 28px 8px', pointerEvents: 'none',
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: statusColor, fontFamily: '-apple-system, system-ui' }}>9:41</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="17" height="11" viewBox="0 0 17 11"><g fill={statusColor}><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="4.5" y="5" width="3" height="6" rx="0.5"/><rect x="9" y="3" width="3" height="8" rx="0.5"/><rect x="13.5" y="1" width="3" height="10" rx="0.5"/></g></svg>
          <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke={statusColor} fill="none"/><rect x="2" y="2" width="17" height="7" rx="1" fill={statusColor}/></svg>
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

// App header — paper style with stitched dashed border
function AppHeader({ title, eyebrow, left, right, bg = S_C.cream, border = true }) {
  return (
    <div style={{
      paddingTop: 56, paddingBottom: 18, paddingLeft: 20, paddingRight: 20,
      background: bg,
      borderBottom: border ? `1px dashed ${S_C.sand}` : 'none',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 32 }}>
        <div style={{ width: 32, display: 'flex', alignItems: 'center' }}>{left}</div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          {eyebrow && <div style={{ fontFamily: S_F.inter, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: S_C.green, marginBottom: 2 }}>{eyebrow}</div>}
          <div style={{ fontFamily: S_F.playfair, fontSize: 18, fontWeight: 600, color: S_C.text, letterSpacing: -0.2 }}>{title}</div>
        </div>
        <div style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{right}</div>
      </div>
    </div>
  );
}

// Tab bar
function TabBar({ active, onTab }) {
  const tabs = [
    { id: 'lineup', label: 'Lineup', icon: I.user },
    { id: 'foursome', label: 'Foursome', icon: I.flag },
    { id: 'messages', label: 'Chat', icon: I.chat },
    { id: 'profile', label: 'Me', icon: I.settings },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 84, zIndex: 40,
      background: S_C.cream,
      borderTop: `1px dashed ${S_C.sand}`,
      paddingBottom: 20, paddingTop: 10,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
    }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => onTab(t.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '4px 12px',
          }}>
            <div style={{ opacity: isActive ? 1 : 0.5 }}>
              {t.icon(isActive ? S_C.green : S_C.darkGray, 22)}
            </div>
            <span style={{
              fontFamily: S_F.inter, fontSize: 9, fontWeight: 700,
              letterSpacing: 1.5, color: isActive ? S_C.green : S_C.midGray,
            }}>{t.label.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}

// Golfer avatar — styled placeholder with initials
function Avatar({ name = 'A B', size = 48, color, tint }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const palette = [
    [S_C.green, S_C.greenTint],
    [S_C.red, '#fde4e0'],
    ['#b48a4a', '#f5ebd7'],
    ['#3d6fa8', '#d9e4f2'],
    ['#7a5a9e', '#e8e0f0'],
    ['#45845e', '#d5e8da'],
  ];
  // deterministic palette pick
  const idx = (name.charCodeAt(0) || 0) % palette.length;
  const [fg, bg] = [color || palette[idx][0], tint || palette[idx][1]];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: S_F.playfair, fontWeight: 700, fontSize: size * 0.38,
      border: `1.5px solid ${fg}`,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// Row field (settings etc.)
function SettingsRow({ label, value, onClick, chev = true, toggle = false, toggled, onToggle, danger = false }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 18px', cursor: onClick || toggle ? 'pointer' : 'default',
      background: S_C.cream,
      borderBottom: `1px dashed ${S_C.borderSoft}`,
    }}>
      <span style={{ fontFamily: S_F.playfair, fontSize: 15, color: danger ? S_C.red : S_C.text, fontWeight: 500 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {value && <span style={{ fontFamily: S_F.inter, fontSize: 13, color: S_C.darkGray }}>{value}</span>}
        {toggle ? (
          <div onClick={(e) => { e.stopPropagation(); onToggle && onToggle(); }} style={{
            width: 44, height: 26, borderRadius: 13,
            background: toggled ? S_C.green : S_C.border,
            position: 'relative', transition: 'all 150ms',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: '#fff', position: 'absolute', top: 2,
              left: toggled ? 20 : 2, transition: 'all 150ms',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}/>
          </div>
        ) : (chev && <span style={{ color: S_C.midGray }}>{I.chev(S_C.midGray, 14)}</span>)}
      </div>
    </div>
  );
}

// Section heading in list (small caps w/ dashes either side)
function SectionHead({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '18px 20px 8px',
    }}>
      <div style={{ flex: 1, height: 1, backgroundImage: `linear-gradient(90deg, ${S_C.sand} 50%, transparent 50%)`, backgroundSize: '6px 1px' }}/>
      <div style={{ fontFamily: S_F.inter, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: S_C.green }}>
        {children}
      </div>
      <div style={{ flex: 1, height: 1, backgroundImage: `linear-gradient(90deg, ${S_C.sand} 50%, transparent 50%)`, backgroundSize: '6px 1px' }}/>
    </div>
  );
}

Object.assign(window, { PhoneChrome, AppHeader, TabBar, Avatar, SettingsRow, SectionHead });
