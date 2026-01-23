"use client";
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    useTheme
} from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface DeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    serviceName: string;
    deleting: boolean;
}

const DeleteDialog = ({ open, onClose, onConfirm, serviceName, deleting }: DeleteDialogProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Dialog
            open={open}
            onClose={() => !deleting && onClose()}
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT,
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                }}
            >
                {english.delete_service}
            </DialogTitle>
            <DialogContent>
                <Typography
                    sx={{
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                    }}
                >
                    {english.delete_service_confirm.replace("{serviceName}", serviceName)}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    onClick={onClose}
                    disabled={deleting}
                    sx={{
                        textTransform: "none",
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    }}
                >
                    {english.cancel}
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={deleting}
                    variant="contained"
                    color="error"
                    sx={{
                        textTransform: "none",
                        borderRadius: "8px",
                        px: 3,
                    }}
                >
                    {deleting ? english.deleting : english.delete}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
