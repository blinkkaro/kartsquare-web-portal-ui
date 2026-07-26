"use client";
import React from "react";
import { getUserRole, UserRole } from "../../../../utils/auth";
import { english } from "../../../../features/i18n/en";
import PageHeading from "@/components/common/PageHeading";

const ProviderServicesHeader = () => {
    const userRole = getUserRole();

    const pageTitle = userRole === UserRole.SERVICE_PROVIDER
        ? english.my_services
        : english.services_for_you;

    return <PageHeading title={pageTitle} sx={{ mb: 0 }} />;
};

export default ProviderServicesHeader;
