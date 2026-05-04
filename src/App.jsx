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
  "Chorwacja":"🇭🇷","Czechy":"🇨🇿","Anglia":"🏴󠁧󠁢󠁥󠁮󠁧󠁿",
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
  const initials = name.slice(0,1).toUpperCase() || "?";
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return { initials, gradient: AVATAR_COLORS[idx] };
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
body { background: #060f07; font-family: 'Inter', sans-serif; }
::-webkit-scrollbar { width: 0; }

/* ── AUTH ────────────────────────────────────────────── */
.auth-screen {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.photo-bg {
  position: fixed; inset: 0;
  background-image: url('${PHOTO_URL}');
  background-size: cover;
  background-position: center center;
}

.overlay-1 {
  position: fixed; inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0,0,0,0.08) 0%,
    rgba(0,0,0,0.08) 25%,
    rgba(0,0,0,0.55) 55%,
    rgba(4,12,5,0.95) 78%,
    #040c05 100%
  );
}

.overlay-glow {
  position: fixed; bottom: 0; left: 0; right: 0; height: 60%;
  background: radial-gradient(ellipse at 50% 100%, rgba(0,180,60,0.1) 0%, transparent 70%);
}

.auth-hero {
  position: relative; z-index: 5;
  padding: 0 28px; margin-bottom: 24px;
  animation: heroReveal 1.2s cubic-bezier(0.16,1,0.3,1) both;
}

@keyframes heroReveal {
  from { opacity:0; transform:translateY(32px); }
  to   { opacity:1; transform:translateY(0); }
}

.hero-eyebrow {
  display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
  animation: fadeSlide 0.8s 0.2s both;
}

@keyframes fadeSlide {
  from { opacity:0; transform:translateX(-16px); }
  to   { opacity:1; transform:translateX(0); }
}

.eyebrow-line { width: 28px; height: 2px; background: #4cde6e; border-radius: 1px; }
.eyebrow-text { font-size: 10px; font-weight: 700; color: #4cde6e; letter-spacing: 3px; text-transform: uppercase; }

.hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 64px; line-height: 0.88; color: #fff; letter-spacing: 2px; margin-bottom: 12px;
  animation: titleReveal 1s 0.1s cubic-bezier(0.16,1,0.3,1) both;
  text-shadow: 0 4px 40px rgba(0,0,0,0.6);
}

@keyframes titleReveal {
  from { opacity:0; transform:translateY(24px) skewY(2deg); }
  to   { opacity:1; transform:translateY(0) skewY(0deg); }
}

.hero-title-green { color: #4cde6e; filter: drop-shadow(0 0 20px rgba(76,222,110,0.4)); }

.hero-sub {
  font-size: 15px; font-weight: 700;
  color: rgba(255,255,255,0.92);
  letter-spacing: 0.2px; line-height: 1.6;
  text-shadow: 0 2px 12px rgba(0,0,0,0.8);
  animation: fadeSlide 0.8s 0.3s both;
}

.auth-card {
  position: relative; z-index: 5;
  margin: 0 16px 48px;
  background: rgba(8,20,10,0.72);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px; padding: 22px;
  backdrop-filter: blur(30px);
  animation: cardReveal 1s 0.35s cubic-bezier(0.16,1,0.3,1) both;
  box-shadow: 0 0 0 1px rgba(76,222,110,0.08), 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
}

@keyframes cardReveal {
  from { opacity:0; transform:translateY(32px) scale(0.97); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}

.card-top-accent {
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 60%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(76,222,110,0.4), transparent);
}

.auth-seg {
  display: flex; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; padding: 3px; margin-bottom: 16px;
}

.seg-btn {
  flex: 1; padding: 10px; text-align: center; font-size: 14px; font-weight: 600;
  color: rgba(255,255,255,0.35); border-radius: 12px; border: none; background: transparent;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.22s;
}

.seg-btn.active { background: linear-gradient(135deg, #1a6b30, #4cde6e); color: #000; box-shadow: 0 4px 16px rgba(76,222,110,0.25); }

.auth-field { position: relative; margin-bottom: 10px; }
.field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; opacity: 0.4; pointer-events: none; }

.auth-input {
  width: 100%; padding: 13px 16px 13px 42px;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09);
  border-radius: 13px; color: #fff; font-family: 'Inter', sans-serif; font-size: 15px; outline: none; transition: all 0.22s;
}
.auth-input:focus { background: rgba(255,255,255,0.09); border-color: rgba(76,222,110,0.4); box-shadow: 0 0 0 3px rgba(76,222,110,0.08); }
.auth-input::placeholder { color: rgba(255,255,255,0.22); }

.auth-error { color: #ff453a; font-size: 12px; text-align: center; margin-bottom: 8px; font-weight: 500; }

.auth-cta {
  width: 100%; padding: 15px;
  background: linear-gradient(135deg, #1e7a38, #4cde6e);
  border: none; border-radius: 14px; color: #000;
  font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 700;
  cursor: pointer; margin-top: 4px; transition: all 0.2s;
  box-shadow: 0 8px 28px rgba(76,222,110,0.3); position: relative; overflow: hidden;
}
.auth-cta::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%); pointer-events: none; }
.auth-cta:hover { transform: translateY(-1px); box-shadow: 0 12px 36px rgba(76,222,110,0.4); }
.auth-cta:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

/* ── MAIN APP ────────────────────────────────────────── */
.main-app {
  min-height: 100vh; background: #060f07;
  max-width: 480px; margin: 0 auto;
  padding-bottom: 100px; font-family: 'Inter', sans-serif;
}

/* Header */
.app-header { position: relative; overflow: hidden; padding: 0 0 20px; min-height: 195px; }

.header-photo {
  position: absolute; inset: -20px -10px 0;
  background-image: url('${PHOTO_URL}');
  background-size: cover; background-position: center 30%;
  filter: blur(2px) brightness(0.4) saturate(1.2);
}

.header-photo-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(6,15,7,0.35) 0%, rgba(6,15,7,0.55) 50%, #060f07 100%);
}

.header-content { position: relative; z-index: 2; padding: 22px 20px 0; }

.hdr-top {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 18px;
}

/* ── LOGO WIĘKSZY ─── */
.hdr-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px; /* było 22px */
  color: #fff; letter-spacing: 2.5px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.5);
}
.hdr-logo span { color: #4cde6e; }

.hdr-right { display: flex; align-items: center; gap: 10px; }

.user-pill {
  display: flex; align-items: center; gap: 7px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(76,222,110,0.2);
  border-radius: 20px; padding: 6px 14px 6px 7px;
}

.u-av { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #000; flex-shrink: 0; }

/* ── NAZWA UŻYTKOWNIKA JAŚNIEJSZA ─── */
.u-name { font-size: 14px; color: rgba(255,255,255,0.9); font-weight: 600; }

/* ── WYLOGUJ JAŚNIEJSZY ─── */
.u-logout {
  font-size: 13px; font-weight: 600;
  color: rgba(255,255,255,0.65); /* było 0.22 */
  background: none; border: none; cursor: pointer; font-family: inherit;
  transition: color 0.2s;
}
.u-logout:hover { color: #fff; }

/* Stats */
.stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }

.stat-box {
  background: rgba(0,0,0,0.45);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px; padding: 11px 13px;
  backdrop-filter: blur(10px);
}

/* ── STAT LABEL JAŚNIEJSZY ─── */
.stat-lbl {
  font-size: 10px; font-weight: 700;
  color: rgba(255,255,255,0.65); /* było 0.35 */
  text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px;
}

/* ── STAT VALUE WIĘKSZY ─── */
.stat-val {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px; color: #fff; letter-spacing: 1px; line-height: 1;
}
.stat-val.green { color: #4cde6e; filter: drop-shadow(0 0 8px rgba(76,222,110,0.4)); }

/* Nav */
.bottom-nav {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 480px;
  background: rgba(6,15,7,0.97);
  border-top: 1px solid rgba(76,222,110,0.1);
  display: flex; z-index: 50; backdrop-filter: blur(20px);
  padding: 10px 0 14px;
}

.nav-item {
  flex: 1; padding: 6px 4px 4px;
  background: transparent; border: none; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
}

.nav-ic {
  width: 48px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px; font-size: 26px; transition: background 0.2s;
}

.nav-item.active .nav-ic { background: rgba(76,222,110,0.12); }

/* ── NAV LABEL JAŚNIEJSZY I WIĘKSZY ─── */
.nav-lbl {
  font-size: 11px; font-weight: 600;
  color: rgba(255,255,255,0.5); /* było 0.22 */
  transition: color 0.2s;
}
.nav-item.active .nav-lbl { color: #4cde6e; }

.nav-dot { width: 4px; height: 4px; background: #4cde6e; border-radius: 50%; display: none; }
.nav-item.active .nav-dot { display: block; }

/* Content */
.content { padding: 16px; }

/* ── SECTION HEADER JAŚNIEJSZY ─── */
.sec-hdr {
  font-size: 12px; font-weight: 700;
  color: rgba(255,255,255,0.65); /* było 0.28 */
  letter-spacing: 1.5px; text-transform: uppercase;
  margin-bottom: 12px; padding: 0 2px;
}

/* Match card */
.m-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px; margin-bottom: 12px; overflow: hidden;
  transition: border-color 0.2s, transform 0.15s;
}
.m-card:hover { border-color: rgba(76,222,110,0.25); transform: translateY(-1px); }

.m-top {
  padding: 10px 14px;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  display: flex; justify-content: space-between; align-items: center;
}

.grp-badge {
  font-size: 11px; color: #4cde6e;
  background: rgba(76,222,110,0.1);
  border: 1px solid rgba(76,222,110,0.2);
  padding: 3px 10px; border-radius: 20px; font-weight: 700;
}

/* ── DATA I GODZINA JAŚNIEJSZA ─── */
.m-time {
  font-size: 13px;
  color: rgba(255,255,255,0.75); /* było 0.3 */
  font-weight: 600;
}

.m-body { padding: 14px; }

.teams { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.team { display: flex; align-items: center; gap: 8px; flex: 1; }
.team.r { flex-direction: row-reverse; }
.tflag { font-size: 26px; }
.tname { font-size: 15px; font-weight: 700; color: #fff; }
.team.r .tname { text-align: right; }
.vsep { width: 6px; height: 6px; background: rgba(255,255,255,0.15); border-radius: 50%; flex-shrink: 0; }

.odds { display: flex; gap: 8px; }

.odd {
  flex: 1; border-radius: 12px; padding: 10px 6px; text-align: center;
  background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1);
  cursor: pointer; transition: all 0.18s;
}
.odd:hover:not(:disabled) { background: rgba(76,222,110,0.1); border-color: rgba(76,222,110,0.4); }
.odd.sel { background: rgba(76,222,110,0.15); border-color: #4cde6e; }
.odd.ok { background: rgba(52,199,89,0.12); border-color: #34c759; }
.odd.no { opacity: 0.3; }
.odd:disabled { cursor: default; }

.odd-l { font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 600; }
.odd.sel .odd-l { color: rgba(76,222,110,0.8); }
.odd.ok .odd-l { color: #34c759; }

.odd-v { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: #fff; letter-spacing: 0.5px; margin-top: 2px; }
.odd.sel .odd-v { color: #4cde6e; }
.odd.ok .odd-v { color: #34c759; }

.tip-ok {
  margin-top: 10px; background: rgba(76,222,110,0.08);
  border: 1px solid rgba(76,222,110,0.2);
  border-radius: 10px; padding: 8px 12px;
  font-size: 13px; color: #4cde6e; font-weight: 600;
}

.locked { margin-top: 10px; font-size: 13px; color: #ff453a; text-align: center; font-weight: 600; }

.res-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.res-w { background: rgba(52,199,89,0.15); color: #34c759; }
.res-l { background: rgba(255,59,48,0.12); color: #ff3b30; }
.res-n { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.45); }

/* Leaderboard */
.lb-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden; }
.lb-row { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.lb-row:last-child { border-bottom: none; }
.lb-row.me { background: rgba(76,222,110,0.05); border-left: 2px solid #4cde6e; }
.lb-rank { font-size: 20px; width: 30px; text-align: center; flex-shrink: 0; }
.lb-rank-n { font-family: 'Bebas Neue', sans-serif; font-size: 17px; color: rgba(255,255,255,0.35); }
.lb-av { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; color: #000; flex-shrink: 0; }
.lb-name { font-size: 16px; font-weight: 600; color: #fff; }
.lb-me { font-size: 9px; color: #4cde6e; background: rgba(76,222,110,0.12); padding: 1px 6px; border-radius: 6px; font-weight: 700; margin-left: 4px; }
.lb-sub { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px; }
.lb-pts { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 0.5px; }
.lb-pts.top { color: #4cde6e; filter: drop-shadow(0 0 8px rgba(76,222,110,0.3)); }
.lb-pts.norm { color: #fff; }
.lb-pts-lbl { font-size: 10px; color: rgba(255,255,255,0.4); font-weight: 600; text-align: right; }

/* Rules */
.r-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden; margin-bottom: 10px; }
.r-row { display: flex; gap: 14px; align-items: flex-start; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.r-row:last-child { border-bottom: none; }
.r-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.r-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 5px; }

/* ── TEKST REGULAMIN JAŚNIEJSZY ─── */
.r-text {
  font-size: 13px;
  color: rgba(255,255,255,0.72); /* było 0.38 */
  line-height: 1.65;
}

.prize-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.prize-row:last-child { border-bottom: none; }
.prize-ic { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
.prize-name { font-size: 16px; font-weight: 600; color: #fff; }
.prize-amt { font-family: 'Bebas Neue', sans-serif; font-size: 30px; letter-spacing: 1px; }

/* Admin */
.adm-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.adm-row:last-child { border-bottom: none; }
.adm-name { font-size: 14px; font-weight: 700; color: #fff; }
.adm-time { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 2px; }
.adm-res { font-size: 12px; color: #4cde6e; margin-top: 2px; font-weight: 600; }
.adm-edit { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.8); padding: 7px 13px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.adm-result { background: rgba(76,222,110,0.1); border: 1px solid rgba(76,222,110,0.25); color: #4cde6e; padding: 7px 13px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }

/* Modal */
.mo { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: flex-end; justify-content: center; z-index: 100; backdrop-filter: blur(20px); }
.mb { background: #0f1a10; border: 1px solid rgba(255,255,255,0.12); border-radius: 24px 24px 0 0; padding: 28px 24px; width: 100%; max-width: 480px; max-height: 92vh; overflow-y: auto; }
.mh { width: 36px; height: 4px; background: rgba(255,255,255,0.15); border-radius: 2px; margin: 0 auto 20px; }
.mt { font-size: 19px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.ms { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 20px; }
.res-btn { flex: 1; padding: 16px 8px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.12); border-radius: 14px; color: rgba(255,255,255,0.7); cursor: pointer; font-family: inherit; font-size: 20px; font-weight: 700; transition: all 0.18s; }
.res-btn:hover { background: rgba(76,222,110,0.12); border-color: #4cde6e; color: #4cde6e; }
.mi { width: 100%; padding: 13px 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; color: #fff; font-family: inherit; font-size: 15px; outline: none; transition: border-color 0.2s; }
.mi:focus { border-color: rgba(76,222,110,0.4); }
.mi::placeholder { color: rgba(255,255,255,0.3); }
.m-primary { width: 100%; padding: 15px; background: linear-gradient(135deg, #1e7a38, #4cde6e); border: none; border-radius: 14px; color: #000; font-family: inherit; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: 0 6px 24px rgba(76,222,110,0.25); }
.m-secondary { width: 100%; padding: 13px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; color: rgba(255,255,255,0.6); font-family: inherit; font-size: 15px; font-weight: 500; cursor: pointer; }

/* Toast */
.toast { position: fixed; bottom: 110px; left: 50%; transform: translateX(-50%); background: rgba(10,20,12,0.96); border: 1px solid rgba(76,222,110,0.25); color: #fff; padding: 11px 22px; border-radius: 50px; font-size: 14px; font-weight: 600; z-index: 200; white-space: nowrap; animation: toastIn 0.25s ease; backdrop-filter: blur(20px); }
@keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }

/* Chat */
.chat-wrap { display: flex; flex-direction: column; height: calc(100vh - 210px); }
.chat-msgs { flex: 1; overflow-y: auto; padding: 0 0 8px; }
.chat-date { text-align: center; margin: 14px 0 10px; }
.chat-date span { font-size: 11px; color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.06); padding: 3px 12px; border-radius: 20px; }
.cbw { display: flex; flex-direction: column; margin-bottom: 2px; }
.crow { display: flex; align-items: flex-end; gap: 6px; }
.crow.me { flex-direction: row-reverse; }
.cav { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #000; flex-shrink: 0; }
.cb { padding: 10px 14px; border-radius: 18px; max-width: 76%; word-break: break-word; font-size: 15px; line-height: 1.4; }
.cb.mine { background: linear-gradient(135deg, #1e7a38, #4cde6e); color: #000; font-weight: 500; border-bottom-right-radius: 4px; }
.cb.theirs { background: rgba(255,255,255,0.09); color: #fff; border-bottom-left-radius: 4px; }
.csender { font-size: 11px; color: rgba(255,255,255,0.45); margin-left: 34px; margin-top: 2px; }
.ctime { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 2px; text-align: right; }
.chat-bar { padding: 8px 0 16px; display: flex; gap: 8px; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); }
.chat-in { flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 22px; color: #fff; font-family: inherit; font-size: 15px; outline: none; }
.chat-in:focus { border-color: rgba(76,222,110,0.3); }
.chat-in::placeholder { color: rgba(255,255,255,0.3); }
.chat-send { width: 40px; height: 40px; background: linear-gradient(135deg, #1e7a38, #4cde6e); border: none; border-radius: 50%; color: #000; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: 700; }
.chat-send:disabled { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.2); }
.empty { text-align: center; padding: 60px 0; color: rgba(255,255,255,0.35); }
.empty-i { font-size: 44px; margin-bottom: 12px; }
.empty-t { font-size: 17px; font-weight: 600; color: rgba(255,255,255,0.5); }
.empty-s { font-size: 14px; margin-top: 4px; }
`;

// ── MATCH FORM ────────────────────────────────────────────────────────────────
function MatchFormFields({ data, onChange }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ display:"flex", gap:8 }}>
        <input className="mi" placeholder="Gospodarz" value={data.home} onChange={e => onChange({...data, home:e.target.value})} />
        <input className="mi" placeholder="Gość" value={data.away} onChange={e => onChange({...data, away:e.target.value})} />
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <input className="mi" type="date" value={data.match_date} onChange={e => onChange({...data, match_date:e.target.value})} />
        <input className="mi" type="time" value={data.match_time} onChange={e => onChange({...data, match_time:e.target.value})} />
      </div>
      <input className="mi" placeholder="Grupa (np. Grupa A)" value={data.group_name} onChange={e => onChange({...data, group_name:e.target.value})} />
      <div style={{ display:"flex", gap:8 }}>
        <input className="mi" type="number" step="0.01" min="1" placeholder="Kurs 1" value={data.odds_home} onChange={e => onChange({...data, odds_home:e.target.value})} />
        <input className="mi" type="number" step="0.01" min="1" placeholder="Kurs X" value={data.odds_draw} onChange={e => onChange({...data, odds_draw:e.target.value})} />
        <input className="mi" type="number" step="0.01" min="1" placeholder="Kurs 2" value={data.odds_away} onChange={e => onChange({...data, odds_away:e.target.value})} />
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

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError("Nieprawidłowy e-mail lub hasło"); setLoading(false); return; }
      onAuth(data.user);
    } else {
      if (!name.trim()) { setError("Wpisz swoje imię lub pseudonim"); setLoading(false); return; }
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { data: { name: name.trim() } }
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
        <div className="overlay-1" />
        <div className="overlay-glow" />
        <div className="auth-hero">
          <div className="hero-eyebrow">
            <div className="eyebrow-line" />
            <span className="eyebrow-text">MŚ 2026</span>
          </div>
          <div className="hero-title">
            MUNDIALOWY<br/>
            <span className="hero-title-green">EKSPERT</span>
          </div>
          <div className="hero-sub">
            Typuj mecze ze znajomymi.<br/>
            Kursy bukmacherskie. Prawdziwa rywalizacja.
          </div>
        </div>
        <div className="auth-card">
          <div className="card-top-accent" />
          <div className="auth-seg">
            {["login","register"].map(m => (
              <button key={m} className={`seg-btn ${mode===m?"active":""}`} onClick={() => setMode(m)}>
                {m==="login" ? "Logowanie" : "Rejestracja"}
              </button>
            ))}
          </div>
          {mode==="register" && (
            <div className="auth-field">
              <span className="field-icon">👤</span>
              <input className="auth-input" placeholder="Imię lub pseudonim" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div className="auth-field">
            <span className="field-icon">✉️</span>
            <input className="auth-input" type="email" placeholder="Adres e-mail" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="auth-field">
            <span className="field-icon">🔒</span>
            <input className="auth-input" type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==="Enter" && handleSubmit()} />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-cta" onClick={handleSubmit} disabled={loading}>
            {loading ? "Ładowanie..." : mode==="login" ? "Zaloguj się →" : "Zarejestruj się →"}
          </button>
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
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:"smooth" }), 100);
    });
    const channel = supabase.channel("messages")
      .on("postgres_changes", { event:"INSERT", schema:"public", table:"messages" }, payload => {
        setMessages(prev => [...prev, payload.new]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:"smooth" }), 50);
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

  const fmt = ts => new Date(ts).toLocaleTimeString("pl-PL", { hour:"2-digit", minute:"2-digit" });
  const fmtD = ts => new Date(ts).toLocaleDateString("pl-PL", { day:"numeric", month:"long" });
  const grouped = messages.reduce((acc, m) => {
    const d = fmtD(m.created_at);
    if (!acc[d]) acc[d] = [];
    acc[d].push(m); return acc;
  }, {});

  return (
    <div className="chat-wrap">
      <div className="chat-msgs">
        {messages.length === 0 && <div className="empty"><div className="empty-i">💬</div><div className="empty-t">Brak wiadomości</div><div className="empty-s">Zacznij rozmowę</div></div>}
        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div className="chat-date"><span>{date}</span></div>
            {msgs.map((msg, i) => {
              const isMe = msg.user_id === user.id;
              const av = getAvatar(msg.user_name);
              const showName = !msgs[i+1] || msgs[i+1].user_id !== msg.user_id;
              return (
                <div key={msg.id} className="cbw" style={{ alignItems: isMe?"flex-end":"flex-start" }}>
                  <div className={`crow ${isMe?"me":""}`}>
                    {!isMe && <div className="cav" style={{ background: showName ? av.gradient : "transparent" }}>{showName ? av.initials : ""}</div>}
                    <div className={`cb ${isMe?"mine":"theirs"}`}>{msg.content}</div>
                  </div>
                  {showName && !isMe && <div className="csender">{msg.user_name}</div>}
                  {showName && isMe && <div className="ctime">{fmt(msg.created_at)}</div>}
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="chat-bar">
        <input className="chat-in" placeholder="Wiadomość..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send()} maxLength={500} />
        <button className="chat-send" onClick={send} disabled={!input.trim() || sending}>↑</button>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
function MainApp({ user, profile, onLogout }) {
  const [tab, setTab] = useState("matches");
  const [matches, setMatches] = useState([]);
  const [tips, setTips] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultModal, setResultModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editData, setEditData] = useState({});
  const [toast, setToast] = useState(null);
  const [newMatch, setNewMatch] = useState({ home:"", away:"", match_date:"", match_time:"21:00", group_name:"Grupa A", odds_home:"", odds_draw:"", odds_away:"" });

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const load = async () => {
    const [{ data: m }, { data: t }, { data: p }] = await Promise.all([
      supabase.from("matches").select("*").order("match_date").order("match_time"),
      supabase.from("tips").select("*"),
      supabase.from("profiles").select("*"),
    ]);
    setMatches(m||[]); setTips(t||[]); setProfiles(p||[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const isLocked = m => new Date() >= new Date(`${m.match_date}T${m.match_time}`);
  const myTip = id => tips.find(t => t.user_id===user.id && t.match_id===id);

  const placeTip = async (matchId, pick) => {
    const match = matches.find(m => m.id===matchId);
    if (isLocked(match)) { showToast("⛔ Typowanie zamknięte"); return; }
    const ex = myTip(matchId);
    if (ex) {
      await supabase.from("tips").update({ pick, points:0 }).eq("id", ex.id);
      setTips(tips.map(t => t.id===ex.id ? {...t, pick, points:0} : t));
    } else {
      const { data } = await supabase.from("tips").insert({ user_id:user.id, match_id:matchId, pick, points:0 }).select().single();
      if (data) setTips([...tips, data]);
    }
    showToast(`Typ: ${PICK_LABELS[pick]} · +${parseFloat(match[`odds_${pick}`]).toFixed(2)} pkt`);
  };

  const saveResult = async (matchId, result) => {
    const match = matches.find(m => m.id===matchId);
    await supabase.from("matches").update({ status:"finished", result }).eq("id", matchId);
    for (const t of tips.filter(t => t.match_id===matchId)) {
      await supabase.from("tips").update({ points: t.pick===result ? parseFloat(match[`odds_${result}`]) : 0 }).eq("id", t.id);
    }
    await load(); setResultModal(null); showToast("Wynik zapisany!");
  };

  const openEdit = match => {
    setEditData({ home:match.home, away:match.away, match_date:match.match_date, match_time:match.match_time?.slice(0,5), group_name:match.group_name, odds_home:parseFloat(match.odds_home).toFixed(2), odds_draw:parseFloat(match.odds_draw).toFixed(2), odds_away:parseFloat(match.odds_away).toFixed(2) });
    setEditModal(match);
  };

  const saveEdit = async () => {
    const { home, away, match_date, match_time, group_name, odds_home, odds_draw, odds_away } = editData;
    if (!home||!away||!match_date||!odds_home||!odds_draw||!odds_away) { showToast("Wypełnij wszystkie pola"); return; }
    await supabase.from("matches").update({ home, away, home_flag:FLAGS[home]||"🏳️", away_flag:FLAGS[away]||"🏳️", match_date, match_time, group_name, odds_home:parseFloat(odds_home), odds_draw:parseFloat(odds_draw), odds_away:parseFloat(odds_away) }).eq("id", editModal.id);
    await load(); setEditModal(null); showToast("Zaktualizowano!");
  };

  const addMatch = async () => {
    const { home, away, match_date, match_time, group_name, odds_home, odds_draw, odds_away } = newMatch;
    if (!home||!away||!match_date||!odds_home||!odds_draw||!odds_away) { showToast("Wypełnij wszystkie pola"); return; }
    await supabase.from("matches").insert({ home, away, home_flag:FLAGS[home]||"🏳️", away_flag:FLAGS[away]||"🏳️", match_date, match_time, group_name, odds_home:parseFloat(odds_home), odds_draw:parseFloat(odds_draw), odds_away:parseFloat(odds_away), status:"upcoming", result:null });
    await load(); setAddModal(false);
    setNewMatch({ home:"", away:"", match_date:"", match_time:"21:00", group_name:"Grupa A", odds_home:"", odds_draw:"", odds_away:"" });
    showToast("Mecz dodany!");
  };

  const lb = profiles.map(p => ({
    ...p,
    points: tips.filter(t => t.user_id===p.id).reduce((s,t) => s+(t.points||0), 0),
    correct: tips.filter(t => t.user_id===p.id && t.points>0).length,
  })).sort((a,b) => b.points-a.points);

  const myPts = lb.find(u => u.id===user.id)?.points || 0;
  const myRank = lb.findIndex(u => u.id===user.id) + 1;
  const upcoming = matches.filter(m => m.status==="upcoming");
  const finished = matches.filter(m => m.status==="finished");
  const av = getAvatar(profile?.name||"");

  const tabs = [
    { key:"matches", icon:"⚽", label:"Mecze" },
    { key:"leaderboard", icon:"🏆", label:"Tabela" },
    { key:"chat", icon:"💬", label:"Czat" },
    { key:"rules", icon:"📋", label:"Regulamin" },
    ...(profile?.is_admin ? [{ key:"admin", icon:"⚙️", label:"Admin" }] : []),
  ];

  if (loading) return (
    <>
      <style>{css}</style>
      <div style={{ minHeight:"100vh", background:"#060f07", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
        <div style={{ width:52, height:52, background:"linear-gradient(135deg,#1e7a38,#4cde6e)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>⚽</div>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:14, color:"rgba(76,222,110,0.6)", letterSpacing:3 }}>ŁADOWANIE</div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="main-app">

        <div className="app-header">
          <div className="header-photo" />
          <div className="header-photo-overlay" />
          <div className="header-content">
            <div className="hdr-top">
              <div className="hdr-logo">MUNDIALOWY <span>EKSPERT</span></div>
              <div className="hdr-right">
                <div className="user-pill">
                  <div className="u-av" style={{ background:av.gradient }}>{av.initials}</div>
                  <span className="u-name">{profile?.name||"Ty"}</span>
                </div>
                <button className="u-logout" onClick={onLogout}>Wyloguj</button>
              </div>
            </div>
            <div className="stats-row">
              {[
                { label:"Punkty", value:myPts.toFixed(2), green:true },
                { label:"Pozycja", value:`#${myRank}`, green:false },
                { label:"Trafione", value:tips.filter(t => t.user_id===user.id && t.points>0).length, green:false },
              ].map(s => (
                <div key={s.label} className="stat-box">
                  <div className="stat-lbl">{s.label}</div>
                  <div className={`stat-val ${s.green?"green":""}`}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="content">
          {tab==="chat" && <ChatTab user={user} profile={profile}/>}

          {tab==="matches" && <>
            {upcoming.length===0 && finished.length===0 && (
              <div className="empty"><div className="empty-i">📅</div><div className="empty-t">Brak meczów</div><div className="empty-s">Admin wkrótce doda terminarz</div></div>
            )}
            {upcoming.length>0 && <>
              <div className="sec-hdr">Nadchodzące</div>
              {upcoming.map(match => {
                const tip = myTip(match.id);
                const lck = isLocked(match);
                return (
                  <div key={match.id} className="m-card">
                    <div className="m-top">
                      <span className="grp-badge">{match.group_name}</span>
                      <span className="m-time">{match.match_date} · {match.match_time?.slice(0,5)}</span>
                    </div>
                    <div className="m-body">
                      <div className="teams">
                        <div className="team"><span className="tflag">{match.home_flag}</span><span className="tname">{match.home}</span></div>
                        <div className="vsep"/>
                        <div className="team r"><span className="tflag">{match.away_flag}</span><span className="tname">{match.away}</span></div>
                      </div>
                      <div className="odds">
                        {["home","draw","away"].map(pick => (
                          <button key={pick} className={`odd ${tip?.pick===pick&&!lck?"sel":""} ${lck&&tip?.pick!==pick?"no":""}`} onClick={() => placeTip(match.id, pick)} disabled={lck}>
                            <div className="odd-l">{PICK_LABELS[pick]}</div>
                            <div className="odd-v">{parseFloat(match[`odds_${pick}`]).toFixed(2)}</div>
                          </button>
                        ))}
                      </div>
                      {lck && <div className="locked">⛔ Typowanie zamknięte</div>}
                      {!lck && tip && <div className="tip-ok">✓ Typ: {PICK_LABELS[tip.pick]} · +{parseFloat(match[`odds_${tip.pick}`]).toFixed(2)} pkt</div>}
                    </div>
                  </div>
                );
              })}
            </>}
            {finished.length>0 && <>
              <div className="sec-hdr" style={{ marginTop:8 }}>Zakończone</div>
              {finished.map(match => {
                const tip = myTip(match.id);
                const isCor = tip?.pick===match.result;
                return (
                  <div key={match.id} className="m-card" style={{ opacity:0.85 }}>
                    <div className="m-top">
                      <span style={{ fontSize:11, color:"rgba(255,255,255,0.5)", fontWeight:600 }}>{match.group_name}</span>
                      <span className={`res-badge ${isCor&&tip?"res-w":tip?"res-l":"res-n"}`}>
                        {tip ? (isCor ? `+${parseFloat(match[`odds_${tip.pick}`]).toFixed(2)} pkt ✓` : "0 pkt ✗") : "Brak typu"}
                      </span>
                    </div>
                    <div className="m-body">
                      <div className="teams">
                        <div className="team"><span className="tflag">{match.home_flag}</span><span className="tname">{match.home}</span></div>
                        <div style={{ textAlign:"center", padding:"0 8px" }}>
                          <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:1 }}>Wynik</div>
                          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color:"#4cde6e" }}>{PICK_LABELS[match.result]}</div>
                        </div>
                        <div className="team r"><span className="tflag">{match.away_flag}</span><span className="tname">{match.away}</span></div>
                      </div>
                      <div className="odds">
                        {["home","draw","away"].map(pick => (
                          <button key={pick} className={`odd ${pick===match.result?"ok":tip?.pick===pick?"no":""}`} disabled>
                            <div className="odd-l">{PICK_LABELS[pick]}</div>
                            <div className="odd-v" style={{ color:pick===match.result?"#34c759":"rgba(255,255,255,0.35)" }}>{parseFloat(match[`odds_${pick}`]).toFixed(2)}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>}
          </>}

          {tab==="leaderboard" && <>
            <div className="sec-hdr">Klasyfikacja</div>
            {lb.length===0 && <div className="empty"><div className="empty-i">🏆</div><div className="empty-t">Brak uczestników</div></div>}
            <div className="lb-card">
              {lb.map((u,i) => {
                const uav = getAvatar(u.name);
                return (
                  <div key={u.id} className={`lb-row ${u.id===user.id?"me":""}`}>
                    <div className="lb-rank">{i===0?"🥇":i===1?"🥈":i===2?"🥉":<span className="lb-rank-n">#{i+1}</span>}</div>
                    <div className="lb-av" style={{ background:uav.gradient }}>{uav.initials}</div>
                    <div style={{ flex:1 }}>
                      <div className="lb-name">{u.name}{u.id===user.id&&<span className="lb-me">TY</span>}</div>
                      <div className="lb-sub">{u.correct} trafione</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div className={`lb-pts ${i===0?"top":"norm"}`}>{u.points.toFixed(2)}</div>
                      <div className="lb-pts-lbl">PKT</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>}

          {tab==="rules" && <>
            <div className="sec-hdr">Nagrody</div>
            <div className="r-card" style={{ marginBottom:10 }}>
              {[
                { emoji:"🥇", name:"1. miejsce", amount:"50 zł", color:"#ffd700", bg:"rgba(255,215,0,0.08)" },
                { emoji:"🥈", name:"2. miejsce", amount:"30 zł", color:"#c0c0c0", bg:"rgba(192,192,192,0.08)" },
                { emoji:"🥉", name:"3. miejsce", amount:"20 zł", color:"#cd7f32", bg:"rgba(205,127,50,0.08)" },
              ].map((r,i,arr) => (
                <div key={r.name} className="prize-row" style={{ borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.06)":"none" }}>
                  <div className="prize-ic" style={{ background:r.bg }}>{r.emoji}</div>
                  <div style={{ flex:1 }}><div className="prize-name">{r.name}</div></div>
                  <div className="prize-amt" style={{ color:r.color }}>{r.amount}</div>
                </div>
              ))}
            </div>
            <div className="r-card" style={{ marginBottom:10 }}>
              <div className="r-row">
                <div className="r-icon" style={{ background:"rgba(76,222,110,0.08)" }}>💸</div>
                <div>
                  <div className="r-title">Wypłata nagród</div>
                  <div className="r-text">Płatności realizowane <strong style={{ color:"#4cde6e" }}>BLIKIEM</strong> po zakończeniu turnieju. Zwycięzcy zostaną poproszeni o podanie numeru do przelewu.</div>
                </div>
              </div>
            </div>
            <div className="sec-hdr" style={{ marginTop:16 }}>Zasady gry</div>
            {[
              { icon:"⏱️", bg:"rgba(0,122,255,0.1)", title:"Typowanie", text:"Przed każdym meczem wybierasz wynik: wygraną gospodarza (1), remis (X) lub wygraną gości (2). Typ możesz zmienić do momentu rozpoczęcia meczu — po godzinie startu typowanie jest zablokowane." },
              { icon:"🎯", bg:"rgba(255,59,48,0.1)", title:"Punktacja", text:"Za trafiony typ otrzymujesz tyle punktów ile wynosił kurs bukmacherski. Przykład: trafiony typ z kursem 3.20 daje 3.20 pkt. Za chybiony typ otrzymujesz 0 punktów." },
              { icon:"🏆", bg:"rgba(76,222,110,0.08)", title:"Klasyfikacja", text:"Wygrywa gracz z największą sumą punktów po zakończeniu wszystkich meczów. System premiuje odważne typy — trafienie niespodziewanego wyniku daje więcej punktów niż typowanie faworyta." },
            ].map(s => (
              <div key={s.title} className="r-card" style={{ marginBottom:8 }}>
                <div className="r-row">
                  <div className="r-icon" style={{ background:s.bg }}>{s.icon}</div>
                  <div><div className="r-title">{s.title}</div><div className="r-text">{s.text}</div></div>
                </div>
              </div>
            ))}
            <div className="sec-hdr" style={{ marginTop:16 }}>Informacje</div>
            <div className="r-card">
              {[
                { icon:"👨‍💻", bg:"rgba(52,199,89,0.08)", text:"Projekt powstał hobbystycznie, gdzieś między jednym a drugim zadaniem w pracy. Przetestowaliśmy go na zawrotnej grupie trzech osób i… chyba działa 🙂 Teraz pałeczka przechodzi na Was, to Wy jesteście ekipą testową." },
                { icon:"⚠️", bg:"rgba(255,149,0,0.08)", text:"Administrator nie daje gwarancji, że wszystko pójdzie idealnie 😉 Możliwe drobne potknięcia po drodze, ale liczymy, że wspólnie dociągniemy temat do finału mistrzostw." },
                { icon:"✉️", bg:"rgba(0,122,255,0.1)", email:"bleiddxxx@gmail.com" },
              ].map((s,i,arr) => (
                <div key={i} className="r-row" style={{ borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.06)":"none" }}>
                  <div className="r-icon" style={{ background:s.bg }}>{s.icon}</div>
                  <div>
                    {s.text && <div className="r-text">{s.text}</div>}
                    {s.email && <><div className="r-text" style={{ marginBottom:4 }}>Wszelkie uwagi, sugestie i zgłoszenia problemów prosimy kierować na adres:</div><div style={{ fontSize:15, fontWeight:700, color:"#4cde6e" }}>{s.email}</div></>}
                  </div>
                </div>
              ))}
            </div>
          </>}

          {tab==="admin" && profile?.is_admin && <>
            <div className="sec-hdr">Panel administratora</div>
            <button className="m-primary" style={{ marginBottom:16 }} onClick={() => setAddModal(true)}>+ Dodaj mecz</button>
            {upcoming.length>0 && <>
              <div className="sec-hdr">Nadchodzące mecze</div>
              <div className="r-card" style={{ marginBottom:10 }}>
                {upcoming.map((match,i) => (
                  <div key={match.id} className="adm-row" style={{ borderBottom:i<upcoming.length-1?"1px solid rgba(255,255,255,0.06)":"none" }}>
                    <div><div className="adm-name">{match.home_flag} {match.home} vs {match.away} {match.away_flag}</div><div className="adm-time">{match.match_date} · {match.match_time?.slice(0,5)}</div></div>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="adm-edit" onClick={() => openEdit(match)}>Edytuj</button>
                      <button className="adm-result" onClick={() => setResultModal(match)}>Wynik</button>
                    </div>
                  </div>
                ))}
              </div>
            </>}
            {finished.length>0 && <>
              <div className="sec-hdr">Zakończone mecze</div>
              <div className="r-card">
                {finished.map((match,i) => (
                  <div key={match.id} className="adm-row" style={{ borderBottom:i<finished.length-1?"1px solid rgba(255,255,255,0.06)":"none" }}>
                    <div><div className="adm-name">{match.home_flag} {match.home} vs {match.away} {match.away_flag}</div><div className="adm-res">Wynik: {PICK_LABELS[match.result]}</div></div>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="adm-edit" onClick={() => openEdit(match)}>Edytuj</button>
                      <button className="adm-result" onClick={() => setResultModal(match)}>Popraw</button>
                    </div>
                  </div>
                ))}
              </div>
            </>}
          </>}
        </div>

        <div className="bottom-nav">
          {tabs.map(t => (
            <button key={t.key} className={`nav-item ${tab===t.key?"active":""}`} onClick={() => setTab(t.key)}>
              <div className="nav-ic">{t.icon}</div>
              <div className="nav-lbl">{t.label}</div>
              <div className="nav-dot"/>
            </button>
          ))}
        </div>

        {resultModal && (
          <div className="mo" onClick={() => setResultModal(null)}>
            <div className="mb" onClick={e => e.stopPropagation()}>
              <div className="mh"/>
              <div className="mt">{resultModal.home_flag} {resultModal.home} vs {resultModal.away} {resultModal.away_flag}</div>
              <div className="ms">Wybierz wynik meczu</div>
              <div style={{ display:"flex", gap:10 }}>
                {["home","draw","away"].map(pick => (
                  <button key={pick} className="res-btn" onClick={() => saveResult(resultModal.id, pick)}>
                    <div style={{ fontSize:22, fontWeight:700 }}>{PICK_LABELS[pick]}</div>
                    <div style={{ fontSize:12, marginTop:4, color:"rgba(255,255,255,0.5)" }}>{PICK_NAMES[pick]}</div>
                  </button>
                ))}
              </div>
              <button className="m-secondary" style={{ marginTop:12 }} onClick={() => setResultModal(null)}>Anuluj</button>
            </div>
          </div>
        )}

        {addModal && (
          <div className="mo" onClick={() => setAddModal(false)}>
            <div className="mb" onClick={e => e.stopPropagation()}>
              <div className="mh"/>
              <div className="mt">Dodaj mecz ⚽</div>
              <div className="ms">Wypełnij dane i kursy</div>
              <MatchFormFields data={newMatch} onChange={setNewMatch}/>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:16 }}>
                <button className="m-primary" onClick={addMatch}>Dodaj mecz</button>
                <button className="m-secondary" onClick={() => setAddModal(false)}>Anuluj</button>
              </div>
            </div>
          </div>
        )}

        {editModal && (
          <div className="mo" onClick={() => setEditModal(null)}>
            <div className="mb" onClick={e => e.stopPropagation()}>
              <div className="mh"/>
              <div className="mt">Edytuj mecz ✏️</div>
              <div className="ms">Zmień dane meczu</div>
              <MatchFormFields data={editData} onChange={setEditData}/>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:16 }}>
                <button className="m-primary" onClick={saveEdit}>Zapisz zmiany</button>
                <button className="m-secondary" onClick={() => setEditModal(null)}>Anuluj</button>
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
      if (event==="SIGNED_IN" && session?.user) loadProfile(session.user);
      if (event==="SIGNED_OUT") { setUser(null); setProfile(null); setChecking(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); };

  if (checking) return (
    <>
      <style>{css}</style>
      <div style={{ minHeight:"100vh", background:"#060f07", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:52, height:52, background:"linear-gradient(135deg,#1e7a38,#4cde6e)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>⚽</div>
      </div>
    </>
  );

  return user
    ? <MainApp user={user} profile={profile} onLogout={handleLogout}/>
    : <AuthScreen onAuth={u => loadProfile(u)}/>;
}
