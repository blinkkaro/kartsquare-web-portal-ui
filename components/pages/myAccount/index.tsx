"use client";

import React, { useState, useMemo } from "react";
import { Box, Grid } from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import CustomBox from "./components/CustomBox";
import { myAccountNav, myAccountSettingNav } from "@/constants/myAccount";
import { AppUserType } from "@/services/auth/auth.interface";
import ProfileWrapper from "@/components/common/profile/profileWrapper";
import WarningModel from "@/components/common/WarningModel";
import Button from "@/components/common/Button";
import { useLogout } from "@/hooks/useLogout";
import ChangePassword from "./components/changePassword";
import RightDrawer from "@/components/common/RightDrawer";
import { secureStorage } from "@/helper/SecureStorage";
import PostModel from "./components/post/postModel";
import PageHeading from "@/components/common/PageHeading";

function MyAccountView() {
  const { t } = useTranslate();
  const role = secureStorage.getItem("role");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isPostsModalOpen, setIsPostsModalOpen] = useState(false);

  const { handleLogout } = useLogout();

  const MyAccount = useMemo(
    () => myAccountNav(role as AppUserType, t),
    [role, t],
  );
  const Settings = useMemo(() => myAccountSettingNav(t), [role, t]);

  const onLogoutClick = async () => {
    await handleLogout();
  };

  return (
    <ProfileWrapper showProfileOnMobile={true}>
      <Box>
        <PageHeading title={t("myAccount")} />
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
                  xs: "calc(50% - 8px)",
                  sm: "calc(50% - 16px)",
                  lg: "calc(25% - 16px)",
                },
                maxWidth: {
                  xs: "calc(50% - 8px)",
                  sm: "calc(50% - 16px)",
                  lg: "calc(25% - 16px)",
                },
                flexGrow: 0,
              }}
            >
              <CustomBox
                icon={item.icon}
                label={item.label}
                path={item.href}
                onClick={
                  item.isLogout
                    ? () => setIsLogoutModalOpen(true)
                    : item.isPosts
                      ? () => setIsPostsModalOpen(true)
                      : undefined
                }
              />
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ mt: 8 }}>
        <PageHeading title={t("settings")} />
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
                  xs: "calc(50% - 8px)",
                  sm: "calc(50% - 16px)",
                  lg: "calc(25% - 16px)",
                },
                maxWidth: {
                  xs: "calc(50% - 8px)",
                  sm: "calc(50% - 16px)",
                  lg: "calc(25% - 16px)",
                },
                flexGrow: 0,
              }}
            >
              <CustomBox
                icon={item.icon}
                label={item.label}
                path={item.href}
                onClick={
                  item.isChangePassword
                    ? () => setIsChangePasswordModalOpen(true)
                    : undefined
                }
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Logout Warning Modal */}
      <WarningModel
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title={t("logoutTitle")}
        description={t("logoutDescription")}
        ActionsButtons={
          <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
            <Button
              variant="outlined"
              onClick={() => setIsLogoutModalOpen(false)}
              sx={{
                flex: 1,
                borderColor: "divider",
                color: "text.primary",
              }}
            >
              {t("logoutCancel")}
            </Button>
            <Button
              variant="contained"
              onClick={onLogoutClick}
              sx={{
                flex: 1,
                bgcolor: "error.main",
                color: "white",
                "&:hover": {
                  bgcolor: "error.dark",
                },
              }}
            >
              {t("logoutConfirm")}
            </Button>
          </Box>
        }
      />

      {/* Change Password Modal */}
      <RightDrawer
        open={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        title={t("changePassword")}
        width={800}
      >
        <ChangePassword onClose={() => setIsChangePasswordModalOpen(false)} />
      </RightDrawer>
      <RightDrawer
        open={isPostsModalOpen}
        onClose={() => setIsPostsModalOpen(false)}
        title={t("postReel")}
        width={800}
      >
        <PostModel onClose={() => setIsPostsModalOpen(false)} />
      </RightDrawer>
    </ProfileWrapper>
  );
}

export default MyAccountView;
