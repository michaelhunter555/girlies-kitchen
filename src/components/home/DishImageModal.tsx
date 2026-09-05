"use client";

import { useState } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { brand } from "@/theme/theme";

type DishImageModalProps = {
  open: boolean;
  onClose: () => void;
  src: string;
  title: string;
};

export function DishImageModal({
  open,
  onClose,
  src,
  title,
}: DishImageModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 0,
            border: `3px solid ${brand.black}`,
            bgcolor: brand.black,
            m: 1,
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: brand.green,
          borderBottom: `3px solid ${brand.gold}`,
          px: 2,
          py: 1.25,
        }}
      >
        <Typography
          sx={{
            color: brand.gold,
            fontFamily: "var(--font-display), Impact, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontSize: { xs: "1.15rem", md: "1.4rem" },
          }}
        >
          {title}
        </Typography>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ color: brand.gold }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 0, bgcolor: brand.black }}>
        <Box sx={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}>
          <Image
            src={src}
            alt={title}
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            style={{ objectFit: "cover" }}
            priority
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

type ClickableDishImageProps = {
  src: string;
  title: string;
  aspectRatio?: string;
};

export function ClickableDishImage({
  src,
  title,
  aspectRatio = "4 / 3",
}: ClickableDishImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge photo of ${title}`}
        sx={{
          position: "relative",
          display: "block",
          width: "100%",
          aspectRatio,
          border: `2px solid ${brand.black}`,
          p: 0,
          m: 0,
          cursor: "zoom-in",
          overflow: "hidden",
          bgcolor: brand.black,
          "&:hover img": { transform: "scale(1.03)" },
          "& img": { transition: "transform 200ms ease" },
        }}
      >
        <Image
          src={src}
          alt={title}
          fill
          sizes="(max-width: 600px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      </Box>
      <DishImageModal
        open={open}
        onClose={() => setOpen(false)}
        src={src}
        title={title}
      />
    </>
  );
}
