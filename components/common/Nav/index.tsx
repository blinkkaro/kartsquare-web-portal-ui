"use client";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import { useAppSelector } from "@/store/hooks";
import {
  getDesktopNavItems,
  getMobileNavItems,
  getProviderDockItems,
} from "../../../constants/navRoutes";
import { AppUserType } from "@/services/auth/auth.interface";
import { publicProfilePath } from "@/lib/providerDashboard";

// Import extracted components
import NavLogo from "./components/NavLogo";
import LocationChip from "../Ai/components/LocationChip";
import { useAILocation } from "../Ai/useAILocation";
import SearchBar from "./components/SearchBar";
import DesktopNavLinks from "./components/DesktopNavLinks";
import NavActions from "./components/NavActions";
import MobileBottomNav from "./components/MobileBottomNav";
import ProviderBottomNav from "./components/ProviderBottomNav";
import MobileSearchDrawer from "./components/MobileSearchDrawer";
import NotificationList from "./components/NotificationList";
import RightDrawer from "../RightDrawer";
import { secureStorage } from "@/helper/SecureStorage";
import {
  selectIsAuthenticated,
  selectCurrentUser,
} from "@/features/ui/authSlice";

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
  width: "100%",
  maxWidth: 1680,
  margin: "0 auto",
  padding: "0.75rem 1rem",
  [theme.breakpoints.up("sm")]: {
    padding: "0.75rem 1.25rem",
  },
  [theme.breakpoints.up("md")]: {
    padding: "0.5rem 1.75rem",
    gap: "1.25rem",
  },
  [theme.breakpoints.up("lg")]: {
    padding: "0.5rem 2.25rem",
    gap: "1.75rem",
  },
  [theme.breakpoints.up("xl")]: {
    padding: "0.5rem 2.5rem",
    gap: "2.25rem",
  },
}));

const Nav = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { location, setLocation, locateMe, locating, locateError } = useAILocation();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslate();
  const mode = useAppSelector((state) => state.ui.mode);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const appBarRef = useRef<HTMLElement>(null);
  const [appBarHeight, setAppBarHeight] = useState(0);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const role = user?.role || null;

  // Local state
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Get navigation items
  const desktopNavItems = useMemo(() => getDesktopNavItems(role, t), [role, t]);
  const mobileNavItems = useMemo(
    () => getMobileNavItems(isAuthenticated, t, role),
    [isAuthenticated, t, role],
  );

  const isProviderDock = isAuthenticated && role === AppUserType.SERVICE_PROVIDER;
  const providerUsername = (secureStorage.getItem("user_details") as { username?: string } | null)?.username;
  const providerDock = useMemo(
    () => getProviderDockItems(t, publicProfilePath(providerUsername)),
    [t, providerUsername],
  );

  // Handlers
  const handleProfileClick = () => {
    router.push("/myAccount");
  };

  const handleLogin = () => {
    router.push("/login?role=customer");
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

  const handleFreeListingClick = () => {
    router.push("/business-listing");
  };

  // Measure the fixed AppBar's real rendered height (it varies by breakpoint/content
  // wrapping) and reserve exactly that much space via a spacer, instead of guessing
  // per-breakpoint margin-top values that drift out of sync and let content slide
  // underneath the fixed header.
  useLayoutEffect(() => {
    const node = appBarRef.current;
    if (!node) return;

    const updateHeight = () => setAppBarHeight(node.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, [isMobile, isTablet]);

  return (
    <>
      <StyledAppBar position="fixed" elevation={0} ref={appBarRef}>
        <StyledToolbar>
          {/* Left Section: Logo and Search */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: "0.5rem", sm: "1rem", lg: "1.5rem" }, minWidth: 0 }}>
            <NavLogo isMobile={isMobile} mode={mode} />

            {/* Which city results are for (Jaipur by default) — one picker for the whole app. */}
            <Box sx={{ minWidth: 0, maxWidth: { xs: 168, sm: 220 }, flexShrink: 1 }}>
              <LocationChip
                location={location}
                onChange={setLocation}
                onUseCurrent={() => locateMe()}
                locating={locating}
                error={locateError}
              />
            </Box>

            {!isMobile && !isTablet && (
              <SearchBar
                search={search}
                onSearchChange={handleSearchChange}
                placeholder={t("search")}
              />
            )}
          </Box>

          {/* Right Section: Navigation Links and Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { md: "0.5rem", lg: "1.5rem" },
            }}
          >
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
              onSearchToggle={toggleMobileSearch}
              profileClick={handleProfileClick}
              onLogin={handleLogin}
              loginText={t("login")}
              onNotificationToggle={toggleNotificationDrawer}
              onFreeListingClick={handleFreeListingClick}
              // The home hero has the page's search, so the header drops its own there (phones/tablets only).
              homeCompact={pathname === "/"}
            />
          </Box>

          {/* Mobile Bottom Navigation */}
          {(isMobile || isTablet) &&
            (isProviderDock ? (
              <ProviderBottomNav primary={providerDock.primary} more={providerDock.more} currentPath={pathname} />
            ) : (
              <MobileBottomNav items={mobileNavItems} currentPath={pathname} />
            ))}
        </StyledToolbar>
      </StyledAppBar>

      {/* Reserves the exact space the fixed AppBar occupies so page content never
          slides underneath it, regardless of breakpoint or content wrapping. */}
      <Box sx={{ height: appBarHeight }} />

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
