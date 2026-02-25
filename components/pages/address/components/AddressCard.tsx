"use client";
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Address } from "@/services/address/addressInterface";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { formatAddress } from "@/helper/helper";

interface AddressCardProps {
  address: Address;
  onEdit?: (address: Address) => void;
  onDelete?: (id: string) => void;
  onSetDefault?: (id: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  const { t } = useTranslationContext();

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "12px",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.PRIMARY_LIGHT,
        position: "relative",
      }}
    >
      {/* Header with address name and action icons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: (theme) => theme.palette.text.primary,
          }}
        >
          {address.address_name}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {onEdit && (
            <IconButton
              size="small"
              onClick={() => onEdit(address)}
              sx={{
                color: (theme) => theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: COLORS.PURPLE_ALPHA_04,
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              size="small"
              onClick={() => onDelete(address.id)}
              sx={{
                color: "#FF5252",
                "&:hover": {
                  backgroundColor: "rgba(255, 82, 82, 0.1)",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Address details */}
      <Typography
        variant="body2"
        sx={{
          color: (theme) => theme.palette.text.secondary,
          mb: 2,
          lineHeight: 1.6,
        }}
      >
        {formatAddress(
          {
            address: address.address,
            building_no: address.building_no || "",
            floor: address.floor || "",
            landmark: address.landmark || "",
            city_town: address.city_town,
            state: address.state,
            pincode: address.pincode,
            country: address.country,
            latitude: address.latitude,
            longitude: address.longitude,
          },
          t,
        )}
      </Typography>

      {/* Default button or badge */}
      {address.is_default ? (
        <Box
          sx={{
            display: "inline-block",
            px: 2,
            py: 0.5,
            borderRadius: "20px",
            backgroundColor: COLORS.PRIMARY_PURPLE,
            color: COLORS.WHITE,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          >
            {t("default")}
          </Typography>
        </Box>
      ) : (
        onSetDefault && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => onSetDefault(address.id)}
            sx={{
              borderRadius: "20px",
              fontSize: "0.7rem !important",
              padding: "4px 16px !important",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {t("setAsDefault")}
          </Button>
        )
      )}
    </Box>
  );
};

export default AddressCard;
