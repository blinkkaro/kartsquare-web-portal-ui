import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Stack,
  useTheme,
  Skeleton,
  Badge,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import StoryViewer from "./stories/StoryViewer";
import AddStoryModal from "./stories/AddStoryModal";
import { useAppSelector } from "@/store/hooks";
import { InfiniteData } from "@tanstack/react-query";
import {
  StoriesList,
  StoriesListResponse,
  StoryItem,
} from "@/services/stories/stories.interface";
import { useAddStory } from "@/hooks/useStories";
import { MediaType } from "@/services/stories/stories.interface";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { secureStorage } from "@/helper/SecureStorage";

const StoriesSection = ({
  data,
  isLoading,
}: {
  data: InfiniteData<StoriesListResponse> | undefined;
  isLoading: boolean;
}) => {
  const theme = useTheme();
  const profile = secureStorage.getItem("user_details");
  const { t } = useTranslationContext();

  const [viewerOpen, setViewerOpen] = useState(false);
  const [addStoryOpen, setAddStoryOpen] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.IMAGE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { mutate: addStory, isPending } = useAddStory();

  const handleAddMedia = (type: MediaType) => {
    setMediaType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept =
        type === MediaType.VIDEO ? "video/*" : "image/*";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type: Only png or jpg/jpeg
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (mediaType === MediaType.IMAGE && !allowedTypes.includes(file.type)) {
        alert(t("invalidFileType"));
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Validate video type if needed
      if (mediaType === MediaType.VIDEO && !file.type.startsWith("video/")) {
        alert(t("something_went_wrong"));
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setSelectedFile(file);
      setAddStoryOpen(true);
    }
  };

  const handleCompleteStory = (caption: string) => {
    if (selectedFile) {
      addStory({
        media: selectedFile,
        caption: caption,
        media_type: mediaType,
      });
      setAddStoryOpen(false);
      setSelectedFile(null);
    }
  };

  const handleCloseModal = () => {
    setAddStoryOpen(false);
    setSelectedFile(null);
  };

  const storiesList = data?.pages.flatMap((page) => page.stories) || [];

  const hasUnseenStories = (stories: StoryItem[]) => {
    return stories.some((s) => !s.is_visited);
  };

  // Sort stories: User story first, then unseen other stories, then seen other stories
  const userStory = storiesList.find((story) => story.user_id === profile?.id);
  const otherStories = storiesList.filter(
    (story) => story.user_id !== profile?.id
  );

  const unseenOtherStories = otherStories.filter((s) =>
    hasUnseenStories(s.stories)
  );
  const seenOtherStories = otherStories.filter(
    (s) => !hasUnseenStories(s.stories)
  );

  const sortedOtherStories = [...unseenOtherStories, ...seenOtherStories];

  // Combined list for the viewer: User's story (if exists) + sorted others
  const viewerStoriesList = userStory
    ? [userStory, ...sortedOtherStories]
    : sortedOtherStories;

  const handleStoryClick = (index: number) => {
    setSelectedUserIndex(index);
    setViewerOpen(true);
  };

  const handleUserItemClick = () => {
    if (!userStory) {
      setAddStoryOpen(true);
    } else {
      handleStoryClick(0);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
        }}
      >
        {/* Loading Skeletons */}
        {isLoading &&
          Array.from(new Array(5)).map((_, index) => (
            <Stack
              key={index}
              alignItems="center"
              spacing={1}
              sx={{ minWidth: 64 }}
            >
              <Skeleton variant="circular" width={56} height={56} />
              <Skeleton variant="text" width={40} />
            </Stack>
          ))}

        {!isLoading && (
          <>
            {/* Current User Item */}
            {profile && (
              <Stack
                alignItems="center"
                spacing={1}
                sx={{
                  minWidth: 64,
                  cursor: "pointer",
                  position: "relative",
                  marginRight: 1,
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <Box
                      sx={{
                        bgcolor: COLORS.PRIMARY_PURPLE,
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `2px solid ${theme.palette.background.paper}`,
                      }}
                    >
                      <Add
                        sx={{ color: "white", fontSize: 14 }}
                        onClick={() => setAddStoryOpen(true)}
                      />
                    </Box>
                  }
                >
                  <Box
                    sx={{
                      p: 0.3,
                      borderRadius: "50%",
                      background:
                        userStory && hasUnseenStories(userStory.stories)
                          ? `linear-gradient(135deg, ${
                              theme.palette.mode === "dark"
                                ? COLORS.ICON_GRADIENT.Dark.START
                                : COLORS.ICON_GRADIENT.Light.START
                            } 0%, ${
                              theme.palette.mode === "dark"
                                ? COLORS.ICON_GRADIENT.Dark.END
                                : COLORS.ICON_GRADIENT.Light.END
                            } 100%)`
                          : "transparent",
                      border:
                        userStory && !hasUnseenStories(userStory.stories)
                          ? `2px solid ${
                              theme.palette.mode === "dark"
                                ? COLORS.BORDER.DEFAULT_DARK
                                : COLORS.BORDER.HOVER_LIGHT
                            }`
                          : "none",
                    }}
                  >
                    <Avatar
                      src={profile.profile_pic}
                      alt={t("yourStory")}
                      sx={{
                        width: 56,
                        height: 56,
                        border: `2px solid ${theme.palette.background.paper}`,
                      }}
                      onClick={handleUserItemClick}
                    />
                  </Box>
                </Badge>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.7rem",
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                    color: theme.palette.text.primary,
                  }}
                >
                  {t("yourStory")}
                </Typography>
              </Stack>
            )}

            {/* Other Users' Stories */}
            {sortedOtherStories.map((storyUser, index) => {
              const unseen = hasUnseenStories(storyUser.stories);
              return (
                <Stack
                  key={storyUser.user_id}
                  alignItems="center"
                  spacing={1}
                  sx={{ minWidth: 64, cursor: "pointer" }}
                  onClick={() =>
                    handleStoryClick(userStory ? index + 1 : index)
                  }
                >
                  <Box
                    sx={{
                      p: 0.3,
                      borderRadius: "50%",
                      background: unseen
                        ? `linear-gradient(135deg, ${
                            theme.palette.mode === "dark"
                              ? COLORS.ICON_GRADIENT.Dark.START
                              : COLORS.ICON_GRADIENT.Light.START
                          } 0%, ${
                            theme.palette.mode === "dark"
                              ? COLORS.ICON_GRADIENT.Dark.END
                              : COLORS.ICON_GRADIENT.Light.END
                          } 100%)`
                        : "transparent",
                      border: !unseen
                        ? `2px solid ${
                            theme.palette.mode === "dark"
                              ? COLORS.BORDER.DEFAULT_DARK
                              : COLORS.BORDER.HOVER_LIGHT
                          }`
                        : "none",
                    }}
                  >
                    <Avatar
                      src={storyUser.user_profile_image}
                      alt={storyUser.user_name}
                      sx={{
                        width: 56,
                        height: 56,
                        border: `2px solid ${theme.palette.background.paper}`,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.7rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {storyUser.user_name}
                  </Typography>
                </Stack>
              );
            })}
          </>
        )}
      </Box>

      {viewerOpen && viewerStoriesList.length > 0 && (
        <StoryViewer
          storiesList={viewerStoriesList}
          initialUserIndex={selectedUserIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}

      <AddStoryModal
        open={addStoryOpen}
        onClose={handleCloseModal}
        onAddPhoto={() => handleAddMedia(MediaType.IMAGE)}
        onAddVideo={() => handleAddMedia(MediaType.VIDEO)}
        file={selectedFile}
        mediaType={mediaType}
        onShare={handleCompleteStory}
        isLoading={isPending}
      />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default StoriesSection;
