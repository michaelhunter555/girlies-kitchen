"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import PlaceIcon from "@mui/icons-material/Place";
import { BUSINESS, DELIVERY_PRICING } from "@/lib/constants";
import { brand } from "@/theme/theme";
import { FlagBand } from "@/components/brand/FlagBand";

export function ContactSection() {
  return (
    <Box
      id="contact"
      component="section"
      sx={{ bgcolor: brand.cream, py: { xs: 5, md: 8 } }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <Box sx={{ border: `3px solid ${brand.black}`, bgcolor: brand.white }}>
          <FlagBand height={12} />
          <Box
            sx={{
              bgcolor: brand.green,
              py: { xs: 2, md: 2.5 },
              borderBottom: `3px solid ${brand.black}`,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: brand.gold,
                textAlign: "center",
                fontSize: { xs: "1.75rem", md: "2.5rem" },
              }}
            >
              Call Girlie&apos;s Kitchen
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
              gap: 0,
            }}
          >
            <Box
              sx={{
                p: { xs: 3, md: 5 },
                borderRight: { md: `3px solid ${brand.black}` },
                borderBottom: { xs: `3px solid ${brand.black}`, md: "none" },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: "1.05rem", md: "1.2rem" },
                  maxWidth: 480,
                }}
              >
                Ready to feed your crew? Call for catering questions, custom
                trays, and same-week availability.
              </Typography>

              <Link
                href={BUSINESS.phoneHref}
                underline="none"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.5,
                  color: brand.black,
                  bgcolor: brand.gold,
                  border: `3px solid ${brand.black}`,
                  px: { xs: 2, md: 3 },
                  py: { xs: 1.5, md: 2 },
                  mb: 3,
                  "&:hover": { bgcolor: brand.goldDeep },
                }}
              >
                <PhoneInTalkIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    Phone
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-display), Impact, sans-serif",
                      fontSize: { xs: "1.75rem", md: "2.25rem" },
                      lineHeight: 1,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {BUSINESS.phone}
                  </Typography>
                </Box>
              </Link>

              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 3 }}>
                <PlaceIcon sx={{ color: brand.green }} />
                <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  {BUSINESS.location}
                </Typography>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  component="a"
                  href={BUSINESS.phoneHref}
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Tap to Call
                </Button>
                <Button
                  component={NextLink}
                  href="/schedule"
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  Schedule Online
                </Button>
              </Stack>
            </Box>

            <Box sx={{ bgcolor: brand.black, color: brand.cream, p: { xs: 3, md: 5 } }}>
              <Typography
                variant="h3"
                sx={{ color: brand.gold, mb: 2, fontSize: "1.25rem" }}
              >
                Ordering Notes
              </Typography>
              <Stack spacing={2} sx={{ fontWeight: 600 }}>
                <Typography>
                  50% deposit on most orders. 75% deposit for oxtail, goat, or fish.
                </Typography>
                <Typography>
                  Delivery is ${DELIVERY_PRICING.ratePerMile}/mile from Belcamp,
                  MD (min ${DELIVERY_PRICING.minimumFee}). Schedule online for an
                  exact mileage quote.
                </Typography>
                <Typography>
                  Prefer to talk it through? Call {BUSINESS.phone} and we will
                  build your tray list with you.
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
