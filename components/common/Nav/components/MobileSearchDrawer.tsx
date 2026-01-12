import React from "react";
import {
  Box,
  InputBase,
  InputAdornment,
  Slide,
  styled,
  useTheme,
} from "@mui/material";
import { Search as SearchIcon, Tune as TuneIcon } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";
import GradientIcon from "../../GradientIcon";

const MobileSearchSlider = styled(Box)(({ theme }) => ({
  padding: "1.5rem",
  backgroundColor:
    theme.palette.mode === "dark"
      ? COLORS.BACKGROUND.PAPER_DARK
      : COLORS.BACKGROUND.PAPER_LIGHT,
  borderBottomLeftRadius: "20px",
  borderBottomRightRadius: "20px",
}));

interface MobileSearchDrawerProps {
  isOpen: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onClose: () => void;
  placeholder: string;
}

const MobileSearchDrawer: React.FC<MobileSearchDrawerProps> = ({
  isOpen,
  search,
  onSearchChange,
  onClose,
  placeholder,
}) => {
  const theme = useTheme();

  return (
    <>
      {isOpen && (
        <Box
          onClick={onClose}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        />
      )}
      <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
        <MobileSearchSlider
          sx={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 1100,
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? COLORS.BACKGROUND.PRIMARY_DARK
                  : COLORS.BACKGROUND.PRIMARY_LIGHT,
              padding: "0.5rem",
              borderRadius: "25px",
            }}
          >
            <InputBase
              placeholder={placeholder}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
              sx={{
                width: "100%",
                padding: "0 0.5rem",
                fontSize: "1rem",
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <GradientIcon sx={{ fontSize: "1.25rem", cursor: "pointer" }}>
                    <TuneIcon />
                  </GradientIcon>
                </InputAdornment>
              }
            />
          </Box>
        </MobileSearchSlider>
      </Slide>
    </>
  );
};

export default MobileSearchDrawer;
