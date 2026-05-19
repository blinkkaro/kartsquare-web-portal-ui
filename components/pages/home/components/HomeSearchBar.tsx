"use client";
import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import {
    Box,
    Typography,
    Button,
    InputBase,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    CircularProgress,
    ClickAwayListener,
    useMediaQuery
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/navigation";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { searchService } from "@/services/search/searchService";
import { SearchResponse } from "@/services/search/searchInterface";
import { COLORS } from "@/constants/colors";
import { getServiceRouteParam } from "@/utils/serviceRoute";

interface HomeSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

const HomeSearchBar = forwardRef(({ value, onChange }: HomeSearchBarProps, ref) => {
    const { t } = useTranslationContext();
    const router = useRouter();
    const [suggestions, setSuggestions] = useState<SearchResponse | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
            setShowSuggestions(true);
        }
    }));

    const fetchSuggestions = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSuggestions(null);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await searchService.search(query, 5);
            if (response.status === "success") {
                setSuggestions(response.data);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (value) {
                fetchSuggestions(value);
            } else {
                setSuggestions(null);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [value, fetchSuggestions]);

    // Ensure suggestions show when value is updated (e.g., from tags)
    useEffect(() => {
        if (value) {
            setShowSuggestions(true);
        }
    }, [value]);

    const isMobile = useMediaQuery(theme => theme.breakpoints.down("sm"));

    const handleSearch = () => {
        if (value.trim()) {
            router.push(`/store?q=${encodeURIComponent(value.trim())}`);
            setShowSuggestions(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <Box sx={{ position: "relative", width: "100%", maxWidth: "600px", zIndex: 11 }}>
            <Paper
                elevation={4}
                component="div"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "white",
                    borderRadius: "50px", // Pill shape
                    p: "6px",
                    pl: 3,
                    width: "100%",
                    boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
                    transition: "transform 0.2s",
                    "&:focus-within": {
                        transform: "scale(1.01)",
                        boxShadow: "0px 12px 30px rgba(0,0,0,0.3)"
                    }
                }}
            >
                <SearchIcon sx={{ color: "text.secondary", fontSize: 24, mr: 1.5 }} />
                <InputBase
                    inputRef={inputRef}
                    placeholder={isMobile ? "Search..." : t("home_banner_search_placeholder")}
                    sx={{
                        flex: 1,
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        color: "black",
                        "& input::placeholder": {
                            opacity: 0.7
                        }
                    }}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onKeyDown={handleKeyPress}
                    onFocus={() => setShowSuggestions(true)}
                />
                <Button
                    variant="contained"
                    startIcon={<AutoAwesomeIcon sx={{ mr: isMobile ? -1 : 0 }} />}
                    onClick={handleSearch}
                    sx={{
                        borderRadius: "30px",
                        background: "linear-gradient(135deg, #6C5DD3 0%, #4D3CC1 100%)",
                        textTransform: "none",
                        boxShadow: "0 4px 15px rgba(108, 93, 211, 0.4)",
                        px: isMobile ? 1.5 : 3,
                        py: isMobile ? 0.8 : 1.2,
                        fontSize: isMobile ? "0.85rem" : "0.95rem",
                        fontWeight: 600,
                        minWidth: isMobile ? "40px" : "120px",
                        "&:hover": {
                            background: "linear-gradient(135deg, #7A6BE0 0%, #5E4DD8 100%)",
                            boxShadow: "0 6px 20px rgba(108, 93, 211, 0.6)",
                        }
                    }}
                >
                    {!isMobile && t("home_banner_search_button")}
                </Button>
            </Paper>

            {/* Suggestions Dropdown */}
            {showSuggestions && (value.trim() || isSearching) && (
                <Paper
                    sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        mt: 1,
                        borderRadius: "20px",
                        overflow: "hidden",
                        zIndex: 1000,
                        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                        bgcolor: "white",
                        maxHeight: "400px",
                        overflowY: "auto",
                    }}
                >
                    <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
                        <List sx={{ p: 0 }}>
                            {isSearching && (
                                <ListItem sx={{ py: 2, justifyContent: "center" }}>
                                    <CircularProgress size={24} sx={{ color: COLORS.PRIMARY_PURPLE }} />
                                </ListItem>
                            )}

                            {!isSearching && suggestions && (suggestions.services.length > 0 || suggestions.users.length > 0) ? (
                                <>
                                    {suggestions.services.map((service) => (
                                        <ListItem
                                            key={service.id}
                                            onClick={() => {
                                                onChange(service.name);
                                                const serviceRoute = getServiceRouteParam(service);
                                                router.push(`/services/${serviceRoute}`);
                                                setShowSuggestions(false);
                                            }}
                                            sx={{
                                                cursor: "pointer",
                                                "&:hover": { bgcolor: "rgba(108, 93, 211, 0.05)" }
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={service.image} variant="rounded">
                                                    <SearchIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={service.name}
                                                secondary={service.provider_name}
                                                primaryTypographyProps={{ fontWeight: 600, color: "text.primary" }}
                                            />
                                        </ListItem>
                                    ))}
                                    {suggestions.users.map((user) => (
                                        <ListItem
                                            key={user.id}
                                            onClick={() => {
                                                const fullName = `${user.first_name} ${user.last_name}`;
                                                onChange(fullName);
                                                router.push(`/store?q=${encodeURIComponent(fullName)}`);
                                                setShowSuggestions(false);
                                            }}
                                            sx={{
                                                cursor: "pointer",
                                                "&:hover": { bgcolor: "rgba(108, 93, 211, 0.05)" }
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={user.profile_pic}>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${user.first_name} ${user.last_name}`}
                                                secondary={user.city || "Service Provider"}
                                                primaryTypographyProps={{ fontWeight: 600, color: "text.primary" }}
                                            />
                                        </ListItem>
                                    ))}
                                </>
                            ) : (
                                !isSearching && value.trim() && (
                                    <ListItem sx={{ py: 3 }}>
                                        <ListItemText
                                            primary={t("no_services_found" as any) || "No related service found"}
                                            sx={{ textAlign: "center", color: "text.secondary" }}
                                        />
                                    </ListItem>
                                )
                            )}
                        </List>
                    </ClickAwayListener>
                </Paper>
            )}
        </Box>
    );
});

export default HomeSearchBar;
