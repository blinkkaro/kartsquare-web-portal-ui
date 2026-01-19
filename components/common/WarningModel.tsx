"use client";
import React, { ReactNode } from "react";
import {
  Dialog,
  Box,
  Typography,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface SuccessModelProps {
  open: boolean;
  onClose?: () => void;
  title: ReactNode;
  description?: ReactNode;
  ActionsButtons?: ReactNode;
  icon?: string;
}

const WarningModel: React.FC<SuccessModelProps> = ({
  open,
  onClose,
  title,
  description,
  ActionsButtons,
  icon = "/warning.svg",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="success-modal-description"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          padding: "2rem 5rem",
          maxWidth: "30rem",
          width: "100%",
          boxShadow: "0px 10px 40px rgba(0,0,0,0.1)",
          margin: "16px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 2,
          py: 2,
        }}
      >
        {/* Success Icon */}
        <Box sx={{ position: "relative", width: 80, height: 80, mb: 1 }}>
          <Image
            src={icon}
            alt="Success"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>

        {/* Title Section */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.3,
              fontSize: "1.8rem",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Description Section */}
        {description && (
          <Box sx={{ mb: 2 }}>
            {typeof description === "string" ? (
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.5,
                  maxWidth: "90%",
                  mx: "auto",
                }}
              >
                {description}
              </Typography>
            ) : (
              description
            )}
          </Box>
        )}

        {/* Action Button */}
        {ActionsButtons}
      </Box>
    </Dialog>
  );
};

export default WarningModel;
