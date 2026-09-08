"use client";

import NextLink from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { brand } from "@/theme/brand";
import {
  ORDER_STATUSES,
  type CateringOrder,
  type OrderStatus,
} from "@/lib/order-types";

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

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");

  const queryKey = useMemo(
    () => ["admin-orders", status, search] as const,
    [status, search]
  );

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams({ status, q: search });
      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load orders");
      return json as { orders: CateringOrder[] };
    },
  });

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
            Orders
          </Typography>
          <Typography sx={{ fontWeight: 600, color: brand.muted }}>
            Search, filter, and update catering jobs.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => refetch()}
          disabled={isFetching}
          sx={{ borderColor: brand.black, color: brand.black }}
        >
          Refresh
        </Button>
      </Stack>

      <Box
        sx={{
          border: `3px solid ${brand.black}`,
          bgcolor: brand.white,
          p: 2,
          mb: 2,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 180px auto" },
          gap: 1.5,
        }}
      >
        <TextField
          label="Search name, phone, email, address"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setSearch(q.trim());
          }}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="status-filter">Status</InputLabel>
          <Select
            labelId="status-filter"
            label="Status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as OrderStatus | "all")
            }
            sx={{ borderRadius: 0 }}
          >
            <MenuItem value="all">All</MenuItem>
            {ORDER_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s.replace("_", " ")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setSearch(q.trim())}
        >
          Search
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress sx={{ color: brand.green }} />
        </Box>
      ) : error ? (
        <Typography sx={{ fontWeight: 700 }}>
          {error instanceof Error ? error.message : "Failed to load orders"}
        </Typography>
      ) : (
        <Box sx={{ border: `3px solid ${brand.black}`, bgcolor: brand.white }}>
          <Box
            sx={{
              display: { xs: "none", md: "grid" },
              gridTemplateColumns: "1.2fr 1fr 0.8fr 0.7fr 0.7fr auto",
              gap: 1,
              bgcolor: brand.black,
              color: brand.gold,
              px: 2,
              py: 1.25,
              fontWeight: 800,
              textTransform: "uppercase",
              fontSize: "0.8rem",
              letterSpacing: "0.04em",
            }}
          >
            <span>Customer</span>
            <span>Event</span>
            <span>Status</span>
            <span>Total</span>
            <span>Paid</span>
            <span />
          </Box>

          {(data?.orders || []).length === 0 ? (
            <Typography sx={{ p: 2.5, fontWeight: 600 }}>
              No orders match this filter.
            </Typography>
          ) : (
            (data?.orders || []).map((order, index) => (
              <Box
                key={order.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1.2fr 1fr 0.8fr 0.7fr 0.7fr auto",
                  },
                  gap: 1,
                  alignItems: "center",
                  px: 2,
                  py: 1.75,
                  bgcolor: index % 2 === 0 ? brand.cream : brand.white,
                  borderBottom: `1px solid ${brand.creamDark}`,
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>
                    {order.customerName}
                  </Typography>
                  <Typography sx={{ fontSize: "0.85rem", color: brand.muted }}>
                    {order.customerPhone} | {order.customerEmail}
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  {formatWhen(order.eventAt)}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                    fontSize: "0.8rem",
                    color: brand.green,
                  }}
                >
                  {order.status.replace("_", " ")}
                </Typography>
                <Typography sx={{ fontWeight: 800 }}>
                  {money(order.total)}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {money(order.amountPaid)}
                </Typography>
                <Button
                  component={NextLink}
                  href={`/admin/orders/${order.id}`}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Manage
                </Button>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
}
