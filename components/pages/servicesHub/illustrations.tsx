import React from "react";
import { COLORS } from "@/constants/colors";

const LILAC = COLORS.NEW_UI.EDITORIAL_LILAC;
const TINT = COLORS.NEW_UI.EDITORIAL_TINT;

/** Faceless flat person: head and shoulders. */
function Person({ x, y, scale = 1, body, head }: { x: number; y: number; scale?: number; body: string; head: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="0" cy="-34" r="16" fill={head} />
      <path d="M-30 18c0-22 12-38 30-38s30 16 30 38v6h-60z" fill={body} />
    </g>
  );
}

/** Customers around a phone showing a chat: the idea of "describe it, get matched". Decorative. */
export function PeopleIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 460 360" role="presentation" aria-hidden focusable="false" style={{ width: "100%", height: "auto", display: "block" }}>
      <circle cx="230" cy="190" r="150" fill={COLORS.WHITE} opacity="0.1" />
      <circle cx="230" cy="190" r="104" fill={COLORS.WHITE} opacity="0.1" />
      {/* phone */}
      <rect x="170" y="50" width="120" height="236" rx="22" fill={COLORS.NEW_UI.INK} />
      <rect x="178" y="62" width="104" height="212" rx="15" fill={COLORS.WHITE} />
      <rect x="178" y="62" width="104" height="30" rx="15" fill={TINT} />
      <circle cx="194" cy="77" r="7" fill={COLORS.PRIMARY_PURPLE} />
      <rect x="206" y="72" width="44" height="6" rx="3" fill={COLORS.PRIMARY_PURPLE} opacity="0.6" />
      <rect x="188" y="104" width="62" height="24" rx="10" fill={COLORS.BACKGROUND.PAPER_LIGHT} />
      <rect x="214" y="136" width="58" height="22" rx="10" fill={COLORS.PRIMARY_PURPLE} />
      <rect x="188" y="166" width="70" height="30" rx="10" fill={COLORS.BACKGROUND.PAPER_LIGHT} />
      <rect x="188" y="208" width="84" height="28" rx="14" fill={TINT} />
      <rect x="196" y="218" width="40" height="7" rx="3.5" fill={COLORS.PRIMARY_PURPLE} opacity="0.55" />
      {/* people */}
      <Person x={92} y={246} scale={1.25} body={COLORS.WHITE} head={LILAC} />
      <Person x={370} y={250} scale={1.35} body={LILAC} head={COLORS.WHITE} />
      <Person x={56} y={140} scale={0.8} body={COLORS.SECONDARY_ORANGE} head={TINT} />
      <Person x={410} y={140} scale={0.8} body={TINT} head={COLORS.SECONDARY_ORANGE} />
      {/* speech bubbles */}
      <g>
        <rect x="46" y="62" width="86" height="34" rx="14" fill={COLORS.WHITE} />
        <path d="M70 96l-6 12 18-12z" fill={COLORS.WHITE} />
        <rect x="58" y="74" width="50" height="6" rx="3" fill={COLORS.PRIMARY_PURPLE} opacity="0.5" />
        <rect x="58" y="84" width="32" height="6" rx="3" fill={COLORS.PRIMARY_PURPLE} opacity="0.3" />
      </g>
      <g>
        <rect x="330" y="76" width="84" height="32" rx="14" fill={COLORS.WHITE} />
        <path d="M392 108l8 12-22-12z" fill={COLORS.WHITE} />
        <rect x="342" y="88" width="46" height="6" rx="3" fill={COLORS.PRIMARY_PURPLE} opacity="0.5" />
        <rect x="342" y="98" width="28" height="6" rx="3" fill={COLORS.PRIMARY_PURPLE} opacity="0.3" />
      </g>
      {/* map pin */}
      <g transform="translate(236 318)">
        <path d="M0-30c-11 0-19 8-19 19 0 14 19 31 19 31s19-17 19-31c0-11-8-19-19-19z" fill={COLORS.SECONDARY_ORANGE} />
        <circle cx="0" cy="-11" r="7" fill={COLORS.WHITE} />
      </g>
    </svg>
  );
}

/** A person with a magnifier, for "nothing listed yet" states. Decorative. */
export function SearchPersonIllustration() {
  return (
    <svg viewBox="0 0 160 120" role="presentation" aria-hidden focusable="false" style={{ width: 160, maxWidth: "100%", height: "auto", display: "block" }}>
      <circle cx="80" cy="60" r="52" fill={TINT} />
      <Person x={66} y={96} scale={1.1} body={COLORS.PRIMARY_PURPLE} head={LILAC} />
      <circle cx="104" cy="52" r="17" fill="none" stroke={COLORS.NEW_UI.INK} strokeWidth="5" />
      <path d="M116 64l16 16" stroke={COLORS.NEW_UI.INK} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/** Row of overlapping faceless avatars, for small "people" accents. Decorative. */
export function AvatarStack() {
  const tones = [COLORS.PRIMARY_PURPLE, COLORS.SECONDARY_ORANGE, LILAC, COLORS.PURPLE_DEEP];
  return (
    <svg viewBox="0 0 150 44" role="presentation" aria-hidden focusable="false" style={{ width: 120, height: "auto", display: "block" }}>
      {tones.map((c, i) => (
        <g key={c + i} transform={`translate(${22 + i * 32} 22)`}>
          <circle r="20" fill={c} stroke={COLORS.WHITE} strokeWidth="3" />
          <circle cy="-5" r="6" fill={COLORS.WHITE} opacity="0.9" />
          <path d="M-11 14c0-7 5-11 11-11s11 4 11 11z" fill={COLORS.WHITE} opacity="0.9" />
        </g>
      ))}
    </svg>
  );
}
