import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fsdfvgqqjknwlclgzwxk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZGZ2Z3Fxamtud2xjbGd6d3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NjU4MjEsImV4cCI6MjA5MzQ0MTgyMX0.5ZipTtbTB15DR-uBzuaP0zK4sfYjymPxuEn2h6io2L0";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PHOTO_URL = "https://images.unsplash.com/photo-1569531955323-33c6b2dca44b?fm=jpg&q=85&w=1600&auto=format&fit=crop";

const PICK_LABELS = { home: "1", draw: "X", away: "2" };
const PICK_NAMES = { home: "Gospodarz", draw: "Remis", away: "Gość" };

const FLAGS = {
  "Stany Zjednoczone":"🇺🇸","Kanada":"🇨🇦","Meksyk":"🇲🇽",
  "Austria":"🇦🇹","Belgia":"🇧🇪","Bośnia i Hercegowina":"🇧🇦",
  "Chorwacja":"🇭🇷","Czechy":"🇨🇿","Anglia":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Szkocja":"🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Francja":"🇫🇷","Niemcy":"🇩🇪","Holandia":"🇳🇱",
  "Norwegia":"🇳🇴","Portugalia":"🇵🇹","Hiszpania":"🇪🇸",
  "Szwecja":"🇸🇪","Szwajcaria":"🇨🇭","Turcja":"🇹🇷",
  "Argentyna":"🇦🇷","Brazylia":"🇧🇷","Kolumbia":"🇨🇴",
  "Ekwador":"🇪🇨","Paragwaj":"🇵🇾","Urugwaj":"🇺🇾",
  "Australia":"🇦🇺","Iran":"🇮🇷","Japonia":"🇯🇵",
  "Jordania":"🇯🇴","Korea Południowa":"🇰🇷","Katar":"🇶🇦",
  "Arabia Saudyjska":"🇸🇦","Uzbekistan":"🇺🇿","Irak":"🇮🇶",
  "Algieria":"🇩🇿","Wybrzeże Kości Słoniowej":"🇨🇮","Egipt":"🇪🇬",
  "Ghana":"🇬🇭","Maroko":"🇲🇦","Senegal":"🇸🇳",
  "Tunezja":"🇹🇳","RPA":"🇿🇦","Cabo Verde":"🇨🇻",
  "DR Konga":"🇨🇩","Haiti":"🇭🇹","Panama":"🇵🇦",
  "Curaçao":"🇨🇼","Nowa Zelandia":"🇳🇿","Polska":"🇵🇱",
};

const AVATAR_COLORS = [
  "linear-gradient(135deg,#4cde6e,#2d8a4e)",
  "linear-gradient(135deg,#ff9500,#ff6b00)",
  "linear-gradient(135deg,#00d4aa,#007aff)",
  "linear-gradient(135deg,#af52de,#7a3ec2)",
  "linear-gradient(135deg,#ff2d55,#ff6b8a)",
  "linear-gradient(135deg,#5ac8fa,#007aff)",
  "linear-gradient(135deg,#ffcc00,#ff9500)",
];

const getAvatar = (name = "") => {
  const initials = name.slice(0, 1).toUpperCase() || "?";
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return { initials, gradient: AVATAR_COLORS[idx] };
};

// Blokada w strefie czasowej Warszawa (CET/CEST automatycznie)
const isMatchLocked = (m) => {
  const nowWarsaw = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).format(new Date()).replace(" ", "T");
  const matchStr = `${m.match_date}T${m.match_time?.slice(0, 5)}`;
  return nowWarsaw >= matchStr;
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap');
* { box-sizing:border-box; margin:0; padding:0; -webkit-font-smoothing:antialiased; }
body { background:#060f07; font-family:'Inter',sans-serif; }
::-webkit-scrollbar { width:0; }

.auth-screen { min-height:100vh; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:flex-end; }
.photo-bg { position:fixed; inset:0; background-image:url('${PHOTO_URL}'); background-size:cover; background-position:center center; }
.ov1 { position:fixed; inset:0; background:linear-gradient(180deg,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.55) 55%,rgba(4,12,5,0.95) 78%,#040c05 100%); }
.ov2 { position:fixed; bottom:0; left:0; right:0; height:60%; background:radial-gradient(ellipse at 50% 100%,rgba(0,180,60,0.1) 0%,transparent 70%); }

.auth-hero { position:relative; z-index:5; padding:0 28px; margin-bottom:24px; animation:heroIn 1.2s cubic-bezier(0.16,1,0.3,1) both; }
@keyframes heroIn { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
.eyebrow { display:flex; align-items:center; gap:8px; margin-bottom:12px; animation:slideIn 0.8s 0.2s both; }
@keyframes slideIn { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
.ey-line { width:28px; height:2px; background:#4cde6e; border-radius:1px; }
.ey-txt { font-size:10px; font-weight:700; color:#4cde6e; letter-spacing:3px; text-transform:uppercase; }
.hero-title { font-family:'Bebas Neue',sans-serif; font-size:64px; line-height:0.88; color:#fff; letter-spacing:2px; margin-bottom:12px; animation:titleIn 1s 0.1s cubic-bezier(0.16,1,0.3,1) both; text-shadow:0 4px 40px rgba(0,0,0,0.6); }
@keyframes titleIn { from{opacity:0;transform:translateY(24px) skewY(2deg)} to{opacity:1;transform:translateY(0) skewY(0)} }
.hero-green { color:#4cde6e; filter:drop-shadow(0 0 20px rgba(76,222,110,0.4)); }
.hero-sub { font-size:15px; font-weight:700; color:rgba(255,255,255,0.92); line-height:1.6; text-shadow:0 2px 12px rgba(0,0,0,0.8); animation:slideIn 0.8s 0.3s both; }

.auth-card { position:relative; z-index:5; margin:0 16px 48px; background:rgba(8,20,10,0.72); border:1px solid rgba(255,255,255,0.1); border-radius:24px; padding:22px; backdrop-filter:blur(30px); animation:cardIn 1s 0.35s cubic-bezier(0.16,1,0.3,1) both; box-shadow:0 0 0 1px rgba(76,222,110,0.08),0 24px 60px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08); }
@keyframes cardIn { from{opacity:0;transform:translateY(32px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
.card-shine { position:absolute; top:0; left:50%; transform:translateX(-50%); width:60%; height:1px; background:linear-gradient(90deg,transparent,rgba(76,222,110,0.4),transparent); }

.seg { display:flex; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:3px; margin-bottom:16px; }
.seg-btn { flex:1; padding:10px; text-align:center; font-size:14px; font-weight:600; color:rgba(255,255,255,0.35); border-radius:12px; border:none; background:transparent; font-family:'Inter',sans-serif; cursor:pointer; transition:all 0.22s; }
.seg-btn.on { background:linear-gradient(135deg,#1a6b30,#4cde6e); color:#000; box-shadow:0 4px 16px rgba(76,222,110,0.25); }

.afield { position:relative; margin-bottom:10px; }
.aicon { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:16px; opacity:0.4; pointer-events:none; }
.ainput { width:100%; padding:13px 16px 13px 42px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.09); border-radius:13px; color:#fff; font-family:'Inter',sans-serif; font-size:15px; outline:none; transition:all 0.22s; }
.ainput:focus { background:rgba(255,255,255,0.09); border-color:rgba(76,222,110,0.4); box-shadow:0 0 0 3px rgba(76,222,110,0.08); }
.ainput::placeholder { color:rgba(255,255,255,0.22); }
.aerr { color:#ff453a; font-size:12px; text-align:center; margin-bottom:8px; font-weight:500; }
.acta { width:100%; padding:15px; background:linear-gradient(135deg,#1e7a38,#4cde6e); border:none; border-radius:14px; color:#000; font-family:'Inter',sans-serif; font-size:16px; font-weight:700; cursor:pointer; margin-top:4px; transition:all 0.2s; box-shadow:0 8px 28px rgba(76,222,110,0.3); position:relative; overflow:hidden; }
.acta::after { content:''; position:absolute; inset:0; background:linear-gradient(180deg,rgba(255,255,255,0.15) 0%,transparent 50%); pointer-events:none; }
.acta:hover { transform:translateY(-1px); box-shadow:0 12px 36px rgba(76,222,110,0.4); }
.acta:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
.forgot-btn { width:100%; padding:10px; background:transparent; border:none; color:rgba(255,255,255,0.4); font-size:13px; cursor:pointer; margin-top:4px; font-family:'Inter',sans-serif; transition:color 0.2s; }
.forgot-btn:hover { color:rgba(76,222,110,0.7); }
.back-btn { width:100%; padding:12px; background:transparent; border:none; color:rgba(255,255,255,0.4); font-size:13px; cursor:pointer; margin-top:8px; font-family:'Inter',sans-serif; }
.reset-ok { background:rgba(76,222,110,0.08); border:1px solid rgba(76,222,110,0.2); border-radius:12px; padding:14px 16px; text-align:center; color:#4cde6e; font-size:14px; font-weight:600; line-height:1.5; }

/* TEAM PICKER */
.tp-ov { position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:200; display:flex; align-items:flex-end; justify-content:center; backdrop-filter:blur(20px); }
.tp-box { background:#0f1a10; border:1px solid rgba(255,255,255,0.12); border-radius:28px 28px 0 0; padding:28px 20px 48px; width:100%; max-width:480px; max-height:90vh; display:flex; flex-direction:column; animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
@keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
.tp-handle { width:36px; height:4px; background:rgba(255,255,255,0.15); border-radius:2px; margin:0 auto 20px; }
.tp-title { font-family:'Bebas Neue',sans-serif; font-size:28px; color:#fff; letter-spacing:2px; text-align:center; margin-bottom:4px; }
.tp-sub { font-size:13px; color:rgba(255,255,255,0.45); text-align:center; margin-bottom:20px; }
.tp-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; overflow-y:auto; flex:1; }
.tp-item { background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.08); border-radius:14px; padding:10px 6px; text-align:center; cursor:pointer; transition:all 0.18s; }
.tp-item:hover { border-color:rgba(76,222,110,0.35); background:rgba(76,222,110,0.07); }
.tp-item.sel { border-color:#4cde6e; background:rgba(76,222,110,0.15); }
.tp-flag { font-size:26px; display:block; margin-bottom:4px; }
.tp-name { font-size:9px; color:rgba(255,255,255,0.5); font-weight:600; line-height:1.2; }
.tp-item.sel .tp-name { color:#4cde6e; }
.tp-save { width:100%; padding:15px; background:linear-gradient(135deg,#1e7a38,#4cde6e); border:none; border-radius:14px; color:#000; font-family:'Inter',sans-serif; font-size:16px; font-weight:700; cursor:pointer; margin-top:16px; flex-shrink:0; }
.tp-save:disabled { opacity:0.35; cursor:not-allowed; }
.tp-skip { width:100%; padding:11px; background:transparent; border:none; color:rgba(255,255,255,0.3); font-family:'Inter',sans-serif; font-size:13px; cursor:pointer; margin-top:6px; flex-shrink:0; }

/* MAIN */
.app { min-height:100vh; background:#060f07; max-width:480px; margin:0 auto; padding-bottom:100px; font-family:'Inter',sans-serif; }
.hdr { position:relative; overflow:hidden; padding:0 0 20px; min-height:195px; }
.hdr-photo { position:absolute; inset:-20px -10px 0; background-image:url('${PHOTO_URL}'); background-size:cover; background-position:center 30%; filter:blur(2px) brightness(0.4) saturate(1.2); }
.hdr-ov { position:absolute; inset:0; background:linear-gradient(180deg,rgba(6,15,7,0.35) 0%,rgba(6,15,7,0.55) 50%,#060f07 100%); }
.hdr-ct { position:relative; z-index:2; padding:22px 20px 0; }
.hdr-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
.logo { font-family:'Bebas Neue',sans-serif; font-size:28px; color:#fff; letter-spacing:2.5px; text-shadow:0 2px 12px rgba(0,0,0,0.5); }
.logo span { color:#4cde6e; }
.hdr-r { display:flex; align-items:center; gap:10px; }
.upill { display:flex; align-items:center; gap:7px; background:rgba(255,255,255,0.1); border:1px solid rgba(76,222,110,0.2); border-radius:20px; padding:6px 14px 6px 7px; }
.uav { width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#000; flex-shrink:0; }
.uname { font-size:14px; color:rgba(255,255,255,0.9); font-weight:600; }
.uout { font-size:13px; font-weight:600; color:rgba(255,255,255,0.65); background:none; border:none; cursor:pointer; font-family:inherit; transition:color 0.2s; }
.uout:hover { color:#fff; }
.stats { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
.sbox { background:rgba(0,0,0,0.45); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:11px 13px; backdrop-filter:blur(10px); }
.slbl { font-size:10px; font-weight:700; color:rgba(255,255,255,0.65); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:4px; }
.sval { font-family:'Bebas Neue',sans-serif; font-size:28px; color:#fff; letter-spacing:1px; line-height:1; }
.sval.g { color:#4cde6e; filter:drop-shadow(0 0 8px rgba(76,222,110,0.4)); }

.nav { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:480px; background:rgba(6,15,7,0.97); border-top:1px solid rgba(76,222,110,0.1); display:flex; z-index:50; backdrop-filter:blur(20px); padding:10px 0 14px; }
.ni { flex:1; padding:6px 4px 4px; background:transparent; border:none; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:4px; }
.nic { width:48px; height:34px; display:flex; align-items:center; justify-content:center; border-radius:12px; font-size:26px; transition:background 0.2s; }
.ni.on .nic { background:rgba(76,222,110,0.12); }
.nlbl { font-size:11px; font-weight:600; color:rgba(255,255,255,0.5); transition:color 0.2s; }
.ni.on .nlbl { color:#4cde6e; }
.ndot { width:4px; height:4px; background:#4cde6e; border-radius:50%; display:none; }
.ni.on .ndot { display:block; }

.ct { padding:16px; }
.sh { font-size:12px; font-weight:700; color:rgba(255,255,255,0.65); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:12px; padding:0 2px; }

.mc { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:20px; margin-bottom:12px; overflow:hidden; transition:border-color 0.2s,transform 0.15s; }
.mc:hover { border-color:rgba(76,222,110,0.25); transform:translateY(-1px); }
.mt { padding:10px 14px; background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.07); display:flex; justify-content:space-between; align-items:center; }
.gbadge { font-size:11px; color:#4cde6e; background:rgba(76,222,110,0.1); border:1px solid rgba(76,222,110,0.2); padding:3px 10px; border-radius:20px; font-weight:700; }
.mtime { font-size:13px; color:rgba(255,255,255,0.75); font-weight:600; }
.mb2 { padding:14px; }
.tms { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.tm { display:flex; align-items:center; gap:8px; flex:1; }
.tm.r { flex-direction:row-reverse; }
.tf { font-size:26px; }
.tn { font-size:15px; font-weight:700; color:#fff; }
.tm.r .tn { text-align:right; }
.vs { width:6px; height:6px; background:rgba(255,255,255,0.15); border-radius:50%; flex-shrink:0; }
.odds { display:flex; gap:8px; }
.odd { flex:1; border-radius:12px; padding:10px 6px; text-align:center; background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.1); cursor:pointer; transition:all 0.18s; }
.odd:hover:not(:disabled) { background:rgba(76,222,110,0.1); border-color:rgba(76,222,110,0.4); }
.odd.sel { background:rgba(76,222,110,0.15); border-color:#4cde6e; }
.odd.ok { background:rgba(52,199,89,0.12); border-color:#34c759; }
.odd.no { opacity:0.3; }
.odd:disabled { cursor:default; }
.ol { font-size:11px; color:rgba(255,255,255,0.55); font-weight:600; }
.odd.sel .ol { color:rgba(76,222,110,0.8); }
.odd.ok .ol { color:#34c759; }
.ov { font-family:'Bebas Neue',sans-serif; font-size:22px; color:#fff; letter-spacing:0.5px; margin-top:2px; }
.odd.sel .ov { color:#4cde6e; }
.odd.ok .ov { color:#34c759; }
.tipok { margin-top:10px; background:rgba(76,222,110,0.08); border:1px solid rgba(76,222,110,0.2); border-radius:10px; padding:8px 12px; font-size:13px; color:#4cde6e; font-weight:600; }
.lck { margin-top:10px; font-size:13px; color:#ff453a; text-align:center; font-weight:600; }
.rbadge { font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; }
.rw { background:rgba(52,199,89,0.15); color:#34c759; }
.rl { background:rgba(255,59,48,0.12); color:#ff3b30; }
.rn { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.45); }

.lbc { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:20px; overflow:hidden; }
.lbr { display:flex; align-items:center; gap:10px; padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.06); }
.lbr:last-child { border-bottom:none; }
.lbr.me { background:rgba(76,222,110,0.05); border-left:2px solid #4cde6e; }
.lbrank { font-size:20px; width:30px; text-align:center; flex-shrink:0; }
.lbrn { font-family:'Bebas Neue',sans-serif; font-size:17px; color:rgba(255,255,255,0.35); }
.lbfc { width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,0.07); border:1.5px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.lbfc.hf { border-color:rgba(76,222,110,0.2); background:rgba(76,222,110,0.06); }
.lbav { width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; color:#000; flex-shrink:0; }
.lbn { font-size:16px; font-weight:600; color:#fff; }
.lbme { font-size:9px; color:#4cde6e; background:rgba(76,222,110,0.12); padding:1px 6px; border-radius:6px; font-weight:700; margin-left:4px; }
.lbs { font-size:12px; color:rgba(255,255,255,0.5); margin-top:2px; }
.lbp { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:0.5px; }
.lbp.top { color:#4cde6e; filter:drop-shadow(0 0 8px rgba(76,222,110,0.3)); }
.lbp.nm { color:#fff; }
.lbpl { font-size:10px; color:rgba(255,255,255,0.4); font-weight:600; text-align:right; }

.rc { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:20px; overflow:hidden; margin-bottom:10px; }
.rrow { display:flex; gap:14px; align-items:flex-start; padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.06); }
.rrow:last-child { border-bottom:none; }
.ric { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.rtit { font-size:15px; font-weight:700; color:#fff; margin-bottom:5px; }
.rtxt { font-size:13px; color:rgba(255,255,255,0.72); line-height:1.65; }
.prow { display:flex; align-items:center; gap:14px; padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.06); }
.prow:last-child { border-bottom:none; }
.pic { width:50px; height:50px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:28px; }
.pnm { font-size:16px; font-weight:600; color:#fff; }
.pamt { font-family:'Bebas Neue',sans-serif; font-size:30px; letter-spacing:1px; }

.ar { display:flex; align-items:center; justify-content:space-between; padding:13px 16px; border-bottom:1px solid rgba(255,255,255,0.06); }
.ar:last-child { border-bottom:none; }
.an { font-size:14px; font-weight:700; color:#fff; }
.at { font-size:12px; color:rgba(255,255,255,0.55); margin-top:2px; }
.ares { font-size:12px; color:#4cde6e; margin-top:2px; font-weight:600; }
.aedt { background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); color:rgba(255,255,255,0.8); padding:7px 13px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit; }
.ares-btn { background:rgba(76,222,110,0.1); border:1px solid rgba(76,222,110,0.25); color:#4cde6e; padding:7px 13px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit; }

.mo { position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:flex-end; justify-content:center; z-index:100; backdrop-filter:blur(20px); }
.mbox { background:#0f1a10; border:1px solid rgba(255,255,255,0.12); border-radius:24px 24px 0 0; padding:28px 24px; width:100%; max-width:480px; max-height:92vh; overflow-y:auto; }
.mh { width:36px; height:4px; background:rgba(255,255,255,0.15); border-radius:2px; margin:0 auto 20px; }
.mtt { font-size:19px; font-weight:700; color:#fff; margin-bottom:4px; }
.mst { font-size:13px; color:rgba(255,255,255,0.5); margin-bottom:20px; }
.rbtn { flex:1; padding:16px 8px; background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.12); border-radius:14px; color:rgba(255,255,255,0.7); cursor:pointer; font-family:inherit; font-size:20px; font-weight:700; transition:all 0.18s; }
.rbtn:hover { background:rgba(76,222,110,0.12); border-color:#4cde6e; color:#4cde6e; }
.mi { width:100%; padding:13px 16px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:12px; color:#fff; font-family:inherit; font-size:15px; outline:none; transition:border-color 0.2s; }
.mi:focus { border-color:rgba(76,222,110,0.4); }
.mi::placeholder { color:rgba(255,255,255,0.3); }
.mprim { width:100%; padding:15px; background:linear-gradient(135deg,#1e7a38,#4cde6e); border:none; border-radius:14px; color:#000; font-family:inherit; font-size:16px; font-weight:700; cursor:pointer; }
.msec { width:100%; padding:13px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:14px; color:rgba(255,255,255,0.6); font-family:inherit; font-size:15px; font-weight:500; cursor:pointer; }

.toast { position:fixed; bottom:110px; left:50%; transform:translateX(-50%); background:rgba(10,20,12,0.96); border:1px solid rgba(76,222,110,0.25); color:#fff; padding:11px 22px; border-radius:50px; font-size:14px; font-weight:600; z-index:200; white-space:nowrap; animation:toastIn 0.25s ease; backdrop-filter:blur(20px); }
@keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

.chat-wrap { display:flex; flex-direction:column; height:calc(100vh - 210px); }
.chat-msgs { flex:1; overflow-y:auto; padding:0 0 8px; }
.cdt { text-align:center; margin:14px 0 10px; }
.cdt span { font-size:11px; color:rgba(255,255,255,0.4); background:rgba(255,255,255,0.06); padding:3px 12px; border-radius:20px; }
.cbw { display:flex; flex-direction:column; margin-bottom:2px; }
.crow { display:flex; align-items:flex-end; gap:6px; }
.crow.me { flex-direction:row-reverse; }
.cav2 { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#000; flex-shrink:0; }
.cb { padding:10px 14px; border-radius:18px; max-width:76%; word-break:break-word; font-size:15px; line-height:1.4; }
.cb.mine { background:linear-gradient(135deg,#1e7a38,#4cde6e); color:#000; font-weight:500; border-bottom-right-radius:4px; }
.cb.theirs { background:rgba(255,255,255,0.09); color:#fff; border-bottom-left-radius:4px; }
.csnd { font-size:11px; color:rgba(255,255,255,0.45); margin-left:34px; margin-top:2px; }
.ctm { font-size:11px; color:rgba(255,255,255,0.3); margin-top:2px; text-align:right; }
.chat-bar { padding:8px 0 16px; display:flex; gap:8px; align-items:center; border-top:1px solid rgba(255,255,255,0.08); }
.cin { flex:1; padding:12px 16px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:22px; color:#fff; font-family:inherit; font-size:15px; outline:none; }
.cin:focus { border-color:rgba(76,222,110,0.3); }
.cin::placeholder { color:rgba(255,255,255,0.3); }
.csend { width:40px; height:40px; background:linear-gradient(135deg,#1e7a38,#4cde6e); border:none; border-radius:50%; color:#000; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:700; }
.csend:disabled { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.2); }
.empty { text-align:center; padding:60px 0; color:rgba(255,255,255,0.35); }
.ei { font-size:44px; margin-bottom:12px; }
.et { font-size:17px; font-weight:600; color:rgba(255,255,255,0.5); }
.es { font-size:14px; margin-top:4px; }
`;

// ── TEAM PICKER ───────────────────────────────────────────────────────────────
function TeamPicker({ onSave, onSkip }) {
  const [sel, setSel] = useState(null);
  return (
    <div className="tp-ov">
      <div className="tp-box">
        <div className="tp-handle" />
        <div className="tp-title">KOMU KIBICUJESZ?</div>
        <div className="tp-sub">Wybierz swoją drużynę — flaga pojawi się przy Twoim profilu w tabeli</div>
        <div className="tp-grid">
          {Object.entries(FLAGS).map(([name, flag]) => (
            <div key={name} className={`tp-item ${sel === name ? "sel" : ""}`} onClick={() => setSel(name)}>
              <span className="tp-flag">{flag}</span>
              <span className="tp-name">{name}</span>
            </div>
          ))}
        </div>
        <button className="tp-save" onClick={() => onSave(sel)} disabled={!sel}>Zapisz wybór →</button>
        <button className="tp-skip" onClick={onSkip}>Pomiń na razie</button>
      </div>
    </div>
  );
}

// ── MATCH FORM ────────────────────────────────────────────────────────────────
function MatchFormFields({ data, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="mi" placeholder="Gospodarz" value={data.home} onChange={e => onChange({ ...data, home: e.target.value })} />
        <input className="mi" placeholder="Gość" value={data.away} onChange={e => onChange({ ...data, away: e.target.value })} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="mi" type="date" value={data.match_date} onChange={e => onChange({ ...data, match_date: e.target.value })} />
        <input className="mi" type="time" value={data.match_time} onChange={e => onChange({ ...data, match_time: e.target.value })} />
      </div>
      <input className="mi" placeholder="Grupa (np. Grupa A)" value={data.group_name} onChange={e => onChange({ ...data, group_name: e.target.value })} />
      <div style={{ display: "flex", gap: 8 }}>
        <input className="mi" type="number" step="0.01" min="1" placeholder="Kurs 1" value={data.odds_home} onChange={e => onChange({ ...data, odds_home: e.target.value })} />
        <input className="mi" type="number" step="0.01" min="1" placeholder="Kurs X" value={data.odds_draw} onChange={e => onChange({ ...data, odds_draw: e.target.value })} />
        <input className="mi" type="number" step="0.01" min="1" placeholder="Kurs 2" value={data.odds_away} onChange={e => onChange({ ...data, odds_away: e.target.value })} />
      </div>
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleReset = async () => {
    if (!resetEmail.trim()) { setError("Wpisz swój adres e-mail"); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: "https://mundialowy-ekspert.vercel.app",
    });
    setLoading(false);
    if (error) { setError("Nie znaleziono konta z tym adresem e-mail"); return; }
    setResetSent(true);
  };

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError("Nieprawidłowy e-mail lub hasło"); setLoading(false); return; }
      onAuth(data.user);
    } else {
      if (!name.trim()) { setError("Wpisz swoje imię lub pseudonim"); setLoading(false); return; }
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { data: { name: name.trim() } },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.user) {
        await supabase.from("profiles").upsert({ id: data.user.id, name: name.trim(), is_admin: false });
        onAuth(data.user);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <style>{css}</style>
      <div className="auth-screen">
        <div className="photo-bg" />
        <div className="ov1" />
        <div className="ov2" />
        <div className="auth-hero">
          <div className="eyebrow">
            <div className="ey-line" />
            <span className="ey-txt">MŚ 2026</span>
          </div>
          <div className="hero-title">MUNDIALOWY<br /><span className="hero-green">EKSPERT</span></div>
          <div className="hero-sub">Typuj mecze ze znajomymi.<br />Kursy bukmacherskie. Prawdziwa rywalizacja.</div>
        </div>
        <div className="auth-card">
          <div className="card-shine" />
          {resetMode ? (
            <>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Resetuj hasło</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                  {resetSent ? "Sprawdź skrzynkę e-mail i kliknij link, aby ustawić nowe hasło." : "Podaj adres e-mail — wyślemy link do resetowania hasła."}
                </div>
              </div>
              {!resetSent && (
                <>
                  <div className="afield">
                    <span className="aicon">✉️</span>
                    <input className="ainput" type="email" placeholder="Adres e-mail" value={resetEmail} onChange={e => setResetEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleReset()} />
                  </div>
                  {error && <div className="aerr">{error}</div>}
                  <button className="acta" onClick={handleReset} disabled={loading}>
                    {loading ? "Wysyłanie..." : "Wyślij link resetujący →"}
                  </button>
                </>
              )}
              {resetSent && <div className="reset-ok">✓ Link wysłany!<br />Sprawdź swoją skrzynkę e-mail.</div>}
              <button className="back-btn" onClick={() => { setResetMode(false); setResetSent(false); setError(""); }}>← Wróć do logowania</button>
            </>
          ) : (
            <>
              <div className="seg">
                {["login", "register"].map(m => (
                  <button key={m} className={`seg-btn ${mode === m ? "on" : ""}`} onClick={() => setMode(m)}>
                    {m === "login" ? "Logowanie" : "Rejestracja"}
                  </button>
                ))}
              </div>
              {mode === "register" && (
                <div className="afield">
                  <span className="aicon">👤</span>
                  <input className="ainput" placeholder="Imię lub pseudonim" value={name} onChange={e => setName(e.target.value)} />
                </div>
              )}
              <div className="afield">
                <span className="aicon">✉️</span>
                <input className="ainput" type="email" placeholder="Adres e-mail" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="afield">
                <span className="aicon">🔒</span>
                <input className="ainput" type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              </div>
              {error && <div className="aerr">{error}</div>}
              <button className="acta" onClick={handleSubmit} disabled={loading}>
                {loading ? "Ładowanie..." : mode === "login" ? "Zaloguj się →" : "Zarejestruj się →"}
              </button>
              {mode === "login" && (
                <button className="forgot-btn" onClick={() => { setResetMode(true); setError(""); }}>
                  Nie pamiętam hasła
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── CHAT ──────────────────────────────────────────────────────────────────────
function ChatTab({ user, profile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    supabase.from("messages").select("*").order("created_at").then(({ data }) => {
      setMessages(data || []);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    const channel = supabase.channel("messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
        setMessages(prev => [...prev, payload.new]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      }).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const send = async () => {
    const c = input.trim();
    if (!c || sending) return;
    setSending(true); setInput("");
    await supabase.from("messages").insert({ user_id: user.id, user_name: profile?.name || user.email, content: c });
    setSending(false);
  };

  // Czas w strefie Warszawa
  const fmt = ts => new Date(ts).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" });
  const fmtD = ts => new Date(ts).toLocaleDateString("pl-PL", { day: "numeric", month: "long", timeZone: "Europe/Warsaw" });

  const grouped = messages.reduce((acc, m) => {
    const d = fmtD(m.created_at);
    if (!acc[d]) acc[d] = [];
    acc[d].push(m); return acc;
  }, {});

  return (
    <div className="chat-wrap">
      <div className="chat-msgs">
        {messages.length === 0 && <div className="empty"><div className="ei">💬</div><div className="et">Brak wiadomości</div><div className="es">Zacznij rozmowę</div></div>}
        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div className="cdt"><span>{date}</span></div>
            {msgs.map((msg, i) => {
              const isMe = msg.user_id === user.id;
              const av = getAvatar(msg.user_name);
              const showName = !msgs[i + 1] || msgs[i + 1].user_id !== msg.user_id;
              return (
                <div key={msg.id} className="cbw" style={{ alignItems: isMe ? "flex-end" : "flex-start" }}>
                  <div className={`crow ${isMe ? "me" : ""}`}>
                    {!isMe && <div className="cav2" style={{ background: showName ? av.gradient : "transparent" }}>{showName ? av.initials : ""}</div>}
                    <div className={`cb ${isMe ? "mine" : "theirs"}`}>{msg.content}</div>
                  </div>
                  {showName && !isMe && <div className="csnd">{msg.user_name}</div>}
                  {showName && isMe && <div className="ctm">{fmt(msg.created_at)}</div>}
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="chat-bar">
        <input className="cin" placeholder="Wiadomość..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} maxLength={500} />
        <button className="csend" onClick={send} disabled={!input.trim() || sending}>↑</button>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
function MainApp({ user, profile: initialProfile, onLogout }) {
  const [profile, setProfile] = useState(initialProfile);
  const [tab, setTab] = useState("matches");
  const [matches, setMatches] = useState([]);
  const [tips, setTips] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [resultModal, setResultModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editData, setEditData] = useState({});
  const [toast, setToast] = useState(null);
  const [newMatch, setNewMatch] = useState({ home: "", away: "", match_date: "", match_time: "21:00", group_name: "Grupa A", odds_home: "", odds_draw: "", odds_away: "" });

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const load = async () => {
    const [{ data: m }, { data: t }, { data: p }] = await Promise.all([
      supabase.from("matches").select("*").order("match_date").order("match_time"),
      supabase.from("tips").select("*"),
      supabase.from("profiles").select("*"),
    ]);
    setMatches(m || []); setTips(t || []); setProfiles(p || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    if (!initialProfile?.favorite_team) setTimeout(() => setShowTeamPicker(true), 800);
  }, []);

  const saveTeam = async (teamName) => {
    if (!teamName) return;
    await supabase.from("profiles").update({ favorite_team: teamName }).eq("id", user.id);
    setProfile(prev => ({ ...prev, favorite_team: teamName }));
    setShowTeamPicker(false);
    showToast(`Kibicujesz: ${FLAGS[teamName]} ${teamName}`);
    await load();
  };

  const myTip = id => tips.find(t => t.user_id === user.id && t.match_id === id);

  // Upsert — nigdy nie daje błędu duplicate key
  const placeTip = async (matchId, pick) => {
    const match = matches.find(m => m.id === matchId);
    if (isMatchLocked(match)) { showToast("⛔ Typowanie zamknięte"); return; }

    const { data, error } = await supabase
      .from("tips")
      .upsert(
        { user_id: user.id, match_id: matchId, pick, points: 0 },
        { onConflict: "user_id,match_id" }
      )
      .select()
      .single();

    if (error) { showToast("⚠️ Błąd zapisu — spróbuj jeszcze raz"); return; }

    setTips(prev => {
      const idx = prev.findIndex(t => t.user_id === user.id && t.match_id === matchId);
      if (idx >= 0) { const u = [...prev]; u[idx] = data; return u; }
      return [...prev, data];
    });

    showToast(`Typ: ${PICK_LABELS[pick]} · +${parseFloat(match[`odds_${pick}`]).toFixed(2)} pkt`);
  };

  const saveResult = async (matchId, result) => {
    const match = matches.find(m => m.id === matchId);
    await supabase.from("matches").update({ status: "finished", result }).eq("id", matchId);
    for (const t of tips.filter(t => t.match_id === matchId)) {
      await supabase.from("tips").update({ points: t.pick === result ? parseFloat(match[`odds_${result}`]) : 0 }).eq("id", t.id);
    }
    await load(); setResultModal(null); showToast("Wynik zapisany!");
  };

  const openEdit = match => {
    setEditData({ home: match.home, away: match.away, match_date: match.match_date, match_time: match.match_time?.slice(0, 5), group_name: match.group_name, odds_home: parseFloat(match.odds_home).toFixed(2), odds_draw: parseFloat(match.odds_draw).toFixed(2), odds_away: parseFloat(match.odds_away).toFixed(2) });
    setEditModal(match);
  };

  const saveEdit = async () => {
    const { home, away, match_date, match_time, group_name, odds_home, odds_draw, odds_away } = editData;
    if (!home || !away || !match_date || !odds_home || !odds_draw || !odds_away) { showToast("Wypełnij wszystkie pola"); return; }
    await supabase.from("matches").update({ home, away, home_flag: FLAGS[home] || "🏳️", away_flag: FLAGS[away] || "🏳️", match_date, match_time, group_name, odds_home: parseFloat(odds_home), odds_draw: parseFloat(odds_draw), odds_away: parseFloat(odds_away) }).eq("id", editModal.id);
    await load(); setEditModal(null); showToast("Zaktualizowano!");
  };

  const addMatch = async () => {
    const { home, away, match_date, match_time, group_name, odds_home, odds_draw, odds_away } = newMatch;
    if (!home || !away || !match_date || !odds_home || !odds_draw || !odds_away) { showToast("Wypełnij wszystkie pola"); return; }
    await supabase.from("matches").insert({ home, away, home_flag: FLAGS[home] || "🏳️", away_flag: FLAGS[away] || "🏳️", match_date, match_time, group_name, odds_home: parseFloat(odds_home), odds_draw: parseFloat(odds_draw), odds_away: parseFloat(odds_away), status: "upcoming", result: null });
    await load(); setAddModal(false);
    setNewMatch({ home: "", away: "", match_date: "", match_time: "21:00", group_name: "Grupa A", odds_home: "", odds_draw: "", odds_away: "" });
    showToast("Mecz dodany!");
  };

  const lb = profiles.map(p => ({
    ...p,
    points: tips.filter(t => t.user_id === p.id).reduce((s, t) => s + (t.points || 0), 0),
    correct: tips.filter(t => t.user_id === p.id && t.points > 0).length,
  })).sort((a, b) => b.points - a.points);

  const myPts = lb.find(u => u.id === user.id)?.points || 0;
  const myRank = lb.findIndex(u => u.id === user.id) + 1;
  const upcoming = matches.filter(m => m.status === "upcoming");
  const finished = matches.filter(m => m.status === "finished");
  const av = getAvatar(profile?.name || "");

  const tabs = [
    { key: "matches", icon: "⚽", label: "Mecze" },
    { key: "leaderboard", icon: "🏆", label: "Tabela" },
    { key: "chat", icon: "💬", label: "Czat" },
    { key: "rules", icon: "📋", label: "Regulamin" },
    ...(profile?.is_admin ? [{ key: "admin", icon: "⚙️", label: "Admin" }] : []),
  ];

  if (loading) return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: "#060f07", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <div style={{ width: 52, height: 52, background: "linear-gradient(135deg,#1e7a38,#4cde6e)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>⚽</div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, color: "rgba(76,222,110,0.6)", letterSpacing: 3 }}>ŁADOWANIE</div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {showTeamPicker && <TeamPicker onSave={saveTeam} onSkip={() => setShowTeamPicker(false)} />}

        <div className="hdr">
          <div className="hdr-photo" />
          <div className="hdr-ov" />
          <div className="hdr-ct">
            <div className="hdr-top">
              <div className="logo">MUNDIALOWY <span>EKSPERT</span></div>
              <div className="hdr-r">
                <div className="upill">
                  <div className="uav" style={{ background: av.gradient }}>{av.initials}</div>
                  <span className="uname">{profile?.name || "Ty"}</span>
                </div>
                <button className="uout" onClick={onLogout}>Wyloguj</button>
              </div>
            </div>
            <div className="stats">
              {[
                { label: "Punkty", value: myPts.toFixed(2), g: true },
                { label: "Pozycja", value: `#${myRank}`, g: false },
                { label: "Trafione", value: tips.filter(t => t.user_id === user.id && t.points > 0).length, g: false },
              ].map(s => (
                <div key={s.label} className="sbox">
                  <div className="slbl">{s.label}</div>
                  <div className={`sval ${s.g ? "g" : ""}`}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ct">
          {tab === "chat" && <ChatTab user={user} profile={profile} />}

          {tab === "matches" && <>
            {upcoming.length === 0 && finished.length === 0 && (
              <div className="empty"><div className="ei">📅</div><div className="et">Brak meczów</div><div className="es">Admin wkrótce doda terminarz</div></div>
            )}
            {upcoming.length > 0 && <>
              <div className="sh">Nadchodzące</div>
              {upcoming.map(match => {
                const tip = myTip(match.id);
                const lck = isMatchLocked(match);
                return (
                  <div key={match.id} className="mc">
                    <div className="mt">
                      <span className="gbadge">{match.group_name}</span>
                      <span className="mtime">{match.match_date} · {match.match_time?.slice(0, 5)}</span>
                    </div>
                    <div className="mb2">
                      <div className="tms">
                        <div className="tm"><span className="tf">{match.home_flag}</span><span className="tn">{match.home}</span></div>
                        <div className="vs" />
                        <div className="tm r"><span className="tf">{match.away_flag}</span><span className="tn">{match.away}</span></div>
                      </div>
                      <div className="odds">
                        {["home", "draw", "away"].map(pick => (
                          <button key={pick} className={`odd ${tip?.pick === pick && !lck ? "sel" : ""} ${lck && tip?.pick !== pick ? "no" : ""}`} onClick={() => placeTip(match.id, pick)} disabled={lck}>
                            <div className="ol">{PICK_LABELS[pick]}</div>
                            <div className="ov">{parseFloat(match[`odds_${pick}`]).toFixed(2)}</div>
                          </button>
                        ))}
                      </div>
                      {lck && <div className="lck">⛔ Typowanie zamknięte</div>}
                      {!lck && tip && <div className="tipok">✓ Typ: {PICK_LABELS[tip.pick]} · +{parseFloat(match[`odds_${tip.pick}`]).toFixed(2)} pkt</div>}
                    </div>
                  </div>
                );
              })}
            </>}
            {finished.length > 0 && <>
              <div className="sh" style={{ marginTop: 8 }}>Zakończone</div>
              {finished.map(match => {
                const tip = myTip(match.id);
                const isCor = tip?.pick === match.result;
                return (
                  <div key={match.id} className="mc" style={{ opacity: 0.85 }}>
                    <div className="mt">
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{match.group_name}</span>
                      <span className={`rbadge ${isCor && tip ? "rw" : tip ? "rl" : "rn"}`}>
                        {tip ? (isCor ? `+${parseFloat(match[`odds_${tip.pick}`]).toFixed(2)} pkt ✓` : "0 pkt ✗") : "Brak typu"}
                      </span>
                    </div>
                    <div className="mb2">
                      <div className="tms">
                        <div className="tm"><span className="tf">{match.home_flag}</span><span className="tn">{match.home}</span></div>
                        <div style={{ textAlign: "center", padding: "0 8px" }}>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Wynik</div>
                          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: "#4cde6e" }}>{PICK_LABELS[match.result]}</div>
                        </div>
                        <div className="tm r"><span className="tf">{match.away_flag}</span><span className="tn">{match.away}</span></div>
                      </div>
                      <div className="odds">
                        {["home", "draw", "away"].map(pick => (
                          <button key={pick} className={`odd ${pick === match.result ? "ok" : tip?.pick === pick ? "no" : ""}`} disabled>
                            <div className="ol">{PICK_LABELS[pick]}</div>
                            <div className="ov" style={{ color: pick === match.result ? "#34c759" : "rgba(255,255,255,0.35)" }}>{parseFloat(match[`odds_${pick}`]).toFixed(2)}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>}
          </>}

          {tab === "leaderboard" && <>
            <div className="sh">Klasyfikacja</div>
            {lb.length === 0 && <div className="empty"><div className="ei">🏆</div><div className="et">Brak uczestników</div></div>}
            <div className="lbc">
              {lb.map((u, i) => {
                const uav = getAvatar(u.name);
                const favFlag = u.favorite_team ? FLAGS[u.favorite_team] : null;
                return (
                  <div key={u.id} className={`lbr ${u.id === user.id ? "me" : ""}`}>
                    <div className="lbrank">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <span className="lbrn">#{i + 1}</span>}</div>
                    <div className={`lbfc ${favFlag ? "hf" : ""}`}>
                      {favFlag
                        ? favFlag
                        : <div className="lbav" style={{ background: uav.gradient, width: "100%", height: "100%", borderRadius: "50%", fontSize: 13 }}>{uav.initials}</div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="lbn">{u.name}{u.id === user.id && <span className="lbme">TY</span>}</div>
                      <div className="lbs">{u.correct} trafione</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className={`lbp ${i === 0 ? "top" : "nm"}`}>{u.points.toFixed(2)}</div>
                      <div className="lbpl">PKT</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>}

          {tab === "rules" && <>
            <div className="sh">Nagrody</div>
            <div className="rc" style={{ marginBottom: 10 }}>
              {[
                { emoji: "🥇", name: "1. miejsce", amount: "100 zł", color: "#ffd700", bg: "rgba(255,215,0,0.08)" },
                { emoji: "🥈", name: "2. miejsce", amount: "30 zł", color: "#c0c0c0", bg: "rgba(192,192,192,0.08)" },
                { emoji: "🥉", name: "3. miejsce", amount: "20 zł", color: "#cd7f32", bg: "rgba(205,127,50,0.08)" },
              ].map((r, i, arr) => (
                <div key={r.name} className="prow" style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div className="pic" style={{ background: r.bg }}>{r.emoji}</div>
                  <div style={{ flex: 1 }}><div className="pnm">{r.name}</div></div>
                  <div className="pamt" style={{ color: r.color }}>{r.amount}</div>
                </div>
              ))}
            </div>
            <div className="rc" style={{ marginBottom: 10 }}>
              <div className="rrow">
                <div className="ric" style={{ background: "rgba(76,222,110,0.08)" }}>💸</div>
                <div><div className="rtit">Wypłata nagród</div><div className="rtxt">Płatności realizowane <strong style={{ color: "#4cde6e" }}>BLIKIEM</strong> po zakończeniu turnieju. Zwycięzcy zostaną poproszeni o podanie numeru do przelewu.</div></div>
              </div>
            </div>
            <div className="sh" style={{ marginTop: 16 }}>Zasady gry</div>
            {[
              { icon: "⏱️", bg: "rgba(0,122,255,0.1)", title: "Typowanie", text: "Przed każdym meczem wybierasz wynik: wygraną gospodarza (1), remis (X) lub wygraną gości (2). Typ możesz zmienić do momentu rozpoczęcia meczu — po godzinie startu typowanie jest zablokowane.\n\nKursy są aktualizowane na bieżąco na podstawie ofert bukmacherów STS oraz Superbet — najpóźniej do kilku minut przed rozpoczęciem meczu, dzięki czemu zawsze widzisz możliwie najbardziej aktualne wartości." },
              { icon: "🎯", bg: "rgba(255,59,48,0.1)", title: "Punktacja", text: "Za trafiony typ otrzymujesz tyle punktów ile wynosił kurs bukmacherski. Przykład: trafiony typ z kursem 3.20 daje 3.20 pkt. Za chybiony typ otrzymujesz 0 punktów." },
              { icon: "🏆", bg: "rgba(76,222,110,0.08)", title: "Klasyfikacja", text: "Wygrywa gracz z największą sumą punktów po zakończeniu wszystkich meczów. System premiuje odważne typy — trafienie niespodziewanego wyniku daje więcej punktów niż typowanie faworyta." },
            ].map(s => (
              <div key={s.title} className="rc" style={{ marginBottom: 8 }}>
                <div className="rrow">
                  <div className="ric" style={{ background: s.bg }}>{s.icon}</div>
                  <div><div className="rtit">{s.title}</div><div className="rtxt" style={{ whiteSpace: "pre-line" }}>{s.text}</div></div>
                </div>
              </div>
            ))}
            <div className="sh" style={{ marginTop: 16 }}>Informacje</div>
            <div className="rc">
              {[
                { icon: "👨‍💻", bg: "rgba(52,199,89,0.08)", text: "Projekt powstał hobbystycznie, gdzieś między jednym a drugim zadaniem w pracy. Przetestowaliśmy go na zawrotnej grupie trzech osób i… chyba działa 🙂 Teraz pałeczka przechodzi na Was, to Wy jesteście ekipą testową." },
                { icon: "⚠️", bg: "rgba(255,149,0,0.08)", text: "Administrator nie daje gwarancji, że wszystko pójdzie idealnie 😉 Możliwe drobne potknięcia po drodze, ale liczymy, że wspólnie dociągniemy temat do finału mistrzostw." },
                { icon: "✉️", bg: "rgba(0,122,255,0.1)", email: "bewn.gmail.3ss6o@slmail.me" },
              ].map((s, i, arr) => (
                <div key={i} className="rrow" style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div className="ric" style={{ background: s.bg }}>{s.icon}</div>
                  <div>
                    {s.text && <div className="rtxt">{s.text}</div>}
                    {s.email && <><div className="rtxt" style={{ marginBottom: 4 }}>Wszelkie uwagi, sugestie i zgłoszenia problemów prosimy kierować na adres:</div><div style={{ fontSize: 15, fontWeight: 700, color: "#4cde6e" }}>{s.email}</div></>}
                  </div>
                </div>
              ))}
            </div>
          </>}

          {tab === "admin" && profile?.is_admin && <>
            <div className="sh">Panel administratora</div>
            <button className="mprim" style={{ marginBottom: 16 }} onClick={() => setAddModal(true)}>+ Dodaj mecz</button>
            {upcoming.length > 0 && <>
              <div className="sh">Nadchodzące mecze</div>
              <div className="rc" style={{ marginBottom: 10 }}>
                {upcoming.map((match, i) => (
                  <div key={match.id} className="ar" style={{ borderBottom: i < upcoming.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <div><div className="an">{match.home_flag} {match.home} vs {match.away} {match.away_flag}</div><div className="at">{match.match_date} · {match.match_time?.slice(0, 5)}</div></div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="aedt" onClick={() => openEdit(match)}>Edytuj</button>
                      <button className="ares-btn" onClick={() => setResultModal(match)}>Wynik</button>
                    </div>
                  </div>
                ))}
              </div>
            </>}
            {finished.length > 0 && <>
              <div className="sh">Zakończone mecze</div>
              <div className="rc">
                {finished.map((match, i) => (
                  <div key={match.id} className="ar" style={{ borderBottom: i < finished.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <div><div className="an">{match.home_flag} {match.home} vs {match.away} {match.away_flag}</div><div className="ares">Wynik: {PICK_LABELS[match.result]}</div></div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="aedt" onClick={() => openEdit(match)}>Edytuj</button>
                      <button className="ares-btn" onClick={() => setResultModal(match)}>Popraw</button>
                    </div>
                  </div>
                ))}
              </div>
            </>}
          </>}
        </div>

        <div className="nav">
          {tabs.map(t => (
            <button key={t.key} className={`ni ${tab === t.key ? "on" : ""}`} onClick={() => setTab(t.key)}>
              <div className="nic">{t.icon}</div>
              <div className="nlbl">{t.label}</div>
              <div className="ndot" />
            </button>
          ))}
        </div>

        {resultModal && (
          <div className="mo" onClick={() => setResultModal(null)}>
            <div className="mbox" onClick={e => e.stopPropagation()}>
              <div className="mh" /><div className="mtt">{resultModal.home_flag} {resultModal.home} vs {resultModal.away} {resultModal.away_flag}</div>
              <div className="mst">Wybierz wynik meczu</div>
              <div style={{ display: "flex", gap: 10 }}>
                {["home", "draw", "away"].map(pick => (
                  <button key={pick} className="rbtn" onClick={() => saveResult(resultModal.id, pick)}>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>{PICK_LABELS[pick]}</div>
                    <div style={{ fontSize: 12, marginTop: 4, color: "rgba(255,255,255,0.5)" }}>{PICK_NAMES[pick]}</div>
                  </button>
                ))}
              </div>
              <button className="msec" style={{ marginTop: 12 }} onClick={() => setResultModal(null)}>Anuluj</button>
            </div>
          </div>
        )}

        {addModal && (
          <div className="mo" onClick={() => setAddModal(false)}>
            <div className="mbox" onClick={e => e.stopPropagation()}>
              <div className="mh" /><div className="mtt">Dodaj mecz ⚽</div><div className="mst">Wypełnij dane i kursy</div>
              <MatchFormFields data={newMatch} onChange={setNewMatch} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                <button className="mprim" onClick={addMatch}>Dodaj mecz</button>
                <button className="msec" onClick={() => setAddModal(false)}>Anuluj</button>
              </div>
            </div>
          </div>
        )}

        {editModal && (
          <div className="mo" onClick={() => setEditModal(null)}>
            <div className="mbox" onClick={e => e.stopPropagation()}>
              <div className="mh" /><div className="mtt">Edytuj mecz ✏️</div><div className="mst">Zmień dane meczu</div>
              <MatchFormFields data={editData} onChange={setEditData} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                <button className="mprim" onClick={saveEdit}>Zapisz zmiany</button>
                <button className="msec" onClick={() => setEditModal(null)}>Anuluj</button>
              </div>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [checking, setChecking] = useState(true);

  const loadProfile = async u => {
    const { data } = await supabase.from("profiles").select("*").eq("id", u.id).single();
    setProfile(data); setUser(u); setChecking(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadProfile(session.user);
      else setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) loadProfile(session.user);
      if (event === "SIGNED_OUT") { setUser(null); setProfile(null); setChecking(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); };

  if (checking) return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: "#060f07", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 52, height: 52, background: "linear-gradient(135deg,#1e7a38,#4cde6e)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>⚽</div>
      </div>
    </>
  );

  return user
    ? <MainApp user={user} profile={profile} onLogout={handleLogout} />
    : <AuthScreen onAuth={u => loadProfile(u)} />;
}
