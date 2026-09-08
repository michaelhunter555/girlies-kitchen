"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { BUSINESS } from "@/lib/constants";
import { brand } from "@/theme/brand";
import { FlagBand } from "@/components/brand/FlagBand";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: brand.cream,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 440,
          border: `3px solid ${brand.black}`,
          bgcolor: brand.white,
        }}
      >
        <FlagBand height={10} />
        <Box
          sx={{
            bgcolor: brand.green,
            py: 2,
            borderBottom: `3px solid ${brand.black}`,
          }}
        >
          <Typography
            sx={{
              color: brand.gold,
              textAlign: "center",
              fontFamily: "var(--font-display), Impact, sans-serif",
              textTransform: "uppercase",
              fontSize: "1.75rem",
              letterSpacing: "0.04em",
            }}
          >
            {BUSINESS.name} Admin
          </Typography>
        </Box>

        <Box component="form" onSubmit={onSubmit} sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 600, mb: 2, color: brand.muted }}>
            Soft login for now. Any email and password works until Firebase is
            connected.
          </Typography>

          {error ? (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: 0, border: `2px solid ${brand.black}` }}
            >
              {error}
            </Alert>
          ) : null}

          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: brand.black }} />
              ) : (
                "Sign in"
              )}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
