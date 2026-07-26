import React from "react";
import { english } from "../../../../features/i18n/en";
import PageHeading from "@/components/common/PageHeading";

interface ProviderBookingsHeaderProps {
    title?: string;
}

const ProviderBookingsHeader: React.FC<ProviderBookingsHeaderProps> = ({
    title = english.provider_bookings
}) => {
    return <PageHeading title={title} sx={{ mb: 0 }} />;
};

export default ProviderBookingsHeader;
