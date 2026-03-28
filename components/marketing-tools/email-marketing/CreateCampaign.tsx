"use client";
import React, { useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Send as SendIcon,
  ArrowBack as BackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { emailMarketingService } from "@/services/emailMarketing/emailMarketing.service";
import toast from "react-hot-toast";

interface CreateCampaignProps {
  role: "supplier" | "spr";
}

interface CampaignFormData {
  name: string;
  subject: string;
  bodyHtml: string;
  isScheduled: boolean;
  scheduleTime: string;
}

interface EmailEntry {
  id: number;
  value: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CreateCampaign({ role }: CreateCampaignProps) {
  const router = useRouter();
  const { t } = useTranslationContext();

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [csvError, setCsvError] = useState<string>("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [inputType, setInputType] = useState<"upload" | "manual">("upload");

  // Individual email entries
  const [emailEntries, setEmailEntries] = useState<EmailEntry[]>([
    { id: 1, value: "" },
  ]);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const nextId = useRef(2);

  const validEmailEntries = emailEntries.filter((e) =>
    emailRegex.test(e.value.trim()),
  );

  const translate = (key: string, fallback: string) => {
    const res = t(key as any);
    return res && typeof res === "string" && res !== key ? res : fallback;
  };

  const basePath = role === "supplier" ? "/supplier" : "/spr";

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CampaignFormData>({
    defaultValues: {
      name: "",
      subject: "",
      bodyHtml: "",
      isScheduled: false,
      scheduleTime: "",
    },
  });

  const isScheduled = watch("isScheduled");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setCsvFile(file);
        setCsvError("");

        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            const data = results.data as any[];
            setTotalRecords(data.length);

            if (data.length > 0) {
              const keys = Object.keys(data[0]).map((k) => k.toLowerCase());
              if (!keys.includes("email")) {
                setCsvError(
                  translate(
                    "csv_no_email_column",
                    "Error: CSV must contain an 'email' column",
                  ),
                );
                setCsvPreview([]);
              } else {
                setCsvPreview(data.slice(0, 5));
              }
            }
          },
          error: function () {
            setCsvError(
              translate("csv_parse_error", "Failed to parse CSV file."),
            );
          },
        });
      }
    },
    [translate],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
  });

  const handleAddEmail = () => {
    const trimmed = newEmailInput.trim();
    if (!trimmed) {
      setIsAddingNew(false);
      return;
    }
    setEmailEntries((prev) => [
      ...prev,
      { id: nextId.current++, value: trimmed },
    ]);
    setNewEmailInput("");
    setIsAddingNew(false);
  };

  const handleUpdateEntry = (id: number, value: string) => {
    setEmailEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, value } : e)),
    );
  };

  const handleRemoveEntry = (id: number) => {
    setEmailEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleNewEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const onSubmit = async (data: CampaignFormData) => {
    let finalCsvFile: File | null = csvFile;

    if (inputType === "manual") {
      const filledEntries = emailEntries.filter((e) => e.value.trim());
      if (filledEntries.length === 0) {
        toast.error(
          translate(
            "manual_emails_required",
            "Please enter at least one email address",
          ),
        );
        return;
      }
      const invalidEntries = filledEntries.filter(
        (e) => !emailRegex.test(e.value.trim()),
      );
      if (invalidEntries.length > 0) {
        toast.error(
          `${invalidEntries.length} invalid email(s). Please fix them before submitting.`,
        );
        return;
      }

      const csvContent =
        "email\n" + filledEntries.map((e) => e.value.trim()).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      finalCsvFile = new File([blob], "contact_list.csv", { type: "text/csv" });
    } else {
      if (!csvFile) {
        toast.error(
          translate("csv_required", "Please upload a CSV file with recipients"),
        );
        return;
      }
      if (csvError) {
        toast.error(csvError);
        return;
      }
    }

    try {
      setSubmitting(true);

      const payload = {
        name: data.name,
        subject: data.subject,
        bodyHtml: data.bodyHtml,
        csvFile: finalCsvFile as File,
        ...(data.isScheduled && data.scheduleTime
          ? { scheduleTime: new Date(data.scheduleTime).toISOString() }
          : {}),
      };

      const response = await emailMarketingService.createCampaign(payload);
      toast.success(
        translate("campaign_created", "Campaign created successfully"),
      );

      router.push(
        `${basePath}/marketing-tools/email-marketing/campaigns/${response.data.id}`,
      );
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          translate("campaign_create_failed", "Failed to create campaign"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const removeFile = () => {
    setCsvFile(null);
    setCsvPreview([]);
    setTotalRecords(0);
    setCsvError("");
  };

  const filledEntries = emailEntries.filter((e) => e.value.trim());
  const invalidCount = filledEntries.filter(
    (e) => !emailRegex.test(e.value.trim()),
  ).length;
  const isSubmitDisabled =
    submitting ||
    (inputType === "upload"
      ? !csvFile || !!csvError
      : filledEntries.length === 0 || invalidCount > 0);

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <IconButton
          onClick={() =>
            router.push(`${basePath}/marketing-tools/email-marketing`)
          }
          sx={{ bgcolor: "white", boxShadow: 1 }}
        >
          <BackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {translate("create_new_campaign", "Create New Campaign")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {translate(
              "create_campaign_subtitle",
              "Set up your email content, upload recipients, and schedule delivery.",
            )}
          </Typography>
        </Box>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* General Info */}
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {translate("campaign_details", "Campaign Details")}
                </Typography>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                  }}
                >
                  <Controller
                    name="name"
                    control={control}
                    rules={{
                      required: translate(
                        "required_field",
                        "This field is required",
                      ) as string,
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={translate(
                          "campaign_name_label",
                          "Campaign Name (Internal)",
                        )}
                        fullWidth
                        size="small"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        placeholder={translate(
                          "campaign_name_placeholder",
                          "e.g., Summer Promo 2026",
                        )}
                      />
                    )}
                  />

                  <Controller
                    name="subject"
                    control={control}
                    rules={{
                      required: translate(
                        "required_field",
                        "This field is required",
                      ) as string,
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={translate("email_subject", "Email Subject")}
                        fullWidth
                        size="small"
                        error={!!errors.subject}
                        helperText={errors.subject?.message}
                        placeholder={translate(
                          "email_subject_placeholder",
                          "Don't miss our latest offers!",
                        )}
                      />
                    )}
                  />

                  <Controller
                    name="bodyHtml"
                    control={control}
                    rules={{
                      required: translate(
                        "required_field",
                        "This field is required",
                      ) as string,
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={translate(
                          "email_body",
                          "Email Body (HTML Supported)",
                        )}
                        fullWidth
                        multiline
                        rows={9}
                        size="small"
                        error={!!errors.bodyHtml}
                        helperText={
                          errors.bodyHtml?.message
                            ? errors.bodyHtml.message
                            : translate(
                                "email_body_helper",
                                "You can use standard HTML tags like <b>, <i>, <br>, <a> etc.",
                              )
                        }
                        placeholder={translate(
                          "email_body_placeholder",
                          "<h1>Hello!</h1><p>Check out our new products...</p>",
                        )}
                      />
                    )}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Delivery Settings */}
            <Card
              sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {translate("delivery_settings", "Delivery Settings")}
                </Typography>

                <Box sx={{ mt: 1 }}>
                  <Controller
                    name="isScheduled"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={field.value}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body2">
                            {translate(
                              "schedule_for_later",
                              "Schedule for later (Send automatically at a specific time)",
                            )}
                          </Typography>
                        }
                      />
                    )}
                  />

                  {isScheduled && (
                    <Box sx={{ mt: 2, pl: 4 }}>
                      <Controller
                        name="scheduleTime"
                        control={control}
                        rules={{
                          required: isScheduled
                            ? (translate(
                                "required_field",
                                "This field is required",
                              ) as string)
                            : false,
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="datetime-local"
                            label={translate(
                              "schedule_time",
                              "Schedule Date & Time",
                            )}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            size="small"
                            error={!!errors.scheduleTime}
                            helperText={errors.scheduleTime?.message}
                          />
                        )}
                      />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Recipients */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                position: "sticky",
                top: 80,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {translate("recipients", "Recipients")}
                </Typography>

                <Tabs
                  value={inputType}
                  onChange={(_, newValue) => setInputType(newValue)}
                  variant="fullWidth"
                  sx={{ mb: 2.5, borderBottom: 1, borderColor: "divider" }}
                >
                  <Tab
                    icon={<UploadIcon fontSize="small" />}
                    iconPosition="start"
                    label={
                      <Typography variant="caption" fontWeight="bold">
                        Upload CSV
                      </Typography>
                    }
                    value="upload"
                    sx={{ minHeight: 44 }}
                  />
                  <Tab
                    icon={<EditIcon fontSize="small" />}
                    iconPosition="start"
                    label={
                      <Typography variant="caption" fontWeight="bold">
                        Manual Input
                      </Typography>
                    }
                    value="manual"
                    sx={{ minHeight: 44 }}
                  />
                </Tabs>

                {/* ── UPLOAD CSV TAB ── */}
                {inputType === "upload" && (
                  <>
                    {/* Professional CSV Format Guide as table */}
                    <Box
                      sx={{
                        mb: 2.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          bgcolor: "#f5f5f5",
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="caption"
                          fontWeight="bold"
                          color="text.primary"
                          sx={{
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          CSV Format Guide
                        </Typography>
                      </Box>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#fafafa" }}>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "12px",
                                py: 0.75,
                                color: "primary.main",
                              }}
                            >
                              email
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "12px",
                                py: 0.75,
                                color: "text.secondary",
                              }}
                            >
                              name (optional)
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell
                              sx={{
                                fontSize: "12px",
                                py: 0.75,
                                fontFamily: "monospace",
                              }}
                            >
                              john@example.com
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "12px",
                                py: 0.75,
                                fontFamily: "monospace",
                                color: "text.secondary",
                              }}
                            >
                              John Doe
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              sx={{
                                fontSize: "12px",
                                py: 0.75,
                                fontFamily: "monospace",
                              }}
                            >
                              jane@example.com
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "12px",
                                py: 0.75,
                                fontFamily: "monospace",
                                color: "text.secondary",
                              }}
                            >
                              Jane Smith
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <Box
                        sx={{
                          px: 2,
                          py: 0.75,
                          bgcolor: "#fafafa",
                          borderTop: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          The <strong>email</strong> column is required. Other
                          columns are optional and will be ignored.
                        </Typography>
                      </Box>
                    </Box>

                    {!csvFile ? (
                      <Box
                        {...getRootProps()}
                        sx={{
                          border: "2px dashed",
                          borderColor: isDragActive
                            ? "primary.main"
                            : "divider",
                          bgcolor: isDragActive ? "primary.50" : "#fafafa",
                          borderRadius: 2,
                          p: 3,
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: "primary.main",
                            bgcolor: "#f0f4ff",
                          },
                        }}
                      >
                        <input {...getInputProps()} />
                        <UploadIcon
                          sx={{ fontSize: 36, color: "text.secondary", mb: 1 }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          gutterBottom
                        >
                          {translate(
                            "drag_drop_csv",
                            "Drag & drop your CSV file here",
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {translate("or_click_csv", "or click to select file")}
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            bgcolor: "#f5f5f5",
                            p: 1.5,
                            borderRadius: 2,
                            mb: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              overflow: "hidden",
                            }}
                          >
                            <UploadIcon
                              color="primary"
                              sx={{ mr: 1.5, fontSize: 20 }}
                            />
                            <Box sx={{ overflow: "hidden" }}>
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                noWrap
                              >
                                {csvFile.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {(csvFile.size / 1024).toFixed(1)} KB •{" "}
                                {totalRecords} {translate("records", "records")}
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={removeFile}
                            color="error"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        {csvError ? (
                          <Alert severity="error" sx={{ mb: 1.5 }}>
                            {csvError}
                          </Alert>
                        ) : (
                          <>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              gutterBottom
                              display="block"
                            >
                              {translate(
                                "preview_first_5",
                                "Preview (First 5 rows):",
                              )}
                            </Typography>
                            <Paper
                              variant="outlined"
                              sx={{
                                overflow: "auto",
                                mb: 1.5,
                                borderRadius: 1.5,
                              }}
                            >
                              <Table size="small">
                                <TableHead sx={{ bgcolor: "#f9f9f9" }}>
                                  <TableRow>
                                    {csvPreview.length > 0 &&
                                      Object.keys(csvPreview[0]).map((key) => (
                                        <TableCell
                                          key={key}
                                          sx={{
                                            fontWeight: "bold",
                                            fontSize: "11px",
                                            py: 0.75,
                                          }}
                                        >
                                          {key}
                                        </TableCell>
                                      ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {csvPreview.map((row, i) => (
                                    <TableRow key={i}>
                                      {Object.values(row).map((val: any, j) => (
                                        <TableCell
                                          key={j}
                                          sx={{
                                            fontSize: "11px",
                                            py: 0.75,
                                            maxWidth: 100,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          {val}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Paper>
                            <Alert
                              severity="success"
                              icon={false}
                              sx={{ py: 0.5, fontSize: "13px" }}
                            >
                              Ready to import {totalRecords}{" "}
                              {translate("recipients", "recipients")}
                            </Alert>
                          </>
                        )}
                      </Box>
                    )}
                  </>
                )}

                {/* ── MANUAL INPUT TAB ── */}
                {inputType === "manual" && (
                  <Box>
                    {/* Summary bar */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Add recipients one by one
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {filledEntries.length > 0 && (
                          <Chip
                            icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                            label={`${validEmailEntries.length} valid`}
                            color="success"
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "11px", height: 22 }}
                          />
                        )}
                        {invalidCount > 0 && (
                          <Chip
                            icon={<CancelIcon sx={{ fontSize: 14 }} />}
                            label={`${invalidCount} invalid`}
                            color="error"
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "11px", height: 22 }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Existing email entries */}
                    {emailEntries.map((entry, index) => {
                      const isValid =
                        !entry.value.trim() ||
                        emailRegex.test(entry.value.trim());
                      return (
                        <Box
                          key={entry.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            placeholder={`Email address ${index + 1}`}
                            value={entry.value}
                            onChange={(e) =>
                              handleUpdateEntry(entry.id, e.target.value)
                            }
                            error={!!entry.value.trim() && !isValid}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {entry.value.trim() ? (
                                    isValid ? (
                                      <CheckCircleIcon
                                        sx={{
                                          fontSize: 16,
                                          color: "success.main",
                                        }}
                                      />
                                    ) : (
                                      <CancelIcon
                                        sx={{
                                          fontSize: 16,
                                          color: "error.main",
                                        }}
                                      />
                                    )
                                  ) : (
                                    <Box sx={{ width: 16 }} />
                                  )}
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1.5,
                                fontSize: "0.875rem",
                              },
                            }}
                          />
                          {emailEntries.length > 1 && (
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveEntry(entry.id)}
                              color="error"
                              sx={{ flexShrink: 0, p: 0.5 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      );
                    })}

                    {/* Add new email row */}
                    {isAddingNew ? (
                      <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                        <TextField
                          autoFocus
                          fullWidth
                          size="small"
                          placeholder="Type an email and press Enter to Add"
                          value={newEmailInput}
                          onChange={(e) => setNewEmailInput(e.target.value)}
                          onKeyDown={handleNewEmailKeyDown}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1.5,
                              fontSize: "0.875rem",
                              borderStyle: "dashed",
                            },
                          }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={handleAddEmail}
                          disabled={!newEmailInput.trim()}
                          sx={{
                            flexShrink: 0,
                            borderRadius: 1.5,
                            px: 2,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                    ) : (
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setIsAddingNew(true)}
                        sx={{
                          mt: 1.5,
                          py: 1,
                          borderRadius: 2,
                          borderStyle: "dashed",
                          color: "text.secondary",
                          borderColor: "divider",
                          "&:hover": {
                            borderColor: "primary.main",
                            bgcolor: "primary.50",
                          },
                        }}
                      >
                        Add Email
                      </Button>
                    )}
                    {isAddingNew && (
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        Press Enter or click Add to add another email
                      </Typography>
                    )}
                  </Box>
                )}

                <Divider sx={{ my: 2.5 }} />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={isSubmitDisabled}
                  startIcon={
                    submitting ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <SendIcon />
                    )
                  }
                  sx={{ py: 1.25, borderRadius: 2 }}
                >
                  {submitting
                    ? translate("creating", "Creating...")
                    : isScheduled
                      ? translate("schedule_campaign", "Schedule Campaign")
                      : translate("save_and_continue", "Save & Continue")}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
