"use client";
import React, { useRef, useState, useEffect } from "react";
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
import SearchDropdown from "./SearchDropdown";
import { searchService } from "../../../../services/search/searchService";
import { SearchUser, SearchService as SearchServiceType } from "../../../../services/search/searchInterface";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<{
    users: SearchUser[];
    services: SearchServiceType[];
  }>({ users: [], services: [] });
  const [loading, setLoading] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (search.trim().length === 0) {
      setSearchResults({ users: [], services: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await searchService.search(search, 5, 1);
        if (response.status === "success") {
          setSearchResults({
            users: response.data.users || [],
            services: response.data.services || [],
          });
        } else {
          setSearchResults({ users: [], services: [] });
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults({ users: [], services: [] });
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [search]);

  const handleSeeAll = () => {
    router.push(`/search?q=${encodeURIComponent(search)}`);
    onClose();
  };

  const showDropdown =
    isOpen &&
    search.trim().length > 0 &&
    (loading || searchResults.users.length > 0 || searchResults.services.length > 0);

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
            ref={searchBoxRef}
            sx={{
              position: "relative",
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
            {showDropdown && (
              <SearchDropdown
                open={showDropdown}
                anchorEl={searchBoxRef.current}
                users={searchResults.users}
                services={searchResults.services}
                loading={loading}
                searchQuery={search}
                onClose={onClose}
                onSeeAll={handleSeeAll}
              />
            )}
          </Box>
        </MobileSearchSlider>
      </Slide>
    </>
  );
};

export default MobileSearchDrawer;
