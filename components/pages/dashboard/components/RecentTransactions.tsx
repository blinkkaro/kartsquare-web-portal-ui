"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Avatar,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";

interface Transaction {
  id: string;
  date: string;
  quarter: string;
  productName: string;
  commissionRate: string;
  amount: string;
  image?: string;
}

const RecentTransactions: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslate();
  const router = useRouter();
  const isDark = theme.palette.mode === "dark";

  // Mock data - will be replaced with API data
  const transactions: Transaction[] = [
    {
      id: "1",
      date: "Sep 25, 2023",
      quarter: "Q-1",
      productName: t("ultralipNourishingShine"),
      commissionRate: `${t("commissionRate")}: 10%`,
      amount: "₹5",
    },
    {
      id: "2",
      date: "Sep 24, 2023",
      quarter: "Q-1",
      productName: t("ultralipNourishingShine"),
      commissionRate: `${t("commissionRate")}: 10%`,
      amount: "₹5",
    },
    {
      id: "3",
      date: "Sep 23, 2023",
      quarter: "Q-1",
      productName: t("ultralipNourishingShine"),
      commissionRate: `${t("commissionRate")}: 10%`,
      amount: "₹5",
    },
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
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
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
            {t("recentTransactions")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: COLORS.PRIMARY_PURPLE,
              cursor: "pointer",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={() => router.push("/transactions")}
          >
            {t("seeall")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {transactions.map((transaction) => (
            <Box
              key={transaction.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                borderRadius: "8px",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: isDark
                    ? COLORS.BACKGROUND.SECONDARY_DARK
                    : COLORS.BACKGROUND.SECONDARY_LIGHT,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: COLORS.PRIMARY_PURPLE,
                  fontSize: "16px",
                }}
              >
                💄
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                    fontSize: "0.75rem",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  {transaction.date} | {transaction.quarter}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                    mb: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {transaction.productName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                    fontSize: "0.75rem",
                  }}
                >
                  {transaction.commissionRate}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: COLORS.PRIMARY_PURPLE,
                }}
              >
                {transaction.amount}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
