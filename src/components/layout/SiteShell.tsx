"use client";

import Box from "@mui/material/Box";
import { PhoneBar } from "@/components/layout/PhoneBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileCallBar } from "@/components/layout/MobileCallBar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        pb: { xs: 9, md: 0 },
      }}
    >
      <PhoneBar />
      <SiteHeader />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <SiteFooter />
      <MobileCallBar />
    </Box>
  );
}
