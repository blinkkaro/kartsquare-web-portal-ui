import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { StoryItem, MediaType } from "@/services/stories/stories.interface";

interface StoryMediaProps {
  story: StoryItem;
  isActive: boolean;
  isPaused: boolean;
  onMediaReady: () => void; // Triggered when image loads or video is ready to play
  onMediaEnd?: () => void;
}

const StoryMedia: React.FC<StoryMediaProps> = ({
  story,
  isActive,
  isPaused,
  onMediaReady,
  onMediaEnd,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && story.media_type === MediaType.VIDEO && videoRef.current) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current
          .play()
          .catch((e) => console.log("Autoplay prevented", e));
      }
    } else if (
      !isActive &&
      story.media_type === MediaType.VIDEO &&
      videoRef.current
    ) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive, isPaused, story.media_type]);

  if (story.media_type === MediaType.VIDEO) {
    return (
      <Box
        component="video"
        ref={videoRef}
        src={story.media_url}
        onLoadedData={onMediaReady}
        onEnded={onMediaEnd}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "contain", // Keep aspect ratio, show generic bg
          bgcolor: "#000",
        }}
        playsInline
        muted={false} // Stories usually have sound, but might need to start muted then unmute?
      />
    );
  }

  return (
    <Box
      component="img"
      src={story.media_url}
      alt={story.caption}
      onLoad={onMediaReady}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        bgcolor: "#000",
      }}
    />
  );
};

export default StoryMedia;
