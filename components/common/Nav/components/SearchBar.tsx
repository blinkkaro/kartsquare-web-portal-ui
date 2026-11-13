"use client";
import React, { useId, useRef, useState, useEffect } from "react";
import {
  Box,
  InputBase,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
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
  /** "nav" is the compact pill in the header (default). "hero" is the large labelled form on the home page. */
  variant?: "nav" | "hero";
  /** hero only: called with the typed text when the form is submitted (Enter or the button). */
  onSubmit?: (query: string) => void;
  /** hero only: the accessible name of the field (also shown to screen readers, never as the only hint). */
  label?: string;
  /** hero only: text of the submit button. */
  submitLabel?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  onSearchChange,
  placeholder,
  variant = "nav",
  onSubmit,
  label = "Search for a service",
  submitLabel = "Search",
}) => {
  const inputId = useId();
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

  if (variant === "hero") {
    return (
      <Box
        component="form"
        role="search"
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          setIsFocused(false);
          onSubmit?.(search);
        }}
        sx={{ width: "100%" }}
      >
        <Box
          component="label"
          htmlFor={inputId}
          sx={{ position: "absolute", width: "1px", height: "1px", margin: "-1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}
        >
          {label}
        </Box>
        <Box
          ref={searchBoxRef}
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 1,
            minHeight: 56,
            pl: 1.75,
            pr: 0.75,
            borderRadius: "16px",
            bgcolor: COLORS.WHITE,
            border: "1px solid",
            borderColor: COLORS.WHITE,
            boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
            transition: "border-color 160ms ease, box-shadow 160ms ease",
            "&:focus-within": {
              borderColor: COLORS.WHITE,
              boxShadow: `0 0 0 3px ${COLORS.SECONDARY_ORANGE}`,
            },
            "@media (prefers-reduced-motion: reduce)": { transition: "none" },
          }}
        >
          <SearchIcon aria-hidden sx={{ color: "text.secondary", fontSize: 22, flexShrink: 0 }} />
          <InputBase
            id={inputId}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            inputProps={{ enterKeyHint: "search", autoComplete: "off", style: { fontSize: 16 } }}
            sx={{ flex: 1, minWidth: 0, minHeight: 48, fontWeight: 500 }}
          />
          <Box
            component="button"
            type="submit"
            sx={{
              all: "unset",
              boxSizing: "border-box",
              cursor: "pointer",
              minHeight: 44,
              px: 2.25,
              display: "flex",
              alignItems: "center",
              borderRadius: "12px",
              bgcolor: COLORS.PRIMARY_PURPLE,
              color: COLORS.WHITE,
              fontWeight: 700,
              fontSize: "0.92rem",
              flexShrink: 0,
              transition: "background-color 160ms ease",
              "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
              "&:focus-visible": { outline: `3px solid ${COLORS.PURPLE_ALPHA_30}`, outlineOffset: 2 },
            }}
          >
            {submitLabel}
          </Box>
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
      </Box>
    );
  }

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
