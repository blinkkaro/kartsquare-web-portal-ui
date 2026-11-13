"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Box, ButtonBase, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useDispatch } from "react-redux";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import { openAiWithQuery } from "@/features/ui/uiSlice";
import { getServiceHref } from "@/utils/serviceRoute";
import { COLORS } from "../../../../constants/colors";
import { type SearchUser, type SearchService } from "../../../../services/search/searchInterface";
import { getUserRole, UserRole } from "../../../../utils/auth";

interface SearchDropdownProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  users: SearchUser[];
  services: SearchService[];
  loading: boolean;
  searchQuery: string;
  onClose: () => void;
  onSeeAll: () => void;
}

const pop = keyframes`from { opacity: 0; transform: translateY(-6px) scale(0.985); } to { opacity: 1; transform: none; }`;

/** Space the panel leaves under itself: the phone dock (56px + 10px gap) plus breathing room. */
const BOTTOM_RESERVE_MOBILE = 56 + 10 + 20;
const BOTTOM_RESERVE_DESKTOP = 20;

/** Bolds the part of `text` that matches what was typed, so the match is easy to spot. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const at = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <Box component="mark" sx={{ bgcolor: "transparent", color: COLORS.PRIMARY_PURPLE, fontWeight: 700 }}>
        {text.slice(at, at + q.length)}
      </Box>
      {text.slice(at + q.length)}
    </>
  );
}

function Row({
  onClick,
  children,
  accent,
}: {
  onClick: () => void;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: "100%",
        justifyContent: "flex-start",
        textAlign: "left",
        gap: 1.5,
        px: 1.5,
        py: 1,
        minHeight: 56,
        borderRadius: "14px",
        transition: "background-color 140ms ease, transform 120ms ease",
        "&:hover, &:focus-visible": { bgcolor: accent ? COLORS.PURPLE_ALPHA_10 : "action.hover" },
        "&:active": { transform: "scale(0.985)" },
        "&:focus-visible": { outline: `2px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: -2 },
        "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:active": { transform: "none" } },
      }}
    >
      {children}
    </ButtonBase>
  );
}

const IconTile = ({ children, filled }: { children: React.ReactNode; filled?: boolean }) => (
  <Box
    sx={{
      width: 40,
      height: 40,
      flexShrink: 0,
      borderRadius: "12px",
      display: "grid",
      placeItems: "center",
      color: filled ? COLORS.WHITE : COLORS.PRIMARY_PURPLE,
      background: filled
        ? `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PURPLE_HOVER})`
        : COLORS.PURPLE_ALPHA_10,
    }}
  >
    {children}
  </Box>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <Typography sx={{ px: 1.5, pt: 1.25, pb: 0.5, fontSize: "0.75rem", fontWeight: 700, color: "text.secondary" }}>
    {children}
  </Typography>
);

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  open,
  anchorEl,
  users,
  services,
  loading,
  searchQuery,
  onClose,
  onSeeAll,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const dark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const update = () => setViewportHeight(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!open || !anchorEl) return null;

  const query = searchQuery.trim();
  const hasResults = users.length > 0 || services.length > 0;

  // The panel ends above the phone dock, never under it.
  const rect = anchorEl.getBoundingClientRect();
  const room = viewportHeight - rect.bottom - 8 - (isMobile ? BOTTOM_RESERVE_MOBILE : BOTTOM_RESERVE_DESKTOP);
  const maxHeight = Math.max(220, Math.min(room, 480));

  const openService = (service: SearchService) => {
    if (getUserRole() === UserRole.SERVICE_PROVIDER) router.push(`/spr/services/${service.id}`);
    else router.push(getServiceHref(service));
    onClose();
  };
  const openUser = (id: string) => {
    dispatch(openDrawer({ userId: id }));
    onClose();
  };
  const askAi = () => {
    dispatch(openAiWithQuery(query));
    onClose();
  };

  return (
    <Box
      role="listbox"
      aria-label="Search suggestions"
      sx={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        right: 0,
        minWidth: { sm: 320 },
        zIndex: 1300,
        maxHeight,
        overflowY: "auto",
        overscrollBehavior: "contain",
        p: 0.75,
        borderRadius: "20px",
        bgcolor: "background.paper",
        color: "text.primary",
        border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(42,13,115,0.08)"}`,
        boxShadow: dark ? "0 18px 44px rgba(0,0,0,0.55)" : "0 18px 44px rgba(42,13,115,0.28)",
        transformOrigin: "top center",
        animation: `${pop} 180ms cubic-bezier(0.22, 1, 0.36, 1)`,
        scrollbarWidth: "thin",
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    >
      {/* Two always-there actions: search everything, or ask Kart AI */}
      {query && (
        <>
          <Row onClick={onSeeAll}>
            <IconTile>
              <SearchRoundedIcon fontSize="small" />
            </IconTile>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography noWrap sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                Search “{query}”
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>All services and people</Typography>
            </Box>
            <ChevronRightRoundedIcon sx={{ color: "text.disabled" }} />
          </Row>
          <Row onClick={askAi} accent>
            <IconTile filled>
              <AutoAwesomeRoundedIcon fontSize="small" />
            </IconTile>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography noWrap sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                Ask Kart AI
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }} noWrap>
                Tell it your problem, it finds the right pro
              </Typography>
            </Box>
            <ChevronRightRoundedIcon sx={{ color: "text.disabled" }} />
          </Row>
        </>
      )}

      {loading && !hasResults ? (
        <Box aria-busy sx={{ px: 1.5, py: 1 }}>
          {[0, 1, 2].map((i) => (
            <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "center", py: 0.9 }}>
              <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: "12px" }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="62%" />
                <Skeleton width="38%" />
              </Box>
            </Box>
          ))}
        </Box>
      ) : !hasResults && query ? (
        <Typography sx={{ px: 1.5, py: 2, fontSize: "0.88rem", color: "text.secondary" }}>
          Nothing found for “{query}”. Try another word, or ask Kart AI.
        </Typography>
      ) : (
        <>
          {services.length > 0 && (
            <>
              <Label>Services</Label>
              {services.map((service) => (
                <Row key={service.id} onClick={() => openService(service)}>
                  <Avatar
                    variant="rounded"
                    src={service.image || undefined}
                    alt=""
                    sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: COLORS.PURPLE_ALPHA_10, color: COLORS.PRIMARY_PURPLE, fontWeight: 700 }}
                  >
                    {service.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography noWrap sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      <Highlight text={service.name} query={query} />
                    </Typography>
                    <Typography noWrap sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                      {service.provider_name ? `by ${service.provider_name}` : "Service"}
                    </Typography>
                  </Box>
                  {service.price > 0 && (
                    <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: COLORS.PRIMARY_PURPLE, flexShrink: 0 }}>
                      ₹{service.price}
                    </Typography>
                  )}
                </Row>
              ))}
            </>
          )}

          {users.length > 0 && (
            <>
              <Label>People</Label>
              {users.map((user) => {
                const name = `${user.first_name} ${user.last_name}`.trim();
                return (
                  <Row key={user.id} onClick={() => openUser(user.id)}>
                    <Avatar src={user.profile_pic || undefined} alt="" sx={{ width: 44, height: 44, bgcolor: COLORS.PURPLE_ALPHA_10, color: COLORS.PRIMARY_PURPLE, fontWeight: 700 }}>
                      {user.first_name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography noWrap sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                        <Highlight text={name} query={query} />
                      </Typography>
                      <Typography noWrap sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                        {[user.type === "SERVICE_PROVIDER" ? "Service provider" : null, user.city].filter(Boolean).join(" · ")}
                      </Typography>
                    </Box>
                  </Row>
                );
              })}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default SearchDropdown;
