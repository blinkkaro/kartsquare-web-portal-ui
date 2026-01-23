import React, { Suspense } from "react";
import MainLayout from "../mainLayout";
import SearchResultsView from "@/components/pages/search";
import { CircularProgress, Box } from "@mui/material";
import { COLORS } from "@/constants/colors";

function SearchPage() {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <CircularProgress sx={{ color: COLORS.PRIMARY_PURPLE }} />
          </Box>
        }
      >
        <SearchResultsView />
      </Suspense>
    </MainLayout>
  );
}

export default SearchPage;
