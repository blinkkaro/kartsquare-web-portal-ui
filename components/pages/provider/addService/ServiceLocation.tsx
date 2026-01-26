"use client";
import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    CircularProgress,
    useTheme,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import { UserAddress } from "@/services/userAddress/userAddressInterface";
import AddressDrawer from "@/components/common/address/AddressDrawer";
import { english } from "@/features/i18n/en";

interface ServiceLocationProps {
    locationType: "at_customer" | "at_provider";
    onLocationTypeChange: (value: "at_customer" | "at_provider") => void;
    addresses: UserAddress[];
    selectedAddressId: string;
    onAddressSelect: (addressId: string) => void;
    visitingCharge: string;
    onVisitingChargeChange: (value: string) => void;
    serviceRadius: string;
    onServiceRadiusChange: (value: string) => void;
    addressesLoading: boolean;
    onAddressAdded: () => void;
}

const ServiceLocation = ({
    locationType,
    onLocationTypeChange,
    addresses,
    selectedAddressId,
    onAddressSelect,
    visitingCharge,
    onVisitingChargeChange,
    serviceRadius,
    onServiceRadiusChange,
    addressesLoading,
    onAddressAdded,
}: ServiceLocationProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [addressDrawerOpen, setAddressDrawerOpen] = useState(false);

    const handleAddressDrawerClose = () => {
        setAddressDrawerOpen(false);
        onAddressAdded();
    };

    return (
        <>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {english.service_location}
            </Typography>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
                <RadioGroup
                    value={locationType}
                    onChange={(e) => onLocationTypeChange(e.target.value as any)}
                >
                    <FormControlLabel
                        value="at_provider"
                        control={<Radio sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                        label={english.at_provider_location}
                    />
                    <FormControlLabel
                        value="at_customer"
                        control={<Radio sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                        label={english.at_customer_location}
                    />
                </RadioGroup>
            </FormControl>

            {/* Address Selection */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    {english.select_address}
                    <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                </Typography>

                {addressesLoading ? (
                    <CircularProgress size={20} />
                ) : addresses.length > 0 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
                        {addresses.map((addr) => (
                            <Box
                                key={addr.id}
                                onClick={() => onAddressSelect(addr.id)}
                                sx={{
                                    p: 2,
                                    border: `2px solid ${selectedAddressId === addr.id
                                        ? COLORS.PRIMARY_PURPLE
                                        : isDark
                                            ? COLORS.BORDER.DEFAULT_DARK
                                            : COLORS.BORDER.DEFAULT_LIGHT
                                        }`,
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    bgcolor: selectedAddressId === addr.id
                                        ? COLORS.PURPLE_ALPHA_04
                                        : isDark
                                            ? COLORS.BACKGROUND.PAPER_DARK
                                            : COLORS.BACKGROUND.PRIMARY_LIGHT,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        borderColor: COLORS.PRIMARY_PURPLE,
                                        bgcolor: COLORS.PURPLE_ALPHA_04,
                                    },
                                }}
                            >
                                {addr.address_name && (
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 600,
                                            color: COLORS.PRIMARY_PURPLE,
                                            mb: 0.5,
                                        }}
                                    >
                                        {addr.address_name}
                                        {addr.is_default && (
                                            <span style={{ marginLeft: "8px", fontSize: "0.75rem" }}>
                                                {english.default_address}
                                            </span>
                                        )}
                                    </Typography>
                                )}
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    {addr.building_no && `${addr.building_no}, `}
                                    {addr.floor && `Floor ${addr.floor}, `}
                                    {addr.address}
                                </Typography>
                                {addr.landmark && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        {english.near} {addr.landmark}
                                    </Typography>
                                )}
                                <Typography variant="body2" color="text.secondary">
                                    {addr.city_town}, {addr.state} - {addr.pincode}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {addr.country}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {english.no_address_yet}
                    </Typography>
                )}

                <Button
                    variant="outlined"
                    onClick={() => setAddressDrawerOpen(true)}
                    sx={{
                        mt: 1,
                        borderColor: COLORS.PRIMARY_PURPLE,
                        color: COLORS.PRIMARY_PURPLE,
                        "&:hover": {
                            borderColor: COLORS.PURPLE_HOVER,
                            bgcolor: COLORS.PURPLE_ALPHA_04,
                        },
                    }}
                >
                    {english.add_address}
                </Button>
            </Box>

            {/* Visiting Charge for User Location */}
            {locationType === "at_customer" && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                        {english.visiting_charge_inr}
                        <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        value={visitingCharge}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '');
                            if (val === '' || (parseFloat(val) <= 10000 && (val.match(/\./g) || []).length <= 1)) {
                                onVisitingChargeChange(val);
                            }
                        }}
                        placeholder={english.enter_visiting_charge}
                    />
                </Box>
            )}

            {/* Service Radius */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    {english.service_radius_km}
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    value={serviceRadius}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val === '' || parseInt(val) <= 100) {
                            onServiceRadiusChange(val);
                        }
                    }}
                    placeholder="5"
                />
            </Box>

            {/* Address Drawer */}
            <AddressDrawer
                open={addressDrawerOpen}
                onClose={handleAddressDrawerClose}
                mode="add"
            />
        </>
    );
};

export default ServiceLocation;
