import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

interface StoryProgressBarProps {
  duration?: number; // duration in ms
  isActive: boolean;
  onCompleted: () => void;
  isPaused?: boolean;
  isCompleted?: boolean;
}

const StoryProgressBar: React.FC<StoryProgressBarProps> = ({
  duration = 5000,
  isActive,
  onCompleted,
  isPaused = false,
  isCompleted = false,
}) => {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const lastPauseStartRef = useRef<number | null>(null);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (isCompleted) {
      setProgress(100);
      return;
    }
    if (!isActive) {
      setProgress(0);
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
      lastPauseStartRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (isPaused) {
        if (!lastPauseStartRef.current) {
          lastPauseStartRef.current = timestamp;
        }
        requestRef.current = requestAnimationFrame(animate);
        return;
      }

      if (lastPauseStartRef.current) {
        pausedTimeRef.current += timestamp - lastPauseStartRef.current;
        lastPauseStartRef.current = null;
      }

      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const elapsed = timestamp - startTimeRef.current - pausedTimeRef.current;
      const progressValue = Math.min((elapsed / duration) * 100, 100);
      setProgress(progressValue);

      if (progressValue < 100) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        onCompleted();
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive, duration, onCompleted, isPaused, isCompleted]);

  return (
    <Box
      sx={{
        width: "100%",
        height: 4,
        bgcolor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: "#fff",
        }}
        transition={{ ease: "linear", duration: 0 }} // Managed by state
      />
    </Box>
  );
};

export default StoryProgressBar;
