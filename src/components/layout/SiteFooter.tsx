"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BUSINESS } from "@/lib/constants";
import { brand } from "@/theme/theme";

export function SiteFooter() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: brand.black,
        color: brand.white,
        borderTop: `4px solid ${brand.gold}`,
        mt: "auto",
      }}
    >
      <Box
        sx={{
          height: 10,
          background: `linear-gradient(90deg, ${brand.green} 0%, ${brand.green} 33%, ${brand.gold} 33%, ${brand.gold} 66%, ${brand.black} 66%, ${brand.black} 100%)`,
        }}
      />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ justifyContent: "space-between" }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ color: brand.gold, mb: 1, fontSize: { xs: "1.5rem", md: "1.85rem" } }}
            >
              {BUSINESS.name}
            </Typography>
            <Typography sx={{ color: brand.green, fontWeight: 700, mb: 2 }}>
              {BUSINESS.tagline}
            </Typography>
            <Typography sx={{ color: brand.cream, maxWidth: 360 }}>
              Authentic Jamaican catering in {BUSINESS.location}. Call to book trays,
              combos, and custom catering for your next event.
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="h4"
              sx={{ color: brand.gold, mb: 2, fontSize: "1.15rem" }}
            >
              Contact
            </Typography>
            <Stack spacing={1}>
              <Link
                href={BUSINESS.phoneHref}
                underline="hover"
                sx={{ color: brand.gold, fontWeight: 800, fontSize: "1.25rem" }}
              >
                {BUSINESS.phone}
              </Link>
              <Typography sx={{ color: brand.cream }}>{BUSINESS.location}</Typography>
              <Typography sx={{ color: brand.cream, fontSize: "0.9rem" }}>
                Business Facebook & Instagram coming soon
              </Typography>
            </Stack>
          </Box>

          <Stack spacing={1.5} sx={{ alignItems: { xs: "stretch", md: "flex-start" } }}>
            <Button
              component="a"
              href={BUSINESS.phoneHref}
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ maxWidth: 280 }}
            >
              Call Now
            </Button>
            <Button
              component={NextLink}
              href="/schedule"
              variant="outlined"
              fullWidth
              sx={{
                maxWidth: 280,
                borderColor: brand.gold,
                color: brand.gold,
                "&:hover": {
                  borderColor: brand.gold,
                  bgcolor: brand.green,
                  color: brand.gold,
                },
              }}
            >
              Schedule Online
            </Button>
          </Stack>
        </Stack>

        <Typography
          sx={{
            mt: 4,
            pt: 3,
            borderTop: `1px solid ${brand.green}`,
            color: brand.creamDark,
            fontSize: "0.85rem",
          }}
        >
          © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
