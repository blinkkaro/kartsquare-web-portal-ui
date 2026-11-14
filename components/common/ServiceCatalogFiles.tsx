"use client";
import React, { useState } from "react";
import { Box, Button, Dialog, IconButton, Typography, useTheme } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos, Close } from "@mui/icons-material";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import { COLORS } from "@/constants/colors";

/** A catalogue file is a PDF when its URL ends in .pdf (uploads keep their extension). */
export const isPdfUrl = (url: string): boolean => /\.pdf(\?|#|$)/i.test(url);

/** price_catalog_url arrives as a string[]; tolerate a JSON string or a single url from older rows. */
export function catalogUrls(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((u): u is string => typeof u === "string" && !!u.trim());
  if (typeof raw === "string" && raw.trim()) {
    const value = raw.trim();
    if (value.startsWith("[")) {
      try {
        return catalogUrls(JSON.parse(value));
      } catch {
        return [];
      }
    }
    return [value];
  }
  return [];
}

function fileName(url: string, index: number): string {
  try {
    const last = decodeURIComponent(new URL(url).pathname.split("/").pop() || "");
    if (last) return last;
  } catch {
    /* not a full url */
  }
  return `catalogue-${index + 1}.pdf`;
}

/** Saves the file; when the host refuses a cross-origin fetch, opens it so the browser's viewer can save it. */
async function downloadFile(url: string, name: string) {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) throw new Error(String(response.status));
    const blobUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

interface ServiceCatalogFilesProps {
  urls: string[];
  /** Thumbnail edge in px (images). */
  thumbSize?: number;
}

/** A service's price catalogue: photos as thumbnails with a full-screen viewer, PDFs as files to view or download. */
export default function ServiceCatalogFiles({ urls, thumbSize = 160 }: ServiceCatalogFilesProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = urls.filter((u) => !isPdfUrl(u));
  const pdfs = urls.filter(isPdfUrl);
  const borderColor = isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT;
  const accent = isDark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE;

  if (urls.length === 0) return null;

  const step = (delta: number) =>
    setLightboxIndex((prev) => (prev === null ? prev : (prev + delta + images.length) % images.length));

  const lightboxNavSx = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    color: COLORS.WHITE,
    bgcolor: "rgba(255,255,255,0.1)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
    zIndex: 10,
    width: 48,
    height: 48,
  } as const;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {pdfs.map((url, index) => {
        const name = fileName(url, index);
        return (
          <Box
            key={url}
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
              p: 1.5,
              borderRadius: "12px",
              border: `1px solid ${borderColor}`,
              bgcolor: isDark ? COLORS.NEW_UI.SURFACE_SOFT_DARK : COLORS.NEW_UI.SURFACE_SOFT_LIGHT,
            }}
          >
            <PictureAsPdfRoundedIcon sx={{ fontSize: 32, color: accent, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 120 }}>
              <Typography sx={{ fontSize: "0.88rem", fontWeight: 600, color: "text.primary" }} noWrap>
                {pdfs.length > 1 ? `Price catalogue ${index + 1}` : "Price catalogue"}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }} noWrap title={name}>
                PDF · {name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
              <Button
                component="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                variant="outlined"
                startIcon={<OpenInNewRoundedIcon sx={{ fontSize: 16 }} />}
                aria-label={`View ${name}`}
                sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px", color: accent, borderColor: accent }}
              >
                View
              </Button>
              <Button
                onClick={() => void downloadFile(url, name)}
                size="small"
                variant="contained"
                startIcon={<FileDownloadRoundedIcon sx={{ fontSize: 16 }} />}
                aria-label={`Download ${name}`}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "10px",
                  boxShadow: "none",
                  bgcolor: COLORS.PRIMARY_PURPLE,
                  color: COLORS.WHITE,
                  "&:hover": { bgcolor: COLORS.PURPLE_HOVER, boxShadow: "none" },
                }}
              >
                Download
              </Button>
            </Box>
          </Box>
        );
      })}

      {images.length > 0 && (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {images.map((url, index) => (
            <Box
              key={url}
              component="button"
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`View catalogue image ${index + 1}`}
              sx={{
                p: 0,
                width: thumbSize,
                height: thumbSize,
                borderRadius: 2,
                border: `2px solid ${borderColor}`,
                overflow: "hidden",
                cursor: "pointer",
                bgcolor: "transparent",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                "&:hover, &:focus-visible": {
                  borderColor: COLORS.PRIMARY_PURPLE,
                  boxShadow: `0 4px 12px ${COLORS.PURPLE_ALPHA_20}`,
                },
              }}
            >
              <Box component="img" src={url} alt={`Price catalogue ${index + 1}`} loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </Box>
          ))}
        </Box>
      )}

      <Dialog
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        fullWidth
        slotProps={{
          paper: {
            sx: { bgcolor: "transparent", boxShadow: "none", overflow: "hidden", width: "100%", height: "100%", maxWidth: "none", margin: 0 },
          },
        }}
      >
        {lightboxIndex !== null && images[lightboxIndex] && (
          <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
            <Box
              component="img"
              src={images[lightboxIndex]}
              alt={`Price catalogue ${lightboxIndex + 1}`}
              sx={{ maxHeight: "90vh", maxWidth: "90vw", objectFit: "contain", borderRadius: 2 }}
            />
            {images.length > 1 && (
              <>
                <IconButton onClick={() => step(-1)} aria-label="Previous image" sx={{ ...lightboxNavSx, left: { xs: 10, md: 40 } }}>
                  <ArrowBackIosNew />
                </IconButton>
                <IconButton onClick={() => step(1)} aria-label="Next image" sx={{ ...lightboxNavSx, right: { xs: 10, md: 40 } }}>
                  <ArrowForwardIos />
                </IconButton>
              </>
            )}
            <IconButton
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
              sx={{ position: "absolute", top: 20, right: 20, color: COLORS.WHITE, bgcolor: "rgba(255,255,255,0.1)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }, zIndex: 10 }}
            >
              <Close />
            </IconButton>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
