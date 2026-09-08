import { Suspense } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { brand } from "@/theme/brand";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: brand.cream,
          }}
        >
          <CircularProgress sx={{ color: brand.green }} />
        </Box>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
