"use client";
import React, { useRef, useState, useEffect } from "react";
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
import SearchDropdown from "./SearchDropdown";
import { searchService } from "../../../../services/search/searchService";
import { SearchUser, SearchService as SearchServiceType } from "../../../../services/search/searchInterface";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    if (isFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFocused]);

  const handleSeeAll = () => {
    router.push(`/search?q=${encodeURIComponent(search)}`);
    setIsFocused(false);
  };

  const showDropdown =
    isFocused &&
    (search.trim().length > 0 || loading || searchResults.users.length > 0 || searchResults.services.length > 0);

  return (
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
        padding: "0.2rem",
        borderRadius: "25px",
        width: { md: "14rem", lg: "18rem", xl: "22rem" },
      }}
    >
      <InputBase
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
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
            {/* <GradientIcon sx={{ fontSize: "1.25rem", cursor: "pointer" }}>
              <TuneIcon />
            </GradientIcon> */}
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
          onClose={() => setIsFocused(false)}
          onSeeAll={handleSeeAll}
        />
      )}
    </Box>
  );
};

export default SearchBar;
