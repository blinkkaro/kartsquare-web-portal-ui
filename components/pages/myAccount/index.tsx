"use client";

import React, { useMemo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import { useTheme } from "@mui/material";
import CustomBox from "./components/CustomBox";
import { myAccountNav, myAccountSettingNav } from "@/constants/myAccount";
import { AppUserType } from "@/services/auth/auth.interface";
import ProfileWrapper from "@/components/common/profileWrapper";
function MyAccountView() {
  const theme = useTheme();
  const { t } = useTranslate();
  const role = localStorage.getItem("role");

  const MyAccount = useMemo(
    () => myAccountNav(role as AppUserType, t),
    [role, t]
  );
  const Settings = useMemo(() => myAccountSettingNav(t), [role, t]);
  return (
    <ProfileWrapper>
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            fontWeight: "500",
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("myAccount")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
            gap: 2,
            justifyContent: "flex-start",
            flexWrap: "wrap",
            pt: { xs: 3, md: 5 },
          }}
        >
          {MyAccount.map((item) => (
            <Box
              key={item.label}
              sx={{
                flexBasis: {
                  xs: "100%",
                  sm: "calc(50% - 16px)",
                  lg: "calc(25% - 16px)",
                },
                maxWidth: {
                  xs: "100%",
                  sm: "calc(50% - 16px)",
                  lg: "calc(25% - 16px)",
                },
                flexGrow: 0,
              }}
            >
              <CustomBox icon={item.icon} label={item.label} path={item.href} />
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ mt: 8 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            fontWeight: "500",
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("settings")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
            gap: 2,
            justifyContent: "flex-start",
            flexWrap: "wrap",
            pt: { xs: 3, md: 5 },
          }}
        >
          {Settings.map((item) => (
            <Box
              key={item.label}
              sx={{
                flexBasis: {
                  xs: "100%",
                  sm: "calc(50% - 16px)",
                  lg: "calc(25% - 16px)",
                },
                maxWidth: {
                  xs: "100%",
                  sm: "calc(50% - 16px)",
                  lg: "calc(25% - 16px)",
                },
                flexGrow: 0,
              }}
            >
              <CustomBox icon={item.icon} label={item.label} path={item.href} />
            </Box>
          ))}
        </Box>
      </Box>
    </ProfileWrapper>
  );
}

export default MyAccountView;
