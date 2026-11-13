"use client";
import React from "react";
import FilterChips, { type FilterChipOption } from "@/components/common/list/FilterChips";
import { useTranslate } from "@/hooks/useTranslate";
import { type Service, ServiceStatus } from "@/services/serviceList/listInteraface";

export type StatusFilter = "all" | "active" | "review" | "inactive";

/** Which group a service belongs to, from the status the backend reports. */
export const statusGroup = (status: ServiceStatus): Exclude<StatusFilter, "all"> => {
  if (status === ServiceStatus.ACTIVE || status === ServiceStatus.APPROVED) return "active";
  if (status === ServiceStatus.PENDING_APPROVAL) return "review";
  return "inactive";
};

export const countByGroup = (services: Service[]): Record<StatusFilter, number> => {
  const counts: Record<StatusFilter, number> = {
    all: services.length,
    active: 0,
    review: 0,
    inactive: 0,
  };
  services.forEach((s) => {
    counts[statusGroup(s.status)] += 1;
  });
  return counts;
};

interface ServiceStatusFilterProps {
  value: StatusFilter;
  counts: Record<StatusFilter, number>;
  onChange: (value: StatusFilter) => void;
}

/** Filter chips with live counts. Groups with nothing in them are left out, except the one in use. */
const ServiceStatusFilter = ({ value, counts, onChange }: ServiceStatusFilterProps) => {
  const { t } = useTranslate();
  const options: FilterChipOption[] = [
    { key: "all", label: t("sv_filter_all"), count: counts.all },
    { key: "active", label: t("sv_filter_active"), count: counts.active },
    { key: "review", label: t("sv_filter_review"), count: counts.review },
    { key: "inactive", label: t("sv_filter_inactive"), count: counts.inactive },
  ].filter((o) => o.key === "all" || o.key === value || o.count > 0);
  return (
    <FilterChips
      options={options}
      value={value}
      onChange={(k) => onChange(k as StatusFilter)}
      ariaLabel={t("sv_filters_label")}
    />
  );
};

export default ServiceStatusFilter;
