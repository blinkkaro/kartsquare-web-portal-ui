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
      open={isOpen}
      title={t("auth_required_title")}
      description={t("auth_required_description")}
      ActionsButtons={
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              router.push("/selectRole");
              dispatch(closeLoginModal());
            }}
          >
            {t("login")}    
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              dispatch(closeLoginModal());
            }}
          >
            {t("cancel")}    
          </Button>
        </Box>
      }
    />
  );
}

export default LoginModal;
