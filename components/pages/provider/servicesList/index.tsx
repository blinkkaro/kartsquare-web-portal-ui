"use client";
import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import MainLayout from "@/app/mainLayout";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { useProviderServicesList, useServicesList } from "@/hooks/useServicesList";
import { useTranslate } from "@/hooks/useTranslate";
import { getUserRole, UserRole } from "@/utils/auth";
import AddServiceDrawer from "../addService";
import ProviderCategoriesBar from "./ProviderCategoriesBar";
import ProviderServicesGrid from "./ProviderServicesGrid";
import ProviderServicesHeader from "./ProviderServicesHeader";
import ProviderServicesSearchBar from "./ProviderServicesSearchBar";
import ServiceStatusFilter, {
  countByGroup,
  statusGroup,
  type StatusFilter,
} from "./ServiceStatusFilter";

const LIMIT = 12;

const ProviderServicesList = () => {
  const { t } = useTranslate();
  const queryClient = useQueryClient();
  const isProvider = getUserRole() === UserRole.SERVICE_PROVIDER;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  // Search answers as you type, after a short pause, so each keystroke is not a request.
  const search = useDebounce(searchInput.trim(), 300);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [addServiceDrawerOpen, setAddServiceDrawerOpen] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const providerServicesQuery = useProviderServicesList(search, isProvider);
  const customerServicesQuery = useServicesList(
    {
      page,
      limit: LIMIT,
      ...(selectedCategory && { category_id: selectedCategory }),
      ...(search && { search }),
    },
    !isProvider,
  );
  const servicesQuery = isProvider ? providerServicesQuery : customerServicesQuery;

  const allServices = useMemo(() => servicesQuery.data?.services ?? [], [servicesQuery.data]);
  const counts = useMemo(() => countByGroup(allServices), [allServices]);
  // Providers get the whole list at once, so the status chips filter it here.
  const services = useMemo(
    () =>
      isProvider && statusFilter !== "all"
        ? allServices.filter((s) => statusGroup(s.status) === statusFilter)
        : allServices,
    [allServices, isProvider, statusFilter],
  );
  const totalPages = servicesQuery.data?.pagination?.total_pages || 1;
  const total = servicesQuery.data?.pagination?.total ?? allServices.length;
  const loading = servicesQuery.isLoading;

  const subtitle = isProvider
    ? total > 0
      ? t("sv_subtitle", { total, active: counts.active })
      : t("sv_subtitle_none")
    : undefined;

  const handleServiceAdded = () => {
    setPage(1);
    queryClient.invalidateQueries({ queryKey: ["provider-services-list"] });
  };

  return (
    <MainLayout>
      <Box sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 3 }, mx: "auto", maxWidth: 1200 }}>
        <ProviderServicesHeader
          title={isProvider ? t("sv_title") : t("services_for_you")}
          subtitle={subtitle}
          // The empty state already carries its own "Add service" button, so the header one waits for a list.
          onAdd={
            isProvider && (loading || allServices.length > 0 || search)
              ? () => setAddServiceDrawerOpen(true)
              : undefined
          }
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 3,
          }}
        >
          <ProviderServicesSearchBar
            searchInput={searchInput}
            onSearchInputChange={(value) => {
              setSearchInput(value);
              setPage(1);
            }}
            onSearchSubmit={(e) => e.preventDefault()}
          />
          {isProvider && (
            <ServiceStatusFilter value={statusFilter} counts={counts} onChange={setStatusFilter} />
          )}
        </Box>

        {!isProvider && (
          <ProviderCategoriesBar
            categories={categories}
            selectedCategory={selectedCategory}
            categoriesLoading={categoriesLoading}
            onCategoryClick={(id) => {
              setSelectedCategory(id);
              setPage(1);
            }}
          />
        )}

        <ProviderServicesGrid
          services={services}
          totalPages={totalPages}
          currentPage={page}
          onPageChange={(_event, value) => {
            setPage(value);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          loading={loading}
          isProvider={isProvider}
          searchTerm={search}
          filtered={isProvider && statusFilter !== "all"}
          onClearSearch={() => setSearchInput("")}
          onAdd={() => setAddServiceDrawerOpen(true)}
        />
      </Box>

      <AddServiceDrawer
        open={addServiceDrawerOpen}
        onClose={() => setAddServiceDrawerOpen(false)}
        onSuccess={handleServiceAdded}
      />
    </MainLayout>
  );
};

export default ProviderServicesList;
