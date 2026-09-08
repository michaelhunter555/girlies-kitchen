"use client";

import NextLink from "next/link";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { brand } from "@/theme/brand";
import type { CateringOrder } from "@/lib/order-types";

function money(n: number) {
  return `$${Number(n).toFixed(2)}`;
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminOverviewPage() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load stats");
      return json as {
        stats: {
          totalOrders: number;
          activeOrders: number;
          depositPaid: number;
          confirmed: number;
          revenuePaid: number;
          outstanding: number;
          upcoming: CateringOrder[];
        };
      };
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress sx={{ color: brand.green }} />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          {error instanceof Error ? error.message : "Could not load dashboard"}
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  const { stats } = data;
  const cards = [
    { label: "Active orders", value: String(stats.activeOrders) },
    { label: "Deposit paid", value: String(stats.depositPaid) },
    { label: "Confirmed", value: String(stats.confirmed) },
    { label: "Paid in", value: money(stats.revenuePaid) },
    { label: "Balance due", value: money(stats.outstanding) },
    { label: "All orders", value: String(stats.totalOrders) },
  ];

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h2"
            sx={{
              color: brand.green,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            Overview
          </Typography>
          <Typography sx={{ fontWeight: 600, color: brand.muted }}>
            Track catering deposits, balances, and upcoming events.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => refetch()}
            disabled={isFetching}
            sx={{ borderColor: brand.black, color: brand.black }}
          >
            Refresh
          </Button>
          <Button
            component={NextLink}
            href="/admin/orders"
            variant="contained"
            color="secondary"
          >
            View orders
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 0,
          border: `3px solid ${brand.black}`,
          mb: 4,
        }}
      >
        {cards.map((card, index) => (
          <Box
            key={card.label}
            sx={{
              p: 2.5,
              bgcolor: index % 2 === 0 ? brand.white : brand.cream,
              borderRight: {
                xs: index % 2 === 0 ? `2px solid ${brand.black}` : "none",
                md:
                  (index + 1) % 3 === 0
                    ? "none"
                    : `2px solid ${brand.black}`,
              },
              borderBottom:
                index < cards.length - (cards.length % 2 === 0 ? 2 : 1) ||
                (index < 3 && cards.length > 3)
                  ? `2px solid ${brand.black}`
                  : "none",
            }}
          >
            <Typography
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 800,
                fontSize: "0.75rem",
                color: brand.green,
                mb: 0.75,
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-display), Impact, sans-serif",
                fontSize: { xs: "1.6rem", md: "2rem" },
                lineHeight: 1,
              }}
            >
              {card.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ border: `3px solid ${brand.black}`, bgcolor: brand.white }}>
        <Box
          sx={{
            bgcolor: brand.black,
            color: brand.gold,
            px: 2,
            py: 1.5,
            borderBottom: `3px solid ${brand.gold}`,
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-display), Impact, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontSize: "1.25rem",
            }}
          >
            Upcoming events
          </Typography>
        </Box>
        {stats.upcoming.length === 0 ? (
          <Typography sx={{ p: 2.5, fontWeight: 600 }}>
            No upcoming active orders yet.
          </Typography>
        ) : (
          stats.upcoming.map((order, index) => (
            <Box
              key={order.id}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr auto" },
                gap: 1,
                px: 2,
                py: 1.75,
                borderBottom:
                  index < stats.upcoming.length - 1
                    ? `1px solid ${brand.creamDark}`
                    : "none",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 800 }}>
                  {order.customerName}
                </Typography>
                <Typography sx={{ color: brand.muted, fontSize: "0.9rem" }}>
                  {order.deliveryAddress}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  Event: {formatWhen(order.eventAt)}
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {order.status.replace("_", " ")} | {money(order.total)}
                </Typography>
              </Box>
              <Button
                component={NextLink}
                href={`/admin/orders/${order.id}`}
                variant="contained"
                color="primary"
                size="small"
              >
                Open
              </Button>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
