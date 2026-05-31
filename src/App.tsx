import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Music,
  Sparkles,
  Copy,
  Share2,
  Terminal,
  MessageSquare,
  User,
  Sliders,
  CheckCircle2,
  Info,
  X,
  Clock,
  Radio,
  Cpu,
  Keyboard,
  Disc,
  Monitor,
  RotateCcw,
  Skull,
  Zap
} from "lucide-react";

// YouTube global types for TS safety
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface GuestbookMessage {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  isVip?: boolean;
}

interface SequencerPattern {
  kick: boolean[];
  snare: boolean[];
  hihat: boolean[];
  synth: boolean[];
}

export default function App() {
  // Query parameters and states
  const [username, setUsername] = useState("blockcraft2014_73772");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://cdn.discordapp.com/avatars/1360838133498908673/96d053a8ccfd346944251eccdf453190.png?size=256"
  );
  const [discordId, setDiscordId] = useState("1360838133498908673");
  const [isVerified, setIsVerified] = useState(true);
  const [youtubeId, setYoutubeId] = useState("aYPN0tdere8");
  const [glowTheme, setGlowTheme] = useState<"purple" | "cyan" | "rose" | "amber" | "emerald" | "blue">("purple");
  
  // Skin Styles
  const [skinStyle, setSkinStyle] = useState<"matrix" | "neon-sunset" | "stealth" | "emperor-gold">("matrix");

  // Interactive states
  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState<"off" | "low" | "medium" | "high">("medium");
  const [activeTab, setActiveTab] = useState<"bio" | "soundboard" | "sequencer" | "guestbook" | "space">("bio");
  
  // Animation states
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [nameTilt, setNameTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [isBeating, setIsBeating] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(24).fill(4));

  // Interactive Drum & Bass Sequencer State
  const [sequencerBPM, setSequencerBPM] = useState(126);
  const [isSequencerPlaying, setIsSequencerPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sequencerPattern, setSequencerPattern] = useState<SequencerPattern>({
    kick:  [true,  false, false, false, true,  false, false, false],
    snare: [false, false, true,  false, false, false, true,  false],
    hihat: [true,  true,  true,  true,  true,  true,  true,  true],
    synth: [true,  false, false, true,  false, true,  false, false],
  });

  // Holographic Cyber Stickers
  const [activeStickers, setActiveStickers] = useState<string[]>(["💀 HYPER_ROOT", "⚡ OVERCLOCKED"]);
  const stickerOptions = [
    "💀 HYPER_ROOT",
    "⚡ OVERCLOCKED",
    "👾 SHADOW",
    "🛡️ LEVEL_99",
    "🔮 DMAX_CORE",
    "👽 NEON_SOUL",
    "🛰️ PROXY_BYPASS",
    "🔥 HOTWIRE"
  ];

  // Discord Status Activity Widget
  const [discordStatusText, setDiscordStatusText] = useState("Coding in VS Code...");
  const [discordActivityType, setDiscordActivityType] = useState<"PLAYING" | "CODING" | "STREAMING">("CODING");
  const [discordDetails, setDiscordDetails] = useState("Mining sector-9 database");

  // Custom Cyber Terminal Console Logs & Input
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYSTEM] Decryption protocol active...",
    "[SYSTEM] Command core online. Type /help for secret inputs."
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [isGlitching, setIsGlitching] = useState(false);
  const [isRainbowMode, setIsRainbowMode] = useState(false);
  const [cassettePitch, setCassettePitch] = useState(1.0); // Pitch rate visual modifier
  const [isMatrixRainActive, setIsMatrixRainActive] = useState(true);

  // Guestbook states
  const [guestName, setGuestName] = useState("");
  const [guestMsg, setGuestMsg] = useState("");
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);

  // Customizer UI states
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [customizerName, setCustomizerName] = useState("blockcraft2014_73772");
  const [customizerAvatar, setCustomizerAvatar] = useState(
    "https://cdn.discordapp.com/avatars/1360838133498908673/96d053a8ccfd346944251eccdf453190.png?size=256"
  );
  const [customizerYoutube, setCustomizerYoutube] = useState("aYPN0tdere8");
  const [customizerId, setCustomizerId] = useState("1360838133498908673");
  const [customizerVerified, setCustomizerVerified] = useState(true);
  const [customizerDetails, setCustomizerDetails] = useState("Mining sector-9 database");

  // Refs
  const playerRef = useRef<any>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Theme configuration styles mapping
  const themeConfig = {
    purple: {
      glow: "shadow-[0_0_50px_rgba(168,85,247,0.25)] border-purple-500/25",
      glowPulse: "shadow-[0_0_70px_rgba(168,85,247,0.5)] border-purple-400/50",
      text: "text-purple-400",
      textGlow: "drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]",
      bg: "bg-purple-500/10",
      accent: "bg-purple-600",
      accentHover: "hover:bg-purple-500",
      badge: "border-purple-500/30 text-purple-400 bg-purple-950/35",
      wave: "bg-gradient-to-t from-purple-600 via-fuchsia-500 to-purple-400",
      borderAccent: "border-purple-500/40"
    },
    cyan: {
      glow: "shadow-[0_0_50px_rgba(6,182,212,0.25)] border-cyan-500/25",
      glowPulse: "shadow-[0_0_70px_rgba(6,182,212,0.5)] border-cyan-400/50",
      text: "text-cyan-400",
      textGlow: "drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]",
      bg: "bg-cyan-500/10",
      accent: "bg-cyan-600",
      accentHover: "hover:bg-cyan-500",
      badge: "border-cyan-500/30 text-cyan-400 bg-cyan-950/35",
      wave: "bg-gradient-to-t from-cyan-600 via-teal-500 to-cyan-400",
      borderAccent: "border-cyan-500/40"
    },
    rose: {
      glow: "shadow-[0_0_50px_rgba(244,63,94,0.25)] border-rose-500/25",
      glowPulse: "shadow-[0_0_70px_rgba(244,63,94,0.5)] border-rose-400/50",
      text: "text-rose-400",
      textGlow: "drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]",
      bg: "bg-rose-500/10",
      accent: "bg-rose-600",
      accentHover: "hover:bg-rose-500",
      badge: "border-rose-500/30 text-rose-400 bg-rose-950/35",
      wave: "bg-gradient-to-t from-rose-600 via-pink-500 to-rose-400",
      borderAccent: "border-rose-500/40"
    },
    amber: {
      glow: "shadow-[0_0_50px_rgba(245,158,11,0.25)] border-amber-500/25",
      glowPulse: "shadow-[0_0_70px_rgba(245,158,11,0.5)] border-amber-400/50",
      text: "text-amber-400",
      textGlow: "drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]",
      bg: "bg-amber-500/10",
      accent: "bg-amber-600",
      accentHover: "hover:bg-amber-500",
      badge: "border-amber-500/30 text-amber-400 bg-amber-950/35",
      wave: "bg-gradient-to-t from-amber-600 via-yellow-500 to-amber-400",
      borderAccent: "border-amber-500/40"
    },
    emerald: {
      glow: "shadow-[0_0_50px_rgba(16,185,129,0.25)] border-emerald-500/25",
      glowPulse: "shadow-[0_0_70px_rgba(16,185,129,0.5)] border-emerald-400/50",
      text: "text-emerald-400",
      textGlow: "drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]",
      bg: "bg-emerald-500/10",
      accent: "bg-emerald-600",
      accentHover: "hover:bg-emerald-500",
      badge: "border-emerald-500/30 text-emerald-400 bg-emerald-950/35",
      wave: "bg-gradient-to-t from-emerald-600 via-lime-500 to-emerald-400",
      borderAccent: "border-emerald-500/40"
    },
    blue: {
      glow: "shadow-[0_0_50px_rgba(59,130,246,0.25)] border-blue-500/25",
      glowPulse: "shadow-[0_0_70px_rgba(59,130,246,0.5)] border-blue-400/50",
      text: "text-blue-400",
      textGlow: "drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]",
      bg: "bg-blue-500/10",
      accent: "bg-blue-600",
      accentHover: "hover:bg-blue-500",
      badge: "border-blue-500/30 text-blue-400 bg-blue-950/35",
      wave: "bg-gradient-to-t from-blue-600 via-indigo-500 to-blue-400",
      borderAccent: "border-blue-500/40"
    }
  };

  // Preset skin card background and general card styling definitions
  const skinStyleConfig = {
    matrix: {
      cardBg: "bg-[#08080c]/90 backdrop-blur-xl border-white/10",
      panelBg: "bg-black/40 border border-white/5",
      gridAccent: "rgba(16, 185, 129, 0.06)",
      font: "font-mono"
    },
    "neon-sunset": {
      cardBg: "bg-gradient-to-b from-[#160b22]/90 to-[#05020b]/95 backdrop-blur-xl border-pink-500/20",
      panelBg: "bg-purple-950/20 border border-pink-500/15",
      gridAccent: "rgba(236, 72, 153, 0.06)",
      font: "font-sans"
    },
    stealth: {
      cardBg: "bg-[#030303]/95 backdrop-blur-2xl border-zinc-800",
      panelBg: "bg-zinc-900/40 border border-zinc-800/50",
      gridAccent: "rgba(255, 255, 255, 0.02)",
      font: "font-mono"
    },
    "emperor-gold": {
      cardBg: "bg-gradient-to-br from-[#110d03]/95 via-[#070501]/98 to-[#0e0a02]/95 backdrop-blur-xl border-amber-500/35",
      panelBg: "bg-[#181307]/35 border border-amber-500/15",
      gridAccent: "rgba(245, 158, 11, 0.04)",
      font: "font-sans"
    }
  };

  // 1. Parse Query Parameters on Mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const queryUser = params.get("username");
    const queryAvatar = params.get("avatar_url");
    const queryId = params.get("id");
    const queryVerified = params.get("verified");
    const queryYt = params.get("youtube_id") || params.get("yt");
    const queryGlow = params.get("glow") as any;
    const querySkin = params.get("skin") as any;
    const queryStickers = params.get("stickers");
    const queryStatus = params.get("status_text");
    const queryDetails = params.get("details");

    if (queryUser) {
      setUsername(queryUser);
      setCustomizerName(queryUser);
    }
    if (queryAvatar) {
      setAvatarUrl(queryAvatar);
      setCustomizerAvatar(queryAvatar);
    }
    if (queryId) {
      setDiscordId(queryId);
      setCustomizerId(queryId);
    }
    if (queryVerified !== null) {
      const verifiedVal = queryVerified === "true";
      setIsVerified(verifiedVal);
      setCustomizerVerified(verifiedVal);
    }
    if (queryYt) {
      setYoutubeId(queryYt);
      setCustomizerYoutube(queryYt);
    }
    if (queryGlow && ["purple", "cyan", "rose", "amber", "emerald", "blue"].includes(queryGlow)) {
      setGlowTheme(queryGlow);
    }
    if (querySkin && ["matrix", "neon-sunset", "stealth", "emperor-gold"].includes(querySkin)) {
      setSkinStyle(querySkin);
    }
    if (queryStickers) {
      try {
        setActiveStickers(JSON.parse(decodeURIComponent(queryStickers)));
      } catch (e) {
        console.error("Failed parsing query stickers", e);
      }
    }
    if (queryStatus) {
      setDiscordStatusText(decodeURIComponent(queryStatus));
    }
    if (queryDetails) {
      setDiscordDetails(decodeURIComponent(queryDetails));
      setCustomizerDetails(decodeURIComponent(queryDetails));
    }

    // Initialize Guestbook
    const stored = localStorage.getItem("cyber_vibe_guestbook_v2");
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      const defaults: GuestbookMessage[] = [
        {
          id: "1",
          name: "⚙️ Matrix Operator",
          message: "Cybernetic core fully integrated. Stars and blurry glows removed. Animated Grid Matrix activated. 📡",
          timestamp: new Date(Date.now() - 3600000 * 2).toLocaleDateString(),
          isVip: true
        },
        {
          id: "2",
          name: "blockcraft2014_73772",
          message: "Welcome to my upgraded bio space! Use the Drum & Bass Sequencer to create custom loops. 🎧🔊",
          timestamp: new Date(Date.now() - 3600000).toLocaleDateString(),
          isVip: true
        }
      ];
      setMessages(defaults);
      localStorage.setItem("cyber_vibe_guestbook_v2", JSON.stringify(defaults));
    }
  }, []);

  // Dynamic Canvas-based Matrix Rain Overlay
  useEffect(() => {
    if (!isMatrixRainActive) return;

    const canvas = matrixCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // Matrix character list
    const matrixChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ".split("");
    const fontSize = 11;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      // Semi-transparent black to clear screen & leave gorgeous trails
      ctx.fillStyle = "rgba(2, 2, 5, 0.07)";
      ctx.fillRect(0, 0, width, height);

      // Matrix color scheme depending on skin
      if (skinStyle === "neon-sunset") {
        ctx.fillStyle = "rgba(236, 72, 153, 0.7)"; // Hot pink
      } else if (skinStyle === "emperor-gold") {
        ctx.fillStyle = "rgba(245, 158, 11, 0.6)"; // Amber Gold
      } else if (skinStyle === "stealth") {
        ctx.fillStyle = "rgba(160, 160, 160, 0.4)"; // Dim silver
      } else {
        // Classic cyber green
        ctx.fillStyle = "rgba(16, 185, 129, 0.8)"; 
      }

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMatrixRainActive, skinStyle]);

  // 2. Load & Initialize YouTube Iframe Player API
  useEffect(() => {
    const loadYoutubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };

      if (window.YT && window.YT.Player) {
        initializePlayer();
      }
    };

    const initializePlayer = () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error(e);
        }
      }

      playerRef.current = new window.YT.Player("bg-video-player", {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: youtubeId,
          mute: 1, 
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          enablejsapi: 1
        },
        events: {
          onReady: (event: any) => {
            setPlayerReady(true);
            event.target.setVolume(volume);
            if (hasEntered) {
              event.target.unMute();
              event.target.playVideo();
              setIsPlaying(true);
            }
          },
          onStateChange: (event: any) => {
            if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 2) {
              setIsPlaying(false);
            }
          }
        }
      });
    };

    loadYoutubeAPI();

    return () => {
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, [youtubeId]);

  // 3. Sync state changes with YouTube Player
  useEffect(() => {
    if (playerRef.current && playerReady && typeof playerRef.current.setVolume === "function") {
      playerRef.current.setVolume(volume);
    }
  }, [volume, playerReady]);

  useEffect(() => {
    if (playerRef.current && playerReady && typeof playerRef.current.mute === "function") {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
  }, [isMuted, playerReady]);

  // 4. Phonk Beat Rhythm
  useEffect(() => {
    if (!isPlaying || !hasEntered || shakeIntensity === "off") {
      setIsBeating(false);
      return;
    }

    const interval = setInterval(() => {
      setIsBeating(true);
      setTimeout(() => {
        setIsBeating(false);
      }, 150);
    }, 476); // ~126 BPM beat duration

    return () => clearInterval(interval);
  }, [isPlaying, hasEntered, shakeIntensity]);

  // 5. Elapsed Time Counter
  useEffect(() => {
    if (!hasEntered) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [hasEntered]);

  // 6. Interactive Equalizer Visualizer Bounces
  useEffect(() => {
    if (!isPlaying) {
      const fadeInterval = setInterval(() => {
        setVisualizerBars((prev) => {
          if (prev.every((b) => b <= 4)) {
            clearInterval(fadeInterval);
            return prev;
          }
          return prev.map((val) => Math.max(4, val - 2));
        });
      }, 100);
      return () => clearInterval(fadeInterval);
    }

    const bounceInterval = setInterval(() => {
      setVisualizerBars((prev) =>
        prev.map((_, idx) => {
          // Generate beautiful logarithmic frequency look
          const isBeatPulse = isBeating && (idx % 3 === 0 || idx < 5);
          const baseMultiplier = isBeatPulse ? 80 : 45;
          const noise = Math.random() * baseMultiplier;
          const positionModifier = Math.sin((idx / 24) * Math.PI) * 20;
          return Math.max(8, Math.round(10 + noise + positionModifier));
        })
      );
    }, 95);

    return () => clearInterval(bounceInterval);
  }, [isPlaying, isBeating]);

  // 7. Sound Synth Generator Engine (Web Audio API)
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
  };

  // Plays clean procedural soundboard effects
  const playSynthesizedSound = (type: "bass" | "laser" | "beep" | "sweep" | "arcade" | "alarm") => {
    try {
      initAudioContext();
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;
      const finalVolume = (volume / 100) * 0.35 * cassettePitch; 

      if (type === "bass") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(130 * cassettePitch, now);
        osc.frequency.exponentialRampToValueAtTime(35 * cassettePitch, now + 0.6);
        
        // Lowpass filter for authentic sub bass feel
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(180, now);
        osc.disconnect(gainNode);
        osc.connect(filter);
        filter.connect(gainNode);

        gainNode.gain.setValueAtTime(finalVolume * 1.8, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === "laser") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(1600 * cassettePitch, now);
        osc.frequency.exponentialRampToValueAtTime(100 * cassettePitch, now + 0.22);
        gainNode.gain.setValueAtTime(finalVolume * 0.9, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === "beep") {
        osc.type = "square";
        osc.frequency.setValueAtTime(920 * cassettePitch, now);
        osc.frequency.setValueAtTime(1840 * cassettePitch, now + 0.06);
        gainNode.gain.setValueAtTime(finalVolume * 0.6, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.13);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === "sweep") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(90 * cassettePitch, now);
        osc.frequency.linearRampToValueAtTime(2200 * cassettePitch, now + 0.5);
        gainNode.gain.setValueAtTime(0.01, now);
        gainNode.gain.linearRampToValueAtTime(finalVolume * 1.4, now + 0.25);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === "arcade") {
        osc.type = "sine";
        const notes = [523.25, 659.25, 783.99, 1046.5]; // Chord progression
        notes.forEach((f, i) => {
          osc.frequency.setValueAtTime(f * cassettePitch, now + i * 0.07);
        });
        gainNode.gain.setValueAtTime(finalVolume * 1.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "alarm") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(480 * cassettePitch, now);
        osc.frequency.linearRampToValueAtTime(620 * cassettePitch, now + 0.15);
        osc.frequency.linearRampToValueAtTime(480 * cassettePitch, now + 0.3);
        osc.frequency.linearRampToValueAtTime(620 * cassettePitch, now + 0.45);
        gainNode.gain.setValueAtTime(finalVolume * 0.8, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      console.error("Sound generator failed", e);
    }
  };

  // Synthesize drum beats for Sequencer
  const playSequencerStepSound = (instrument: "kick" | "snare" | "hihat" | "synth") => {
    try {
      initAudioContext();
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;
      const baseVol = (volume / 100) * 0.35;

      if (instrument === "kick") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);
        gainNode.gain.setValueAtTime(baseVol * 2.0, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (instrument === "snare") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);
        
        const noiseOsc = ctx.createOscillator();
        const noiseGain = ctx.createGain();
        noiseOsc.type = "sawtooth";
        noiseOsc.frequency.setValueAtTime(800, now);
        noiseOsc.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseGain.gain.setValueAtTime(baseVol * 0.4, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        noiseOsc.start(now);
        noiseOsc.stop(now + 0.12);

        gainNode.gain.setValueAtTime(baseVol * 1.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (instrument === "hihat") {
        osc.type = "square";
        osc.frequency.setValueAtTime(8000, now);
        gainNode.gain.setValueAtTime(baseVol * 0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (instrument === "synth") {
        osc.type = "sawtooth";
        const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
        const currentNote = notes[currentStep % notes.length];
        osc.frequency.setValueAtTime(currentNote, now);
        osc.frequency.exponentialRampToValueAtTime(currentNote / 2, now + 0.2);
        
        gainNode.gain.setValueAtTime(baseVol * 0.8, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      console.error("Sequencer sound synth error", e);
    }
  };

  // Sequencer Beat Looper Hook
  useEffect(() => {
    if (!isSequencerPlaying) return;

    // Calculate duration per step
    const duration = (60 / sequencerBPM) / 2 * 1000;

    const interval = setInterval(() => {
      setCurrentStep((prevStep) => {
        const nextStep = (prevStep + 1) % 8;
        
        // Check and play active sounds for nextStep
        if (sequencerPattern.kick[nextStep]) playSequencerStepSound("kick");
        if (sequencerPattern.snare[nextStep]) playSequencerStepSound("snare");
        if (sequencerPattern.hihat[nextStep]) playSequencerStepSound("hihat");
        if (sequencerPattern.synth[nextStep]) playSequencerStepSound("synth");

        return nextStep;
      });
    }, duration);

    return () => clearInterval(interval);
  }, [isSequencerPlaying, sequencerPattern, sequencerBPM, currentStep, volume]);

  // Load preset patterns in sequencer
  const loadSequencerPreset = (preset: "liquid" | "neuro" | "industrial" | "wiped") => {
    if (preset === "liquid") {
      setSequencerPattern({
        kick:  [true,  false, false, false, false, false, true,  false],
        snare: [false, false, true,  false, false, false, true,  false],
        hihat: [true,  true,  false, true,  true,  true,  false, true],
        synth: [true,  false, true,  false, true,  false, true,  false],
      });
      addTerminalLog("[SEQUENCER] Liquid DnB vibe pattern initialized.");
    } else if (preset === "neuro") {
      setSequencerPattern({
        kick:  [true,  false, false, true,  true,  false, false, false],
        snare: [false, false, true,  false, false, true,  true,  false],
        hihat: [true,  true,  true,  true,  true,  true,  true,  true],
        synth: [true,  true,  false, true,  true,  true,  false, true],
      });
      addTerminalLog("[SEQUENCER] Heavy Neurofunk active beat injected.");
    } else if (preset === "industrial") {
      setSequencerPattern({
        kick:  [true,  false, true,  false, true,  false, true,  false],
        snare: [false, true,  false, true,  false, true,  false, true],
        hihat: [false, false, true,  false, false, false, true,  false],
        synth: [true,  false, false, false, true,  false, false, false],
      });
      addTerminalLog("[SEQUENCER] Techno industrial sequence loaded.");
    } else {
      setSequencerPattern({
        kick:  Array(8).fill(false),
        snare: Array(8).fill(false),
        hihat: Array(8).fill(false),
        synth: Array(8).fill(false),
      });
      addTerminalLog("[SEQUENCER] Step keys cleared.");
    }
  };

  // Mouse 3D Parallax Move
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMouseCoords({ x: Math.round(x), y: Math.round(y) });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const cardRotateX = ((y - centerY) / centerY) * -7;
    const cardRotateY = ((x - centerX) / centerX) * 7;
    
    const nameRotateX = ((y - centerY) / centerY) * -20;
    const nameRotateY = ((x - centerX) / centerX) * 20;

    const gX = (x / rect.width) * 100;
    const gY = (y / rect.height) * 100;

    setCardTilt({ x: cardRotateX, y: cardRotateY });
    setNameTilt({ x: nameRotateX, y: nameRotateY });
    setGlarePos({ x: gX, y: gY });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
    setNameTilt({ x: 0, y: 0 });
  };

  // Access Entrance Module
  const handleEnterSpace = () => {
    initAudioContext();
    setHasEntered(true);
    
    if (playerRef.current && playerReady) {
      try {
        playerRef.current.unMute();
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch (err) {
        console.error("Autoplay failed", err);
      }
    }

    addTerminalLog(`[ACCESS] Decrypted user space for ${username}.`);
    addTerminalLog("[SYSTEM] Cyber-grid projection active.");
    addTerminalLog("[AUDIO] Background soundtrack decoded.");
  };

  const addTerminalLog = (msg: string) => {
    setTerminalLogs((prev) => [...prev, msg]);
  };

  // Scroll console box to bottom
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Play/Pause Toggle
  const handlePlayPause = () => {
    if (!playerRef.current || !playerReady) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      addTerminalLog("[AUDIO] Audio stream suspended.");
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
      addTerminalLog("[AUDIO] Resuming streaming audio flow.");
    }
  };

  // Guestbook transmissions
  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMsg.trim()) return;

    const newMsg: GuestbookMessage = {
      id: Date.now().toString(),
      name: guestName.trim(),
      message: guestMsg.trim(),
      timestamp: new Date().toLocaleDateString(),
      isVip: guestName.trim().toLowerCase() === username.toLowerCase()
    };

    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem("cyber_vibe_guestbook_v2", JSON.stringify(updated));
    setGuestName("");
    setGuestMsg("");
    addTerminalLog(`[WALL] Transmission from: ${newMsg.name}`);
  };

  // Cyber Terminal Command Parser
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const rawCommand = terminalInput.trim();
    const cleanInput = rawCommand.toLowerCase();
    addTerminalLog(`> ${rawCommand}`);
    setTerminalInput("");

    if (cleanInput === "/help") {
      addTerminalLog("--- CHRONOS CYBER CORE SHELL HELP ---");
      addTerminalLog("/hack            : Simulate high intensity cyber security breach");
      addTerminalLog("/rainbow         : Toggle hyperwave color saturation shifting");
      addTerminalLog("/matrix          : Toggle holographic digital rain background overlay");
      addTerminalLog("/status [msg]    : Alter simulated Discord presence tagline text");
      addTerminalLog("/siren           : Trigger emergencyFM alarm soundwave signals");
      addTerminalLog("/presets         : List configurable design preset styles");
      addTerminalLog("/sticker [name]  : Pin a custom sticker instantly (e.g. /sticker 💀 SYSTEM_REBEL)");
      addTerminalLog("/joke            : Fetch a randomized cyber developer joke");
      addTerminalLog("/clear           : Flush diagnostic terminal logs clean");
    } else if (cleanInput === "/hack") {
      addTerminalLog("[WARNING] PREPARING SYSTEM DECRYPTION SECURITY INTERFACE BREACH...");
      setIsGlitching(true);
      playSynthesizedSound("alarm");
      setTimeout(() => {
        playSynthesizedSound("bass");
      }, 300);
      setTimeout(() => {
        setIsGlitching(false);
        addTerminalLog("[RECOVERY] Simulated breach terminated. Integrity shields at 100%.");
      }, 2000);
    } else if (cleanInput === "/rainbow") {
      setIsRainbowMode(!isRainbowMode);
      addTerminalLog(`[SYSTEM] Rainbow Shift status updated: ${!isRainbowMode ? "ON" : "OFF"}`);
    } else if (cleanInput === "/matrix") {
      setIsMatrixRainActive(!isMatrixRainActive);
      addTerminalLog(`[SYSTEM] Digital Rain Matrix canvas: ${!isMatrixRainActive ? "ENABLED" : "SUSPENDED"}`);
    } else if (cleanInput.startsWith("/status ")) {
      const newStatus = rawCommand.substring(8);
      setDiscordStatusText(newStatus);
      addTerminalLog(`[PRESENCE] Rich status altered to: "${newStatus}"`);
    } else if (cleanInput === "/siren") {
      addTerminalLog("[SOUND] Emitting synthesized sirens...");
      playSynthesizedSound("alarm");
      setTimeout(() => playSynthesizedSound("alarm"), 250);
    } else if (cleanInput === "/presets") {
      addTerminalLog("--- PRESETS INSTALLED ---");
      addTerminalLog("1. Matrix (Hacker Green wireframe matrix)");
      addTerminalLog("2. Neon-Sunset (Retro sunset magenta vibe)");
      addTerminalLog("3. Stealth (Obsidian space, minimal indicators)");
      addTerminalLog("4. Emperor-Gold (Polished luxury gold accents)");
    } else if (cleanInput.startsWith("/sticker ")) {
      const stickerName = rawCommand.substring(9).toUpperCase();
      if (activeStickers.length >= 3) {
        setActiveStickers([...activeStickers.slice(1), stickerName]);
      } else {
        setActiveStickers([...activeStickers, stickerName]);
      }
      addTerminalLog(`[STICKER] Sticker pinned successfully: ${stickerName}`);
    } else if (cleanInput === "/joke") {
      const jokes = [
        "There are 10 types of people: those who understand binary, and those who don't.",
        "Why do Java programmers wear glasses? Because they don't C#!",
        "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
        "Microservices: We took one big complex bug and chopped it into twenty tiny distributed bugs!"
      ];
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      addTerminalLog(`[HUMOR] ${randomJoke}`);
    } else if (cleanInput === "/clear") {
      setTerminalLogs(["[SYSTEM] Terminal logs wiped."]);
    } else {
      addTerminalLog(`[ERROR] "${rawCommand}" unrecognized directive. Enter /help to search available tasks.`);
    }
  };

  // Generate URL Link
  const getCustomizedLink = () => {
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set("username", customizerName);
    params.set("avatar_url", customizerAvatar);
    params.set("id", customizerId);
    params.set("verified", customizerVerified ? "true" : "false");
    params.set("youtube_id", customizerYoutube);
    params.set("glow", glowTheme);
    params.set("skin", skinStyle);
    params.set("stickers", JSON.stringify(activeStickers));
    params.set("status_text", encodeURIComponent(discordStatusText));
    params.set("details", encodeURIComponent(customizerDetails));
    return `${base}?${params.toString()}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getCustomizedLink());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleApplyCustomization = () => {
    setUsername(customizerName);
    setAvatarUrl(customizerAvatar);
    setDiscordId(customizerId);
    setIsVerified(customizerVerified);
    setYoutubeId(customizerYoutube);
    setDiscordDetails(customizerDetails);
    setShowCustomizer(false);
    addTerminalLog("[SYSTEM] Variables injected dynamically.");
  };

  // Toggles state of stickers
  const toggleSticker = (sticker: string) => {
    if (activeStickers.includes(sticker)) {
      setActiveStickers(activeStickers.filter((s) => s !== sticker));
    } else {
      if (activeStickers.length >= 3) {
        setActiveStickers([...activeStickers.slice(1), sticker]);
      } else {
        setActiveStickers([...activeStickers, sticker]);
      }
    }
  };

  const currentTheme = themeConfig[glowTheme];
  const currentSkin = skinStyleConfig[skinStyle];

  return (
    <div
      className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#020205] select-none transition-all duration-300 p-4 ${
        isGlitching ? "animate-pulse invert-[0.15] saturate-200" : ""
      } ${
        isBeating && shakeIntensity !== "off"
          ? shakeIntensity === "low"
            ? "animate-[shake_0.2s_ease-in-out_infinite]"
            : shakeIntensity === "medium"
            ? "animate-[shake_0.15s_ease-in-out_infinite]"
            : "animate-[shake_0.08s_ease-in-out_infinite]"
          : ""
      }`}
      style={{
        fontFamily: currentSkin.font === "font-mono" ? "monospace, ui-monospace" : "sans-serif"
      }}
    >
      {/* STYLES INJECTION for high performance custom animations */}
      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(0px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(2px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(2px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        @keyframes cyber-grid-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .cyber-grid {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, ${currentSkin.gridAccent} 1px, transparent 1px),
            linear-gradient(to bottom, ${currentSkin.gridAccent} 1px, transparent 1px);
          animation: cyber-grid-scroll 8s linear infinite;
        }
        .cassette-spin {
          animation: spin ${3 / cassettePitch}s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .glare-shine::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(
            circle 250px at var(--glare-x, 50%) var(--glare-y, 50%),
            rgba(255, 255, 255, 0.08),
            transparent 60%
          );
          z-index: 15;
          pointer-events: none;
        }
        .cosmic-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .cosmic-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .cosmic-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
        .cosmic-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .neon-circuit-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawCircuit 25s linear infinite;
        }
        @keyframes drawCircuit {
          to { stroke-dashoffset: 0; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .cyber-scanline {
          animation: scanline 12s linear infinite;
        }
      `}</style>

      {/* 1. Background Iframe Player */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div id="bg-video-player" className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 opacity-35 pointer-events-none scale-105 object-cover"></div>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#020205]/60 to-[#020205] pointer-events-none" />
        <div className="absolute inset-0 bg-black/55 pointer-events-none backdrop-blur-[2px]" />
      </div>

      {/* Canvas Matrix Rain Overlay */}
      {isMatrixRainActive && (
        <canvas
          ref={matrixCanvasRef}
          className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-[0.18]"
        />
      )}

      {/* 2. Dynamic Cyber Grid & Tech Line Systems */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Futuristic cyber grid background */}
        <div className="absolute inset-0 cyber-grid opacity-65" />
        
        {/* Digital scanning light lines */}
        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent top-0 cyber-scanline pointer-events-none" />

        {/* Cyber circuit path lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.22]" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0,100 L 300,100 L 350,150 L 800,150 L 850,100 L 1200,100 L 1300,200" fill="none" stroke="#38bdf8" strokeWidth="1" className="neon-circuit-line" />
          <path d="M 100,900 L 400,900 L 450,850 L 900,850 L 950,900" fill="none" stroke="#a855f7" strokeWidth="1" className="neon-circuit-line" />
          <circle cx="350" cy="150" r="3.5" fill="#38bdf8" />
          <circle cx="800" cy="150" r="3.5" fill="#38bdf8" />
          <circle cx="450" cy="850" r="3.5" fill="#a855f7" />
          <circle cx="900" cy="850" r="3.5" fill="#a855f7" />
        </svg>
      </div>

      {/* 3. Decrypt Portal Entrance screen */}
      {!hasEntered && (
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 max-w-lg w-full bg-[#08080e]/95 border border-white/10 rounded-3xl shadow-2xl transform transition-all duration-500 scale-100">
          
          {/* Tech label badges */}
          <div className="absolute top-3 left-3 text-[9px] font-mono text-emerald-400 tracking-widest uppercase">[SYS DECK ACTIVE]</div>
          <div className="absolute top-3 right-3 text-[9px] font-mono text-white/35">DECR_KEY: #0773</div>
          
          <div className="relative mb-6 mt-4">
            <div className={`absolute -inset-1.5 rounded-full blur opacity-60 animate-pulse ${currentTheme.accent}`} />
            <div className="relative w-24 h-24 rounded-full bg-black/85 border-2 border-white/15 flex items-center justify-center overflow-hidden shadow-2xl">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://cdn.discordapp.com/embed/avatars/0.png";
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-1 justify-center">
            <h1 className="text-2xl font-bold text-white tracking-wider">{username}</h1>
            {isVerified && (
              <CheckCircle2 className="w-5 h-5 text-purple-400 fill-purple-950/50 animate-pulse" />
            )}
          </div>
          
          <p className="text-white/40 font-mono text-xs mb-6 select-all">DISCORD_UID: {discordId}</p>

          {/* Custom Cyberpunk Stickers Banner */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
            {activeStickers.map((sticker) => (
              <span key={sticker} className="px-2.5 py-0.5 rounded text-[9.5px] font-mono bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 uppercase font-bold tracking-wider">
                {sticker}
              </span>
            ))}
          </div>

          {/* Cyber Terminal Decryption Box */}
          <div className="w-full bg-black/75 border border-white/10 rounded-xl p-4 mb-6 text-left font-mono text-[11px] text-white/60 leading-relaxed space-y-1">
            <div className="flex items-center text-emerald-400 gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>[SYSTEM] DECK ENCRYPTION VERIFIED</span>
            </div>
            <div>&gt; THEME SKIN: {skinStyle.toUpperCase()} ({glowTheme})</div>
            <div>&gt; BACKGROUND AUDIO: Loaded via secure stream</div>
            <div className="text-emerald-400">&gt; READY FOR SYSTEM LINK INITIALIZATION</div>
          </div>

          <button
            onClick={handleEnterSpace}
            className="group relative w-full py-4 rounded-xl font-display font-bold text-xs uppercase tracking-widest text-white transition-all duration-300 overflow-hidden cursor-pointer active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 transition-all duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10 flex items-center justify-center gap-2 text-shadow">
              <Cpu className="w-4 h-4 animate-spin" />
              Decrypt & Access Space
            </span>
          </button>
          
          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-white/35 font-mono">
            <Info className="w-3.5 h-3.5" />
            <span>Procedural synthesizers and live commands integrated.</span>
          </div>
        </div>
      )}

      {/* 4. Main Dashboard Deck */}
      {hasEntered && (
        <div className={`relative z-10 flex flex-col lg:flex-row items-stretch justify-center gap-5 w-full max-w-5xl ${isRainbowMode ? "hue-rotate-90" : ""} transition-all`}>
          
          {/* LEFT COLUMN: Cyber Diagnostics, cassette spinner, Rich Presence */}
          <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0">
            
            {/* Core Status */}
            <div className={`${currentSkin.panelBg} rounded-2xl p-4 shadow-xl relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">CORE DIAGNOSTICS</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-white/5 rounded text-white/70">
                  SYS_V2.4
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-white/40">Deck Coordinates:</span>
                  <span className={`text-[11px] ${currentTheme.text} font-bold`}>
                    X:{mouseCoords.x} Y:{mouseCoords.y}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40">System Uptime:</span>
                  <span className="text-white/80 flex items-center gap-1 font-bold">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40">Hologram Skin:</span>
                  <span className="text-emerald-400 font-bold uppercase text-[10px]">{skinStyle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40">Audio Synth:</span>
                  <span className="text-purple-400 font-bold text-[10px]">126 BPM</span>
                </div>
              </div>
            </div>

            {/* Holographic Cassette Deck UI */}
            <div className={`${currentSkin.panelBg} rounded-2xl p-4 shadow-xl flex flex-col relative overflow-hidden`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Disc className={`w-4 h-4 ${isPlaying ? "animate-spin" : ""} ${currentTheme.text}`} />
                  <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">ANALOG TAPE DECK</span>
                </div>
                
                {/* Matrix indicator / button */}
                <button
                  onClick={() => {
                    setIsMatrixRainActive(!isMatrixRainActive);
                    addTerminalLog(`[MATRIX] Screen rain toggled manually: ${!isMatrixRainActive ? "ON" : "OFF"}`);
                  }}
                  title="Toggle Matrix Rain Background Overlay"
                  className={`px-1.5 py-0.5 text-[9px] font-mono rounded border transition-all cursor-pointer ${
                    isMatrixRainActive 
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" 
                      : "bg-zinc-900 border-zinc-800 text-zinc-500"
                  }`}
                >
                  RAIN
                </button>
              </div>

              {/* Cassette Graphic Design */}
              <div className="relative h-28 w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2 overflow-hidden flex flex-col justify-between shadow-inner">
                <div className="flex justify-between items-center text-[7px] font-mono text-zinc-500 px-1">
                  <span>STEREO EMULATION</span>
                  <span>CHRONOS D-90</span>
                </div>

                {/* Center cassette window with reels */}
                <div className="relative h-12 w-full bg-zinc-950 rounded border border-zinc-800/70 flex items-center justify-around px-4">
                  {/* Left Reel */}
                  <div className="relative w-9 h-9 rounded-full bg-zinc-850 border border-zinc-700 flex items-center justify-center">
                    <div className={`w-8 h-8 rounded-full border-4 border-dashed border-zinc-600 flex items-center justify-center ${isPlaying ? "cassette-spin" : ""}`}>
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-950" />
                    </div>
                  </div>

                  {/* Cassette center view window */}
                  <div className="h-6 w-12 bg-emerald-950/10 border border-zinc-850 flex items-center justify-center">
                    <span className={`text-[8px] font-mono tracking-widest ${isPlaying ? "text-emerald-400 animate-pulse" : "text-zinc-600"}`}>
                      {isPlaying ? "RUN" : "STOP"}
                    </span>
                  </div>

                  {/* Right Reel */}
                  <div className="relative w-9 h-9 rounded-full bg-zinc-850 border border-zinc-700 flex items-center justify-center">
                    <div className={`w-8 h-8 rounded-full border-4 border-dashed border-zinc-600 flex items-center justify-center ${isPlaying ? "cassette-spin" : ""}`}>
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-950" />
                    </div>
                  </div>
                </div>

                {/* Pitch rate speed adjuster */}
                <div className="flex items-center justify-between text-[8.5px] font-mono text-zinc-400 mt-1 px-1">
                  <span>RATE SPEED: {cassettePitch.toFixed(1)}x</span>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={cassettePitch}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      setCassettePitch(p);
                    }}
                    className="w-20 h-1 bg-zinc-800 rounded appearance-none accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* EQ Visualizer Bars */}
              <div className="h-8 flex items-end justify-between gap-[2px] bg-black/45 border border-white/5 rounded-lg p-1.5 mt-3">
                {visualizerBars.map((barHeight, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${Math.min(100, barHeight * cassettePitch)}%` }}
                    className={`w-full rounded-t transition-all duration-300 ${currentTheme.wave}`}
                  />
                ))}
              </div>
            </div>

            {/* Simulated Discord Rich Presence Activity */}
            <div className={`${currentSkin.panelBg} rounded-2xl p-4 shadow-xl flex flex-col relative overflow-hidden`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">ACTIVITY PRESENCE</span>
                </div>
                <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded text-[8.5px] font-mono uppercase font-bold">
                  ONLINE
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="relative w-12 h-12 rounded-xl bg-black/65 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  <div className="absolute inset-0 flex flex-wrap gap-0.5 p-0.5 overflow-hidden opacity-40">
                    {Array(16).fill(0).map((_, i) => (
                      <span key={i} className="text-[7px] text-emerald-500 font-mono animate-pulse" style={{ animationDelay: `${i * 80}ms` }}>
                        {Math.round(Math.random())}
                      </span>
                    ))}
                  </div>
                  <Terminal className="w-5 h-5 text-emerald-400 z-10" />
                </div>

                <div className="flex-1 min-w-0 text-xs font-mono">
                  <div className="text-white font-bold truncate">{discordActivityType}</div>
                  <div className="text-white/90 truncate font-semibold text-[11px]">{discordStatusText}</div>
                  <div className="text-white/55 text-[10px] truncate">{discordDetails}</div>
                  <div className="text-emerald-400 text-[9px] mt-1 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>ELAPSED: {Math.floor(elapsedSeconds / 60)}m</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Configure Space Panel Button */}
            <button
              onClick={() => {
                setCustomizerName(username);
                setCustomizerAvatar(avatarUrl);
                setCustomizerId(discordId);
                setCustomizerVerified(isVerified);
                setCustomizerYoutube(youtubeId);
                setCustomizerDetails(discordDetails);
                setShowCustomizer(true);
              }}
              className="rounded-2xl border border-white/10 p-4 shadow-xl text-left group cursor-pointer hover:border-white/20 transition-all bg-black/60 hover:bg-black/80"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all">
                    <Sliders className={`w-4 h-4 ${currentTheme.text}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Deck Customizer</h4>
                    <p className="text-[9.5px] text-white/45">Change skins, tags and presets</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-white/40 group-hover:text-white transition-colors">&gt;</span>
              </div>
            </button>

          </div>

          {/* CENTER DECK: Main glowing terminal, stickers wall, Tab navigation, customizable modules */}
          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
              transition: "transform 0.15s ease-out",
              "--glare-x": `${glarePos.x}%`,
              "--glare-y": `${glarePos.y}%`
            } as any}
            className={`w-full lg:flex-1 rounded-3xl border p-5 lg:p-7 flex flex-col relative overflow-hidden select-none transition-all duration-300 ${
              currentSkin.cardBg
            } ${isBeating ? currentTheme.glowPulse : currentTheme.glow}`}
          >
            {/* Interactive Glare */}
            <div className="absolute inset-0 glare-shine pointer-events-none z-15" />

            {/* Holographic top border line */}
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
            
            {/* Profile Details Section */}
            <div className="relative z-20 flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-white/10">
              
              {/* Avatar Frame */}
              <div className="relative group">
                <div className={`absolute -inset-1.5 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300 ${currentTheme.accent}`} />
                
                <div className="relative w-24 h-24 rounded-full bg-black border border-white/15 overflow-hidden shadow-2xl flex items-center justify-center">
                  <img
                    src={avatarUrl}
                    alt="Discord Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://cdn.discordapp.com/embed/avatars/0.png";
                    }}
                  />
                  <div className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-[#23a55a] border-2 border-black flex items-center justify-center shadow-lg">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#23a55a] animate-ping" />
                  </div>
                </div>
              </div>

              {/* Name & Sticker Wall */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div
                  style={{
                    transform: `perspective(800px) rotateX(${nameTilt.x}deg) rotateY(${nameTilt.y}deg) translateZ(15px)`,
                    transition: "transform 0.1s ease-out",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                  className="cursor-pointer select-none justify-center sm:justify-start"
                >
                  <h2 className="text-xl md:text-2xl font-black tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {username}
                  </h2>
                  {isVerified && (
                    <div className="relative group/tooltip">
                      <CheckCircle2 className="w-6 h-6 text-purple-400 fill-purple-950/50 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.7)] animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Active Cyber Stickers */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  {activeStickers.length === 0 ? (
                    <span className="text-[9px] font-mono text-white/35 italic">No stickers pinned</span>
                  ) : (
                    activeStickers.map((stk) => (
                      <span
                        key={stk}
                        className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded border border-emerald-500/20 text-emerald-400 bg-emerald-950/30 transition-all hover:scale-105 cursor-crosshair flex items-center gap-1"
                      >
                        {stk.includes("💀") && <Skull className="w-2.5 h-2.5" />}
                        {stk.includes("⚡") && <Zap className="w-2.5 h-2.5" />}
                        {stk.includes("👾") && <Cpu className="w-2.5 h-2.5" />}
                        {stk}
                      </span>
                    ))
                  )}
                </div>

                {/* Tagline */}
                <p className="text-xs text-white/60 font-mono max-w-md leading-relaxed">
                  ⚡ Deck Online. Play procedural synth sequences, soundboard triggers, and view dynamic console diagnostics.
                </p>
              </div>
            </div>

            {/* Master Volume controls & background stream info */}
            <div className="relative z-20 py-4 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all text-white cursor-pointer relative ${currentTheme.accent} ${currentTheme.accentHover}`}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping" />
                    <span className="text-[8.5px] font-mono font-bold uppercase tracking-widest text-purple-400">DECK AUDIO STREAM</span>
                  </div>
                  <p className="text-xs font-bold text-white tracking-wide truncate w-44">
                    YT ID: {youtubeId}
                  </p>
                </div>
              </div>

              {/* Volume slider */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4.5 h-4.5" />
                  ) : (
                    <Volume2 className="w-4.5 h-4.5" />
                  )}
                </button>

                <div className="w-full sm:w-28 flex flex-col">
                  <div className="flex justify-between items-center text-[8.5px] font-mono text-white/30 mb-0.5">
                    <span>VOLUME</span>
                    <span>{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => {
                      setVolume(Number(e.target.value));
                      if (isMuted && Number(e.target.value) > 0) {
                        setIsMuted(false);
                      }
                    }}
                    className="w-full h-1 rounded bg-white/10 cursor-pointer accent-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* TAB CONTROLLERS */}
            <div className="relative z-20 flex flex-wrap justify-between items-center py-3.5 gap-1.5">
              <button
                onClick={() => setActiveTab("bio")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "bio"
                    ? "bg-white/10 text-white border border-white/10"
                    : "text-white/45 hover:text-white hover:bg-white/5"
                }`}
              >
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>BIO LOGS</span>
              </button>

              <button
                onClick={() => setActiveTab("soundboard")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "soundboard"
                    ? "bg-white/10 text-white border border-white/10"
                    : "text-white/45 hover:text-white hover:bg-white/5"
                }`}
              >
                <Music className="w-3.5 h-3.5 text-cyan-400" />
                <span>SFX SYNTH</span>
              </button>

              {/* Drum & Bass Sequencer Tab */}
              <button
                onClick={() => setActiveTab("sequencer")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "sequencer"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "text-white/45 hover:text-white hover:bg-white/5"
                }`}
              >
                <Keyboard className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>BEAT MAKER</span>
              </button>

              <button
                onClick={() => setActiveTab("guestbook")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "guestbook"
                    ? "bg-white/10 text-white border border-white/10"
                    : "text-white/45 hover:text-white hover:bg-white/5"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                <span>WALL BOOK</span>
              </button>

              <button
                onClick={() => setActiveTab("space")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "space"
                    ? "bg-white/10 text-white border border-white/10"
                    : "text-white/45 hover:text-white hover:bg-white/5"
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>CONSOLE LOGS</span>
              </button>
            </div>

            {/* ACTIVE TAB BOX */}
            <div className="relative z-20 flex-1 min-h-[260px] bg-black/55 border border-white/10 rounded-2xl p-4 overflow-y-auto cosmic-scrollbar">
              
              {/* Tab 1: Bio connections */}
              {activeTab === "bio" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className={`${currentSkin.panelBg} rounded-xl p-3 space-y-1`}>
                      <div className="text-[8px] font-mono text-white/40 uppercase">OPERATOR DATA</div>
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{username}</span>
                        <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[8px] rounded-full">
                          SECURE
                        </span>
                      </div>
                      <div className="text-[10px] text-white/50 font-mono flex items-center justify-between pt-1">
                        <span>UID: {discordId}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(discordId);
                            addTerminalLog("[CLIPBOARD] Discord User ID copied.");
                            alert("Discord ID copied!");
                          }}
                          className="text-emerald-400 hover:text-emerald-300 text-[9.5px] flex items-center gap-0.5 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                    </div>

                    <div className={`${currentSkin.panelBg} rounded-xl p-3 space-y-1`}>
                      <div className="text-[8px] font-mono text-white/40 uppercase">STATION TRANSMISSIONS</div>
                      <div className="text-xs font-bold text-white">Base Alpha Central</div>
                      <div className="text-[10px] text-white/50 font-mono">System state: Active</div>
                    </div>
                  </div>

                  {/* Premium Cyber connections layout */}
                  <div className="space-y-2">
                    <h4 className="text-[9px] font-mono text-white/45 tracking-widest uppercase">CYBERNETIC CORE DATAPATHS</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <a
                        href={`https://discord.com/users/${discordId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 rounded-xl text-white transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                            <Radio className="w-4 h-4 text-indigo-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold">Discord Node</div>
                            <div className="text-[8.5px] font-mono text-white/40">Contact operator</div>
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-white" />
                      </a>

                      <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 rounded-xl text-white transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center">
                            <Play className="w-3.5 h-3.5 text-red-400 fill-red-400/10" />
                          </div>
                          <div>
                            <div className="text-xs font-bold">Media Center</div>
                            <div className="text-[8.5px] font-mono text-white/40">YT videos & clips</div>
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-white" />
                      </a>

                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 bg-zinc-800/20 hover:bg-zinc-800/35 border border-zinc-700/30 rounded-xl text-white transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-zinc-800/30 flex items-center justify-center">
                            <Terminal className="w-4 h-4 text-zinc-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold">Git Repository</div>
                            <div className="text-[8.5px] font-mono text-white/40">Script archives</div>
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-white" />
                      </a>

                      <a
                        href="https://steamcommunity.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 bg-sky-600/10 hover:bg-sky-600/20 border border-sky-500/20 rounded-xl text-white transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-sky-600/20 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-sky-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold">Steam Network</div>
                            <div className="text-[8.5px] font-mono text-white/40">Gaming library statistics</div>
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Procedural Web Synthesizer Soundboard */}
              {activeTab === "soundboard" && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">CYBER SYNTH SFX BOARD</h4>
                      <p className="text-[9px] text-white/50">Synthesize custom FM & physical models locally using web audio API</p>
                    </div>
                    <span className="text-[8px] font-mono px-2 py-0.5 bg-white/5 text-emerald-400 rounded">
                      MOD_SCALE: {cassettePitch}x
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <button
                      onClick={() => {
                        playSynthesizedSound("bass");
                        addTerminalLog("[SYNTH] Sub Bass drop triggered.");
                      }}
                      className="p-3 bg-black/40 border border-white/10 rounded-xl hover:border-purple-500/30 hover:bg-purple-500/5 text-left transition-all cursor-pointer"
                    >
                      <div className="text-[8px] font-mono text-purple-400 mb-0.5">● SUB DROP</div>
                      <div className="text-xs font-bold text-white">Sub Bass</div>
                      <div className="text-[8px] text-white/40 mt-1.5">130Hz sliding to 35Hz</div>
                    </button>

                    <button
                      onClick={() => {
                        playSynthesizedSound("laser");
                        addTerminalLog("[SYNTH] Phonk Laser pulse generated.");
                      }}
                      className="p-3 bg-black/40 border border-white/10 rounded-xl hover:border-cyan-500/30 hover:bg-cyan-500/5 text-left transition-all cursor-pointer"
                    >
                      <div className="text-[8px] font-mono text-cyan-400 mb-0.5">● PHONIC BEAM</div>
                      <div className="text-xs font-bold text-white">Retro Laser</div>
                      <div className="text-[8px] text-white/40 mt-1.5">High frequency laser sweep</div>
                    </button>

                    <button
                      onClick={() => {
                        playSynthesizedSound("beep");
                        addTerminalLog("[SYNTH] Glitch Beep pulse generated.");
                      }}
                      className="p-3 bg-black/40 border border-white/10 rounded-xl hover:border-rose-500/30 hover:bg-rose-500/5 text-left transition-all cursor-pointer"
                    >
                      <div className="text-[8px] font-mono text-rose-400 mb-0.5">● CHIP BEEP</div>
                      <div className="text-xs font-bold text-white">Chiptune Hit</div>
                      <div className="text-[8px] text-white/40 mt-1.5">Square wave sequence</div>
                    </button>

                    <button
                      onClick={() => {
                        playSynthesizedSound("sweep");
                        addTerminalLog("[SYNTH] Resonant Filter sweep initialized.");
                      }}
                      className="p-3 bg-black/40 border border-white/10 rounded-xl hover:border-amber-500/30 hover:bg-amber-500/5 text-left transition-all cursor-pointer"
                    >
                      <div className="text-[8px] font-mono text-amber-400 mb-0.5">● NOISE SWEEP</div>
                      <div className="text-xs font-bold text-white">Filter Sweep</div>
                      <div className="text-[8px] text-white/40 mt-1.5">Slow linear frequency ramp</div>
                    </button>

                    <button
                      onClick={() => {
                        playSynthesizedSound("arcade");
                        addTerminalLog("[SYNTH] Retro Arpeggio loop synthesized.");
                      }}
                      className="p-3 bg-black/40 border border-white/10 rounded-xl hover:border-emerald-500/30 hover:bg-emerald-500/5 text-left transition-all cursor-pointer"
                    >
                      <div className="text-[8px] font-mono text-emerald-400 mb-0.5">● CHORD ARP</div>
                      <div className="text-xs font-bold text-white">Retro Chord</div>
                      <div className="text-[8px] text-white/40 mt-1.5">Chord arpeggiator sequence</div>
                    </button>

                    <button
                      onClick={() => {
                        playSynthesizedSound("alarm");
                        addTerminalLog("[SYNTH] FM Warning alarm activated.");
                      }}
                      className="p-3 bg-black/40 border border-white/10 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 text-left transition-all cursor-pointer"
                    >
                      <div className="text-[8px] font-mono text-blue-400 mb-0.5">● WARNING HORN</div>
                      <div className="text-xs font-bold text-white">Warning FM</div>
                      <div className="text-[8px] text-white/40 mt-1.5">Emergency modulation sweep</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Custom Beat Maker & Step Sequencer Grid */}
              {activeTab === "sequencer" && (
                <div className="space-y-3.5 animate-fadeIn font-mono">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Keyboard className="w-4 h-4 animate-bounce" />
                        CYBER STEP BEATMAKER
                      </h4>
                      <p className="text-[9px] text-white/50">Incorporate custom loops in step sequence loops</p>
                    </div>

                    {/* Controllers */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsSequencerPlaying(!isSequencerPlaying);
                          addTerminalLog(`[SEQUENCER] Beat looper: ${!isSequencerPlaying ? "RUNNING" : "HALTED"}`);
                        }}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          isSequencerPlaying ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {isSequencerPlaying ? "STOP" : "START"}
                      </button>

                      {/* Preset Select dropdown */}
                      <select
                        onChange={(e) => loadSequencerPreset(e.target.value as any)}
                        className="bg-zinc-800 border border-zinc-700 text-white text-[10px] rounded-lg px-2 py-1.5 outline-none cursor-pointer font-mono"
                        defaultValue="liquid"
                      >
                        <option value="liquid">Liquid DnB</option>
                        <option value="neuro">Neurofunk Heavy</option>
                        <option value="industrial">Techno Pulse</option>
                        <option value="wiped">Clean slate</option>
                      </select>

                      <button
                        onClick={() => {
                          loadSequencerPreset("wiped");
                        }}
                        className="p-1 bg-zinc-800 hover:bg-zinc-750 text-white rounded-lg cursor-pointer"
                        title="Clear sequencer step buttons"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Tempo indicator & Playhead progress bar */}
                  <div className="flex items-center gap-4 bg-black/45 border border-white/5 p-2.5 rounded-xl justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <span>TEMPO: {sequencerBPM} BPM</span>
                      <input
                        type="range"
                        min="80"
                        max="180"
                        value={sequencerBPM}
                        onChange={(e) => setSequencerBPM(Number(e.target.value))}
                        className="w-24 h-1 bg-zinc-800 appearance-none rounded accent-emerald-400 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>PLAYHEAD STEP: {currentStep + 1}/8</span>
                    </div>
                  </div>

                  {/* Instrument Rows */}
                  <div className="space-y-2">
                    {(["kick", "snare", "hihat", "synth"] as const).map((instrument) => (
                      <div key={instrument} className="flex items-center gap-2">
                        <span className="w-14 text-[10px] uppercase text-zinc-400 font-bold text-left">{instrument}</span>
                        <div className="flex-1 grid grid-cols-8 gap-1">
                          {sequencerPattern[instrument].map((active, stepIdx) => {
                            const isCurrent = currentStep === stepIdx && isSequencerPlaying;
                            return (
                              <button
                                key={stepIdx}
                                onClick={() => {
                                  const newPattern = { ...sequencerPattern };
                                  newPattern[instrument][stepIdx] = !newPattern[instrument][stepIdx];
                                  setSequencerPattern(newPattern);
                                  if (newPattern[instrument][stepIdx]) {
                                    playSequencerStepSound(instrument);
                                  }
                                }}
                                className={`h-7.5 rounded-md border transition-all flex items-center justify-center text-[10px] cursor-pointer ${
                                  active
                                    ? isCurrent
                                      ? "bg-white text-black border-white"
                                      : "bg-emerald-500 border-emerald-400 text-black font-bold shadow-[0_0_8px_rgba(16,185,129,0.35)]"
                                    : isCurrent
                                    ? "bg-zinc-700 border-zinc-500 text-white"
                                    : "bg-zinc-900/75 border-white/5 text-zinc-550 hover:border-white/20"
                                }`}
                              >
                                {stepIdx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Local storage messages wall */}
              {activeTab === "guestbook" && (
                <div className="space-y-3.5 animate-fadeIn">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">GUEST TRANSMISSIONS WALL</h4>
                    <p className="text-[9.5px] text-white/50">Transmit custom persistent message packets into base system database</p>
                  </div>

                  {/* Input forms */}
                  <form onSubmit={handleAddMessage} className="space-y-2.5">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Operator code..."
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        maxLength={20}
                        className="flex-1 px-3 py-2 rounded-xl text-xs text-white bg-black/50 border border-white/10 outline-none focus:border-emerald-500/50 font-mono"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Message body text..."
                        value={guestMsg}
                        onChange={(e) => setGuestMsg(e.target.value)}
                        maxLength={120}
                        className="flex-[2] px-3 py-2 rounded-xl text-xs text-white bg-black/50 border border-white/10 outline-none focus:border-emerald-500/50 font-mono"
                        required
                      />
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase text-white cursor-pointer transition-all shrink-0 ${currentTheme.accent} ${currentTheme.accentHover}`}
                      >
                        Transmit
                      </button>
                    </div>
                  </form>

                  {/* Messages stream */}
                  <div className="space-y-2 max-h-[160px] overflow-y-auto cosmic-scrollbar pr-1">
                    {messages.length === 0 ? (
                      <div className="text-center py-6 text-white/30 font-mono text-[10px]">
                        No packet signals detected.
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-2.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                            msg.isVip
                              ? "bg-purple-500/15 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                              : "bg-black/25 border-white/5"
                          }`}
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold truncate ${msg.isVip ? "text-purple-400" : "text-white"}`}>
                                {msg.name}
                              </span>
                              {msg.isVip && (
                                <span className="text-[7px] font-mono font-bold px-1.5 py-0.2 bg-purple-500/20 border border-purple-500/35 text-purple-400 rounded uppercase">
                                  VIP
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/85 font-mono leading-snug break-words">{msg.message}</p>
                          </div>
                          <span className="text-[8.5px] font-mono text-white/30 whitespace-nowrap shrink-0">{msg.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 5: Cyber Terminal Command Console */}
              {activeTab === "space" && (
                <div className="space-y-3 animate-fadeIn font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">COMMAND CONSOLE SYSTEM</h4>
                      <p className="text-[9px] text-white/50">Run commands to simulate breaches, alter skin styles and trigger synthesized alert sirens</p>
                    </div>
                    <span className="text-[8px] font-mono px-2 py-0.5 bg-white/5 text-emerald-400 rounded">
                      DIAGNOSTICS
                    </span>
                  </div>

                  {/* Logs */}
                  <div className="bg-black/75 border border-white/10 rounded-xl p-3 h-[140px] overflow-y-auto cosmic-scrollbar text-[10px] space-y-1 select-text">
                    {terminalLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`${
                          log.startsWith("[ERROR]") ? "text-red-400" :
                          log.startsWith("[WARNING]") ? "text-yellow-500 font-bold" :
                          log.startsWith(">") ? "text-cyan-400 font-semibold" :
                          log.startsWith("[ACCESS]") ? "text-purple-400" :
                          log.startsWith("[SYSTEM]") ? "text-emerald-400" : "text-white/85"
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                    <div ref={terminalBottomRef} />
                  </div>

                  {/* Form */}
                  <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">&gt;</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Type /help for commands..."
                      className="flex-1 bg-black/65 border border-white/10 rounded-lg px-3 py-1.5 text-[11.5px] text-white focus:border-cyan-500/50 outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10.5px] uppercase tracking-wider cursor-pointer"
                    >
                      Execute
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* 5. CUSTOMIZER CONFIGURATION DRAWER */}
      {showCustomizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#09090e] border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col h-[90vh] relative max-h-[750px] overflow-y-auto cosmic-scrollbar font-mono">
            
            {/* Close button */}
            <button
              onClick={() => setShowCustomizer(false)}
              className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-4.5 h-4.5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Deck Preset Configurator</h3>
            </div>
            
            <p className="text-[10px] text-white/45 mb-4">
              Configure custom layouts, skins, active status messages, and active cyber stickers.
            </p>

            {/* Forms */}
            <div className="space-y-3.5 flex-1">
              
              {/* Choose Preset Skin */}
              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-wider">1. Design Presets Skin</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["matrix", "neon-sunset", "stealth", "emperor-gold"] as const).map((skin) => (
                    <button
                      key={skin}
                      onClick={() => {
                        setSkinStyle(skin);
                        addTerminalLog(`[PRESET] Preset skin shifted: ${skin.toUpperCase()}`);
                      }}
                      className={`py-2.5 px-3 rounded-xl text-[10.5px] font-bold uppercase border text-left transition-all cursor-pointer flex items-center justify-between ${
                        skinStyle === skin
                          ? "bg-emerald-500/10 border-emerald-400 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                          : "bg-black/40 border-white/5 text-white/50 hover:text-white hover:border-white/10"
                      }`}
                    >
                      <span>{skin.replace("-", " ")}</span>
                      <span className="text-[8.5px] opacity-50">●</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Choose Glow Theme Color */}
              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-wider">2. Specular Accent Colors</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {(["purple", "cyan", "rose", "amber", "emerald", "blue"] as const).map((col) => (
                    <button
                      key={col}
                      onClick={() => setGlowTheme(col)}
                      className={`py-2 rounded-lg text-[9px] uppercase border font-bold transition-all cursor-pointer ${
                        glowTheme === col
                          ? "bg-white/10 text-white border-white/20"
                          : "bg-black/50 border-transparent text-white/30 hover:text-white"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={`h-2 w-2 rounded-full ${themeConfig[col].accent}`} />
                        <span>{col}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stickers Selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-wider">3. Holographic Pins (Max 3)</label>
                <div className="flex flex-wrap gap-1.5">
                  {stickerOptions.map((sticker) => {
                    const active = activeStickers.includes(sticker);
                    return (
                      <button
                        key={sticker}
                        onClick={() => toggleSticker(sticker)}
                        className={`px-2 py-1 rounded text-[9px] uppercase font-bold border transition-all cursor-pointer ${
                          active
                            ? "bg-purple-500/20 border-purple-400 text-purple-400"
                            : "bg-black/40 border-white/5 text-white/40 hover:text-white"
                        }`}
                      >
                        {sticker}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Discord Activity state settings */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 uppercase tracking-wider">4. Discord Presence Simulator</label>
                <div className="flex gap-2">
                  <select
                    value={discordActivityType}
                    onChange={(e) => setDiscordActivityType(e.target.value as any)}
                    className="bg-black border border-white/15 text-white rounded-xl px-2.5 py-1.5 text-xs outline-none cursor-pointer"
                  >
                    <option value="CODING">CODING</option>
                    <option value="PLAYING">PLAYING</option>
                    <option value="STREAMING">STREAMING</option>
                  </select>
                  <input
                    type="text"
                    value={discordStatusText}
                    onChange={(e) => setDiscordStatusText(e.target.value)}
                    placeholder="Status message..."
                    className="flex-1 bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
                <input
                  type="text"
                  value={customizerDetails}
                  onChange={(e) => setCustomizerDetails(e.target.value)}
                  placeholder="Activity details info..."
                  className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              {/* Custom profile settings */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-white/40 uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    value={customizerName}
                    onChange={(e) => setCustomizerName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-white/40 uppercase tracking-wider">Discord UID ID</label>
                  <input
                    type="text"
                    value={customizerId}
                    onChange={(e) => setCustomizerId(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Avatar URL */}
              <div className="space-y-1">
                <label className="text-[9px] text-white/40 uppercase tracking-wider">Avatar image URL</label>
                <input
                  type="text"
                  value={customizerAvatar}
                  onChange={(e) => setCustomizerAvatar(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              {/* YouTube background video ID */}
              <div className="space-y-1">
                <label className="text-[9px] text-white/40 uppercase tracking-wider">YouTube Video soundtrack ID</label>
                <input
                  type="text"
                  value={customizerYoutube}
                  onChange={(e) => setCustomizerYoutube(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              {/* Screen shake option selection */}
              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase tracking-wider">5. Audio beat shaking rate</label>
                <div className="grid grid-cols-4 gap-1">
                  {(["off", "low", "medium", "high"] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => setShakeIntensity(item)}
                      className={`py-1 rounded text-[9px] uppercase font-bold transition-all cursor-pointer ${
                        shakeIntensity === item
                          ? "bg-emerald-500 text-black font-bold"
                          : "bg-zinc-900 text-zinc-400"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified switch */}
              <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/70">Verified operator badge</span>
                <button
                  type="button"
                  onClick={() => setCustomizerVerified(!customizerVerified)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                    customizerVerified ? "bg-emerald-500" : "bg-zinc-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${
                      customizerVerified ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

            </div>

            {/* Actions footer */}
            <div className="mt-4 space-y-2.5 pt-3.5 border-t border-white/10 shrink-0">
              <button
                onClick={handleCopyLink}
                className="w-full py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copySuccess ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>LINK COPIED SUCCESS!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>COPY SHAREABLE HYPERLINK</span>
                  </div>
                )}
              </button>

              <button
                onClick={handleApplyCustomization}
                className="w-full py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-black bg-emerald-400 hover:bg-emerald-500 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5" />
                INJECT PRESET DATA
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
