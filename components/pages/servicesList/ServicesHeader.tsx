"use client";

import React from "react";
import { useTranslate } from "@/hooks/useTranslate";
import PageHeading from "@/components/common/PageHeading";

interface ServicesHeaderProps {
  title?: string;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({ title }) => {
  const { t } = useTranslate();

  return (
    <PageHeading
      title={title ?? t("services_for_you")}
      subtitle={t("services_for_you_subtitle")}
    />
  );
};

export default ServicesHeader;
