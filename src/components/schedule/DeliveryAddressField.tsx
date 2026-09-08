"use client";

import { useEffect, useId, useRef, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { brand } from "@/theme/brand";
import { DELIVERY_PRICING } from "@/lib/constants";

export type DeliveryQuote = {
  placeId: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  miles: number;
  distanceText: string;
  durationText: string;
  fee: number;
  allowed: boolean;
  reason: string | null;
  origin: string;
};

type Prediction = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
};

type Props = {
  onQuoteChange: (quote: DeliveryQuote | null) => void;
};

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export function DeliveryAddressField({ onQuoteChange }: Props) {
  const sessionToken = useId().replace(/:/g, "");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Prediction[]>([]);
  const [loadingPredict, setLoadingPredict] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [quote, setQuote] = useState<DeliveryQuote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateQuote(next: DeliveryQuote | null) {
    setQuote(next);
    onQuoteChange(next);
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = inputValue.trim();
    if (q.length < 3) {
      setOptions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoadingPredict(true);
      try {
        const res = await fetch(
          `/api/places/autocomplete?input=${encodeURIComponent(q)}&sessionToken=${sessionToken}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Autocomplete failed");
        setOptions(data.predictions || []);
        setError(null);
      } catch (err) {
        setOptions([]);
        setError(err instanceof Error ? err.message : "Address lookup failed");
      } finally {
        setLoadingPredict(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, sessionToken]);

  async function selectPlace(prediction: Prediction | null) {
    setError(null);
    updateQuote(null);
    if (!prediction) return;

    setLoadingQuote(true);
    try {
      const res = await fetch("/api/delivery/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: prediction.placeId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not calculate delivery");
      setInputValue(data.formattedAddress || prediction.description);
      updateQuote(data as DeliveryQuote);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delivery quote failed");
    } finally {
      setLoadingQuote(false);
    }
  }

  return (
    <Box>
      <Autocomplete
        filterOptions={(x) => x}
        options={options}
        loading={loadingPredict}
        inputValue={inputValue}
        onInputChange={(_, value, reason) => {
          if (reason === "input") {
            setInputValue(value);
            updateQuote(null);
            setError(null);
          }
          if (reason === "clear") {
            setInputValue("");
            updateQuote(null);
            setOptions([]);
          }
        }}
        onChange={(_, value) => {
          if (value && typeof value !== "string") {
            void selectPlace(value);
          }
        }}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.description
        }
        isOptionEqualToValue={(a, b) => a.placeId === b.placeId}
        renderOption={(props, option) => (
          <li {...props} key={option.placeId}>
            <Box sx={{ py: 0.5 }}>
              <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {option.mainText}
              </Typography>
              <Typography sx={{ color: brand.muted, fontSize: "0.85rem" }}>
                {option.secondaryText}
              </Typography>
            </Box>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Delivery address"
            required
            placeholder="Start typing an address"
            helperText={`$${DELIVERY_PRICING.ratePerMile}/mile from Belcamp, MD (min $${DELIVERY_PRICING.minimumFee})`}
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps.input,
                endAdornment: (
                  <>
                    {loadingPredict || loadingQuote ? (
                      <CircularProgress color="inherit" size={18} />
                    ) : null}
                    {params.slotProps.input.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />

      {error ? (
        <Typography sx={{ mt: 1, color: "error.main", fontWeight: 600 }}>
          {error}
        </Typography>
      ) : null}

      {quote ? (
        <Box
          sx={{
            mt: 1.5,
            border: `2px solid ${brand.black}`,
            bgcolor: quote.allowed ? brand.cream : "#fff3f3",
            p: 1.5,
          }}
        >
          {quote.allowed ? (
            <>
              <Typography sx={{ fontWeight: 800, color: brand.green }}>
                Estimated delivery: {money(quote.fee)}
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {quote.miles} miles ({quote.distanceText}
                {quote.durationText ? `, about ${quote.durationText}` : ""})
              </Typography>
            </>
          ) : (
            <Typography sx={{ fontWeight: 700, color: "error.main" }}>
              {quote.reason}
            </Typography>
          )}
        </Box>
      ) : null}
    </Box>
  );
}
