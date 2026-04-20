import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { getLineup, getPreferences, updatePreferences, getMessages, sendMessage, getGroupMessages } from "../lib/api";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
  ImageBackground,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Animated,
  PanResponder,
  FlatList,
} from "react-native";
import Svg, { Circle, Line, Path, Polyline } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import MapView from "react-native-maps";


const GOOGLE_PLACES_API_KEY = "AIzaSyC5DSG01yXbn_ljq994sTnpXw9LCsoBJZk";

const STOCK_IMAGES = [
  require('../assets/stock1.png'),
  require('../assets/stock2.png'),
  require('../assets/stock3.png'),
];

SplashScreen.preventAutoHideAsync();

const CURRENT_USER_ID = "a1111111-1111-1111-1111-111111111111";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Colors ─────────────────────────────────────────────────────────────────
const C = {
  green: "#3A7D44",
  white: "#ffffff",
  offWhite: "#f7f8fa",
  lightGray: "#e8ecf1",
  midGray: "#9ca5b4",
  darkGray: "#5a6377",
  border: "#dfe3ea",
  text: "#1a1a2e",
};

// ─── Data ────────────────────────────────────────────────────────────────────
const PROMPTS = [
  "A golf goal of mine is…",
  "I'm looking for…",
  "My hottest golf take…",
  "The course on my bucket list is…",
  "The best part of golf is…",
];

const ALL_SCREENS = [
  "home", "phone", "code",
  "gps", "intake", "profile",
  "change_phone", "change_code",
];

const INTAKE_SECTIONS = [
  { key: "play_style",  title: "I play…",              options: ["Weekdays", "Weekends", "Early tee times", "Twilight rounds", "All the above"] },
  { key: "formats",     title: "I like to play…",       options: ["Casual", "Competitive", "Match play", "Scramble / Best ball", "Skins / Gambling"] },
  { key: "transport",   title: "On the course I…",      options: ["Walk", "Cart", "Both"] },
  { key: "pace",        title: "My pace of play…",      options: ["Fast", "Moderate", "Relaxed"] },
  { key: "tee_box",     title: "I play from the…",      options: ["Forward tees", "Middle tees", "Back tees", "Tips", "Whatever the group plays"] },
  { key: "betting",     title: "Betting…",              options: ["$5 nassau", "Friendly wagers only", "No money games"] },
  { key: "music",       title: "Music on the course…",  options: ["Speaker on the cart", "Keep it quiet", "Don't care either way"] },
  { key: "substances",  title: "When I golf…",          options: ["Alcohol", "Cannabis", "No substances"] },
  { key: "looking_for", title: "I'm looking for…",      options: ["Golf buddy", "19th hole crew", "Practice partner", "Tournament partner", "League partner", "All the above"] },
  { key: "purpose",     title: "I'm here for…",         options: ["Networking", "Golf trips", "Couples golf", "New to the area", "Growing the crew", "All the above"] },
] as const;

// ─── Continue Button (green circle with chevron) ─────────────────────────────
function GolfBallBtn({ onPress, disabled }: { onPress: () => void; disabled: boolean }) {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.8}
      style={[styles.golfBallBtn, { backgroundColor: disabled ? C.lightGray : C.green }]}
    >
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Polyline points="9,5 17,12 9,19" stroke={C.white} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </TouchableOpacity>
  );
}

// ─── Arrow Button (for change_phone screen) ──────────────────────────────────
function ArrowBtn({ onPress, disabled }: { onPress: () => void; disabled: boolean }) {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.8}
      style={[styles.golfBallBtn, { backgroundColor: disabled ? C.lightGray : C.green }]}
    >
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Line x1={5} y1={12} x2={19} y2={12} stroke={C.white} strokeWidth={2.5} strokeLinecap="round" />
        <Polyline points="12,5 19,12 12,19" stroke={C.white} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </TouchableOpacity>
  );
}

// ─── Edge swipe-back (left 30px zone, horizontal drag triggers onBack) ────────
function EdgeSwipeBack({ onBack }: { onBack: () => void }) {
  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gs) =>
          gs.dx > 15 && Math.abs(gs.dx) > Math.abs(gs.dy),
        onPanResponderRelease: (_, gs) => {
          if (gs.dx > 60) onBack();
        },
      }),
    [onBack]
  );
  return (
    <View
      style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 30, zIndex: 99 }}
      {...pan.panHandlers}
    />
  );
}

// ─── Screen Wrapper ───────────────────────────────────────────────────────────
function Wrap({
  children,
  swipeBack,
}: {
  children: React.ReactNode;
  swipeBack?: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />
      {swipeBack && <EdgeSwipeBack onBack={swipeBack} />}
      {children}
    </SafeAreaView>
  );
}

// ─── Big Text Field ──────────────────────────────────────────────────────────
function BigField({
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  fonts,
  autoFocus = false,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "phone-pad";
  fonts: { playfair: string; inter: string };
  autoFocus?: boolean;
}) {
  const isNum = keyboardType === "numeric" || keyboardType === "phone-pad";
  return (
    <View style={styles.bigFieldWrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(156,165,180,0.5)"
        keyboardType={keyboardType}
        autoFocus={autoFocus}
        style={[
          styles.bigFieldInput,
          { fontFamily: isNum ? (Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto') : fonts.playfair, letterSpacing: isNum ? 0.5 : -0.3 },
        ]}
      />
    </View>
  );
}

// ─── Full-width green button ─────────────────────────────────────────────────
function Btn({
  label,
  onPress,
  disabled = false,
  fonts,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  fonts: { playfair: string };
}) {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.85}
      style={[styles.btn, { opacity: disabled ? 0.4 : 1 }]}
    >
      <Text style={[styles.btnText, { fontFamily: fonts.playfair }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Check Row (intake interest sections) ────────────────────────────────────
function CheckRow({
  label,
  active,
  onPress,
  isLast,
  fonts,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  isLast: boolean;
  fonts: { playfair: string; playfairSemi: string };
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={{
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: "#e8ecf1",
      }}
    >
      <Text style={{
        fontSize: 14, flex: 1,
        fontFamily: active ? fonts.playfairSemi : fonts.playfair,
        color: active ? C.green : C.text,
      }}>
        {label}
      </Text>
      <View style={{
        width: 22, height: 22, borderRadius: 11,
        backgroundColor: active ? C.green : "transparent",
        borderWidth: 2,
        borderColor: active ? C.green : "#dfe3ea",
        alignItems: "center", justifyContent: "center",
        marginLeft: 12,
      }}>
        {active && (
          <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
            <Path d="M2 6 L5 9 L10 3" stroke={C.white} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Bottom Nav ──────────────────────────────────────────────────────────────
const HIDE_NAV_SCREENS = new Set([
  "home", "phone", "code", "gps", "intake", "profile",
  "change_phone", "change_code", "transition",
  "dm", "preferences", "account", "help",
]);

function BottomNav({ screen, setScreen }: { screen: string; setScreen: (s: string) => void }) {
  if (HIDE_NAV_SCREENS.has(screen)) return null;

  const active = (s: string) => s === screen;
  const col = (s: string) => (active(s) ? C.green : "#999");

  return (
    <View style={navStyles.bar}>
      {/* Lineup — golf pin */}
      <TouchableOpacity onPress={() => setScreen("lineup")} style={navStyles.tab} activeOpacity={0.7}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Line x1={12} y1={3} x2={12} y2={21} stroke={col("lineup")} strokeWidth={2} strokeLinecap="round" />
          <Path d="M12 3 L20 7 L12 11" stroke={col("lineup")} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" fill={active("lineup") ? C.green : "none"} />
          <Line x1={8} y1={21} x2={16} y2={21} stroke={col("lineup")} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      </TouchableOpacity>

      {/* Messages — chat bubble */}
      <TouchableOpacity onPress={() => setScreen("messages")} style={navStyles.tab} activeOpacity={0.7}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={col("messages")} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </TouchableOpacity>

      {/* Foursome — logo */}
      <TouchableOpacity onPress={() => setScreen("foursome")} style={navStyles.tab} activeOpacity={0.7}>
        <Image
          source={active("foursome") ? require('../assets/logo-bar-green.png') : require('../assets/logo-bar.png')}
          style={{ width: 28, height: 28, resizeMode: 'contain' }}
        />
      </TouchableOpacity>

      {/* Settings — person silhouette */}
      <TouchableOpacity onPress={() => setScreen("settings")} style={navStyles.tab} activeOpacity={0.7}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={8} r={4} stroke={col("settings")} strokeWidth={2} />
          <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={col("settings")} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      </TouchableOpacity>
    </View>
  );
}

const navStyles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    backgroundColor: C.white,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
});

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    Pacifico_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // ── Screen state ────────────────────────────────────────────────────────────
  const [screen, setScreen] = useState("home");
  const [verifyStatus, setVerifyStatus] = useState<"success" | "error" | null>(null);
  const bannerOpacity = useRef(new Animated.Value(0)).current;

  // ── Form state ──────────────────────────────────────────────────────────────
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [zipInput, setZipInput] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [course, setCourse] = useState("");
  const [courseQuery, setCourseQuery] = useState("");
  const [courseResults, setCourseResults] = useState<{ place_id: string; description: string }[]>([]);
  const courseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [gender, setGender] = useState("");
  const [handicap, setHandicap] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [interests, setInterests] = useState<Record<string, string[]>>({
    play_style: [], formats: [], transport: [], pace: [], tee_box: [], betting: [],
    music: [], substances: [], looking_for: [], purpose: [],
  });
  const [cost9, setCost9] = useState("");
  const [cost18, setCost18] = useState("");
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]);
  const [prompts, setPrompts] = useState(PROMPTS.map((q) => ({ q, a: "" })));
  const [editingPrompt, setEditingPrompt] = useState<number | null>(null);
  const [selectedPromptQ, setSelectedPromptQ] = useState<string | null>(null);
  const [promptDraft, setPromptDraft] = useState("");
  const [oldPhone, setOldPhone] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [changeCode, setChangeCode] = useState(["", "", "", "", "", ""]);

  // ── Post-profile / main app state ───────────────────────────────────────────
  const [golfers, setGolfers] = useState<any[]>([]);
  const [radius, setRadius] = useState(10);
  const [ageRange, setAgeRange] = useState([21, 55]);
  const [prefsChanged, setPrefsChanged] = useState(false);
  const [selectedGolfer, setSelectedGolfer] = useState<any>(null);
  const [dmPrev, setDmPrev] = useState("messages");
  const [lineupError, setLineupError] = useState(false);

  // Refs
  const mapRef = useRef<any>(null);

  // Refs for OTP inputs
  const codeRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const changeCodeRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);

  const fonts = {
    playfair: "PlayfairDisplay_400Regular",
    playfairSemi: "PlayfairDisplay_600SemiBold",
    playfairBold: "PlayfairDisplay_700Bold",
    pacifico: "Pacifico_400Regular",
    inter: "Inter_400Regular",
    interMed: "Inter_500Medium",
    interSemi: "Inter_600SemiBold",
    interBold: "Inter_700Bold",
  };

  // ── Golf course search (Text Search API — filters to golf courses only) ────
  const searchGolfCourses = useCallback((text: string) => {
    setCourseQuery(text);
    if (courseTimer.current) clearTimeout(courseTimer.current);
    if (text.length < 2) { setCourseResults([]); return; }
    courseTimer.current = setTimeout(async () => {
      try {
        const url =
          `https://maps.googleapis.com/maps/api/place/textsearch/json` +
          `?query=golf+course+${encodeURIComponent(text)}` +
          `&type=establishment` +
          `&region=us` +
          `&key=${GOOGLE_PLACES_API_KEY}`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.results) {
          setCourseResults(
            json.results.slice(0, 5).map((r: any) => ({
              place_id: r.place_id,
              description: r.name + (r.formatted_address ? `, ${r.formatted_address}` : ""),
            }))
          );
        }
      } catch { setCourseResults([]); }
    }, 300);
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: C.white }} />;
  }

  // ── Navigation helpers ──────────────────────────────────────────────────────
  const goBack = () => {
    const i = ALL_SCREENS.indexOf(screen);
    if (i > 0) setScreen(ALL_SCREENS[i - 1]);
  };

  // ── Interest toggle with "All the above" logic ──────────────────────────────
  const toggleInterest = (key: string, opt: string) => {
    setInterests((prev) => {
      const arr = prev[key];
      if (opt === "All the above") {
        return { ...prev, [key]: arr.includes(opt) ? [] : [opt] };
      }
      const without = arr.filter((x) => x !== opt && x !== "All the above");
      return { ...prev, [key]: arr.includes(opt) ? without : [...without, opt] };
    });
  };

  // ── OTP input handler ───────────────────────────────────────────────────────
  const handleCode = (idx: number, val: string) => {
    if (verifyStatus !== null) setVerifyStatus(null);
    const digit = val.replace(/[^0-9]/g, "").slice(-1);
    const next = [...code];
    next[idx] = digit;
    setCode(next);
    if (digit && idx < 5) codeRefs.current[idx + 1]?.focus();
  };
  const handleCodeBackspace = (idx: number, key: string) => {
    if (key === "Backspace" && !code[idx] && idx > 0) {
      codeRefs.current[idx - 1]?.focus();
    }
  };

  const handleChangeCode = (idx: number, val: string) => {
    const digit = val.replace(/[^0-9]/g, "").slice(-1);
    const next = [...changeCode];
    next[idx] = digit;
    setChangeCode(next);
    if (digit && idx < 5) changeCodeRefs.current[idx + 1]?.focus();
  };
  const handleChangeCodeBackspace = (idx: number, key: string) => {
    if (key === "Backspace" && !changeCode[idx] && idx > 0) {
      changeCodeRefs.current[idx - 1]?.focus();
    }
  };

  // ── GPS location ────────────────────────────────────────────────────────────
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      mapRef.current?.animateToRegion(
        {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        800
      );
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geo) {
        const cityName = geo.city || geo.subregion || "";
        const stateCode = geo.region || "";
        setCity(`${cityName}, ${stateCode}`);
        setZipInput(geo.postalCode || "");
      }
    } catch {
      // silently fail — user can type zip instead
    }
    setLocationLoading(false);
  };

  // ── Photo picker ────────────────────────────────────────────────────────────
  const pickPhoto = async (idx: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const next = [...photos];
      next[idx] = result.assets[0].uri;
      setPhotos(next);
    }
  };

  const removePhoto = (idx: number) => {
    const next = [...photos];
    next[idx] = null;
    setPhotos(next);
  };

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: HOME
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "home") {
    return (
      <View style={{ flex: 1, overflow: "hidden" }} onLayout={onLayoutRootView}>
        {/* Scaled background — image grows 15% from center, content unaffected */}
        <ImageBackground
          source={require("../assets/Home.png")}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        {/* Dark scrim for text readability */}
        <View style={styles.homeScrim} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <View style={styles.homeInner}>
            <View style={styles.homeTop}>
              <Image
                source={require("../assets/logo-no-background.png")}
                style={{ width: 240, height: 240, marginBottom: -48 }}
                resizeMode="contain"
              />
              <Text style={[styles.homeTitle, { fontFamily: fonts.pacifico }]}>Scramble</Text>
              <Text style={[styles.homeSubtitle, { fontFamily: fonts.playfair }]}>Find your golf crew</Text>
            </View>
            <View style={styles.homeBottom}>
              <View style={{ width: "80%" }}>
                <TouchableOpacity
                  onPress={() => setScreen("phone")}
                  activeOpacity={0.85}
                  style={styles.createAccountBtn}
                >
                  <Text style={[styles.createAccountText, { fontFamily: fonts.playfairSemi }]}>Create Account</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setScreen("phone")} style={{ marginTop: 18 }}>
                <Text style={[styles.signInText, { fontFamily: fonts.playfair }]}>Sign in</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.termsText, { fontFamily: fonts.playfair }]}>
              By continuing, you agree to our{" "}
              <Text style={{ fontFamily: fonts.playfairBold }}>Terms</Text> and{" "}
              <Text style={{ fontFamily: fonts.playfairBold }}>Privacy Policy</Text>
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: PHONE
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "phone") {
    return (
      <Wrap>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <View style={styles.screenPad}>
            <View>
              <Text style={[styles.screenHeader, { fontFamily: fonts.playfairSemi }]}>What's your phone number?</Text>
              <View style={styles.phoneRow}>
                <View style={styles.countryCode}>
                  <Text style={{ fontSize: 18 }}>🇺🇸</Text>
                  <Text style={[styles.countryCodeNum, { fontFamily: fonts.interSemi }]}>+1</Text>
                  <Text style={[styles.countryChevron, { fontFamily: fonts.inter }]}>▾</Text>
                </View>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={[styles.phoneInput, { fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto' }]}
                  autoFocus
                />
              </View>
              <Text style={[styles.helperText, { fontFamily: fonts.playfair }]}>
                Scramble will send you a text with a verification code. Message and data rates may apply.
              </Text>
            </View>
            <View style={styles.bottomRow}>
              <TouchableOpacity onPress={() => setScreen("change_phone")}>
                <Text style={[styles.linkText, { fontFamily: fonts.playfairSemi }]}>What if my number changes?</Text>
              </TouchableOpacity>
              <GolfBallBtn onPress={() => setScreen("code")} disabled={phone.length < 7} />
            </View>
          </View>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Wrap>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: CODE
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "code") {
    const allDigits = code.every((c) => c);

    const handleVerify = () => {
      if (allDigits) {
        setVerifyStatus("success");
        bannerOpacity.setValue(0);
        Animated.timing(bannerOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      } else {
        setVerifyStatus("error");
        bannerOpacity.setValue(0);
        Animated.timing(bannerOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
        setCode(["", "", "", "", "", ""]);
      }
    };

    return (
      <Wrap swipeBack={goBack}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <View style={styles.screenPad}>
            <Text style={[styles.screenHeader, { fontFamily: fonts.playfairSemi }]}>Enter your code</Text>
            <Text style={[styles.subText, { fontFamily: fonts.playfair, marginBottom: 24 }]}>
              Sent to{" "}
              <Text style={{ fontFamily: fonts.inter }}>{phone}</Text>
            </Text>

            {/* Animated banner */}
            {verifyStatus !== null && (
              <Animated.View style={{
                opacity: bannerOpacity,
                backgroundColor: verifyStatus === "success"
                  ? "rgba(58,125,68,0.15)"
                  : "rgba(220,50,50,0.12)",
                borderRadius: 12,
                padding: 12,
                marginBottom: 16,
              }}>
                <Text style={{
                  fontSize: 14,
                  fontFamily: fonts.playfair,
                  textAlign: "center",
                  color: verifyStatus === "success" ? C.green : "#dc3232",
                }}>
                  {verifyStatus === "success"
                    ? "Your number has been verified!"
                    : "Incorrect code. Please re-enter."}
                </Text>
              </Animated.View>
            )}

            <View style={styles.otpRow}>
              {code.map((c, i) => (
                <TextInput
                  key={i}
                  ref={(r) => { codeRefs.current[i] = r; }}
                  value={c}
                  onChangeText={(v) => handleCode(i, v)}
                  onKeyPress={({ nativeEvent }) => handleCodeBackspace(i, nativeEvent.key)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[
                    styles.otpInput,
                    { fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto', borderBottomColor: c ? C.green : C.border },
                  ]}
                />
              ))}
            </View>

            <View style={{ marginTop: "auto", paddingBottom: 40 }}>
              {verifyStatus === "success" ? (
                <Btn label="Create profile" onPress={() => setScreen("gps")} fonts={fonts} />
              ) : (
                <Btn label="Verify" onPress={handleVerify} disabled={!allDigits} fonts={fonts} />
              )}

              <TouchableOpacity style={{ alignItems: "center", marginTop: 20 }} onPress={() => {}}>
                <Text style={[styles.resendText, { fontFamily: fonts.playfair }]}>Resend code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Wrap>
    );
  }


  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: GPS LOCATION
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "gps") {
    return (
      <Wrap swipeBack={goBack}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.screenPad, { flex: 1 }]}>
          <Text style={[styles.screenHeader, { fontFamily: fonts.playfairSemi }]}>Where do you live?</Text>
          <Text style={[styles.subText, { fontFamily: fonts.playfair, marginBottom: 20 }]}>
            Helps us find golfers near you
          </Text>

          {/* Live map with custom pin + GPS button */}
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude: 39.7392,
                longitude: -104.9903,
                latitudeDelta: 0.15,
                longitudeDelta: 0.15,
              }}
              showsUserLocation={false}
              showsMyLocationButton={false}
              toolbarEnabled={false}
            />

            {/* Custom teardrop pin — centered, point at map center */}
            <View pointerEvents="none" style={styles.mapPin}>
              <Svg width={24} height={30} viewBox="0 0 24 30">
                <Path
                  d="M12 0 C5.4 0 0 5.4 0 12 C0 18.6 12 30 12 30 C12 30 24 18.6 24 12 C24 5.4 18.6 0 12 0 Z"
                  fill={C.green}
                />
                <Circle cx={12} cy={11} r={4} fill={C.white} />
              </Svg>
            </View>

            {/* GPS button */}
            <TouchableOpacity
              onPress={getCurrentLocation}
              style={styles.gpsButton}
              activeOpacity={0.85}
            >
              {locationLoading ? (
                <ActivityIndicator size="small" color={C.text} style={{ width: 8, height: 8 }} />
              ) : (
                <Svg width={8} height={8} viewBox="0 0 24 24" fill="none">
                  <Circle cx={12} cy={12} r={3} stroke={C.text} strokeWidth={2} />
                  <Line x1={12} y1={2}  x2={12} y2={6}  stroke={C.text} strokeWidth={2} strokeLinecap="round" />
                  <Line x1={12} y1={18} x2={12} y2={22} stroke={C.text} strokeWidth={2} strokeLinecap="round" />
                  <Line x1={2}  y1={12} x2={6}  y2={12} stroke={C.text} strokeWidth={2} strokeLinecap="round" />
                  <Line x1={18} y1={12} x2={22} y2={12} stroke={C.text} strokeWidth={2} strokeLinecap="round" />
                </Svg>
              )}
              <Text style={[styles.gpsButtonText, { fontFamily: fonts.playfairSemi }]}>
                Go To Current Location
              </Text>
            </TouchableOpacity>
          </View>

          {/* Or divider */}
          <View style={styles.orDivider}>
            <View style={styles.orLine} />
            <Text style={[styles.orText, { fontFamily: fonts.inter }]}>or enter zip</Text>
            <View style={styles.orLine} />
          </View>

          {/* Zip input */}
          <TextInput
            value={zipInput}
            onChangeText={(v) => { setZipInput(v.replace(/\D/g, "")); setCity(v); }}
            placeholder="Zip code"
            keyboardType="number-pad"
            maxLength={5}
            placeholderTextColor={C.midGray}
            style={[styles.zipInput, { fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto', marginBottom: 12 }]}
          />

          {/* Continue button */}
          <View style={{ marginBottom: 40 }}>
            <Btn label="Continue" onPress={() => setScreen("intake")} disabled={!city.trim()} fonts={fonts} />
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Wrap>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: INTAKE
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "intake") {
    const genderOptions: { label: string; row: string }[] = [
      { label: "Man",              row: "a" },
      { label: "Woman",            row: "a" },
      { label: "Non-binary",       row: "b" },
      { label: "Prefer not to say", row: "c" },
    ];

    return (
      <Wrap swipeBack={goBack}>
        <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 140, paddingTop: 28 }}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              bounces={true}
              overScrollMode="always"
            >
              {/* ── Header ── */}
              <Text style={{ color: C.green, fontSize: 26, fontFamily: fonts.playfairBold, marginBottom: 10 }}>
                Create your profile
              </Text>
              <Text style={{ color: C.midGray, fontSize: 14, fontFamily: fonts.playfair, lineHeight: 21, marginBottom: 32 }}>
                Tell us about yourself and your golf game. Scramble will use your inputs to match you with similar golfers.
              </Text>

              {/* ── Section: About you ── */}
              <Text style={{ color: C.green, fontSize: 14, fontFamily: fonts.playfairBold, marginBottom: 20 }}>
                About you
              </Text>

              {/* First name */}
              <View style={{ marginBottom: 24, position: "relative" }}>
                {!name && focusedField !== "name" && (
                  <Text style={{ position: "absolute", top: 10, left: 0, fontSize: 14, color: C.midGray, fontFamily: fonts.playfair, pointerEvents: "none" }}>
                    First name
                  </Text>
                )}
                <TextInput
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    fontSize: 14, fontFamily: fonts.playfair, color: C.text,
                    borderBottomWidth: 1.5, borderBottomColor: focusedField === "name" ? C.green : C.border,
                    paddingVertical: 10, paddingHorizontal: 0,
                  }}
                />
              </View>

              {/* Age */}
              <View style={{ marginBottom: 24, position: "relative" }}>
                {!age && focusedField !== "age" && (
                  <Text style={{ position: "absolute", top: 10, left: 0, fontSize: 14, color: C.midGray, fontFamily: fonts.inter, pointerEvents: "none" }}>
                    Age
                  </Text>
                )}
                <TextInput
                  value={age}
                  onChangeText={setAge}
                  onFocus={() => setFocusedField("age")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="numeric"
                  style={{
                    fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto', color: C.text,
                    borderBottomWidth: 1.5, borderBottomColor: focusedField === "age" ? C.green : C.border,
                    paddingVertical: 10, paddingHorizontal: 0,
                  }}
                />
              </View>

              {/* Home course */}
              <View style={{ marginBottom: 24, zIndex: 10 }}>
                <TextInput
                  value={courseQuery}
                  onChangeText={searchGolfCourses}
                  placeholder="Home course"
                  placeholderTextColor={C.midGray}
                  onFocus={() => setFocusedField("course")}
                  onBlur={() => { setFocusedField(null); setTimeout(() => setCourseResults([]), 200); }}
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.playfair,
                    color: C.text,
                    paddingHorizontal: 0,
                    paddingVertical: 10,
                    borderBottomWidth: 1.5,
                    borderBottomColor: focusedField === "course" ? C.green : C.border,
                    backgroundColor: "transparent",
                  }}
                />
                {courseResults.length > 0 && (
                  <View style={{
                    backgroundColor: C.white,
                    borderRadius: 12,
                    marginTop: 4,
                    elevation: 4,
                    shadowColor: "#000",
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 2 },
                    position: "absolute",
                    top: 42,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                  }}>
                    {courseResults.map((item) => (
                      <TouchableOpacity
                        key={item.place_id}
                        onPress={() => {
                          setCourse(item.description);
                          setCourseQuery(item.description.split(",")[0]);
                          setCourseResults([]);
                        }}
                        style={{
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          borderBottomWidth: 1,
                          borderBottomColor: C.lightGray,
                        }}
                      >
                        <Text style={{ fontSize: 14, fontFamily: fonts.playfair, color: C.text }}>
                          {item.description}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Member at home course */}
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                <Text style={{ fontSize: 14, fontFamily: fonts.playfair, color: C.text }}>
                  Member at home course
                </Text>
                <TouchableOpacity
                  onPress={() => setIsMember(!isMember)}
                  activeOpacity={0.85}
                  style={{
                    width: 48, height: 28, borderRadius: 14,
                    backgroundColor: isMember ? C.green : C.lightGray,
                    justifyContent: "center",
                    paddingHorizontal: 3,
                  }}
                >
                  <View style={{
                    width: 22, height: 22, borderRadius: 11,
                    backgroundColor: C.white,
                    alignSelf: isMember ? "flex-end" : "flex-start",
                    shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 2, shadowOffset: { width: 0, height: 1 },
                    elevation: 2,
                  }} />
                </TouchableOpacity>
              </View>

              {/* I am a... */}
              <View style={{ marginBottom: 28 }}>
                <Text style={{ fontSize: 14, fontFamily: fonts.playfairBold, color: C.green, marginBottom: 14 }}>
                  I am a...
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {genderOptions.map(({ label }) => {
                    const active = gender === label;
                    return (
                      <TouchableOpacity
                        key={label}
                        onPress={() => setGender(label)}
                        activeOpacity={0.7}
                        style={{
                          paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16,
                          backgroundColor: active ? C.green : "transparent",
                          borderWidth: 1.5, borderColor: active ? C.green : C.border,
                        }}
                      >
                        <Text style={{ fontSize: 13, fontFamily: fonts.playfair, color: active ? C.white : C.darkGray }}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Handicap */}
              <View style={{ marginBottom: 36, position: "relative" }}>
                {!handicap && focusedField !== "handicap" && (
                  <Text style={{ position: "absolute", top: 10, left: 0, fontSize: 14, color: C.midGray, fontFamily: fonts.inter, pointerEvents: "none" }}>
                    Handicap
                  </Text>
                )}
                <TextInput
                  value={handicap}
                  onChangeText={setHandicap}
                  onFocus={() => setFocusedField("handicap")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="numeric"
                  style={{
                    fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto', color: C.text,
                    borderBottomWidth: 1.5, borderBottomColor: focusedField === "handicap" ? C.green : C.border,
                    paddingVertical: 10, paddingHorizontal: 0,
                  }}
                />
              </View>

              {/* ── Section: I spend… ── */}
              <Text style={{ color: C.green, fontSize: 14, fontFamily: fonts.playfairBold, marginBottom: 4 }}>
                I spend…
              </Text>
              <Text style={{ color: C.midGray, fontSize: 14, fontFamily: fonts.playfair, marginBottom: 16 }}>
                Average cost per round
              </Text>
              <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 12, marginBottom: 36 }}>
                <Text style={{ fontSize: 14, fontFamily: fonts.interBold, color: C.green, paddingBottom: 10 }}>9 holes</Text>
                <View style={{ position: "relative", width: 64 }}>
                  {!cost9 && focusedField !== "cost9" && (
                    <Text style={{ position: "absolute", bottom: 10, left: 0, fontSize: 14, color: C.midGray, fontFamily: fonts.inter, pointerEvents: "none" }}>
                      $
                    </Text>
                  )}
                  <TextInput
                    value={cost9}
                    onChangeText={setCost9}
                    onFocus={() => setFocusedField("cost9")}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="numeric"
                    style={{
                      fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto', color: C.text,
                      borderBottomWidth: 1.5, borderBottomColor: focusedField === "cost9" ? C.green : C.border,
                      paddingVertical: 10, paddingHorizontal: 0,
                    }}
                  />
                </View>
                <Text style={{ fontSize: 14, fontFamily: fonts.interBold, color: C.green, paddingBottom: 10 }}>18 holes</Text>
                <View style={{ position: "relative", width: 64 }}>
                  {!cost18 && focusedField !== "cost18" && (
                    <Text style={{ position: "absolute", bottom: 10, left: 0, fontSize: 14, color: C.midGray, fontFamily: fonts.inter, pointerEvents: "none" }}>
                      $
                    </Text>
                  )}
                  <TextInput
                    value={cost18}
                    onChangeText={setCost18}
                    onFocus={() => setFocusedField("cost18")}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="numeric"
                    style={{
                      fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto', color: C.text,
                      borderBottomWidth: 1.5, borderBottomColor: focusedField === "cost18" ? C.green : C.border,
                      paddingVertical: 10, paddingHorizontal: 0,
                    }}
                  />
                </View>
              </View>

              {/* ── Interest sections ── */}
              {INTAKE_SECTIONS.map((section) => {
                if (section.key === "betting" && !interests.formats.includes("Skins / Gambling")) return null;
                const selected = interests[section.key] || [];
                const toggle = (opt: string) => {
                  setInterests((prev) => {
                    const arr = prev[section.key] || [];
                    const exclusive = opt === "All the above"
                      || (section.key === "transport" && opt === "Both")
                      || (section.key === "substances" && opt === "No substances")
                      || (section.key === "betting" && opt === "No money games");
                    if (exclusive) {
                      return { ...prev, [section.key]: arr.includes(opt) ? [] : [opt] };
                    }
                    const withoutExclusive = arr.filter((x) =>
                      x !== "All the above"
                      && !(section.key === "transport" && x === "Both")
                      && !(section.key === "substances" && x === "No substances")
                      && !(section.key === "betting" && x === "No money games")
                    );
                    return {
                      ...prev,
                      [section.key]: arr.includes(opt)
                        ? withoutExclusive.filter((x) => x !== opt)
                        : [...withoutExclusive, opt],
                    };
                  });
                };
                return (
                  <View key={section.key} style={{ marginBottom: 32 }}>
                    <Text style={{ color: C.green, fontSize: 14, fontFamily: fonts.playfairBold, marginBottom: 4 }}>
                      {section.title}
                    </Text>
                    <Text style={{ color: C.midGray, fontSize: 14, fontFamily: fonts.playfair, marginBottom: 8 }}>
                      Select all that apply
                    </Text>
                    <View style={{ borderTopWidth: 1, borderTopColor: "#e8ecf1" }}>
                      {section.options.map((opt, i) => (
                        <CheckRow
                          key={opt}
                          label={opt}
                          active={selected.includes(opt)}
                          onPress={() => toggle(opt)}
                          isLast={i === section.options.length - 1}
                          fonts={fonts}
                        />
                      ))}
                    </View>
                  </View>
                );
              })}

            </ScrollView>
          </KeyboardAvoidingView>

        {/* ── Fixed bottom Continue button ── */}
        {(() => {
          const skinsSelected = interests.formats.includes("Skins / Gambling");
          const visibleKeys = INTAKE_SECTIONS
            .filter((s) => s.key !== "betting" || skinsSelected)
            .map((s) => s.key);
          const allSectionsFilled = visibleKeys.every((k) => (interests[k] || []).length > 0);
          const isComplete = !!name.trim() && !!age && !!course.trim() && !!gender && allSectionsFilled;
          return (
            <TouchableOpacity
              onPress={isComplete ? () => setScreen("profile") : undefined}
              activeOpacity={isComplete ? 0.85 : 1}
              style={{
                margin: 16,
                padding: 16,
                borderRadius: 28,
                backgroundColor: isComplete ? C.green : C.lightGray,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontFamily: fonts.playfairBold, color: isComplete ? C.white : C.midGray }}>
                Continue
              </Text>
            </TouchableOpacity>
          );
        })()}
        </View>
      </Wrap>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: PROFILE BUILDER
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "profile") {
    // Sub-screen: editing a prompt
    if (editingPrompt !== null) {
      return (
        <Wrap swipeBack={() => { setEditingPrompt(null); setSelectedPromptQ(null); setPromptDraft(""); }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.screenPad} keyboardShouldPersistTaps="handled">
              <Text style={[styles.screenHeader, { fontFamily: fonts.playfairSemi, fontSize: 20 }]}>
                Choose a prompt
              </Text>
              <Text style={[styles.subText, { fontFamily: fonts.playfair, marginBottom: 24 }]}>
                Pick one and write your answer
              </Text>

              {/* Prompt selector pills */}
              <View style={styles.pillsWrap}>
                {PROMPTS.map((q, i) => {
                  const active = selectedPromptQ === q;
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        setSelectedPromptQ(q);
                        setPromptDraft(prompts.find((pp) => pp.q === q)?.a || "");
                      }}
                      activeOpacity={0.7}
                      style={[
                        styles.promptPill,
                        {
                          backgroundColor: active ? `${C.green}15` : "transparent",
                          borderColor: active ? C.green : C.border,
                          opacity: active ? 1 : 0.6,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.promptPillText,
                          { fontFamily: active ? fonts.playfairBold : fonts.playfair, color: active ? C.green : C.darkGray },
                        ]}
                      >
                        {q}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {selectedPromptQ && (
                <View style={{ marginTop: 24 }}>
                  <Text style={[{ color: C.green, fontSize: 15, fontFamily: fonts.playfairSemi, marginBottom: 10 }]}>
                    {selectedPromptQ}
                  </Text>
                  <TextInput
                    value={promptDraft}
                    onChangeText={(v) => setPromptDraft(v.slice(0, 225))}
                    placeholder="Write your answer…"
                    placeholderTextColor={C.midGray}
                    multiline
                    style={[styles.promptTextarea, { fontFamily: fonts.playfair }]}
                  />
                  <Text style={[styles.charCount, { fontFamily: fonts.inter }]}>
                    {promptDraft.length}/225
                  </Text>
                </View>
              )}

              <View style={styles.promptBtnRow}>
                <TouchableOpacity
                  onPress={() => { setEditingPrompt(null); setSelectedPromptQ(null); setPromptDraft(""); }}
                  style={styles.cancelBtn}
                >
                  <Text style={[styles.cancelBtnText, { fontFamily: fonts.playfair }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (selectedPromptQ && promptDraft.trim()) {
                      const next = [...prompts];
                      next[editingPrompt] = { q: selectedPromptQ, a: promptDraft.trim() };
                      setPrompts(next);
                    }
                    setEditingPrompt(null);
                    setSelectedPromptQ(null);
                    setPromptDraft("");
                  }}
                  style={[
                    styles.saveBtn,
                    { opacity: selectedPromptQ && promptDraft.trim() ? 1 : 0.4 },
                  ]}
                >
                  <Text style={[styles.saveBtnText, { fontFamily: fonts.playfairBold }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Wrap>
      );
    }

    // Main profile builder
    const photoSlotWidth = (SCREEN_WIDTH - 64 - 20) / 3; // 32px each side + 2 gaps of 10px

    return (
      <Wrap swipeBack={goBack}>
        <ScrollView contentContainerStyle={styles.screenPad} keyboardShouldPersistTaps="handled">
          <Text style={[styles.screenHeader, { fontFamily: fonts.playfairSemi }]}>Build your profile</Text>
          <Text style={[styles.subText, { fontFamily: fonts.playfair, marginBottom: 32 }]}>
            Add photos and answer a few prompts
          </Text>

          {/* Photo grid */}
          <View style={styles.photoGrid}>
            {photos.map((p, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => (p ? removePhoto(i) : pickPhoto(i))}
                activeOpacity={0.8}
                style={[
                  styles.photoSlot,
                  {
                    width: photoSlotWidth,
                    height: photoSlotWidth * (4 / 3),
                    borderStyle: p ? "solid" : "dashed",
                    borderColor: p ? `${C.green}30` : C.border,
                    backgroundColor: p ? C.offWhite : C.white,
                  },
                ]}
              >
                {p ? (
                  <>
                    <Image source={{ uri: p }} style={StyleSheet.absoluteFillObject} borderRadius={12} />
                    <View style={styles.photoRemoveBtn}>
                      <Text style={{ fontSize: 11, color: C.darkGray }}>✕</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                      <Line x1={12} y1={5} x2={12} y2={19} stroke={C.midGray} strokeWidth={1.5} />
                      <Line x1={5}  y1={12} x2={19} y2={12} stroke={C.midGray} strokeWidth={1.5} />
                    </Svg>
                    <Text style={[styles.addPhotoText, { fontFamily: fonts.playfair }]}>Add photo</Text>
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Prompts */}
          <View style={{ marginBottom: 32 }}>
            <Text style={[styles.sectionLabel, { fontFamily: fonts.playfairSemi }]}>Prompts</Text>
            {prompts.map((p, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setEditingPrompt(i);
                  setSelectedPromptQ(p.q);
                  setPromptDraft(p.a);
                }}
                style={styles.promptRow}
              >
                <Text style={[styles.promptQuestion, { fontFamily: fonts.playfairBold }]}>{p.q}</Text>
                {p.a ? (
                  <Text style={[styles.promptAnswer, { fontFamily: fonts.playfair }]}>{p.a}</Text>
                ) : (
                  <Text style={[styles.promptPlaceholder, { fontFamily: fonts.playfair }]}>Tap to answer…</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Btn label="Done →" onPress={() => setScreen("transition")} fonts={fonts} />
        </ScrollView>
      </Wrap>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: CHANGE PHONE
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "change_phone") {
    return (
      <Wrap swipeBack={goBack}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <View style={styles.screenPad}>
            <Text style={[styles.screenHeader, { fontFamily: fonts.playfairSemi, fontSize: 22 }]}>
              Change your number
            </Text>
            <Text style={[styles.subText, { fontFamily: fonts.playfair, marginBottom: 32 }]}>
              Enter your old and new phone numbers
            </Text>

            <Text style={[styles.fieldLabel, { fontFamily: fonts.playfair }]}>Old phone number</Text>
            <View style={[styles.phoneRow, { marginBottom: 28 }]}>
              <View style={styles.countryCode}>
                <Text style={{ fontSize: 18 }}>🇺🇸</Text>
                <Text style={[styles.countryCodeNum, { fontFamily: fonts.interSemi }]}>+1</Text>
                <Text style={[styles.countryChevron, { fontFamily: fonts.inter }]}>▾</Text>
              </View>
              <TextInput
                value={oldPhone}
                onChangeText={setOldPhone}
                keyboardType="phone-pad"
                style={[styles.phoneInput, { fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto' }]}
              />
            </View>

            <Text style={[styles.fieldLabel, { fontFamily: fonts.playfair }]}>New phone number</Text>
            <View style={[styles.phoneRow, { marginBottom: 12 }]}>
              <View style={styles.countryCode}>
                <Text style={{ fontSize: 18 }}>🇺🇸</Text>
                <Text style={[styles.countryCodeNum, { fontFamily: fonts.interSemi }]}>+1</Text>
                <Text style={[styles.countryChevron, { fontFamily: fonts.inter }]}>▾</Text>
              </View>
              <TextInput
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
                style={[styles.phoneInput, { fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto' }]}
              />
            </View>

            <Text style={[styles.helperText, { fontFamily: fonts.playfair }]}>
              We'll send a verification code to your new number.
            </Text>

            <View style={[styles.bottomRow, { justifyContent: "flex-end" }]}>
              <ArrowBtn
                onPress={() => setScreen("change_code")}
                disabled={oldPhone.length < 7 || newPhone.length < 7}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Wrap>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: CHANGE CODE
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "change_code") {
    return (
      <Wrap swipeBack={goBack}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <View style={styles.screenPad}>
            <Text style={[styles.screenHeader, { fontFamily: fonts.playfairSemi }]}>Enter your code</Text>
            <Text style={[styles.subText, { fontFamily: fonts.playfair, marginBottom: 36 }]}>
              Sent to{" "}
              <Text style={{ fontFamily: fonts.inter }}>{newPhone}</Text>
            </Text>
            <View style={styles.otpRow}>
              {changeCode.map((c, i) => (
                <TextInput
                  key={i}
                  ref={(r) => { changeCodeRefs.current[i] = r; }}
                  value={c}
                  onChangeText={(v) => handleChangeCode(i, v)}
                  onKeyPress={({ nativeEvent }) => handleChangeCodeBackspace(i, nativeEvent.key)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[
                    styles.otpInput,
                    { fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto', borderBottomColor: c ? C.green : C.border },
                  ]}
                />
              ))}
            </View>
            <Btn
              label="Verify"
              onPress={() => { setPhone(newPhone); setScreen("verified"); }}
              disabled={!changeCode.every((c) => c)}
              fonts={fonts}
            />
            <TouchableOpacity style={{ alignItems: "center", marginTop: 20 }}>
              <Text style={[styles.resendText, { fontFamily: fonts.playfair }]}>Resend code</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Wrap>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: TRANSITION — "Finding your crew…"
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "transition") {
    const TEST_USER_ID = "a1111111-1111-1111-1111-111111111111";

    const fetchAndAdvance = async () => {
      setLineupError(false);
      try {
        console.log("Fetching lineup for user:", TEST_USER_ID);
        const data = await getLineup(TEST_USER_ID);
        console.log("Lineup data received:", JSON.stringify(data).substring(0, 200));
        setGolfers(data as any[]);
        setScreen("lineup");
      } catch (error: any) {
        console.log("Lineup fetch error:", error?.message || error);
        setLineupError(true);
      }
    };

    // Fetch on mount via one-shot effect rendered inside the screen block.
    // We use a local component so the effect fires when this screen mounts.
    return (
      <TransitionScreen
        onMount={fetchAndAdvance}
        error={lineupError}
        fonts={fonts}
      />
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: LINEUP
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "lineup") {
    return (
      <LineupScreen
        golfers={golfers}
        setGolfers={setGolfers}
        prefsChanged={prefsChanged}
        setPrefsChanged={setPrefsChanged}
        setSelectedGolfer={setSelectedGolfer}
        setDmPrev={setDmPrev}
        setScreen={setScreen}
        fonts={fonts}
      />
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: MESSAGES HOME
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "messages") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.white }}>
        <StatusBar barStyle="dark-content" backgroundColor={C.white} />
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
          <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 20, color: C.green }}>Messages</Text>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {golfers.slice(0, 3).map((g, i) => (
            <TouchableOpacity
              key={g.id}
              activeOpacity={0.7}
              onPress={() => { setSelectedGolfer(g); setDmPrev("messages"); setScreen("dm"); }}
              style={{
                flexDirection: "row", alignItems: "center",
                paddingHorizontal: 20, paddingVertical: 14,
                borderBottomWidth: 0.5, borderBottomColor: "#e5e5e5",
              }}
            >
              <View style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: g.color,
                alignItems: "center", justifyContent: "center",
                marginRight: 14,
              }}>
                <Text style={{ fontFamily: fonts.interBold, fontSize: 15, color: C.white }}>{g.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.interSemi, fontSize: 14, color: C.text }}>{g.name}</Text>
                <Text style={{ fontFamily: fonts.inter, fontSize: 13, color: "#888", marginTop: 2 }}>
                  Tap to start a conversation
                </Text>
              </View>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Polyline points="9,5 17,12 9,19" stroke="#ccc" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <BottomNav screen="messages" setScreen={setScreen} />
      </SafeAreaView>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: DM
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "dm" && selectedGolfer) {
    return (
      <DMScreen
        golfer={selectedGolfer}
        onBack={() => setScreen(dmPrev)}
        fonts={fonts}
      />
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: FOURSOME
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "foursome") {
    return (
      <FoursomeScreen
        golfers={golfers}
        setScreen={setScreen}
        fonts={fonts}
      />
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: SETTINGS
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "settings") {
    return (
      <SettingsScreen setScreen={setScreen} fonts={fonts} />
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: PREFERENCES
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "preferences") {
    return (
      <PreferencesScreen
        radius={radius}
        ageRange={ageRange}
        setRadius={setRadius}
        setAgeRange={setAgeRange}
        setPrefsChanged={setPrefsChanged}
        setGolfers={setGolfers}
        setScreen={setScreen}
        fonts={fonts}
      />
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: ACCOUNT
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "account") {
    return <AccountScreen setScreen={setScreen} fonts={fonts} />;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: HELP
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "help") {
    return <HelpScreen setScreen={setScreen} fonts={fonts} />;
  }

  return null;
}

// ─── Transition Screen (inner component so useEffect fires on mount) ──────────
function TransitionScreen({
  onMount,
  error,
  fonts,
}: {
  onMount: () => void;
  error: boolean;
  fonts: Record<string, string>;
}) {
  useEffect(() => { onMount(); }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.white, alignItems: "center", justifyContent: "center" }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />
      {error ? (
        <>
          <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 16, color: "#555", textAlign: "center", marginHorizontal: 40 }}>
            Couldn't load matches. Tap to retry.
          </Text>
          <TouchableOpacity
            onPress={onMount}
            activeOpacity={0.8}
            style={{ marginTop: 20, backgroundColor: C.green, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 10 }}
          >
            <Text style={{ fontFamily: fonts.playfairSemi, color: "#fff", fontSize: 15 }}>Retry</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 22, color: C.green, marginBottom: 20 }}>
            Finding your crew…
          </Text>
          <ActivityIndicator size="large" color={C.green} />
        </>
      )}
    </SafeAreaView>
  );
}

// ─── DM Screen ───────────────────────────────────────────────────────────────
type DmMessage = { from: "you" | "them"; text: string; time: string };

function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`;
}

function DMScreen({
  golfer,
  onBack,
  fonts,
}: {
  golfer: any;
  onBack: () => void;
  fonts: Record<string, string>;
}) {
  const WELCOME: DmMessage = {
    from: "them",
    text: "Hey! Saw we matched. Down for a round this weekend?",
    time: "",
  };

  const [dmMessages, setDmMessages] = useState<DmMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    getMessages(CURRENT_USER_ID, golfer.id).then((rows) => {
      if (!rows.length) {
        setDmMessages([WELCOME]);
        return;
      }
      setDmMessages(
        rows.map((msg: any) => ({
          from: msg.sender_id === CURRENT_USER_ID ? "you" : "them",
          text: msg.body,
          time: formatTime(msg.created_at),
        }))
      );
    });
  }, [golfer.id]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    const optimistic: DmMessage = { from: "you", text, time: formatTime(new Date().toISOString()) };
    setDmMessages((prev) => [...prev, optimistic]);
    scrollRef.current?.scrollToEnd({ animated: true });
    try {
      await sendMessage(CURRENT_USER_ID, golfer.id, text);
    } catch {
      // keep optimistic message; real sync can happen on next mount
    }
    setSending(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.white }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      <EdgeSwipeBack onBack={onBack} />
      {/* Top bar */}
      <View style={dm.topBar}>
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={{ fontSize: 20, color: C.darkGray }}>←</Text>
        </TouchableOpacity>
        <View style={[dm.avatarSm, { backgroundColor: golfer.color }]}>
          <Text style={{ fontFamily: fonts.interBold, fontSize: 13, color: C.white }}>{golfer.avatar}</Text>
        </View>
        <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 16, color: C.text }}>{golfer.name}</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 8 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          showsVerticalScrollIndicator={false}
        >
          {dmMessages.map((msg, i) => (
            <View
              key={i}
              style={{ alignItems: msg.from === "you" ? "flex-end" : "flex-start" }}
            >
              <View style={[
                dm.bubble,
                msg.from === "you" ? dm.bubbleSent : dm.bubbleReceived,
              ]}>
                <Text style={{
                  fontFamily: fonts.inter,
                  fontSize: 15,
                  color: msg.from === "you" ? C.white : C.text,
                  lineHeight: 21,
                }}>
                  {msg.text}
                </Text>
              </View>
              {!!msg.time && (
                <Text style={{ fontFamily: fonts.inter, fontSize: 10, color: "#999", marginTop: 3, opacity: 0.6 }}>
                  {msg.time}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input bar */}
        <View style={dm.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Message…"
            placeholderTextColor="#bbb"
            style={[dm.input, { fontFamily: fonts.inter }]}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            activeOpacity={0.8}
            style={[dm.sendBtn, { opacity: input.trim() ? 1 : 0.4 }]}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M22 2L11 13" stroke={C.white} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={C.white} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const dm = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  avatarSm: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleSent: {
    backgroundColor: C.green,
    borderBottomRightRadius: 4,
  },
  bubbleReceived: {
    backgroundColor: "#f2f2f2",
    borderBottomLeftRadius: 4,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#e5e5e5",
    backgroundColor: C.white,
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: C.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center",
  },
});

// ─── Custom Slider ───────────────────────────────────────────────────────────
function TrackSlider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const trackWidth = useRef(0);

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
          const x = e.nativeEvent.locationX;
          const ratio = Math.max(0, Math.min(1, x / (trackWidth.current || 1)));
          const raw = min + ratio * (max - min);
          onChange(Math.round(raw / step) * step);
        },
        onPanResponderMove: (e) => {
          const x = e.nativeEvent.locationX;
          const ratio = Math.max(0, Math.min(1, x / (trackWidth.current || 1)));
          const raw = min + ratio * (max - min);
          onChange(Math.round(raw / step) * step);
        },
      }),
    [min, max, step, onChange]
  );

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <View
      style={{ height: 40, justifyContent: "center" }}
      onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width; }}
      {...pan.panHandlers}
    >
      {/* Track background */}
      <View style={{ height: 4, backgroundColor: "#e0e0e0", borderRadius: 2 }}>
        {/* Filled portion */}
        <View style={{ width: `${pct}%`, height: 4, backgroundColor: C.green, borderRadius: 2 }} />
      </View>
      {/* Thumb */}
      <View style={{
        position: "absolute",
        left: `${pct}%`,
        marginLeft: -10,
        width: 20, height: 20, borderRadius: 10,
        backgroundColor: C.green,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2, shadowRadius: 3, elevation: 3,
      }} />
    </View>
  );
}

// ─── Settings Screen ──────────────────────────────────────────────────────────
function SettingsScreen({
  setScreen,
  fonts,
}: {
  setScreen: (s: string) => void;
  fonts: Record<string, string>;
}) {
  const menuItems = [
    {
      label: "Preferences",
      screen: "preferences",
      icon: (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={C.darkGray} strokeWidth={1.8} />
          <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={C.darkGray} strokeWidth={1.8} />
        </Svg>
      ),
    },
    {
      label: "Account",
      screen: "account",
      icon: (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={8} r={4} stroke={C.darkGray} strokeWidth={1.8} />
          <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={C.darkGray} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      ),
    },
    {
      label: "Help center",
      screen: "help",
      icon: (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={9} stroke={C.darkGray} strokeWidth={1.8} />
          <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={C.darkGray} strokeWidth={1.8} strokeLinecap="round" />
          <Circle cx={12} cy={17} r={0.5} fill={C.darkGray} stroke={C.darkGray} strokeWidth={1} />
        </Svg>
      ),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.offWhite }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.offWhite} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 }}>
          <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 22, color: C.green }}>Settings</Text>
        </View>

        {/* Profile card */}
        <View style={st.profileCard}>
          <View style={{ position: "relative", alignSelf: "center", marginBottom: 12 }}>
            <View style={st.profileAvatar}>
              <Text style={{ fontFamily: fonts.interBold, fontSize: 32, color: C.white }}>YO</Text>
            </View>
            <View style={st.editBadge}>
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={C.white} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={C.white} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          </View>
          <Text style={{ fontFamily: fonts.interBold, fontSize: 16, color: C.text, textAlign: "center" }}>Your Name</Text>
          <Text style={{ fontFamily: fonts.inter, fontSize: 13, color: "#888", textAlign: "center", marginTop: 3 }}>Member</Text>
        </View>

        {/* Menu */}
        <View style={st.menuCard}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.screen}
              onPress={() => setScreen(item.screen)}
              activeOpacity={0.7}
              style={[st.menuRow, i < menuItems.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: "#e5e5e5" }]}
            >
              <View style={st.menuIcon}>{item.icon}</View>
              <Text style={{ fontFamily: fonts.inter, fontSize: 15, color: C.text, flex: 1 }}>{item.label}</Text>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Polyline points="9,5 17,12 9,19" stroke="#ccc" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNav screen="settings" setScreen={setScreen} />
    </SafeAreaView>
  );
}

// ─── Preferences Screen ───────────────────────────────────────────────────────
function PreferencesScreen({
  radius,
  ageRange,
  setRadius,
  setAgeRange,
  setPrefsChanged,
  setGolfers,
  setScreen,
  fonts,
}: {
  radius: number;
  ageRange: number[];
  setRadius: (v: number) => void;
  setAgeRange: (v: number[]) => void;
  setPrefsChanged: (v: boolean) => void;
  setGolfers: (g: any[]) => void;
  setScreen: (s: string) => void;
  fonts: Record<string, string>;
}) {
  const [localRadius, setLocalRadius] = useState(radius);
  const [localMin, setLocalMin] = useState(ageRange[0]);
  const [localMax, setLocalMax] = useState(ageRange[1]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getPreferences(CURRENT_USER_ID).then((prefs) => {
      if (prefs) {
        setLocalRadius(prefs.radius_miles ?? radius);
        setLocalMin(prefs.age_min ?? ageRange[0]);
        setLocalMax(prefs.age_max ?? ageRange[1]);
      }
      setLoaded(true);
    });
  }, []);

  const changed =
    loaded &&
    (localRadius !== radius || localMin !== ageRange[0] || localMax !== ageRange[1]);

  const handleSave = async () => {
    if (!changed || saving) return;
    setSaving(true);
    await updatePreferences(CURRENT_USER_ID, localRadius, localMin, localMax);
    setRadius(localRadius);
    setAgeRange([localMin, localMax]);
    setPrefsChanged(true);
    getLineup(CURRENT_USER_ID)
      .then((data) => setGolfers(data as any[]))
      .catch(() => {});
    setSaving(false);
    setScreen("settings");
  };

  const handleMinChange = useCallback((v: number) => {
    setLocalMin(Math.min(v, localMax - 1));
  }, [localMax]);

  const handleMaxChange = useCallback((v: number) => {
    setLocalMax(Math.max(v, localMin + 1));
  }, [localMin]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.offWhite }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.offWhite} />
      <EdgeSwipeBack onBack={() => setScreen("settings")} />

      {/* Header */}
      <View style={st.subHeader}>
        <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 18, color: C.green }}>Preferences</Text>
        <View style={{ width: 22 }} />
      </View>

      {!loaded ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={C.green} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 24, gap: 28 }}>

          {/* Search radius */}
          <View style={st.sliderCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
              <Text style={{ fontFamily: fonts.interSemi, fontSize: 14, color: C.text }}>Search radius</Text>
              <Text style={{ fontFamily: fonts.interBold, fontSize: 14, color: C.green }}>{localRadius} mi</Text>
            </View>
            <TrackSlider value={localRadius} min={1} max={50} step={1} onChange={setLocalRadius} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
              <Text style={{ fontFamily: fonts.inter, fontSize: 11, color: "#bbb" }}>1 mi</Text>
              <Text style={{ fontFamily: fonts.inter, fontSize: 11, color: "#bbb" }}>50 mi</Text>
            </View>
          </View>

          {/* Age range */}
          <View style={st.sliderCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
              <Text style={{ fontFamily: fonts.interSemi, fontSize: 14, color: C.text }}>Age range</Text>
              <Text style={{ fontFamily: fonts.interBold, fontSize: 14, color: C.green }}>{localMin} – {localMax}</Text>
            </View>
            <Text style={{ fontFamily: fonts.inter, fontSize: 12, color: "#aaa", marginBottom: 14 }}>Min age</Text>
            <TrackSlider value={localMin} min={18} max={70} step={1} onChange={handleMinChange} />
            <Text style={{ fontFamily: fonts.inter, fontSize: 12, color: "#aaa", marginTop: 16, marginBottom: 14 }}>Max age</Text>
            <TrackSlider value={localMax} min={18} max={70} step={1} onChange={handleMaxChange} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
              <Text style={{ fontFamily: fonts.inter, fontSize: 11, color: "#bbb" }}>18</Text>
              <Text style={{ fontFamily: fonts.inter, fontSize: 11, color: "#bbb" }}>70</Text>
            </View>
          </View>

          {/* Save */}
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={changed ? 0.85 : 1}
            style={[st.saveBtn, { backgroundColor: changed ? C.green : "#d0d0d0" }]}
          >
            {saving ? (
              <ActivityIndicator color={C.white} size="small" />
            ) : (
              <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 15, color: C.white }}>Save preferences</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── Account Screen ───────────────────────────────────────────────────────────
function AccountScreen({
  setScreen,
  fonts,
}: {
  setScreen: (s: string) => void;
  fonts: Record<string, string>;
}) {
  const rows = [
    { label: "Email",          value: "you@example.com" },
    { label: "Phone",          value: "+1 (555) 100-0001" },
    { label: "Handicap source", value: "USGA GHIN" },
    { label: "GHIN number",    value: "4821039" },
    { label: "Home course",    value: "Torrey Pines" },
    { label: "Member since",   value: "March 2025" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.offWhite }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.offWhite} />
      <EdgeSwipeBack onBack={() => setScreen("settings")} />
      <View style={st.subHeader}>
        <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 18, color: C.green }}>Account</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={st.infoCard}>
          {rows.map((r, i) => (
            <View
              key={r.label}
              style={[st.infoRow, i < rows.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: "#e5e5e5" }]}
            >
              <Text style={{ fontFamily: fonts.inter, fontSize: 13, color: "#888", flex: 1 }}>{r.label}</Text>
              <Text style={{ fontFamily: fonts.interMed, fontSize: 14, color: C.text }}>{r.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={st.signOutBtn} activeOpacity={0.7}>
          <Text style={{ fontFamily: fonts.interSemi, fontSize: 15, color: "#A32D2D" }}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Help Screen ──────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "How does matching work?",
    a: "Scramble scores each golfer against your intake answers across 10 categories — play style, pace, betting, substances, availability, and more. The top matches are refreshed weekly.",
  },
  {
    q: "How often does the lineup refresh?",
    a: "Your lineup updates every Monday morning. When you update your preferences, it re-runs immediately so you see the most relevant matches.",
  },
  {
    q: "What is the 4some?",
    a: "The 4some is a group chat with your top 3 matches. It's a low-pressure way to coordinate a round without direct messaging everyone individually.",
  },
  {
    q: "How do I update my handicap?",
    a: "Your handicap is currently set from your profile. We're working on a GHIN integration to keep it in sync automatically.",
  },
];

function HelpScreen({
  setScreen,
  fonts,
}: {
  setScreen: (s: string) => void;
  fonts: Record<string, string>;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.offWhite }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.offWhite} />
      <EdgeSwipeBack onBack={() => setScreen("settings")} />
      <View style={st.subHeader}>
        <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 18, color: C.green }}>Help center</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 10, paddingBottom: 40 }}>
        {FAQ_ITEMS.map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setOpenIdx(openIdx === i ? null : i)}
            activeOpacity={0.75}
            style={st.faqCard}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontFamily: fonts.interSemi, fontSize: 14, color: C.text, flex: 1, paddingRight: 12 }}>
                {item.q}
              </Text>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                {openIdx === i
                  ? <Polyline points="6,15 12,9 18,15" stroke={C.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  : <Polyline points="6,9 12,15 18,9" stroke="#bbb" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                }
              </Svg>
            </View>
            {openIdx === i && (
              <Text style={{ fontFamily: fonts.inter, fontSize: 14, color: C.darkGray, lineHeight: 22, marginTop: 12 }}>
                {item.a}
              </Text>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={st.contactBtn} activeOpacity={0.8}>
          <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 15, color: C.white }}>Contact support</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  profileCard: {
    backgroundColor: C.white,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
    alignItems: "center",
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#534AB7",
    borderWidth: 3,
    borderColor: "#534AB7",
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.green,
    borderWidth: 2,
    borderColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  menuCard: {
    backgroundColor: C.white,
    marginHorizontal: 20,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  menuIcon: {
    width: 32,
    alignItems: "center",
    marginRight: 12,
  },
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  sliderCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
    padding: 20,
  },
  saveBtn: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  infoCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
    overflow: "hidden",
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  signOutBtn: {
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#e5c0c0",
    backgroundColor: "#fff5f5",
  },
  faqCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
    padding: 18,
  },
  contactBtn: {
    backgroundColor: C.green,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
  },
});

// ─── Foursome Screen ─────────────────────────────────────────────────────────
const FOURSOME_GROUP_ID = "g1111111-1111-1111-1111-111111111111";

type GroupMessage = {
  from: string;
  avatar: string;
  color: string;
  text: string;
  time: string;
  isYou: boolean;
};

function FoursomeScreen({
  golfers,
  setScreen,
  fonts,
}: {
  golfers: any[];
  setScreen: (s: string) => void;
  fonts: Record<string, string>;
}) {
  const YOU = { name: "You", avatar: "YO", color: "#378ADD" };

  const buildSeeds = (): GroupMessage[] => {
    if (golfers.length < 3) return [];
    return [
      { from: golfers[0].name, avatar: golfers[0].avatar, color: golfers[0].color, text: "Torrey Pines Saturday 7:30am? I can book it", time: "9:12 AM", isYou: false },
      { from: golfers[1].name, avatar: golfers[1].avatar, color: golfers[1].color, text: "I'm in. South course?",                          time: "9:14 AM", isYou: false },
      { from: golfers[2].name, avatar: golfers[2].avatar, color: golfers[2].color, text: "Works for me. Let's do it",                      time: "9:15 AM", isYou: false },
    ];
  };

  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    getGroupMessages(FOURSOME_GROUP_ID).then((rows) => {
      if (!rows.length) {
        setMessages(buildSeeds());
        return;
      }
      setMessages(
        rows.map((r: any) => {
          const isYou = r.sender_id === CURRENT_USER_ID;
          const sender = r.profiles;
          return {
            from: isYou ? "You" : (sender?.name ?? ""),
            avatar: isYou ? YOU.avatar : (sender?.avatar_initials ?? "??"),
            color: isYou ? YOU.color : (sender?.avatar_color ?? "#999"),
            text: r.body,
            time: formatTime(r.created_at),
            isYou,
          };
        })
      );
    });
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    const optimistic: GroupMessage = {
      from: "You", avatar: YOU.avatar, color: YOU.color,
      text, time: "Now", isYou: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    scrollRef.current?.scrollToEnd({ animated: true });
    try {
      await sendMessage(CURRENT_USER_ID, CURRENT_USER_ID, text, FOURSOME_GROUP_ID);
    } catch {
      // keep optimistic
    }
    setSending(false);
  };

  const members = [YOU, ...(golfers.slice(0, 3).map((g) => ({ name: g.name, avatar: g.avatar, color: g.color })))];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.white }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      {/* Header */}
      <View style={fs.header}>
        <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 16, color: C.green }}>4some</Text>
        {/* Member strip */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
          {members.map((m, i) => (
            <View key={i} style={{ alignItems: "center", gap: 4 }}>
              <View style={[fs.memberAvatar, { backgroundColor: m.color }]}>
                <Text style={{ fontFamily: fonts.interBold, fontSize: 12, color: C.white }}>{m.avatar}</Text>
              </View>
              <Text style={{ fontFamily: fonts.inter, fontSize: 10, color: "#999" }}>
                {m.name.split(" ")[0]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 8 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, i) => (
            <View key={i} style={{ alignItems: msg.isYou ? "flex-end" : "flex-start" }}>
              {!msg.isYou && (
                <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, maxWidth: "78%" }}>
                  <View style={[fs.bubbleAvatar, { backgroundColor: msg.color }]}>
                    <Text style={{ fontFamily: fonts.interBold, fontSize: 10, color: C.white }}>{msg.avatar}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fonts.inter, fontSize: 11, color: "#888", marginBottom: 3 }}>
                      {msg.from}
                    </Text>
                    <View style={[fs.bubble, fs.bubbleReceived]}>
                      <Text style={{ fontFamily: fonts.inter, fontSize: 15, color: C.text, lineHeight: 21 }}>
                        {msg.text}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              {msg.isYou && (
                <View style={[fs.bubble, fs.bubbleSent]}>
                  <Text style={{ fontFamily: fonts.inter, fontSize: 15, color: C.white, lineHeight: 21 }}>
                    {msg.text}
                  </Text>
                </View>
              )}
              {!!msg.time && (
                <Text style={{ fontFamily: fonts.inter, fontSize: 10, color: "#999", marginTop: 3, opacity: 0.6 }}>
                  {msg.time}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input bar */}
        <View style={dm.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Message the group…"
            placeholderTextColor="#bbb"
            style={[dm.input, { fontFamily: fonts.inter }]}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            activeOpacity={0.8}
            style={[dm.sendBtn, { opacity: input.trim() ? 1 : 0.4 }]}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M22 2L11 13" stroke={C.white} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={C.white} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <BottomNav screen="foursome" setScreen={setScreen} />
    </SafeAreaView>
  );
}

const fs = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: "100%",
  },
  bubbleSent: {
    backgroundColor: C.green,
    borderBottomRightRadius: 4,
    maxWidth: "78%",
  },
  bubbleReceived: {
    backgroundColor: "#f2f2f2",
    borderBottomLeftRadius: 4,
  },
});

// ─── Match Badge ─────────────────────────────────────────────────────────────
function MatchBadge({ pct, fonts }: { pct: number; fonts: Record<string, string> }) {
  const good = pct >= 90;
  return (
    <View style={{
      backgroundColor: good ? "#1D9E7520" : "#BA751720",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 3,
    }}>
      <Text style={{ fontFamily: fonts.interSemi, fontSize: 12, color: good ? "#0F6E56" : "#854F0B" }}>
        {pct}% match
      </Text>
    </View>
  );
}

// ─── Lineup Screen ────────────────────────────────────────────────────────────
function LineupScreen({
  golfers,
  setGolfers,
  prefsChanged,
  setPrefsChanged,
  setSelectedGolfer,
  setDmPrev,
  setScreen,
  fonts,
}: {
  golfers: any[];
  setGolfers: (g: any[]) => void;
  prefsChanged: boolean;
  setPrefsChanged: (v: boolean) => void;
  setSelectedGolfer: (g: any) => void;
  setDmPrev: (s: string) => void;
  setScreen: (s: string) => void;
  fonts: Record<string, string>;
}) {
  const TEST_USER_ID = "a1111111-1111-1111-1111-111111111111";
  const [expandedId, setExpandedId] = useState<string | null>(golfers[0]?.id ?? null);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const cardOffsets = useRef<Record<string, number>>({});

  // Refresh lineup when prefs changed flag is set
  useEffect(() => {
    if (!prefsChanged) return;
    setRefreshing(true);
    getLineup(TEST_USER_ID)
      .then((data) => {
        setGolfers(data as any[]);
        setExpandedId((data as any[])[0]?.id ?? null);
        setPrefsChanged(false);
      })
      .catch(() => {})
      .finally(() => setRefreshing(false));
  }, [prefsChanged]);

  const handleExpand = (id: string) => {
    setExpandedId(id);
    const offset = cardOffsets.current[id];
    if (offset !== undefined) {
      scrollRef.current?.scrollTo({ y: offset - 16, animated: true });
    }
  };

  const visible = golfers.slice(0, 3);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.offWhite }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.offWhite} />

      {/* ── Header ── */}
      <View style={{ backgroundColor: C.offWhite, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 }}>
        <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 20, color: C.green }}>Lineup</Text>
        <Text style={{ fontFamily: fonts.inter, fontSize: 13, color: "#888", marginTop: 2 }}>
          Best matched partners for the week
        </Text>

        {/* Prefs-changed banner */}
        {prefsChanged && (
          <View style={{
            flexDirection: "row", alignItems: "center", gap: 8,
            backgroundColor: "#1D9E7515", borderRadius: 10,
            paddingHorizontal: 14, paddingVertical: 10, marginTop: 10,
          }}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M20 6L9 17l-5-5" stroke={C.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={{ fontFamily: fonts.inter, fontSize: 13, color: C.green }}>
              Lineup refreshed with your new filters
            </Text>
          </View>
        )}

        {refreshing && (
          <View style={{ alignItems: "center", paddingVertical: 8 }}>
            <ActivityIndicator size="small" color={C.green} />
          </View>
        )}
      </View>

      {/* ── Cards ── */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {visible.map((g, index) => (
          <View
            key={g.id}
            onLayout={(e) => { cardOffsets.current[g.id] = e.nativeEvent.layout.y; }}
          >
            {g.id === expandedId ? (
              <ExpandedCard
                g={g}
                index={index}
                fonts={fonts}
                onCollapse={() => setExpandedId(null)}
                onMessage={() => {
                  setSelectedGolfer(g);
                  setDmPrev("lineup");
                  setScreen("dm");
                }}
              />
            ) : (
              <CollapsedCard g={g} index={index} fonts={fonts} onExpand={() => handleExpand(g.id)} />
            )}
          </View>
        ))}
      </ScrollView>

      <BottomNav screen="lineup" setScreen={setScreen} />
    </SafeAreaView>
  );
}

// ─── Expanded Card ────────────────────────────────────────────────────────────
function ExpandedCard({
  g,
  index,
  fonts,
  onCollapse,
  onMessage,
}: {
  g: any;
  index: number;
  fonts: Record<string, string>;
  onCollapse: () => void;
  onMessage: () => void;
}) {
  const firstName = g.name.split(" ")[0];

  const intakeRows = [
    { label: "Rounds / month", value: g.intake?.roundsPerMonth },
    { label: "Drinks",         value: g.intake?.drinkOnCourse },
    { label: "Betting",        value: g.intake?.bettingGames },
    { label: "Music",          value: g.intake?.musicOnCourse },
    { label: "Gimme putts",    value: g.intake?.gimmePutt },
    { label: "Preferred tees", value: g.intake?.preferredTees },
    { label: "Walk / ride",    value: g.intake?.walkOrRide },
    { label: "Group vibe",     value: g.intake?.idealGroupVibe },
  ];

  return (
    <View style={ls.card}>
      {/* Hero */}
      <TouchableOpacity activeOpacity={0.85} onPress={onCollapse}>
        <View style={[ls.hero, { overflow: "hidden" }]}>
          <Image
            source={STOCK_IMAGES[index % STOCK_IMAGES.length]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", resizeMode: "cover" }}
          />
          <View style={[ls.avatarLg, { backgroundColor: g.color + "cc", borderWidth: 3, borderColor: C.white }]}>
            <Text style={[ls.avatarLgText, { fontFamily: fonts.interBold }]}>{g.avatar}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={{ padding: 18 }}>
        {/* Name + badge */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Text style={{ fontFamily: fonts.playfairBold, fontSize: 20, color: C.text }}>{g.name}</Text>
          <MatchBadge pct={g.match} fonts={fonts} />
        </View>

        {/* Age / handicap */}
        <Text style={{ fontFamily: fonts.inter, fontSize: 13, color: "#888", marginBottom: 14 }}>
          Age {g.age} · HCP {g.handicap?.toFixed(1)}
        </Text>

        {/* Bio */}
        {!!g.bio && (
          <Text style={{ fontFamily: fonts.inter, fontSize: 14, color: C.text, lineHeight: 22, marginBottom: 16 }}>
            {g.bio}
          </Text>
        )}

        {/* Tag pills */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {[g.style, g.pace, g.availability].filter(Boolean).map((tag: string) => (
            <View key={tag} style={ls.pill}>
              <Text style={{ fontFamily: fonts.inter, fontSize: 11, color: C.darkGray }}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Survey answers */}
        <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 13, color: C.green, marginBottom: 10 }}>
          Survey answers
        </Text>
        <View style={ls.intakeBox}>
          {intakeRows.filter((r) => !!r.value).map((r, i, arr) => (
            <View
              key={r.label}
              style={[ls.intakeRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}
            >
              <Text style={{ fontFamily: fonts.inter, fontSize: 12, color: "#999", flex: 1 }}>{r.label}</Text>
              <Text style={{ fontFamily: fonts.interMed, fontSize: 13, color: C.text, flex: 2, textAlign: "right" }}>
                {r.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Favorite courses */}
        {g.faves?.length > 0 && (
          <View style={{ marginTop: 18 }}>
            <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 13, color: C.green, marginBottom: 10 }}>
              Favorite courses
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {g.faves.map((course: string) => (
                <View key={course} style={ls.coursePill}>
                  <Text style={{ fontFamily: fonts.inter, fontSize: 12, color: C.darkGray }}>{course}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Prompts */}
        {g.prompts?.length > 0 && (
          <View style={{ marginTop: 18 }}>
            <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 13, color: C.green, marginBottom: 10 }}>
              In their words
            </Text>
            {g.prompts.map((p: any, i: number) => (
              <View key={i} style={{ marginBottom: 14 }}>
                <Text style={{ fontFamily: fonts.playfair, fontSize: 13, color: "#999", fontStyle: "italic", marginBottom: 3 }}>
                  {p.question}
                </Text>
                <Text style={{ fontFamily: fonts.inter, fontSize: 14, color: C.text, lineHeight: 21 }}>
                  {p.answer}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Message button */}
        <TouchableOpacity onPress={onMessage} activeOpacity={0.85} style={ls.messageBtn}>
          <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 15, color: C.white }}>
            Message {firstName}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Collapsed Card ───────────────────────────────────────────────────────────
function CollapsedCard({
  g,
  index,
  fonts,
  onExpand,
}: {
  g: any;
  index: number;
  fonts: Record<string, string>;
  onExpand: () => void;
}) {
  return (
    <TouchableOpacity onPress={onExpand} activeOpacity={0.75} style={ls.collapsedCard}>
      <View style={[ls.avatarSm, { overflow: "hidden" }]}>
        <Image
          source={STOCK_IMAGES[index % STOCK_IMAGES.length]}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        />
      </View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontFamily: fonts.playfairSemi, fontSize: 16, color: C.text }}>{g.name}</Text>
          <MatchBadge pct={g.match} fonts={fonts} />
        </View>
        <Text style={{ fontFamily: fonts.inter, fontSize: 12, color: "#999", marginTop: 2 }}>
          HCP {g.handicap?.toFixed(1)} · {g.availability}
        </Text>
      </View>
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Polyline points="6,9 12,15 18,9" stroke="#bbb" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </TouchableOpacity>
  );
}

// ─── Lineup styles ────────────────────────────────────────────────────────────
const ls = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
  },
  hero: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLgText: {
    fontSize: 34,
    color: C.white,
  },
  pill: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  intakeBox: {
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    overflow: "hidden",
  },
  intakeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  coursePill: {
    borderWidth: 0.5,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  messageBtn: {
    marginTop: 22,
    backgroundColor: C.green,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  collapsedCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  avatarSm: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
});

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.white,
  },

  // ── Wrap ──
  wrapHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 8,
  },
  backBtn: {
    padding: 4,
    flexShrink: 0,
  },
  backArrow: {
    fontSize: 20,
    color: C.darkGray,
  },

  // ── Screen content ──
  screenPad: {
    padding: 32,
    paddingTop: 36,
    flexGrow: 1,
  },
  screenHeader: {
    color: C.green,
    fontSize: 24,
    marginBottom: 6,
    lineHeight: 32,
  },
  subText: {
    color: C.midGray,
    fontSize: 14,
    fontWeight: "400",
  },
  helperText: {
    color: C.midGray,
    fontSize: 13,
    lineHeight: 20,
  },
  fieldLabel: {
    color: C.darkGray,
    fontSize: 13,
    marginBottom: 6,
  },

  // ── Floating golf ball FAB ──
  fabPosition: {
    position: "absolute",
    right: 32,
    bottom: 40,
  },

  // ── Golf ball button ──
  golfBallBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  // ── Or divider ──
  orDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  orText: {
    fontSize: 12,
    color: C.midGray,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // ── Bottom row ──
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto" as any,
    paddingTop: 24,
    paddingBottom: 16,
  },

  // ── Home screen ──
  homeScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.38)",
  },
  homeInner: {
    flex: 1,
    paddingHorizontal: 36,
    justifyContent: "space-between",
  },
  homeTop: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 24,
  },
  homeTitle: {
    fontSize: 36,
    color: C.white,
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  homeSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
  },
  homeBottom: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createAccountBtn: {
    width: "100%",
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1.5,
    borderColor: C.white,
    alignItems: "center",
  },
  createAccountText: {
    fontSize: 14.4,
    color: C.white,
  },
  signInText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  termsText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    paddingVertical: 16,
    paddingBottom: 28,
  },

  // ── Phone screen ──
  phoneRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 16,
    marginBottom: 12,
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: C.border,
    flexShrink: 0,
  },
  countryCodeNum: {
    fontSize: 16,
    color: C.green,
  },
  countryChevron: {
    fontSize: 12,
    color: C.midGray,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: C.border,
    color: C.text,
    fontSize: 24,
    letterSpacing: 0.5,
  },
  linkText: {
    color: C.green,
    fontSize: 14,
  },

  // ── OTP ──
  otpRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginBottom: 36,
  },
  otpInput: {
    width: 46,
    height: 54,
    textAlign: "center",
    fontSize: 36,
    fontWeight: "300",
    backgroundColor: "transparent",
    borderBottomWidth: 2,
    color: C.text,
  },
  resendText: {
    color: C.midGray,
    fontSize: 14,
  },

  // ── BigField ──
  bigFieldWrap: {
    marginBottom: 20,
  },
  bigFieldInput: {
    paddingVertical: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: C.border,
    color: C.text,
    fontSize: 24,
  },

  // ── Interest list rows ──
  interestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.lightGray,
  },
  interestRowText: {
    fontSize: 16,
    flex: 1,
    paddingRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: C.green,
    borderColor: C.green,
  },

  // ── Pills ──
  pillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "500",
  },

  // ── Full green button ──
  btn: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 28,
    backgroundColor: C.green,
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.white,
  },

  // ── City screen ──
  mapContainer: {
    flex: 1,
    borderRadius: 16,
    marginBottom: 20,
    minHeight: 360,
    overflow: "hidden",
    position: "relative",
  },
  mapPin: {
    position: "absolute",
    // center horizontally, offset upward so the point sits at map center
    top: "50%",
    left: "50%",
    marginLeft: -12,   // half of pin width
    marginTop: -30,    // full pin height (point is at bottom)
  },
  cityBadge: {
    position: "absolute",
    bottom: 44,
    alignSelf: "center",
    backgroundColor: C.green,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  cityBadgeText: {
    color: C.white,
    fontSize: 14,
  },
  gpsButton: {
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.white,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  gpsButtonText: {
    fontSize: 9,
    color: C.text,
  },
  zipInput: {
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: C.offWhite,
    borderRadius: 8,
    color: C.text,
    fontSize: 16,
    letterSpacing: 1,
  },

  // ── Profile ──
  photoGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 36,
  },
  photoSlot: {
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    overflow: "hidden",
  },
  addPhotoText: {
    color: C.midGray,
    fontSize: 12,
  },
  photoRemoveBtn: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    color: C.green,
    fontSize: 16,
    marginBottom: 16,
  },
  promptRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.lightGray,
  },
  promptQuestion: {
    color: C.green,
    fontSize: 14,
    marginBottom: 4,
  },
  promptAnswer: {
    color: C.text,
    fontSize: 15,
    lineHeight: 22,
  },
  promptPlaceholder: {
    color: C.midGray,
    fontSize: 14,
    fontStyle: "italic",
  },

  // ── Prompt editing ──
  promptPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 4,
  },
  promptPillText: {
    fontSize: 13,
  },
  promptTextarea: {
    paddingTop: 0,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: C.border,
    color: C.text,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    color: C.midGray,
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
  },
  promptBtnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.white,
    alignItems: "center",
  },
  cancelBtnText: {
    color: C.darkGray,
    fontSize: 15,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 28,
    backgroundColor: C.green,
    alignItems: "center",
  },
  saveBtnText: {
    color: C.white,
    fontSize: 15,
  },
});
