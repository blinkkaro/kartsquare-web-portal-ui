"use client";
import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import BusinessProfileStep from "@/components/supplier/onboarding/BusinessProfileStep";
import KycStep from "@/components/supplier/onboarding/KycStep";
// We reuse onboarding steps but need to handle their 'onNext' props differently for settings context.
// Ideally, we refactor them to be "Forms" that take initial data and onSubmit. 
// For now, to save time, we wrapping them.

const TabPanel = (props: { children?: React.ReactNode; index: number; value: number }) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

export default function SupplierSettingsPage() {
    const { t } = useTranslate();
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleSaveSuccess = () => {
        // Maybe show a toast?
        alert(t("profileUpdated") || "Updated successfully");
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={4}>
                {t("settings")}
            </Typography>

            <Paper sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="settings tabs">
                        <Tab label={t("businessDetails")} />
                        <Tab label={t("bankDetails")} />
                        {/* Added KYC/Bank Details as second tab */}
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    {/* Business Profile Form. We reuse the step but 'onNext' is just 'onSave' effectively */}
                    <BusinessProfileStep onNext={handleSaveSuccess} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {/* Kyc Form. OnBack is not needed in settings. */}
                    <KycStep onNext={handleSaveSuccess} onBack={() => setValue(0)} />
                </TabPanel>
            </Paper>
        </Box>
    );
}
