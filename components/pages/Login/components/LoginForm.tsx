'use client';

import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Link,
    Stack,
    useTheme
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    EmailOutlined,
    LockOutlined,
    Google as GoogleIcon
} from '@mui/icons-material';
import { useTranslate } from '@/hooks/useTranslate';

export default function LoginForm() {
    const { t } = useTranslate();
    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <Box component="form" noValidate sx={{ width: '100%', maxWidth: 400 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                {t('welcome_back')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Enter your email & password to login.
            </Typography>

            <Stack spacing={3}>
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        {t('email_address')}
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="masruqjaunhaik@mail.in"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailOutlined color="action" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '12px', bgcolor: 'background.paper' }
                        }}
                    />
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        {t('password')}
                    </Typography>
                    <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        placeholder="********"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlined color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '12px', bgcolor: 'background.paper' }
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link href="#" variant="body2" underline="hover" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {t('forgot_password')}
                    </Link>
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                        py: 1.5,
                        borderRadius: '25px',
                        background: 'linear-gradient(90deg, #536dfe 0%, #7c4dff 100%)', // Fallback/Custom gradient
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 700,
                        boxShadow: '0 4px 14px 0 rgba(124, 77, 255, 0.39)',
                    }}
                >
                    {t('login')}
                </Button>

                <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<GoogleIcon />}
                    sx={{
                        py: 1.5,
                        borderRadius: '25px',
                        borderColor: theme.palette.mode === 'light' ? '#E0E0E0' : '#424242',
                        color: 'text.primary',
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        bgcolor: 'background.paper',
                        '&:hover': {
                            bgcolor: 'action.hover',
                            borderColor: 'text.secondary',
                        },
                    }}
                >
                    {t('continue_with_google')}
                </Button>
            </Stack>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    {t('no_account')}
                    <Link href="#" sx={{ ml: 1, fontWeight: 700, color: 'text.primary' }} underline="hover">
                        {t('sign_up')}
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}
