import React from "react";
import {
  Box,
  InputBase,
  InputAdornment,
  styled,
  useTheme,
} from "@mui/material";
import { Search as SearchIcon, Tune as TuneIcon } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";
import GradientIcon from "../../GradientIcon";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  onSearchChange,
  placeholder,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        backgroundColor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.PRIMARY_LIGHT,
        padding: "0.2rem",
        borderRadius: "25px",
        width: "20rem",
      }}
    >
      <InputBase
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          width: "100%",
          padding: "0 0.5rem",
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
  );
};

export default SearchBar;
