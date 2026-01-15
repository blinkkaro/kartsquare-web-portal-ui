"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { COLORS } from "../../../constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleTheme } from "@/features/ui/uiSlice";
import { logout } from "@/features/ui/authSlice";
import {
  getDesktopNavItems,
  getMobileNavItems,
} from "../../../constants/navRoutes";

// Import extracted components
import NavLogo from "./components/NavLogo";
import SearchBar from "./components/SearchBar";
import DesktopNavLinks from "./components/DesktopNavLinks";
import NavActions from "./components/NavActions";
import MobileBottomNav from "./components/MobileBottomNav";
import MobileSearchDrawer from "./components/MobileSearchDrawer";
import NotificationList from "./components/NotificationList";
import RightDrawer from "../RightDrawer";

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? COLORS.BACKGROUND.PAPER_DARK
      : COLORS.BACKGROUND.PAPER_LIGHT,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 1px 3px rgba(0, 0, 0, 0.3)"
      : "0 1px 3px rgba(0, 0, 0, 0.1)",
  borderBottom: `1px solid ${
    theme.palette.mode === "dark"
      ? COLORS.BORDER.DEFAULT_DARK
      : COLORS.BORDER.DEFAULT_LIGHT
  }`,
  zIndex: 1200,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 1rem",
  [theme.breakpoints.up("md")]: {
    padding: "0.5rem 2rem",
  },
  [theme.breakpoints.up("xl")]: {
    padding: "1rem 12rem",
  },
}));

const Nav = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslate();
  const mode = useAppSelector((state) => state.ui.mode);
  const dispatch = useAppDispatch();
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // Local state
  const [role, setRole] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get navigation items
  const desktopNavItems = useMemo(() => getDesktopNavItems(role, t), [role, t]);
  const mobileNavItems = useMemo(
    () => getMobileNavItems(isAuthenticated, t),
    [isAuthenticated, t]
  );

  // Initialize auth state
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    setIsAuthenticated(!!token);
    setRole(userRole);
  }, []);

  // Handlers
  const handleProfileClick = () => {
    router.push("/myAccount");
  };

  const handleLogin = () => {
    router.push("/selectRole");
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen((prev) => !prev);
  };

  const toggleNotificationDrawer = () => {
    setShowNotificationDrawer((prev) => !prev);
  };

  return (
    <>
      <StyledAppBar position="fixed" elevation={0}>
        <StyledToolbar>
          {/* Left Section: Logo and Search */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <NavLogo isMobile={isMobile} mode={mode} />

            {!isMobile && !isTablet && (
              <SearchBar
                search={search}
                onSearchChange={handleSearchChange}
                placeholder={t("search")}
              />
            )}
          </Box>

          {/* Right Section: Navigation Links and Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <DesktopNavLinks
              items={desktopNavItems}
              currentPath={pathname}
              mode={mode}
            />

            <NavActions
              isAuthenticated={isAuthenticated}
              isMobile={isMobile}
              isTablet={isTablet}
              mode={mode}
              onThemeToggle={handleThemeToggle}
              onSearchToggle={toggleMobileSearch}
              profileClick={handleProfileClick}
              onLogin={handleLogin}
              loginText={t("login")}
              onNotificationToggle={toggleNotificationDrawer}
            />
          </Box>

          {/* Mobile Bottom Navigation */}
          {(isMobile || isTablet) && (
            <MobileBottomNav items={mobileNavItems} currentPath={pathname} />
          )}
        </StyledToolbar>
      </StyledAppBar>

      {/* Mobile Search Drawer */}
      {(isMobile || isTablet) && (
        <MobileSearchDrawer
          isOpen={mobileSearchOpen}
          search={search}
          onSearchChange={handleSearchChange}
          onClose={() => setMobileSearchOpen(false)}
          placeholder={t("search")}
        />
      )}

      {/* Notification Drawer */}
      <RightDrawer
        open={showNotificationDrawer}
        onClose={() => setShowNotificationDrawer(false)}
        title={t("notifications")}
        width={500}
      >
        <NotificationList onClose={() => setShowNotificationDrawer(false)} />
      </RightDrawer>
    </>
  );
};

export default Nav;
