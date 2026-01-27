/**
 * @file AuthModal.tsx
 * @description Logic-enabled Auth Modal connected to Node.js Backend.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.3.0
 */

import React, { useState } from 'react';
import {
    Dialog, DialogContent, TextField, Button, Typography,
    Box, Stack, IconButton, Tabs, Tab, Alert, InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { loginUser, registerUser } from '../../services/authService';
import type { User } from '../../types/ControlSystems';
import type { AlertColor } from '@mui/material';

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    /** Callback triggered upon successful authentication, passing the user object */
    onLoginSuccess: (user: User) => void;
    onNotify: (message: string, severity: AlertColor) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onLoginSuccess, onNotify }) => {
    const [tabIndex, setTabIndex] = useState(0);

    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Name Validation: Letters and spaces only, 2-50 characters.
     */
    const isNameValid = (name: string) => /^[a-zA-Z\s]{2,50}$/.test(name.trim());

    /**
     * Regex for email validation.
     */
    const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    /**
     * Password requirements: min 8 chars and at least 1 number.
     */
    const isPasswordStrong = (pass: string) => pass.length >= 8 && /\d/.test(pass);

    /**
     * Toggles password visibility.
     */
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    /**
     * Handles the form submission for both Login and Registration.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (tabIndex === 1 && !isNameValid(fullName)) {
            setError("Please enter a valid full name (letters only, min 2 chars).");
            return;
        }
        if (!isEmailValid(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (tabIndex === 1 && !isPasswordStrong(password)) {
            setError("Password must be at least 8 characters long and contain at least one number.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            if (tabIndex === 0) {
                // LOGIN FLOW
                const res = await loginUser(email, password);
                if (res.success && res.user) {
                    onLoginSuccess(res.user);
                }
            } else {
                // REGISTRATION FLOW
                const res = await registerUser(fullName, email, password);
                if (res.success) {
                    onNotify("Registration successful! Please sign in with your new account.", "success");
                    setTabIndex(0); // Switch to Login tab
                }
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "Authentication failed";
            setError(msg);
            onNotify(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
            </Box>
            <DialogContent sx={{ pt: 0 }}>
                <Typography variant="h5" fontWeight="800" align="center" gutterBottom>
                    {tabIndex === 0 ? "Welcome Back" : "Create Account"}
                </Typography>

                <Tabs value={tabIndex} onChange={(_, v) => { setTabIndex(v); setError(null); }} centered sx={{ mb: 3 }}>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        {tabIndex === 1 && (
                            <TextField
                                fullWidth label="Full Name"
                                variant="outlined"
                                value={fullName} onChange={(e) => setFullName(e.target.value)}
                            />
                        )}

                        <TextField
                            fullWidth label="Email Address"
                            variant="outlined"
                            error={email !== '' && !isEmailValid(email)}
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            helperText={tabIndex === 1 ? "Min 8 characters + 1 number" : ""}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth size="large"
                            onClick={handleSubmit}
                            disabled={loading || (tabIndex === 1 && (!isEmailValid(email) || !isPasswordStrong(password)))}
                            sx={{ mt: 2, fontWeight: 'bold', height: 50, borderRadius: 2 }}
                        >
                            {loading ? "Processing..." : (tabIndex === 0 ? "Sign In" : "Register")}
                        </Button>
                    </Stack>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;