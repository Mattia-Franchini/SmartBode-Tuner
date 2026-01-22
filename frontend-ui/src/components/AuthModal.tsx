/**
 * @file AuthModal.tsx
 * @description Modern Login/Register modal with glassmorphism effects.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { 
    Dialog, DialogContent, TextField, Button, Typography, 
    Box, Stack, IconButton, InputAdornment, Tab, Tabs, 
    Divider, Link 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onLoginSuccess }) => {
    const [tabIndex, setTabIndex] = useState(0); // 0 = Login, 1 = Register

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    padding: 1,
                    backgroundImage: 'none', // Reset for dark mode
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                }
            }}
        >
            {/* Header with Close Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ pt: 0 }}>
                <Typography variant="h5" fontWeight="800" align="center" gutterBottom>
                    {tabIndex === 0 ? "Welcome Back" : "Create Account"}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    {tabIndex === 0 ? "Access your control projects" : "Join the engineering community"}
                </Typography>

                {/* Tabs Selector */}
                <Tabs 
                    value={tabIndex} 
                    onChange={handleTabChange} 
                    centered 
                    sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                {/* FORM AREA */}
                <Stack spacing={2}>
                    {tabIndex === 1 && (
                        <TextField
                            fullWidth
                            label="Full Name"
                            placeholder="Mattia Franchini"
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" /></InputAdornment>,
                            }}
                        />
                    )}

                    <TextField
                        fullWidth
                        label="Email Address"
                        placeholder="michele@example.com"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" /></InputAdornment>,
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" /></InputAdornment>,
                        }}
                    />

                    {tabIndex === 0 && (
                        <Link href="#" variant="caption" sx={{ alignSelf: 'flex-end', textDecoration: 'none' }}>
                            Forgot password?
                        </Link>
                    )}

                    <Button 
                        variant="contained" 
                        onClick={onLoginSuccess}
                        size="large" 
                        fullWidth 
                        sx={{ py: 1.5, fontWeight: 'bold', borderRadius: 2, mt: 1 }}
                    >
                        {tabIndex === 0 ? "Sign In" : "Start Now"}
                    </Button>
                </Stack>

                {/* SOCIAL LOGIN */}
                <Box sx={{ my: 3 }}>
                    <Divider><Typography variant="caption" color="text.secondary">OR CONTINUE WITH</Typography></Divider>
                </Box>

                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} sx={{ borderRadius: 2 }}>Google</Button>
                    <Button fullWidth variant="outlined" startIcon={<GitHubIcon />} sx={{ borderRadius: 2 }}>GitHub</Button>
                </Stack>

                <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 2 }}>
                    By continuing, you agree to our Terms of Service.
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;