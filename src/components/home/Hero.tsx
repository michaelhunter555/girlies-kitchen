"use client";

import Image from "next/image";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BUSINESS } from "@/lib/constants";
import { brand } from "@/theme/theme";
import { FlagBand } from "@/components/brand/FlagBand";

export function Hero() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        bgcolor: brand.black,
        color: brand.white,
        overflow: "hidden",
        minHeight: { xs: "78vh", md: "88vh" },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FlagBand height={18} />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          top: 18,
          zIndex: 0,
        }}
      >
        <Image
          src="/logo.png"
          alt="Plate of Jamaican brown stew chicken, rice and peas, cabbage, and plantains"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            filter: "brightness(0.45)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.35)",
          }}
        />
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          px: { xs: 2, md: 3 },
          pb: { xs: 5, md: 8 },
          pt: { xs: 8, md: 10 },
        }}
      >
        <Typography
          component="p"
          sx={{
            color: brand.gold,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            mb: 1.5,
            fontSize: { xs: "0.8rem", md: "0.95rem" },
          }}
        >
          {BUSINESS.location} Catering
        </Typography>

        <Typography
          variant="h1"
          sx={{
            color: brand.gold,
            fontSize: { xs: "2.75rem", sm: "4rem", md: "5.5rem" },
            lineHeight: 0.95,
            maxWidth: 900,
            textShadow: "2px 2px 0 #000",
            mb: 1,
          }}
        >
          {BUSINESS.name}
        </Typography>

        <Typography
          sx={{
            color: brand.white,
            fontFamily: "var(--font-display), Impact, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontSize: { xs: "1.15rem", md: "1.6rem" },
            mb: 2,
          }}
        >
          {BUSINESS.tagline}
        </Typography>

        <Typography
          sx={{
            color: brand.cream,
            maxWidth: 520,
            fontSize: { xs: "1rem", md: "1.15rem" },
            mb: 3.5,
            lineHeight: 1.5,
          }}
        >
          Trays, popular combos, and full catering for your next gathering. Call
          now or schedule your order online.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ alignItems: { xs: "stretch", sm: "center" } }}
        >
          <Button
            component="a"
            href={BUSINESS.phoneHref}
            variant="contained"
            color="secondary"
            size="large"
            sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, py: 1.5, px: 3 }}
          >
            Call {BUSINESS.phone}
          </Button>
          <Button
            component={NextLink}
            href="/schedule"
            variant="contained"
            color="primary"
            size="large"
            sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, py: 1.5, px: 3 }}
          >
            Schedule Catering
          </Button>
        </Stack>
      </Container>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          bgcolor: brand.green,
          borderTop: `3px solid ${brand.gold}`,
          py: 1.5,
          px: 2,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: brand.gold,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: { xs: "0.85rem", md: "1rem" },
          }}
        >
          50% deposit required | 75% for oxtail, goat, or fish
        </Typography>
      </Box>
    </Box>
  );
}
