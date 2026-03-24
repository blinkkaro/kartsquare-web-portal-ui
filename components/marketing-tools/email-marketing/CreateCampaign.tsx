"use client";
import React, { useState, useCallback } from "react";
import { 
  Box, Typography, Card, CardContent, Button, TextField, Grid, 
  FormControlLabel, Switch, Divider, Table, TableBody, TableCell, 
  TableHead, TableRow, IconButton, Paper, Alert, CircularProgress
} from "@mui/material";
import { 
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Send as SendIcon,
  ArrowBack as BackIcon
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

export default function CreateCampaign({ role }: CreateCampaignProps) {
  const router = useRouter();
  const { t } = useTranslationContext();
  
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [csvError, setCsvError] = useState<string>("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const translate = (key: string, fallback: string) => {
    const res = t(key as any);
    return res && typeof res === 'string' && res !== key ? res : fallback;
  };

  const basePath = role === "supplier" ? "/supplier" : "/spr";

  const { control, handleSubmit, watch, formState: { errors } } = useForm<CampaignFormData>({
    defaultValues: {
      name: "",
      subject: "",
      bodyHtml: "",
      isScheduled: false,
      scheduleTime: "",
    }
  });

  const isScheduled = watch("isScheduled");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setCsvFile(file);
      setCsvError("");
      
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const data = results.data as any[];
          setTotalRecords(data.length);
          
          if (data.length > 0) {
            const keys = Object.keys(data[0]).map(k => k.toLowerCase());
            if (!keys.includes("email")) {
              setCsvError(translate("csv_no_email_column", "Error: CSV must contain an 'email' column"));
              setCsvPreview([]);
            } else {
              setCsvPreview(data.slice(0, 5));
            }
          }
        },
        error: function() {
          setCsvError(translate("csv_parse_error", "Failed to parse CSV file."));
        }
      });
    }
  }, [translate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  const onSubmit = async (data: CampaignFormData) => {
    if (!csvFile) {
      toast.error(translate("csv_required", "Please upload a CSV file with recipients"));
      return;
    }
    if (csvError) {
      toast.error(csvError);
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        name: data.name,
        subject: data.subject,
        bodyHtml: data.bodyHtml,
        csvFile: csvFile,
        ...(data.isScheduled && data.scheduleTime ? { scheduleTime: new Date(data.scheduleTime).toISOString() } : {})
      };
      
      const response = await emailMarketingService.createCampaign(payload);
      toast.success(translate("campaign_created", "Campaign created successfully"));
      
      router.push(`${basePath}/marketing-tools/email-marketing/campaigns/${response.data.id}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || translate("campaign_create_failed", "Failed to create campaign"));
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

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <IconButton onClick={() => router.push(`${basePath}/marketing-tools/email-marketing`)} sx={{ bgcolor: 'white', boxShadow: 1 }}>
          <BackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {translate("create_new_campaign", "Create New Campaign")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {translate("create_campaign_subtitle", "Set up your email content, upload recipients, and schedule delivery.")}
          </Typography>
        </Box>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            {/* General Info */}
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {translate("campaign_details", "Campaign Details")}
                </Typography>
                
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: translate("required_field", "This field is required") as string }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={translate("campaign_name_label", "Campaign Name (Internal)")}
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        placeholder={translate("campaign_name_placeholder", "e.g., Summer Promo 2026")}
                      />
                    )}
                  />

                  <Controller
                    name="subject"
                    control={control}
                    rules={{ required: translate("required_field", "This field is required") as string }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={translate("email_subject", "Email Subject")}
                        fullWidth
                        error={!!errors.subject}
                        helperText={errors.subject?.message}
                        placeholder={translate("email_subject_placeholder", "Don't miss our latest offers!")}
                      />
                    )}
                  />

                  <Controller
                    name="bodyHtml"
                    control={control}
                    rules={{ required: translate("required_field", "This field is required") as string }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={translate("email_body", "Email Body (HTML Supported)")}
                        fullWidth
                        multiline
                        rows={10}
                        error={!!errors.bodyHtml}
                        helperText={errors.bodyHtml?.message 
                          ? errors.bodyHtml.message 
                          : translate("email_body_helper", "You can use standard HTML tags like <b>, <i>, <br>, <a> etc.")}
                        placeholder={translate("email_body_placeholder", "<h1>Hello!</h1><p>Check out our new products...</p>")}
                      />
                    )}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Delivery Settings */}
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {translate("delivery_settings", "Delivery Settings")}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Controller
                    name="isScheduled"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} color="primary" />}
                        label={translate("schedule_for_later", "Schedule for later (Send automatically at a specific time)")}
                      />
                    )}
                  />

                  {isScheduled && (
                    <Box sx={{ mt: 2, pl: 4 }}>
                      <Controller
                        name="scheduleTime"
                        control={control}
                        rules={{ required: isScheduled ? (translate("required_field", "This field is required") as string) : false }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="datetime-local"
                            label={translate("schedule_time", "Schedule Date & Time")}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
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

          <Grid size={{ xs: 12, md: 5 }}>
            {/* Recipients Import */}
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", position: 'sticky', top: 100 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {translate("recipients", "Recipients (CSV Upload)")}
                </Typography>
                
                {!csvFile ? (
                  <Box 
                    {...getRootProps()} 
                    sx={{ 
                      border: '2px dashed #ccc', 
                      borderColor: isDragActive ? 'primary.main' : '#ccc',
                      bgcolor: isDragActive ? 'primary.light' : '#f9f9f9',
                      borderRadius: 2, 
                      p: 4, 
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: 'primary.main', bgcolor: '#f0f4ff' }
                    }}
                  >
                    <input {...getInputProps()} />
                    <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" fontWeight="bold" gutterBottom>
                      {translate("drag_drop_csv", "Drag & drop your CSV file here")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {translate("or_click_csv", "or click to select file")}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 2 }}>
                      {translate("csv_req", "Must contain an 'email' column header")}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f5f5f5', p: 2, borderRadius: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                        <UploadIcon color="primary" sx={{ mr: 2 }} />
                        <Box sx={{ overflow: 'hidden' }}>
                          <Typography variant="body2" fontWeight="bold" noWrap>{csvFile.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {(csvFile.size / 1024).toFixed(1)} KB • {totalRecords} {translate("records", "records")}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton size="small" onClick={removeFile} color="error">
                        <CloseIcon />
                      </IconButton>
                    </Box>

                    {csvError ? (
                      <Alert severity="error" sx={{ mb: 2 }}>{csvError}</Alert>
                    ) : (
                      <>
                        <Typography variant="subtitle2" gutterBottom color="text.secondary">
                          {translate("preview_first_5", "Preview (First 5 rows):")}
                        </Typography>
                        <Paper variant="outlined" sx={{ overflow: 'auto', mb: 2 }}>
                          <Table size="small">
                            <TableHead sx={{ bgcolor: '#f9f9f9' }}>
                              <TableRow>
                                {csvPreview.length > 0 && Object.keys(csvPreview[0]).map((key) => (
                                  <TableCell key={key} sx={{ fontWeight: 'bold', fontSize: '12px' }}>{key}</TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {csvPreview.map((row, i) => (
                                <TableRow key={i}>
                                  {Object.values(row).map((val: any, j) => (
                                    <TableCell key={j} sx={{ fontSize: '12px', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {val}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Paper>
                        <Alert severity="success" icon={false} sx={{ py: 0 }}>
                          {translate("ready_to_import", "Ready to import")} {totalRecords} {translate("recipients", "recipients")}
                        </Alert>
                      </>
                    )}
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  fullWidth 
                  disabled={submitting || !csvFile || !!csvError}
                  startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  {submitting 
                    ? translate("creating", "Creating...") 
                    : (isScheduled ? translate("schedule_campaign", "Schedule Campaign") : translate("save_and_continue", "Save & Continue"))}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
