"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import NextLink from "next/link";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { ADDONS, COMBOS, MENU_ITEMS } from "@/lib/menu";
import { BUSINESS, DELIVERY_FEES } from "@/lib/constants";
import { priceOrder } from "@/lib/pricing";
import { brand } from "@/theme/theme";
import { FlagBand } from "@/components/brand/FlagBand";
import { ClickableDishImage } from "@/components/home/DishImageModal";

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled") === "1";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [eventAt, setEventAt] = useState<Dayjs | null>(
    dayjs().add(3, "day").hour(12).minute(0)
  );
  const [deliveryId, setDeliveryId] = useState(DELIVERY_FEES[0].id);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [sizes, setSizes] = useState<Record<string, "small" | "large">>({});
  const [useAlt, setUseAlt] = useState<Record<string, boolean>>({});
  const [comboId, setComboId] = useState("");
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priced = useMemo(() => {
    try {
      return priceOrder({
        trays: MENU_ITEMS.filter((item) => selected[item.id]).map((item) => ({
          itemId: item.id,
          size: sizes[item.id] ?? "small",
          useAlt: !!useAlt[item.id],
        })),
        comboId: comboId || undefined,
        addonIds: ADDONS.filter((a) => addons[a.id]).map((a) => a.id),
        deliveryZoneId: deliveryId,
      });
    } catch {
      return null;
    }
  }, [selected, sizes, useAlt, comboId, addons, deliveryId]);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !phone || !email || !address || !eventAt) {
      setError("Fill in your name, phone, email, address, and event time.");
      return;
    }
    if (!priced) {
      setError("Select at least one tray, combo, or add-on.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          deliveryAddress: address,
          eventAt: eventAt.toISOString(),
          notes,
          deliveryZoneId: deliveryId,
          trays: MENU_ITEMS.filter((item) => selected[item.id]).map((item) => ({
            itemId: item.id,
            size: sizes[item.id] ?? "small",
            useAlt: !!useAlt[item.id],
          })),
          comboId: comboId || undefined,
          addonIds: ADDONS.filter((a) => addons[a.id]).map((a) => a.id),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }
      if (!data.url) {
        throw new Error("No Stripe checkout URL returned");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ bgcolor: brand.cream, py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, md: 3 } }}>
        <Box sx={{ border: `3px solid ${brand.black}`, bgcolor: brand.white, mb: 3 }}>
          <FlagBand height={10} />
          <Box sx={{ bgcolor: brand.green, py: 2, borderBottom: `3px solid ${brand.black}` }}>
            <Typography
              variant="h1"
              sx={{
                color: brand.gold,
                textAlign: "center",
                fontSize: { xs: "2rem", md: "2.75rem" },
              }}
            >
              Schedule Your Order
            </Typography>
          </Box>
          <Box sx={{ bgcolor: brand.gold, py: 1.5, px: 2, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 800, color: brand.black }}>
              Prefer to talk? Call{" "}
              <Link href={BUSINESS.phoneHref} sx={{ color: brand.black, fontWeight: 900 }}>
                {BUSINESS.phone}
              </Link>
            </Typography>
          </Box>
        </Box>

        {canceled ? (
          <Alert
            severity="warning"
            sx={{ mb: 2, border: `2px solid ${brand.black}`, borderRadius: 0 }}
          >
            Checkout was canceled. You can update your order and try again, or call{" "}
            {BUSINESS.phone}.
          </Alert>
        ) : null}

        {error ? (
          <Alert
            severity="error"
            sx={{ mb: 2, border: `2px solid ${brand.black}`, borderRadius: 0 }}
          >
            {error}
          </Alert>
        ) : null}

        <Stack spacing={3} component="form" onSubmit={handleCheckout}>
          <Box sx={{ border: `3px solid ${brand.black}`, bgcolor: brand.white, p: { xs: 2, md: 3 } }}>
            <Typography
              variant="h3"
              sx={{ color: brand.green, mb: 2, fontSize: "1.35rem" }}
            >
              Your Details
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Full name"
                required
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Phone"
                required
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextField
                label="Email"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Delivery address"
                required
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <DateTimePicker
                label="Event date and time"
                value={eventAt}
                onChange={setEventAt}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
              <FormControl fullWidth>
                <InputLabel id="delivery-label">Delivery zone</InputLabel>
                <Select
                  labelId="delivery-label"
                  label="Delivery zone"
                  value={deliveryId}
                  onChange={(e) => setDeliveryId(e.target.value)}
                  sx={{ borderRadius: 0 }}
                >
                  {DELIVERY_FEES.map((fee) => (
                    <MenuItem key={fee.id} value={fee.id}>
                      {fee.label} ({money(fee.fee)})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Notes"
                fullWidth
                multiline
                minRows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Guest count, protein choices for combos, spice level, setup notes"
              />
            </Stack>
          </Box>

          <Box sx={{ border: `3px solid ${brand.black}`, bgcolor: brand.white, p: { xs: 2, md: 3 } }}>
            <Typography
              variant="h3"
              sx={{ color: brand.green, mb: 2, fontSize: "1.35rem" }}
            >
              Trays
            </Typography>
            <Stack spacing={2}>
              {MENU_ITEMS.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: item.image ? "100px 1fr" : "1fr",
                    },
                    gap: 1.5,
                    alignItems: "center",
                    borderBottom: `1px solid ${brand.creamDark}`,
                    pb: 1.5,
                  }}
                >
                  {item.image ? (
                    <ClickableDishImage
                      src={item.image}
                      title={item.name}
                      aspectRatio="1 / 1"
                    />
                  ) : null}
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!selected[item.id]}
                          onChange={(e) =>
                            setSelected((prev) => ({
                              ...prev,
                              [item.id]: e.target.checked,
                            }))
                          }
                          sx={{
                            color: brand.green,
                            "&.Mui-checked": { color: brand.green },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontWeight: 700 }}>
                          {item.name}
                          <Typography
                            component="span"
                            sx={{
                              display: "block",
                              fontWeight: 600,
                              color: brand.muted,
                              fontSize: "0.85rem",
                            }}
                          >
                            Small {money(item.prices.small)} | Large{" "}
                            {money(item.prices.large)}
                          </Typography>
                        </Typography>
                      }
                    />
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      sx={{ mt: 0.5, pl: 4 }}
                    >
                      <FormControl
                        size="small"
                        sx={{ minWidth: 120 }}
                        disabled={!selected[item.id]}
                      >
                        <InputLabel id={`size-${item.id}`}>Size</InputLabel>
                        <Select
                          labelId={`size-${item.id}`}
                          label="Size"
                          value={sizes[item.id] ?? "small"}
                          onChange={(e) =>
                            setSizes((prev) => ({
                              ...prev,
                              [item.id]: e.target.value as "small" | "large",
                            }))
                          }
                          sx={{ borderRadius: 0 }}
                        >
                          <MenuItem value="small">Small</MenuItem>
                          <MenuItem value="large">Large</MenuItem>
                        </Select>
                      </FormControl>
                      {item.alt ? (
                        <FormControlLabel
                          disabled={!selected[item.id]}
                          control={
                            <Checkbox
                              checked={!!useAlt[item.id]}
                              onChange={(e) =>
                                setUseAlt((prev) => ({
                                  ...prev,
                                  [item.id]: e.target.checked,
                                }))
                              }
                              sx={{
                                color: brand.green,
                                "&.Mui-checked": { color: brand.green },
                              }}
                            />
                          }
                          label={`${item.alt.label} (+$${item.alt.prices[sizes[item.id] ?? "small"] - item.prices[sizes[item.id] ?? "small"]})`}
                        />
                      ) : null}
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ border: `3px solid ${brand.black}`, bgcolor: brand.white, p: { xs: 2, md: 3 } }}>
            <Typography
              variant="h3"
              sx={{ color: brand.green, mb: 2, fontSize: "1.35rem" }}
            >
              Combo (optional)
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="combo-label">Popular combo</InputLabel>
              <Select
                labelId="combo-label"
                label="Popular combo"
                value={comboId}
                onChange={(e) => setComboId(e.target.value)}
                sx={{ borderRadius: 0 }}
              >
                <MenuItem value="">None</MenuItem>
                {COMBOS.map((combo) => (
                  <MenuItem key={combo.id} value={combo.id}>
                    {combo.name}: {combo.description} ({money(combo.price)})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography
              variant="h3"
              sx={{ color: brand.green, mt: 3, mb: 1, fontSize: "1.35rem" }}
            >
              Add-ons
            </Typography>
            <Stack>
              {ADDONS.map((addon) => (
                <FormControlLabel
                  key={addon.id}
                  control={
                    <Checkbox
                      checked={!!addons[addon.id]}
                      onChange={(e) =>
                        setAddons((prev) => ({
                          ...prev,
                          [addon.id]: e.target.checked,
                        }))
                      }
                      sx={{
                        color: brand.green,
                        "&.Mui-checked": { color: brand.green },
                      }}
                    />
                  }
                  label={`${addon.name} (${money(addon.price)})`}
                />
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              border: `3px solid ${brand.black}`,
              bgcolor: brand.black,
              color: brand.gold,
              p: { xs: 2.5, md: 3 },
            }}
          >
            <Stack spacing={1}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                }}
              >
                <span>Order total</span>
                <span>{priced ? money(priced.total) : "$0.00"}</span>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 800,
                }}
              >
                <span>
                  Deposit due now ({priced ? priced.depositPercent : 50}%)
                </span>
                <span>{priced ? money(priced.depositAmount) : "$0.00"}</span>
              </Box>
              <Typography sx={{ color: brand.cream, fontSize: "0.9rem", pt: 1 }}>
                Prices come from the catering menu. Stripe charges the deposit
                only. Remaining balance is due before delivery.
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 2.5 }}
            >
              <Button
                component="a"
                href={BUSINESS.phoneHref}
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                disabled={submitting}
              >
                Call to Confirm
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={submitting || !priced}
              >
                {submitting ? (
                  <CircularProgress size={22} sx={{ color: brand.gold }} />
                ) : (
                  `Pay Deposit${priced ? ` ${money(priced.depositAmount)}` : ""}`
                )}
              </Button>
            </Stack>
          </Box>

          <Typography sx={{ textAlign: "center", fontWeight: 600 }}>
            Or go back to the{" "}
            <Link
              component={NextLink}
              href="/"
              sx={{ color: brand.green, fontWeight: 800 }}
            >
              home menu
            </Link>
            .
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
