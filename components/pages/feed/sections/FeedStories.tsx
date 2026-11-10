"use client";
import React, { useMemo, useRef, useState } from "react";
import { Avatar, Box, ButtonBase, Skeleton, Typography, useTheme } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import toast from "react-hot-toast";
import { COLORS } from "@/constants/colors";
import { useAddStory, useGetStories } from "@/hooks/useStories";
import { MediaType, StoriesList } from "@/services/stories/stories.interface";
import StoryViewer from "@/components/pages/home/components/stories/StoryViewer";
import AddStoryModal from "@/components/pages/home/components/stories/AddStoryModal";

const RING = `conic-gradient(${COLORS.ICON_GRADIENT.Light.START}, ${COLORS.ICON_GRADIENT.Light.END}, ${COLORS.ICON_GRADIENT.Light.START})`;

interface FeedStoriesProps {
  currentUser: { id?: string; profile_pic?: string | null; first_name?: string; business_name?: string } | null;
}

interface StoryBubbleProps {
  size: number;
  label: string;
  ariaLabel: string;
  onClick: () => void;
  children: React.ReactNode;
}

function StoryBubble({ size, label, ariaLabel, onClick, children }: StoryBubbleProps) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-label={ariaLabel}
      sx={{ flexShrink: 0, width: size + 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.75, borderRadius: "12px", py: 0.5 }}
    >
      {children}
      <Typography sx={{ fontSize: "0.72rem", color: "text.primary", maxWidth: size + 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </Typography>
    </ButtonBase>
  );
}

const storyName = (s: StoriesList) => s.business_name?.trim() || s.user_name?.trim() || s.user_username || "Story";

/**
 * Stories row: the user's own story first (with + to add), then people with
 * unseen stories, then seen ones (grey ring). Signed-in users only — the
 * stories API requires a login.
 */
export default function FeedStories({ currentUser }: FeedStoriesProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { data, isLoading } = useGetStories({ page: 1, limit: 20 });
  const { mutate: addStory, isPending } = useAddStory();

  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.IMAGE);
  const fileInput = useRef<HTMLInputElement>(null);

  const { own, others, viewerList } = useMemo(() => {
    const all = data?.pages.flatMap((p) => p.stories) ?? [];
    const mine = all.find((s) => s.user_id === currentUser?.id) ?? null;
    const rest = all.filter((s) => s.user_id !== currentUser?.id);
    const unseen = rest.filter((s) => s.stories.some((x) => !x.is_visited));
    const seen = rest.filter((s) => !s.stories.some((x) => !x.is_visited));
    const sorted = [...unseen, ...seen];
    return { own: mine, others: sorted, viewerList: mine ? [mine, ...sorted] : sorted };
  }, [data, currentUser?.id]);

  const pickMedia = (type: MediaType) => {
    setMediaType(type);
    if (fileInput.current) {
      fileInput.current.accept = type === MediaType.VIDEO ? "video/*" : "image/png,image/jpeg";
      fileInput.current.click();
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    const ok = mediaType === MediaType.VIDEO ? picked.type.startsWith("video/") : ["image/png", "image/jpeg", "image/jpg"].includes(picked.type);
    if (!ok) {
      toast.error(mediaType === MediaType.VIDEO ? "Please choose a video file." : "Please choose a JPG or PNG photo.");
      return;
    }
    setFile(picked);
    setAddOpen(true);
  };

  const share = (caption: string) => {
    if (!file) return;
    addStory(
      { media: file, caption, media_type: mediaType },
      {
        onSuccess: () => toast.success("Story added"),
        onError: () => toast.error("Couldn't add your story. Please try again."),
      },
    );
    setAddOpen(false);
    setFile(null);
  };

  const border = dark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT;
  const size = 60;

  const ringed = (src: string | null | undefined, name: string, unseen: boolean) => (
    <Box sx={{ p: "2.5px", borderRadius: "50%", background: unseen ? RING : dark ? COLORS.NEW_UI.DIVIDER_DARK : COLORS.NEW_UI.DIVIDER_LIGHT }}>
      <Box sx={{ p: "2px", borderRadius: "50%", bgcolor: "background.paper" }}>
        <Avatar src={src || undefined} alt={name} sx={{ width: size - 9, height: size - 9, fontWeight: 800, bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10, color: dark ? COLORS.NEW_UI.CHIP_TEXT_DARK : COLORS.PRIMARY_PURPLE }}>
          {name.charAt(0).toUpperCase()}
        </Avatar>
      </Box>
    </Box>
  );

  const myName = currentUser?.business_name || currentUser?.first_name || "You";

  return (
    <Box
      component="section"
      aria-label="Stories"
      sx={{
        bgcolor: "background.paper",
        // Edge-to-edge band on phones, a card from tablet up.
        border: { xs: "none", sm: `1px solid ${border}` },
        borderBottom: `1px solid ${border}`,
        borderRadius: { xs: 0, sm: "16px" },
        boxShadow: { xs: "none", sm: dark ? COLORS.NEW_UI.CARD_SHADOW_DARK : COLORS.NEW_UI.CARD_SHADOW_LIGHT },
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1.25, sm: 2 },
      }}
    >
      <Box sx={{ display: "flex", gap: { xs: 1, sm: 1.5 }, overflowX: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
        {/* Your story: view it if you have one, otherwise add one */}
        <StoryBubble
          size={size}
          label="Your story"
          ariaLabel={own ? "View your story" : "Add a story"}
          onClick={() => (own ? setViewerIndex(0) : pickMedia(MediaType.IMAGE))}
        >
          <Box sx={{ position: "relative" }}>
            {own ? (
              ringed(currentUser?.profile_pic, myName, true)
            ) : (
              <Avatar src={currentUser?.profile_pic || undefined} alt={myName} sx={{ width: size, height: size, fontWeight: 800, bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10, color: dark ? COLORS.NEW_UI.CHIP_TEXT_DARK : COLORS.PRIMARY_PURPLE }}>
                {myName.charAt(0).toUpperCase()}
              </Avatar>
            )}
            <Box
              role="button"
              aria-label="Add to your story"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                pickMedia(MediaType.IMAGE);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  pickMedia(MediaType.IMAGE);
                }
              }}
              sx={{ position: "absolute", right: -2, bottom: -2, width: 22, height: 22, borderRadius: "50%", bgcolor: COLORS.PRIMARY_PURPLE, color: COLORS.WHITE, border: "2px solid", borderColor: "background.paper", display: "grid", placeItems: "center", cursor: "pointer" }}
            >
              <AddRoundedIcon sx={{ fontSize: 16 }} />
            </Box>
          </Box>
        </StoryBubble>

        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Box key={i} sx={{ flexShrink: 0, width: size + 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.75 }}>
                <Skeleton variant="circular" width={size} height={size} />
                <Skeleton variant="text" width={size - 8} />
              </Box>
            ))
          : others.map((s, i) => {
              const name = storyName(s);
              const unseen = s.stories.some((x) => !x.is_visited);
              return (
                <StoryBubble
                  key={s.user_id}
                  size={size}
                  label={name}
                  ariaLabel={`View ${name}'s story`}
                  onClick={() => setViewerIndex(own ? i + 1 : i)}
                >
                  {ringed(s.user_profile_image, name, unseen)}
                </StoryBubble>
              );
            })}
      </Box>

      {viewerIndex !== null && viewerList.length > 0 && (
        <StoryViewer storiesList={viewerList} initialUserIndex={viewerIndex} onClose={() => setViewerIndex(null)} />
      )}
      <AddStoryModal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          setFile(null);
        }}
        onAddPhoto={() => pickMedia(MediaType.IMAGE)}
        onAddVideo={() => pickMedia(MediaType.VIDEO)}
        file={file}
        mediaType={mediaType}
        onShare={share}
        isLoading={isPending}
      />
      <input ref={fileInput} type="file" hidden onChange={onFile} />
    </Box>
  );
}
