"use client";

import React from "react";
import { alpha, Avatar, Box, ButtonBase, Chip, Typography } from "@mui/material";
import { CallRounded, WhatsApp } from "@mui/icons-material";
import dayjs from "dayjs";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { getLeadContact, isNewLead } from "@/lib/leadContact";
import type { Lead } from "@/services/leads/lead.interface";
import { DASHBOARD_BUTTON_SX } from "./buttonSx";

// Spread in: the shared Button forwards these to its link, but its prop type does not list them.
const NEW_TAB = { target: "_blank", rel: "noopener noreferrer" };

interface LeadRowProps {
  lead: Lead;
  onOpen: (lead: Lead) => void;
}

/** One lead: who asked, what they need, and one tap to reach them. */
const LeadRow: React.FC<LeadRowProps> = ({ lead, onOpen }) => {
  const { t } = useTranslate();
  const name = `${lead.first_name ?? ""} ${lead.last_name ?? ""}`.trim();
  const { phoneLabel, telHref, whatsAppHref } = getLeadContact(lead);

  return (
    <Box
      component="li"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        gap: { xs: 1.5, md: 2 },
        p: 1.5,
        borderRadius: "12px",
        border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
        transition: "border-color 200ms ease-out, box-shadow 200ms ease-out",
        "&:hover": {
          borderColor: COLORS.NEW_UI.CARD_BORDER_HOVER_LIGHT,
          boxShadow: COLORS.NEW_UI.CARD_SHADOW_HOVER_LIGHT,
        },
      }}
    >
      {/* Opens the full details. Call and WhatsApp sit outside it, so no control is nested. */}
      <ButtonBase
        onClick={() => onOpen(lead)}
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: 1.5,
          textAlign: "left",
          borderRadius: "8px",
          "&.Mui-focusVisible": {
            outline: `3px solid ${COLORS.PRIMARY_PURPLE}`,
            outlineOffset: 2,
          },
        }}
      >
        <Avatar
          aria-hidden
          sx={{
            width: 44,
            height: 44,
            bgcolor: COLORS.PURPLE_ALPHA_10,
            color: COLORS.PRIMARY_PURPLE,
            fontWeight: 700,
          }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>
        <Box component="span" sx={{ flex: 1, minWidth: 0, display: "block" }}>
          <Box
            component="span"
            sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", columnGap: 1 }}
          >
            <Typography component="span" sx={{ fontWeight: 700, wordBreak: "break-word" }}>
              {name}
            </Typography>
            {isNewLead(lead.created_at) && (
              <Chip
                component="span"
                size="small"
                label={t("lead_new")}
                sx={{
                  height: 20,
                  fontWeight: 700,
                  bgcolor: alpha(COLORS.SECONDARY_ORANGE, 0.14),
                  color: COLORS.TEXT.PRIMARY_LIGHT,
                }}
              />
            )}
            <Typography
              component="span"
              variant="caption"
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT }}
            >
              {dayjs(lead.created_at).format("D MMM YYYY")}
            </Typography>
          </Box>
          {lead.message && (
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: COLORS.TEXT.PRIMARY_LIGHT,
                mt: 0.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              {lead.message}
            </Typography>
          )}
          <Typography
            component="span"
            variant="body2"
            sx={{
              color: COLORS.TEXT.SECONDARY_LIGHT,
              display: "block",
              mt: 0.5,
              wordBreak: "break-word",
            }}
          >
            {[phoneLabel, lead.email].filter(Boolean).join(" · ")}
          </Typography>
        </Box>
      </ButtonBase>

      {telHref && (
        <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
          <Button
            variant="outlined"
            href={telHref}
            startIcon={<CallRounded />}
            aria-label={`${t("lead_call")} ${name}`}
            sx={{ ...DASHBOARD_BUTTON_SX, flex: { xs: 1, md: "none" } }}
          >
            {t("lead_call")}
          </Button>
          <Button
            variant="outlined"
            href={whatsAppHref}
            {...NEW_TAB}
            startIcon={<WhatsApp sx={{ color: COLORS.NEW_UI.VERIFIED_GREEN }} />}
            aria-label={`${t("lead_whatsapp")} ${name}`}
            sx={{ ...DASHBOARD_BUTTON_SX, flex: { xs: 1, md: "none" } }}
          >
            {t("lead_whatsapp")}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default LeadRow;
