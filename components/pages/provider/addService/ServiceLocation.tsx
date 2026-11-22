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
  useTheme,
  Slider,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { COLORS } from "@/constants/colors";
import { type UserAddress } from "@/services/userAddress/userAddressInterface";
import AddressDrawer from "@/components/common/address/AddressDrawer";
import { english } from "@/features/i18n/en";
import {
  MAX_VISITING_CHARGE_ROWS,
  type VisitingChargeMode,
  type VisitingTierRow,
} from "./useServiceForm";

interface ServiceLocationProps {
  locationType: "at_customer" | "at_provider" | "virtual_call";
  onLocationTypeChange: (value: "at_customer" | "at_provider" | "virtual_call") => void;
  addresses: UserAddress[];
  selectedAddressId: string;
  onAddressSelect: (addressId: string) => void;
  visitingCharge: string;
  onVisitingChargeChange: (value: string) => void;
  visitingChargeMode: VisitingChargeMode;
  onVisitingChargeModeChange: (value: VisitingChargeMode) => void;
  visitingTiers: VisitingTierRow[];
  onVisitingTiersChange: (rows: VisitingTierRow[]) => void;
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
  visitingChargeMode,
  onVisitingChargeModeChange,
  visitingTiers,
  onVisitingTiersChange,
  serviceRadius,
  onServiceRadiusChange,
  addressesLoading,
  onAddressAdded,
}: ServiceLocationProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [addressDrawerOpen, setAddressDrawerOpen] = useState(false);

  const wholeNumber = (value: string, max: number) => {
    const digits = value.replace(/[^0-9]/g, "");
    return digits === "" || parseInt(digits, 10) <= max ? digits : null;
  };

  const updateTier = (index: number, field: keyof VisitingTierRow, raw: string) => {
    const value = wholeNumber(raw, field === "uptoKm" ? 50 : 10000);
    if (value === null) return;
    onVisitingTiersChange(
      visitingTiers.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const addTier = () => {
    if (visitingTiers.length >= MAX_VISITING_CHARGE_ROWS) return;
    // The new row goes before the open "beyond" row.
    const rows = [...visitingTiers];
    rows.splice(rows.length - 1, 0, { uptoKm: "", charge: "" });
    onVisitingTiersChange(rows);
  };

  const removeTier = (index: number) => {
    if (visitingTiers.length <= 2) return;
    onVisitingTiersChange(visitingTiers.filter((_, i) => i !== index));
  };

  const handleAddressDrawerClose = () => {
    setAddressDrawerOpen(false);
    onAddressAdded();
  };

  return (
    <>
      {/* <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {english.service_location}
            </Typography> */}
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
          <FormControlLabel
            value="virtual_call"
            control={<Radio sx={{ color: COLORS.PRIMARY_PURPLE }} />}
            label={english.virtual_call_location}
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
          <LogoLoader size={20} />
        ) : addresses.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
            {addresses.map((addr) => (
              <Box
                key={addr.id}
                onClick={() => onAddressSelect(addr.id)}
                sx={{
                  p: 2,
                  border: `2px solid ${
                    selectedAddressId === addr.id
                      ? COLORS.PRIMARY_PURPLE
                      : isDark
                        ? COLORS.BORDER.DEFAULT_DARK
                        : COLORS.BORDER.DEFAULT_LIGHT
                  }`,
                  borderRadius: "12px",
                  cursor: "pointer",
                  bgcolor:
                    selectedAddressId === addr.id
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
          <FormControl component="fieldset">
            <RadioGroup
              value={visitingChargeMode}
              onChange={(e) => onVisitingChargeModeChange(e.target.value as VisitingChargeMode)}
            >
              <FormControlLabel
                value="single"
                control={<Radio sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                label={english.visiting_charge_same}
              />
              <FormControlLabel
                value="distance"
                control={<Radio sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                label={english.visiting_charge_by_distance}
              />
            </RadioGroup>
          </FormControl>
          {visitingChargeMode === "distance" ? (
            <Box sx={{ mt: 1 }}>
              {visitingTiers.map((row, index) => {
                const isLast = index === visitingTiers.length - 1;
                const previousKm = visitingTiers[index - 1]?.uptoKm || "0";
                return (
                  <Box
                    key={index}
                    sx={{ display: "flex", gap: 1.5, alignItems: "flex-end", mb: 1.5 }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "block", fontWeight: 500 }}
                      >
                        {isLast
                          ? english.visiting_charge_beyond_km.replace("{km}", previousKm)
                          : english.visiting_charge_upto_km}
                      </Typography>
                      {isLast ? (
                        <TextField fullWidth size="small" value="" disabled placeholder="—" />
                      ) : (
                        <TextField
                          fullWidth
                          size="small"
                          inputProps={{ inputMode: "numeric", maxLength: 2 }}
                          value={row.uptoKm}
                          onChange={(e) => updateTier(index, "uptoKm", e.target.value)}
                          placeholder="2"
                        />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "block", fontWeight: 500 }}
                      >
                        {english.visiting_charge_amount}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        inputProps={{ inputMode: "numeric", maxLength: 5 }}
                        value={row.charge}
                        onChange={(e) => updateTier(index, "charge", e.target.value)}
                        placeholder={isLast ? "250" : "150"}
                      />
                    </Box>
                    {visitingTiers.length > 2 && !isLast ? (
                      <IconButton
                        size="small"
                        onClick={() => removeTier(index)}
                        color="error"
                        aria-label={english.remove_price_item}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      // Same footprint as the remove button so every row's fields line up.
                      <IconButton size="small" disabled aria-hidden sx={{ visibility: "hidden" }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                );
              })}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addTier}
                disabled={visitingTiers.length >= MAX_VISITING_CHARGE_ROWS}
                sx={{
                  borderStyle: "dashed",
                  borderColor: COLORS.PRIMARY_PURPLE,
                  color: COLORS.PRIMARY_PURPLE,
                  py: 1.25,
                  "&:hover": {
                    borderColor: COLORS.PURPLE_HOVER,
                    bgcolor: COLORS.PURPLE_ALPHA_04,
                  },
                }}
              >
                {english.add_distance_row}
              </Button>
            </Box>
          ) : (
            <TextField
              fullWidth
              size="small"
              value={visitingCharge}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, "");
                if (
                  val === "" ||
                  (parseFloat(val) <= 10000 && (val.match(/\./g) || []).length <= 1)
                ) {
                  onVisitingChargeChange(val);
                }
              }}
              placeholder={english.enter_visiting_charge}
            />
          )}
        </Box>
      )}

      {/* Service Radius */}
      {locationType !== "virtual_call" && (
        <Box sx={{ mb: 3, px: 1 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {english.service_radius_km}: {serviceRadius || 5}
          </Typography>
          <Slider
            value={parseInt(serviceRadius) || 5}
            onChange={(_, newValue) => onServiceRadiusChange(newValue.toString())}
            min={5}
            max={50}
            step={1}
            valueLabelDisplay="auto"
            sx={{
              color: COLORS.PRIMARY_PURPLE,
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: -1 }}>
            <Typography variant="caption" color="text.secondary">
              5 km
            </Typography>
            <Typography variant="caption" color="text.secondary">
              50 km
            </Typography>
          </Box>
        </Box>
      )}

      {/* Address Drawer */}
      <AddressDrawer open={addressDrawerOpen} onClose={handleAddressDrawerClose} mode="add" />
    </>
  );
};

export default ServiceLocation;
