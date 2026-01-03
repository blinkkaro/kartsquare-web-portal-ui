'use client';

import React from 'react';
import { Box, Grid, Typography, useTheme, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import LoginForm from './components/LoginForm';
import { OctopusLogo } from './components/OctopusLogo';
import { useTranslate } from '@/hooks/useTranslate';

export default function LoginView() {
    const theme = useTheme();
    const { t, locale, changeLanguage } = useTranslate();

    const handleLanguageChange = (event: SelectChangeEvent<string>) => {
        changeLanguage(event.target.value as any);
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex' }}>
            <Grid container>
                {/* Left Side - Brand & Illustration */}
                <Grid
                    size={{ xs: 12, md: 6 }}
                    sx={{
                        background: 'linear-gradient(135deg, #a7ffeb 0%, #80d8ff 50%, #8c9eff 100%)', // Matching the image gradient feel
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                        position: 'relative',
                        // Create the gradient overlay with the purple hue from image if needed
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(45deg, rgba(230,230,250,0.4) 0%, rgba(255,255,255,0) 100%)',
                            zIndex: 1,
                        }
                    }}
                >
                    <Box sx={{ zIndex: 2, textAlign: 'center', color: '#311b92' }}>
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                            <OctopusLogo />
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '0.1em', mb: 1 }}>
                            OCTOPUS
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>
                            {t('brand_tagline').toUpperCase()}
                        </Typography>
                    </Box>

                    {/* Decorative background elements can be added here */}
                </Grid>

                {/* Right Side - Login Form */}
                <Grid
                    size={{ xs: 12, md: 6 }}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 4,
                        bgcolor: 'background.default',
                        position: 'relative'
                    }}
                >
                    {/* Language Switcher (Top Right) */}
                    <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
                        <Select
                            value={locale}
                            onChange={handleLanguageChange}
                            size="small"
                            variant="standard"
                            disableUnderline
                            sx={{ fontWeight: 'bold' }}
                        >
                            <MenuItem value="en">🇺🇸 EN</MenuItem>
                            <MenuItem value="es">🇪🇸 ES</MenuItem>
                            <MenuItem value="hi">🇮🇳 HI</MenuItem>
                        </Select>
                    </Box>

                    <LoginForm />
                </Grid>
            </Grid>
        </Box>
    );
}
