import React, { useRef, useState, useEffect, useCallback } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/Replay";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

interface ReelPlayerProps {
  videoUrl: string;
  isActive: boolean;
  isPaused?: boolean;
  preload?: "auto" | "metadata" | "none";
}

const ReelPlayer: React.FC<ReelPlayerProps> = ({
  videoUrl,
  isActive,
  isPaused = false,
  preload = "auto",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  // isVideoReady: true once the video has fired 'canplay' for the current activation
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  // userPaused: true only when the user explicitly taps to pause
  const [userPaused, setUserPaused] = useState(false);
  // Reels always start muted — browsers block unmuted autoplay outright, which was
  // freezing every reel on its raw first frame instead of playing. Users can unmute
  // with one click, same convention as TikTok/Instagram/YouTube Shorts.
  const [isMuted, setIsMuted] = useState(true);
  const bufferingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------------------  playback control  ---------------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && !isPaused) {
      video.play().catch((err) => console.log("Autoplay blocked:", err));
      setIsPlaying(true);
    } else {
      video.pause();
      if (!isActive) {
        video.currentTime = 0;
        // Reset ready/loaded state so the loading overlay shows on re-entry
        setIsVideoReady(false);
        setIsVideoLoaded(false);
        setProgress(0);
        setUserPaused(false);
      }
      setIsPlaying(false);
    }
  }, [isActive, isPaused]);

  // ---------------------  video event listeners  ---------------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onWaiting = () => {
      // Only show buffering overlay if the wait lasts > 500ms
      bufferingTimerRef.current = setTimeout(() => {
        setIsBuffering(true);
      }, 500);
    };

    const onPlaying = () => {
      if (bufferingTimerRef.current) {
        clearTimeout(bufferingTimerRef.current);
        bufferingTimerRef.current = null;
      }
      setIsBuffering(false);
      setIsVideoReady(true);
      setHasError(false);
    };

    const onCanPlay = () => {
      if (bufferingTimerRef.current) {
        clearTimeout(bufferingTimerRef.current);
        bufferingTimerRef.current = null;
      }
      setIsBuffering(false);
      setIsVideoReady(true);
    };

    const onLoadedData = () => {
      setIsVideoLoaded(true);
      setHasError(false);
    };

    const onError = () => {
      if (bufferingTimerRef.current) {
        clearTimeout(bufferingTimerRef.current);
        bufferingTimerRef.current = null;
      }
      setIsBuffering(false);
      setIsVideoReady(false);
      setHasError(true);
    };

    const onTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("error", onError);
    video.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      if (bufferingTimerRef.current) {
        clearTimeout(bufferingTimerRef.current);
      }
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("error", onError);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [videoUrl]);

  // ---------------------  click handler  ---------------------
  const handleVideoClick = useCallback(() => {
    if (hasError) {
      // Retry loading the video
      setHasError(false);
      setIsVideoReady(false);
      setIsBuffering(true);
      const video = videoRef.current;
      if (video) {
        video.load();
        video.play().catch((err) => console.log("Retry play failed:", err));
      }
      return;
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setUserPaused(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setUserPaused(false);
      }
    }
  }, [hasError, isPlaying]);

  const handleMuteToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  }, []);

  // ---------------------  overlay helpers  ---------------------
  // Show loading overlay only when active AND video hasn't started playing yet
  const showLoadingOverlay = isActive && !isVideoReady && !hasError;
  // Show buffering indicator (within the loading overlay) when mid-playback stall
  const showBuffering = isActive && isBuffering && !hasError;

  return (
    <Box
      onClick={handleVideoClick}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        loop
        autoPlay={isActive}
        muted={isMuted}
        playsInline
        preload={preload}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />

      {/* ---------- Mute Toggle ---------- */}
      <Box
        onClick={handleMuteToggle}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 6,
          width: 36,
          height: 36,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
          cursor: "pointer",
          "&:hover": { bgcolor: "rgba(0, 0, 0, 0.55)" },
        }}
      >
        {isMuted ? (
          <VolumeOffIcon sx={{ color: "white", fontSize: 20 }} />
        ) : (
          <VolumeUpIcon sx={{ color: "white", fontSize: 20 }} />
        )}
      </Box>

      {/* ---------- Loading / Buffering Overlay ---------- */}
      {showLoadingOverlay && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0, 0, 0, 0.45)",
            zIndex: 5,
            gap: 1.5,
          }}
        >
          <CircularProgress
            size={48}
            thickness={4}
            sx={{ color: "rgba(255, 255, 255, 0.9)" }}
          />
          {showBuffering && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <WifiOffIcon
                sx={{ color: "rgba(255, 255, 255, 0.75)", fontSize: 18 }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.85)",
                  fontWeight: 500,
                  letterSpacing: 0.3,
                  textAlign: "center",
                }}
              >
                Slow connection — please wait…
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* ---------- Error / Retry Overlay ---------- */}
      {hasError && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0, 0, 0, 0.6)",
            zIndex: 5,
            gap: 1,
          }}
        >
          <ReplayIcon sx={{ fontSize: 56, color: "rgba(255,255,255,0.85)" }} />
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.85)",
              fontWeight: 500,
            }}
          >
            Tap to retry
          </Typography>
        </Box>
      )}

      {/* ---------- Paused Play Icon (only on manual pause) ---------- */}
      {userPaused && !showLoadingOverlay && !hasError && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 80 }} />
        </Box>
      )}

      {/* ---------- Progress Bar ---------- */}
      {isActive && isVideoLoaded && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 3,
            bgcolor: "rgba(255, 255, 255, 0.2)",
            zIndex: 6,
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #ff4081, #7c4dff)",
              transition: "width 0.25s linear",
              borderRadius: "0 2px 2px 0",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ReelPlayer;
