"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { BUSINESS } from "@/lib/constants";
import { brand } from "@/theme/theme";

/** Persistent mobile call CTA for exposure. */
export function MobileCallBar() {
  return (
    <Box
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        p: 1.5,
        bgcolor: brand.black,
        borderTop: `3px solid ${brand.gold}`,
      }}
    >
      <Button
        component="a"
        href={BUSINESS.phoneHref}
        variant="contained"
        color="secondary"
        fullWidth
        size="large"
        sx={{ py: 1.5, fontSize: "1.05rem" }}
      >
        Call {BUSINESS.phone}
      </Button>
    </Box>
  );
}
