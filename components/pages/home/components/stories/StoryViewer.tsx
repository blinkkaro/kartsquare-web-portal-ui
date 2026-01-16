import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { StoriesList, MediaType } from "@/services/stories/stories.interface";
import StoryProgressBar from "./StoryProgressBar";
import StoryMedia from "./StoryMedia";
import { Close, HeatPumpRounded, MoreVert, Send } from "@mui/icons-material";
import { useViewStory, useDeleteStory } from "@/hooks/useStories";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { secureStorage } from "@/helper/SecureStorage";

interface StoryViewerProps {
  storiesList: StoriesList[];
  initialUserIndex: number;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  storiesList,
  initialUserIndex,
  onClose,
}) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { mutate: viewStory } = useViewStory();
  const { mutate: deleteStory } = useDeleteStory();
  const profile = secureStorage.getItem("user_details");
  const { t } = useTranslationContext();

  const currentUser = storiesList[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];

  const isOwnStory = profile?.id === currentUser?.user_id;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setIsPaused(true);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setIsPaused(false);
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setAnchorEl(null);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (currentStory) {
      deleteStory(currentStory.story_id);
      setDeleteConfirmOpen(false);
      setIsPaused(false);
      // If it's the last story of the user, handleNext will close or switch user
      handleNext();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setIsPaused(false);
  };

  // Set initial story index to the first unseen story for the initial user
  useEffect(() => {
    if (currentUserIndex === initialUserIndex) {
      const firstUnseenIndex = currentUser.stories.findIndex(
        (s) => !s.is_visited
      );
      if (firstUnseenIndex !== -1) {
        setCurrentStoryIndex(firstUnseenIndex);
      }
    }
  }, [initialUserIndex, currentUserIndex]);

  // Mark story as seen when it changes
  useEffect(() => {
    if (currentStory && !currentStory.is_visited) {
      viewStory(currentStory.story_id, {
        onSuccess: () => {
          // Manually update the story object in the current list to reflect the seen status immediately
          currentStory.is_visited = true;
        },
      });
    }
  }, [currentStory, viewStory]);

  const handleNext = useCallback(() => {
    if (!currentUser) return;

    if (currentStoryIndex < currentUser.stories.length - 1) {
      // Next story of same user
      setCurrentStoryIndex((prev) => prev + 1);
    } else {
      // Next user
      if (currentUserIndex < storiesList.length - 1) {
        const nextUserIndex = currentUserIndex + 1;
        setCurrentUserIndex(nextUserIndex);
        const nextUser = storiesList[nextUserIndex];
        const firstUnseenIndex = nextUser.stories.findIndex(
          (s) => !s.is_visited
        );
        setCurrentStoryIndex(firstUnseenIndex !== -1 ? firstUnseenIndex : 0);
      } else {
        // End of all stories
        onClose();
      }
    }
  }, [
    currentStoryIndex,
    currentUser,
    currentUserIndex,
    storiesList.length,
    onClose,
  ]);

  const handlePrev = useCallback(() => {
    if (currentStoryIndex > 0) {
      // Previous story of same user
      setCurrentStoryIndex((prev) => prev - 1);
    } else {
      // Previous user
      if (currentUserIndex > 0) {
        const prevUserIndex = currentUserIndex - 1;
        setCurrentUserIndex(prevUserIndex);
        // Go to last story of previous user
        setCurrentStoryIndex(storiesList[prevUserIndex].stories.length - 1);
      } else {
        // Close if at very beginning
        onClose();
      }
    }
  }, [currentStoryIndex, currentUserIndex, onClose, storiesList]);

  // Touch handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientY;
    // Swipe down threshold
    if (touchEnd - touchStart > 100) {
      onClose();
    }
    setTouchStart(null);
  };

  const handleMouseDown = () => setIsPaused(true);
  const handleMouseUp = () => setIsPaused(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  if (!currentUser || !currentStory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000",
          zIndex: 1300, // Higher than MUI AppBar usually
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Main Content Container - constrained width on desktop */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            maxWidth: "500px", // Mobile-like aspect on desktop
            position: "relative",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#000",
            overflow: "hidden",
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {/* Progress Bars */}
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              right: 10,
              zIndex: 20,
              display: "flex",
              gap: 0.5,
            }}
          >
            {currentUser.stories.map((story, index) => (
              <Box key={story.story_id} sx={{ flex: 1 }}>
                <StoryProgressBar
                  duration={5000} // or variable if video
                  isActive={index === currentStoryIndex}
                  isCompleted={index < currentStoryIndex}
                  isPaused={isPaused}
                  onCompleted={handleNext}
                />
              </Box>
            ))}
          </Box>

          {/* Header */}
          <Box
            sx={{
              position: "absolute",
              top: 25,
              left: 10,
              right: 10,
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  src={currentUser.user_profile_image}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography
                  sx={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}
                >
                  {currentUser.user_name}
                </Typography>
                <Typography
                  sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem" }}
                >
                  {new Date(currentStory.created_at).getHours()}h
                </Typography>
              </Box>
              {isOwnStory && (
                <>
                  <IconButton onClick={handleMenuOpen} sx={{ color: "#fff" }}>
                    <MoreVert fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleDeleteClick} sx={{ color: "red" }}>
                      {t("delete")}
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
            <IconButton onClick={onClose} sx={{ color: "#fff" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Tap Areas for Navigation */}
          <Box
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            sx={{
              position: "absolute",
              top: 60,
              bottom: 100,
              left: 0,
              width: "30%",
              zIndex: 10,
            }}
          />
          <Box
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            sx={{
              position: "absolute",
              top: 60,
              bottom: 100,
              right: 0,
              width: "70%",
              zIndex: 10,
            }}
          />

          {/* Media */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              bgcolor: "#1a1a1a",
            }}
          >
            <StoryMedia
              story={currentStory}
              isActive={!isPaused} // Should be isActive && !isPaused really, but isActive controls playing state in Media
              isPaused={isPaused}
              onMediaReady={() => {}} // Could start timer here
              onMediaEnd={handleNext} // For videos
            />
          </Box>

          {/* Footer (Caption & Actions) */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {currentStory.caption && (
              <Typography sx={{ color: "#fff", textAlign: "center" }}>
                {currentStory.caption}
              </Typography>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  flex: 1,
                  height: 48,
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                }}
              >
                <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Send a message...
                </Typography>
              </Box>
              <IconButton sx={{ color: "#fff" }}>
                <HeatPumpRounded />
              </IconButton>
              <IconButton sx={{ color: "#fff" }}>
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-story-dialog-title"
          aria-describedby="delete-story-dialog-description"
        >
          <DialogTitle id="delete-story-dialog-title">
            {t("deleteStory")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-story-dialog-description">
              {t("deleteStoryConfirm")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              {t("cancel")}
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              {t("delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryViewer;
