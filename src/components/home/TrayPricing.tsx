"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { MENU_ITEMS, TRAY_NOTE } from "@/lib/menu";
import { brand } from "@/theme/theme";
import { FlagBand } from "@/components/brand/FlagBand";
import { ClickableDishImage } from "@/components/home/DishImageModal";

function money(n: number) {
  return `$${n}`;
}

export function TrayPricing() {
  return (
    <Box
      id="menu"
      component="section"
      sx={{ bgcolor: brand.cream, py: { xs: 5, md: 8 } }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            bgcolor: brand.green,
            border: `3px solid ${brand.black}`,
            mb: 0,
          }}
        >
          <FlagBand height={10} />
          <Typography
            variant="h2"
            sx={{
              color: brand.gold,
              textAlign: "center",
              py: { xs: 2, md: 2.5 },
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              textShadow: "1px 1px 0 #000",
            }}
          >
            Tray Pricing
          </Typography>
        </Box>

        <Typography
          sx={{
            bgcolor: brand.black,
            color: brand.gold,
            textAlign: "center",
            py: 1.25,
            px: 2,
            fontWeight: 600,
            fontSize: { xs: "0.85rem", md: "0.95rem" },
            borderLeft: `3px solid ${brand.black}`,
            borderRight: `3px solid ${brand.black}`,
          }}
        >
          {TRAY_NOTE}
        </Typography>

        <TableContainer
          sx={{
            border: `3px solid ${brand.black}`,
            borderTop: 0,
            bgcolor: brand.white,
          }}
        >
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Small</TableCell>
                <TableCell align="right">Large</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MENU_ITEMS.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{
                    bgcolor: index % 2 === 0 ? brand.cream : brand.white,
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      py: { xs: 1.25, md: 1.5 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 1, md: 1.5 },
                      }}
                    >
                      {item.image ? (
                        <Box
                          sx={{
                            width: { xs: 44, md: 56 },
                            flexShrink: 0,
                          }}
                        >
                          <ClickableDishImage
                            src={item.image}
                            title={item.name}
                            aspectRatio="1 / 1"
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            width: { xs: 44, md: 56 },
                            aspectRatio: "1 / 1",
                            flexShrink: 0,
                            bgcolor: brand.creamDark,
                            border: `2px solid ${brand.black}`,
                          }}
                          aria-hidden
                        />
                      )}
                      <Box sx={{ minWidth: 0 }}>
                        {item.name}
                        {item.alt ? (
                          <Typography
                            component="span"
                            sx={{
                              display: "block",
                              fontWeight: 600,
                              color: brand.muted,
                              fontSize: "0.85rem",
                            }}
                          >
                            or {item.alt.label}: {money(item.alt.prices.small)} /{" "}
                            {money(item.alt.prices.large)}
                          </Typography>
                        ) : null}
                        {item.premiumDeposit ? (
                          <Typography
                            component="span"
                            sx={{
                              display: "block",
                              fontWeight: 700,
                              color: brand.green,
                              fontSize: "0.75rem",
                              letterSpacing: "0.04em",
                              textTransform: "uppercase",
                              mt: 0.25,
                            }}
                          >
                            75% deposit
                          </Typography>
                        ) : null}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 800, whiteSpace: "nowrap" }}
                  >
                    {money(item.prices.small)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 800, whiteSpace: "nowrap" }}
                  >
                    {money(item.prices.large)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
