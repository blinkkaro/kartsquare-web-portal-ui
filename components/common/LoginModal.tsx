import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import WarningModel from "./WarningModel";
import { useTranslate } from "@/hooks/useTranslate";
import Button from "@/components/common/Button";
import { closeLoginModal } from "@/features/ui/loginModalSlice";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";

function LoginModal() {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state: any) => state.loginModal);
  const { t } = useTranslate();
  const router = useRouter();
  return (
    <WarningModel
      open={false}
      title={t("auth_required_title")}
      description={t("auth_required_description")}
      ActionsButtons={
        <Box sx={{ display: "flex", gap: 2, width: "100%", mt: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              dispatch(closeLoginModal());
            }}
            sx={{ borderRadius: "50px", py: 1.5 }}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              router.push("/login?role=customer");
              dispatch(closeLoginModal());
            }}
            sx={{ borderRadius: "50px", py: 1.5 }}
          >
            {t("login")}
          </Button>
        </Box>
      }
    />
  );
}

export default LoginModal;
