"use client";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import PhoneIcon from "@mui/icons-material/Phone";
import { BUSINESS } from "@/lib/constants";
import { brand } from "@/theme/theme";

export function PhoneBar() {
  return (
    <Box
      component="aside"
      sx={{
        bgcolor: brand.gold,
        color: brand.black,
        borderBottom: `3px solid ${brand.black}`,
        py: 1,
        px: 2,
        textAlign: "center",
      }}
    >
      <Typography
        component={Link}
        href={BUSINESS.phoneHref}
        underline="none"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          color: brand.black,
          fontWeight: 800,
          letterSpacing: "0.04em",
          fontSize: { xs: "0.95rem", sm: "1.1rem" },
          "&:hover": { color: brand.greenDark },
        }}
      >
        <PhoneIcon sx={{ fontSize: 20 }} />
        Call {BUSINESS.name}: {BUSINESS.phone}
        <Box
          component="span"
          sx={{
            display: { xs: "none", sm: "inline" },
            fontWeight: 600,
            ml: 1,
          }}
        >
          | Catering in {BUSINESS.location}
        </Box>
      </Typography>
    </Box>
  );
}
