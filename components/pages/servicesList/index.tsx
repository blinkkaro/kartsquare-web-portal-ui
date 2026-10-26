"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/app/mainLayout";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import { ServicesView } from "./ServicesView";

const ServicesContent = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search") ?? "";
  const city = searchParams.get("city") ?? undefined;

  return (
    <ServicesView
      initialCategory={category}
      initialSearch={search}
      initialCity={city}
    />
  );
};

const ListOfServices = () => {
  return (
    <MainLayout>
      <Suspense fallback={<CenteredLoader py={{ xs: 6, sm: 10 }} size={60} />}>
        <ServicesContent />
      </Suspense>
    </MainLayout>
  );
};

export default ListOfServices;
