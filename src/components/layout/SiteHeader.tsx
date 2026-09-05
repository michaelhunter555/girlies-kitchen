"use client";

import Image from "next/image";
import NextLink from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { BUSINESS } from "@/lib/constants";
import { brand } from "@/theme/theme";

const nav = [
  { href: "/#gallery", label: "Photos" },
  { href: "/#menu", label: "Menu" },
  { href: "/#combos", label: "Combos" },
  { href: "/schedule", label: "Schedule Order" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: brand.black,
        borderBottom: `4px solid ${brand.gold}`,
      }}
    >
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 72, md: 88 },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            component={NextLink}
            href="/"
            style={{ textDecoration: "none" }}
            sx={{ alignItems: "center" }}
          >
            <Box
              sx={{
                width: { xs: 56, md: 72 },
                height: { xs: 56, md: 72 },
                position: "relative",
                flexShrink: 0,
                border: `2px solid ${brand.gold}`,
              }}
            >
              <Image
                src="/logo.png"
                alt={`${BUSINESS.name} logo`}
                fill
                sizes="72px"
                style={{ objectFit: "cover" }}
                priority
              />
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                sx={{
                  color: brand.gold,
                  fontFamily: "var(--font-display), Impact, sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                  textTransform: "uppercase",
                  fontSize: { sm: "1.25rem", md: "1.6rem" },
                }}
              >
                {BUSINESS.name}
              </Typography>
              <Typography
                sx={{
                  color: brand.green,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  mt: 0.5,
                }}
              >
                {BUSINESS.tagline}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={{ xs: 0.5, md: 1 }}
            sx={{
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                component={NextLink}
                href={item.href}
                underline="none"
                sx={{
                  display: { xs: item.label === "Combos" ? "none" : "inline", md: "inline" },
                  color: brand.white,
                  fontWeight: 700,
                  fontSize: { xs: "0.75rem", md: "0.85rem" },
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  px: { xs: 0.75, md: 1.25 },
                  py: 0.75,
                  "&:hover": { color: brand.gold },
                }}
              >
                {item.label}
              </Link>
            ))}
            <Button
              component="a"
              href={BUSINESS.phoneHref}
              variant="contained"
              color="secondary"
              sx={{ display: { xs: "none", sm: "inline-flex" }, ml: 1 }}
            >
              {BUSINESS.phone}
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
