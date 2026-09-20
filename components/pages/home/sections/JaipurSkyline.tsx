import React from "react";
import { Box } from "@mui/material";

/**
 * Decorative Jaipur silhouette: a tiered jharokha facade in the middle flanked by
 * domed chhatris and arched gateways. Pure SVG, tinted by `color`, hidden from AT.
 */
export default function JaipurSkyline({ color = "#ff8fb1", opacity = 0.35, height = 84 }: { color?: string; opacity?: number; height?: number }) {
  const dome = (x: number, w: number, y: number) => (
    <g key={x}>
      <path d={`M${x},${y} a${w / 2},${w / 2} 0 0 1 ${w},0 z`} />
      <rect x={x + 2} y={y} width={w - 4} height={10} />
      <rect x={x + w / 2 - 1} y={y - w / 2 - 6} width={2} height={6} />
    </g>
  );
  return (
    <Box aria-hidden sx={{ lineHeight: 0, pointerEvents: "none", userSelect: "none" }}>
      <svg viewBox="0 0 640 90" width="100%" height={height} preserveAspectRatio="xMidYMax slice" fill={color} fillOpacity={opacity}>
        {/* ground */}
        <rect x="0" y="80" width="640" height="10" />
        {/* left gateway with arch cut-out */}
        <path d="M20,80 V46 h70 V80 h-22 V62 a13,13 0 0 0 -26,0 V80 z" />
        {dome(24, 18, 46)}
        {dome(68, 18, 46)}
        {/* left chhatri row */}
        {dome(120, 22, 58)}
        {dome(160, 22, 58)}
        <rect x="112" y="68" width="76" height="12" />
        {/* central tiered facade */}
        <path d="M250,80 V40 h14 V28 h14 V16 h84 V28 h14 V40 h14 V80 z" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={296 + i * 12} cy={26} r={3.2} fill="#fff" fillOpacity={0.55} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${262 + i * 20},52 a5,7 0 0 1 10,0 v10 h-10 z`} fill="#fff" fillOpacity={0.45} />
        ))}
        {dome(258, 16, 40)}
        {dome(366, 16, 40)}
        <rect x="318" y="6" width="3" height="10" />
        {/* right chhatri row */}
        <rect x="450" y="68" width="76" height="12" />
        {dome(458, 22, 58)}
        {dome(498, 22, 58)}
        {/* right gateway */}
        <path d="M550,80 V46 h70 V80 h-22 V62 a13,13 0 0 0 -26,0 V80 z" />
        {dome(554, 18, 46)}
        {dome(598, 18, 46)}
      </svg>
    </Box>
  );
}
