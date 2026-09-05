import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { BUSINESS } from "@/lib/constants";
import { brand } from "@/theme/theme";
import { FlagBand } from "@/components/brand/FlagBand";
import { getStripe } from "@/lib/stripe";

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;

  let amountPaid: string | null = null;
  let customerEmail: string | null = null;
  let orderTotal: string | null = null;
  let balanceDue: string | null = null;

  if (sessionId) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.amount_total != null) {
        amountPaid = `$${(session.amount_total / 100).toFixed(2)}`;
      }
      customerEmail = session.customer_details?.email || session.customer_email || null;
      orderTotal = session.metadata?.orderTotal
        ? `$${Number(session.metadata.orderTotal).toFixed(2)}`
        : null;
      balanceDue = session.metadata?.balanceDue
        ? `$${Number(session.metadata.balanceDue).toFixed(2)}`
        : null;
    } catch {
      // Session lookup failed; still show thank-you UI.
    }
  }

  return (
    <Box sx={{ bgcolor: brand.cream, py: { xs: 5, md: 8 } }}>
      <Container maxWidth="sm" sx={{ px: { xs: 2, md: 3 } }}>
        <Box sx={{ border: `3px solid ${brand.black}`, bgcolor: brand.white }}>
          <FlagBand height={10} />
          <Box
            sx={{
              bgcolor: brand.green,
              py: 2.5,
              borderBottom: `3px solid ${brand.black}`,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                color: brand.gold,
                textAlign: "center",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Deposit Received
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: "1.1rem" }}>
              Thank you for booking with {BUSINESS.name}. Your catering deposit
              payment went through.
            </Typography>

            {amountPaid ? (
              <Typography sx={{ mb: 1, fontWeight: 700 }}>
                Deposit paid: {amountPaid}
              </Typography>
            ) : null}
            {orderTotal ? (
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Order total: {orderTotal}
              </Typography>
            ) : null}
            {balanceDue ? (
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Balance due before delivery: {balanceDue}
              </Typography>
            ) : null}
            {customerEmail ? (
              <Typography sx={{ mb: 2, color: brand.muted }}>
                Receipt sent to {customerEmail} (via Stripe).
              </Typography>
            ) : null}

            <Typography sx={{ mb: 3, fontWeight: 600 }}>
              Questions? Call{" "}
              <Box
                component="a"
                href={BUSINESS.phoneHref}
                sx={{ color: brand.green, fontWeight: 900 }}
              >
                {BUSINESS.phone}
              </Box>
              .
            </Typography>

            <Button
              component={Link}
              href="/"
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
