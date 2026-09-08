"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BUSINESS } from "@/lib/constants";
import { brand } from "@/theme/brand";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: brand.cream }}>
      <Box
        sx={{
          bgcolor: brand.black,
          borderBottom: `4px solid ${brand.gold}`,
          color: brand.white,
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: brand.gold,
                  fontFamily: "var(--font-display), Impact, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  fontSize: { xs: "1.4rem", md: "1.75rem" },
                  lineHeight: 1,
                }}
              >
                {BUSINESS.name} CRM
              </Typography>
              <Typography sx={{ color: brand.cream, fontSize: "0.85rem", mt: 0.5 }}>
                Soft login active. Firebase Auth comes next.
                {email ? ` Signed in as ${email}.` : ""}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {nav.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname?.startsWith(item.href);
                return (
                  <Button
                    key={item.href}
                    component={NextLink}
                    href={item.href}
                    variant={active ? "contained" : "outlined"}
                    color={active ? "secondary" : "inherit"}
                    sx={
                      active
                        ? undefined
                        : {
                            borderColor: brand.gold,
                            color: brand.gold,
                            "&:hover": {
                              borderColor: brand.gold,
                              bgcolor: brand.green,
                            },
                          }
                    }
                  >
                    {item.label}
                  </Button>
                );
              })}
              <Button
                component={NextLink}
                href="/"
                variant="outlined"
                sx={{
                  borderColor: brand.cream,
                  color: brand.cream,
                  "&:hover": { borderColor: brand.gold, color: brand.gold },
                }}
              >
                Site
              </Button>
              <Button onClick={logout} variant="contained" color="primary">
                Log out
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, py: { xs: 3, md: 4 } }}>
        {children}
      </Container>
      <Box sx={{ textAlign: "center", pb: 3 }}>
        <Link
          href={BUSINESS.phoneHref}
          sx={{ color: brand.green, fontWeight: 700 }}
        >
          Customer line: {BUSINESS.phone}
        </Link>
      </Box>
    </Box>
  );
}
