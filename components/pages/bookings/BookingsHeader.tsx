import React from "react";
import { english } from "../../../features/i18n/en";
import PageHeading from "@/components/common/PageHeading";

interface BookingsHeaderProps {
    title?: string;
}

const BookingsHeader: React.FC<BookingsHeaderProps> = ({
    title = english.orders_bookings
}) => {
    return <PageHeading title={title} sx={{ mb: 0 }} />;
};

export default BookingsHeader;
