"use client";

import Box from "@mui/material/Box";
import { brand } from "@/theme/theme";

/** Flat Jamaican flag saltire bar matching the brochure header motif. */
export function FlagBand({ height = 14 }: { height?: number }) {
  return (
    <Box
      aria-hidden
      sx={{
        height,
        width: "100%",
        background: `
          linear-gradient(
            135deg,
            ${brand.green} 0%,
            ${brand.green} 42%,
            ${brand.gold} 42%,
            ${brand.gold} 58%,
            ${brand.black} 58%,
            ${brand.black} 100%
          )
        `,
        borderBottom: `2px solid ${brand.black}`,
      }}
    />
  );
}
