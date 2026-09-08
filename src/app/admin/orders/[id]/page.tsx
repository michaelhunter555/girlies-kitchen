"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";
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
import { useEffect, useState } from "react";
import { brand } from "@/theme/brand";
import {
  ORDER_STATUSES,
  type CateringOrder,
  type OrderStatus,
} from "@/lib/order-types";
import { BUSINESS } from "@/lib/constants";

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

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/orders/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Order not found");
      return json as { order: CateringOrder };
    },
  });

  const [status, setStatus] = useState<OrderStatus>("pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [amountPaid, setAmountPaid] = useState("0");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!data?.order) return;
    setStatus(data.order.status);
    setAdminNotes(data.order.adminNotes || "");
    setAmountPaid(String(data.order.amountPaid ?? 0));
  }, [data?.order]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminNotes,
          amountPaid: Number(amountPaid),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      return json as { order: CateringOrder };
    },
    onSuccess: async () => {
      setMessage("Order saved.");
      await queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => {
      setMessage(err instanceof Error ? err.message : "Update failed");
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress sx={{ color: brand.green }} />
      </Box>
    );
  }

  if (error || !data?.order) {
    return (
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          {error instanceof Error ? error.message : "Order not found"}
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => router.push("/admin/orders")}>
          Back to orders
        </Button>
      </Box>
    );
  }

  const order = data.order;
  const remaining = Math.max(0, order.total - Number(amountPaid || 0));

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
            {order.customerName}
          </Typography>
          <Typography sx={{ fontWeight: 600, color: brand.muted }}>
            Order {order.id.slice(0, 8)}...
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => router.push("/admin/orders")}
          sx={{ borderColor: brand.black, color: brand.black }}
        >
          Back to orders
        </Button>
      </Stack>

      {message ? (
        <Alert
          severity={saveMutation.isError ? "error" : "success"}
          sx={{ mb: 2, borderRadius: 0, border: `2px solid ${brand.black}` }}
        >
          {message}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
          gap: 2,
        }}
      >
        <Box sx={{ border: `3px solid ${brand.black}`, bgcolor: brand.white, p: 2.5 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-display), Impact, sans-serif",
              textTransform: "uppercase",
              color: brand.green,
              mb: 2,
              fontSize: "1.25rem",
            }}
          >
            Customer
          </Typography>
          <Stack spacing={1} sx={{ fontWeight: 600 }}>
            <Typography sx={{ fontWeight: 700 }}>{order.customerName}</Typography>
            <Typography>
              <Box
                component="a"
                href={`tel:${order.customerPhone.replace(/\D/g, "")}`}
                sx={{ color: brand.green, fontWeight: 800 }}
              >
                {order.customerPhone}
              </Box>
            </Typography>
            <Typography>{order.customerEmail}</Typography>
            <Typography>{order.deliveryAddress}</Typography>
            {typeof order.deliveryMiles === "number" ? (
              <Typography>
                Delivery: {order.deliveryMiles} mi | {money(order.deliveryFee)}
              </Typography>
            ) : (
              <Typography>Delivery fee: {money(order.deliveryFee)}</Typography>
            )}
            <Typography>Event: {formatWhen(order.eventAt)}</Typography>
            {order.notes ? <Typography>Customer notes: {order.notes}</Typography> : null}
          </Stack>

          <Typography
            sx={{
              fontFamily: "var(--font-display), Impact, sans-serif",
              textTransform: "uppercase",
              color: brand.green,
              mt: 3,
              mb: 1.5,
              fontSize: "1.25rem",
            }}
          >
            Line items
          </Typography>
          <Stack spacing={1}>
            {order.items.map((item) => (
              <Box
                key={`${item.itemId}-${item.name}`}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  fontWeight: 700,
                  borderBottom: `1px solid ${brand.creamDark}`,
                  pb: 0.75,
                }}
              >
                <span>{item.name}</span>
                <span>{money(item.lineTotal)}</span>
              </Box>
            ))}
            <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <span>Subtotal</span>
              <span>{money(order.subtotal)}</span>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <span>Delivery</span>
              <span>{money(order.deliveryFee)}</span>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 900 }}>
              <span>Total</span>
              <span>{money(order.total)}</span>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <span>Deposit ({order.depositPercent}%)</span>
              <span>{money(order.depositAmount)}</span>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 800, color: brand.green }}>
              <span>Remaining (based on amount paid)</span>
              <span>{money(remaining)}</span>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ border: `3px solid ${brand.black}`, bgcolor: brand.white, p: 2.5 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-display), Impact, sans-serif",
              textTransform: "uppercase",
              color: brand.green,
              mb: 2,
              fontSize: "1.25rem",
            }}
          >
            Manage
          </Typography>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="order-status">Status</InputLabel>
              <Select
                labelId="order-status"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                sx={{ borderRadius: 0 }}
              >
                {ORDER_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s.replace("_", " ")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Amount paid"
              type="number"
              fullWidth
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              helperText="Update when remaining balance is collected"
            />
            <TextField
              label="Admin notes"
              fullWidth
              multiline
              minRows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Kitchen prep notes, payment follow-ups, delivery instructions"
            />
            <Button
              variant="contained"
              color="secondary"
              size="large"
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? (
                <CircularProgress size={22} sx={{ color: brand.black }} />
              ) : (
                "Save changes"
              )}
            </Button>
            <Button
              component="a"
              href={`tel:${order.customerPhone.replace(/\D/g, "")}`}
              variant="contained"
              color="primary"
            >
              Call customer
            </Button>
            <Typography sx={{ fontSize: "0.85rem", color: brand.muted, fontWeight: 600 }}>
              Business line: {BUSINESS.phone}
              {order.stripeCheckoutSessionId
                ? ` | Stripe session: ${order.stripeCheckoutSessionId.slice(0, 18)}...`
                : ""}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
