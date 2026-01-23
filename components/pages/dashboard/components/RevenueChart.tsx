"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

// Simple SVG-based line chart
const LineChart: React.FC<{
  data: number[];
  labels: string[];
  isDark: boolean;
}> = ({ data, labels, isDark }) => {
  const maxValue = Math.max(...data, 1000);
  const minValue = Math.min(...data, 0);
  const range = maxValue - minValue || 1000;
  const width = 1000;
  const height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Normalize data points
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * chartWidth + padding;
    const y =
      chartHeight -
      ((value - minValue) / range) * chartHeight +
      padding;
    return { x, y, value };
  });

  // Create path for line
  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  // Create gradient
  const gradientId = "revenueGradient";

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ maxWidth: "100%", height: "auto" }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor={COLORS.PRIMARY_PURPLE}
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor={COLORS.PRIMARY_PURPLE}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 200, 400, 600, 800, 1000].map((value) => {
          const y =
            chartHeight -
            ((value - minValue) / range) * chartHeight +
            padding;
          return (
            <line
              key={value}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke={isDark ? COLORS.BORDER.DEFAULT_DARK : "#e5e7eb"}
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          );
        })}

        {/* Area under curve */}
        <path
          d={`${pathData} L ${points[points.length - 1].x} ${
            chartHeight + padding
          } L ${padding} ${chartHeight + padding} Z`}
          fill={`url(#${gradientId})`}
        />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={COLORS.PRIMARY_PURPLE}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={COLORS.PRIMARY_PURPLE}
            stroke={COLORS.WHITE}
            strokeWidth="2"
          />
        ))}

        {/* Labels */}
        {labels.map((label, index) => {
          const x = (index / (labels.length - 1)) * chartWidth + padding;
          return (
            <text
              key={index}
              x={x}
              y={height - 10}
              textAnchor="middle"
              fontSize="12"
              fill={isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT}
            >
              {label}
            </text>
          );
        })}

        {/* Y-axis labels */}
        {[0, 200, 400, 600, 800, 1000].map((value) => {
          const y =
            chartHeight -
            ((value - minValue) / range) * chartHeight +
            padding;
          return (
            <text
              key={value}
              x={padding - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill={isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT}
            >
              {value}
            </text>
          );
        })}

        {/* Current month highlight */}
        {points.length > 0 && (
          <>
            <line
              x1={points[points.length - 1].x}
              y1={padding}
              x2={points[points.length - 1].x}
              y2={chartHeight + padding}
              stroke={isDark ? COLORS.TEXT.SECONDARY_DARK : "#9ca3af"}
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="6"
              fill={COLORS.PRIMARY_PURPLE}
              stroke={COLORS.WHITE}
              strokeWidth="3"
            />
          </>
        )}
      </svg>
    </Box>
  );
};

const RevenueChart: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";
  const [period, setPeriod] = useState("monthly");
  const [type, setType] = useState("all");

  // Mock data - will be replaced with API data
  const monthlyData = [700, 400, 700, 200, 400, 500, 600, 550, 710];
  const monthlyLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
  ];

  return (
    <Card
      sx={{
        borderRadius: "12px",
        bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.WHITE,
        border: `1px solid ${
          isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
        }`,
        boxShadow: isDark
          ? "0px 2px 8px rgba(0, 0, 0, 0.2)"
          : "0px 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            }}
          >
            {t("revenueCharts")}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                sx={{
                  borderRadius: "8px",
                  bgcolor: isDark
                    ? COLORS.BACKGROUND.SECONDARY_DARK
                    : COLORS.BACKGROUND.SECONDARY_LIGHT,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: isDark
                      ? COLORS.BORDER.DEFAULT_DARK
                      : COLORS.BORDER.DEFAULT_LIGHT,
                  },
                }}
              >
                <MenuItem value="all">{t("all")}</MenuItem>
                <MenuItem value="services">{t("services")}</MenuItem>
                <MenuItem value="events">{t("events")}</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                sx={{
                  borderRadius: "8px",
                  bgcolor: isDark
                    ? COLORS.BACKGROUND.SECONDARY_DARK
                    : COLORS.BACKGROUND.SECONDARY_LIGHT,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: isDark
                      ? COLORS.BORDER.DEFAULT_DARK
                      : COLORS.BORDER.DEFAULT_LIGHT,
                  },
                }}
              >
                <MenuItem value="monthly">{t("monthly")}</MenuItem>
                <MenuItem value="weekly">{t("weekly")}</MenuItem>
                <MenuItem value="yearly">{t("yearly")}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
              fontSize: "0.875rem",
            }}
          >
            ₹710 {t("revenueEarnedIn")} Sep
          </Typography>
        </Box>

        <LineChart
          data={monthlyData}
          labels={monthlyLabels}
          isDark={isDark}
        />
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
