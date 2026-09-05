import { Suspense } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ScheduleForm from "./ScheduleForm";
import { brand } from "@/theme/theme";

export default function SchedulePage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: 400,
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
      <ScheduleForm />
    </Suspense>
  );
}
