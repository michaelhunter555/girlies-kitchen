"use client";

import { createTheme } from "@mui/material/styles";
import { brand } from "@/theme/brand";

export { brand };

/**
 * Sharp corners. Flat color blocks. No soft radius / heavy gradients.
 */
export const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: "var(--font-body), Helvetica, sans-serif",
    h1: {
      fontFamily: "var(--font-display), Impact, sans-serif",
      fontWeight: 700,
      letterSpacing: "0.02em",
      textTransform: "uppercase",
    },
    h2: {
      fontFamily: "var(--font-display), Impact, sans-serif",
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    },
    h3: {
      fontFamily: "var(--font-display), Impact, sans-serif",
      fontWeight: 700,
      letterSpacing: "0.03em",
      textTransform: "uppercase",
    },
    h4: {
      fontFamily: "var(--font-display), Impact, sans-serif",
      fontWeight: 700,
      textTransform: "uppercase",
    },
    button: {
      fontFamily: "var(--font-body), Helvetica, sans-serif",
      fontWeight: 800,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    },
    body1: {
      fontFamily: "var(--font-body), Helvetica, sans-serif",
      fontWeight: 500,
    },
    body2: {
      fontFamily: "var(--font-body), Helvetica, sans-serif",
    },
  },
  shape: {
    borderRadius: 0,
  },
  palette: {
    mode: "light",
    primary: {
      main: brand.green,
      dark: brand.greenDark,
      contrastText: brand.gold,
    },
    secondary: {
      main: brand.gold,
      dark: brand.goldDeep,
      contrastText: brand.black,
    },
    background: {
      default: brand.cream,
      paper: brand.white,
    },
    text: {
      primary: brand.ink,
      secondary: brand.muted,
    },
    common: {
      black: brand.black,
      white: brand.white,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: brand.cream,
          color: brand.ink,
        },
        a: {
          color: "inherit",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          paddingInline: 20,
          paddingBlock: 12,
        },
        contained: {
          variants: [
            {
              props: { color: "primary" },
              style: {
                backgroundColor: brand.green,
                color: brand.gold,
                "&:hover": {
                  backgroundColor: brand.greenDark,
                },
              },
            },
            {
              props: { color: "secondary" },
              style: {
                backgroundColor: brand.gold,
                color: brand.black,
                "&:hover": {
                  backgroundColor: brand.goldDeep,
                },
              },
            },
          ],
        },
        outlined: {
          borderWidth: 2,
          borderColor: brand.black,
          color: brand.black,
          "&:hover": {
            borderWidth: 2,
            backgroundColor: brand.gold,
            borderColor: brand.black,
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
        square: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
        square: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `2px solid ${brand.black}`,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            backgroundColor: brand.white,
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: "transparent",
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: brand.black,
          color: brand.gold,
          fontWeight: 800,
          textTransform: "uppercase",
          borderBottom: `2px solid ${brand.gold}`,
        },
        body: {
          borderBottom: `1px solid ${brand.creamDark}`,
        },
      },
    },
  },
});
