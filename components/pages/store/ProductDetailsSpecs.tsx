"use client";
import React, { useState } from "react";
import {
    Box,
    Typography,
    useTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Collapse,
    IconButton,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";

interface ProductDetailsSpecsProps {
    specs: { [key: string]: string };
}

const ProductDetailsSpecs = ({ specs }: ProductDetailsSpecsProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [expanded, setExpanded] = useState(true);

    if (!specs || Object.keys(specs).length === 0) return null;

    return (
        <Box sx={{ mb: 3 }}>
            <Box
                onClick={() => setExpanded(!expanded)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    mb: expanded ? 2 : 0,
                    "&:hover": {
                        opacity: 0.8,
                    },
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    }}
                >
                    Product Highlights
                </Typography>
                <IconButton size="small" sx={{ color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </Box>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: "12px",
                        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0,0,0,0.08)"}`,
                        bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "white",
                        overflow: "hidden",
                    }}
                >
                    <Table sx={{ minWidth: "100%" }} aria-label="specifications table">
                        <TableBody>
                            {Object.entries(specs).map(([key, value], index) => (
                                <TableRow
                                    key={key}
                                    sx={{
                                        "&:last-child td, &:last-child th": { border: 0 },
                                        "& .MuiTableCell-root": {
                                            borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0,0,0,0.04)"}`,
                                        },
                                    }}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        sx={{
                                            width: { xs: "40%", sm: "30%" },
                                            py: 2,
                                            px: { xs: 1.5, sm: 2.5 },
                                            color: isDark
                                                ? COLORS.TEXT.SECONDARY_DARK
                                                : COLORS.TEXT.SECONDARY_LIGHT,
                                            fontWeight: 500,
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        {key}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            py: 2,
                                            px: { xs: 1.5, sm: 2.5 },
                                            color: isDark
                                                ? COLORS.TEXT.PRIMARY_DARK
                                                : COLORS.TEXT.PRIMARY_LIGHT,
                                            fontWeight: 600,
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        {value}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>
        </Box>
    );
};

export default ProductDetailsSpecs;


