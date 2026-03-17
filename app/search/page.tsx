import React, { Suspense } from "react";
import MainLayout from "../mainLayout";
import SearchResultsView from "@/components/pages/search";
import { Box } from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import { COLORS } from "@/constants/colors";

function SearchPage() {
  return (
    <MainLayout>
      <Suspense
        fallback={
            <CenteredLoader />
        }
      >
        <SearchResultsView />
      </Suspense>
    </MainLayout>
  );
}

export default SearchPage;
