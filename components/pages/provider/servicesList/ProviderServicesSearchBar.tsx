"use client";
import React from "react";
import ListSearchBar from "@/components/common/list/ListSearchBar";
import { useTranslate } from "@/hooks/useTranslate";

interface ProviderServicesSearchBarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

const ProviderServicesSearchBar = ({
  searchInput,
  onSearchInputChange,
}: ProviderServicesSearchBarProps) => {
  const { t } = useTranslate();
  return (
    <ListSearchBar
      value={searchInput}
      onChange={onSearchInputChange}
      placeholder={t("sv_search_ph")}
      ariaLabel={t("sv_search_label")}
      clearLabel={t("sv_search_clear")}
    />
  );
};

export default ProviderServicesSearchBar;
