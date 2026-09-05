"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ADDONS, COMBOS } from "@/lib/menu";
import { DELIVERY_FEES } from "@/lib/constants";
import { brand } from "@/theme/theme";

export function CombosSection() {
  return (
    <Box
      id="combos"
      component="section"
      sx={{ bgcolor: brand.white, py: { xs: 5, md: 8 } }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            bgcolor: brand.black,
            border: `3px solid ${brand.gold}`,
            mb: 3,
            py: { xs: 2, md: 2.5 },
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
            Popular Combos
          </Typography>
        </Box>

        <Stack spacing={0} sx={{ border: `3px solid ${brand.black}` }}>
          {COMBOS.map((combo, index) => (
            <Box
              key={combo.id}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
                gap: 1,
                alignItems: "center",
                px: { xs: 2, md: 3 },
                py: { xs: 2, md: 2.5 },
                bgcolor: index % 2 === 0 ? brand.cream : brand.white,
                borderBottom:
                  index < COMBOS.length - 1
                    ? `2px solid ${brand.black}`
                    : "none",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: "var(--font-display), Impact, sans-serif",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    color: brand.green,
                    fontSize: { xs: "1.15rem", md: "1.35rem" },
                  }}
                >
                  {combo.name}
                </Typography>
                <Typography sx={{ fontWeight: 600, color: brand.ink }}>
                  {combo.description}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "1.5rem", md: "1.75rem" },
                  color: brand.black,
                  textAlign: { xs: "left", sm: "right" },
                }}
              >
                ${combo.price}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Box
          sx={{
            mt: 4,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 0,
            border: `3px solid ${brand.black}`,
          }}
        >
          <Box
            sx={{
              bgcolor: brand.green,
              color: brand.gold,
              p: { xs: 2.5, md: 3 },
              borderRight: { md: `3px solid ${brand.black}` },
              borderBottom: { xs: `3px solid ${brand.black}`, md: "none" },
            }}
          >
            <Typography
              variant="h3"
              sx={{ color: brand.gold, mb: 2, fontSize: "1.25rem" }}
            >
              Add-Ons
            </Typography>
            <Stack spacing={1}>
              {ADDONS.map((addon) => (
                <Box
                  key={addon.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    fontWeight: 700,
                  }}
                >
                  <span>{addon.name}</span>
                  <span>${addon.price}</span>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ bgcolor: brand.black, color: brand.gold, p: { xs: 2.5, md: 3 } }}>
            <Typography
              variant="h3"
              sx={{ color: brand.gold, mb: 2, fontSize: "1.25rem" }}
            >
              Delivery
            </Typography>
            <Stack spacing={1}>
              {DELIVERY_FEES.map((fee) => (
                <Box
                  key={fee.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    fontWeight: 700,
                  }}
                >
                  <span>{fee.label}</span>
                  <span>${fee.fee}</span>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
