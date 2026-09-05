"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { MENU_WITH_IMAGES } from "@/lib/menu";
import { brand } from "@/theme/theme";
import { FlagBand } from "@/components/brand/FlagBand";
import { ClickableDishImage } from "@/components/home/DishImageModal";

export function DishGallery() {
  return (
    <Box
      id="gallery"
      component="section"
      sx={{ bgcolor: brand.black, py: { xs: 5, md: 7 } }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <Box sx={{ border: `3px solid ${brand.gold}`, mb: 3 }}>
          <FlagBand height={10} />
          <Box sx={{ bgcolor: brand.green, py: { xs: 2, md: 2.5 } }}>
            <Typography
              variant="h2"
              sx={{
                color: brand.gold,
                textAlign: "center",
                fontSize: { xs: "1.75rem", md: "2.5rem" },
              }}
            >
              From Our Kitchen
            </Typography>
            <Typography
              sx={{
                color: brand.cream,
                textAlign: "center",
                mt: 0.5,
                fontWeight: 600,
                px: 2,
              }}
            >
              Tap a photo to enlarge
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              md: "repeat(3, 1fr)",
            },
            gap: { xs: 1.5, md: 2 },
          }}
        >
          {MENU_WITH_IMAGES.map((item) => (
            <Box key={item.id}>
              <ClickableDishImage src={item.image!} title={item.name} />
              <Typography
                sx={{
                  color: brand.gold,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  mt: 1,
                  fontSize: { xs: "0.8rem", md: "0.95rem" },
                }}
              >
                {item.name}
              </Typography>
              <Typography sx={{ color: brand.cream, fontSize: "0.85rem", fontWeight: 600 }}>
                Small ${item.prices.small} | Large ${item.prices.large}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
