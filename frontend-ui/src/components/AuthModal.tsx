/**
 * @file AuthModal.tsx
 * @description Logic-enabled Auth Modal connected to Node.js Backend.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.1.0
 */

import React, { useState } from 'react';
import { 
    Dialog, DialogContent, TextField, Button, Typography, 
    Box, Stack, IconButton, Tabs, Tab, Alert 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { loginUser, registerUser } from '../services/authService';
import type { User } from '../types/ControlSystems'; // Ensure this type is defined in your types file

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    /** Callback triggered upon successful authentication, passing the user object */
    onLoginSuccess: (user: User) => void; 
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onLoginSuccess }) => {
    const [tabIndex, setTabIndex] = useState(0); 
    
    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Handles the form submission for both Login and Registration.
     */
    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            if (tabIndex === 0) {
                // LOGIN FLOW
                const res = await loginUser(email, password);
                if (res.success && res.user) {
                    onLoginSuccess(res.user); // Pass the real user data to App.tsx
                }
            } else {
                // REGISTRATION FLOW
                const res = await registerUser(fullName, email, password);
                if (res.success) {
                    alert("Registration successful! Please sign in with your new credentials.");
                    setTabIndex(0); // Switch to Login tab
                }
            }
        } catch (err: any) {
            // Display error message from backend or a default fallback
            setError(err.response?.data?.message || "Authentication failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="xs" 
            fullWidth 
            PaperProps={{ sx: { borderRadius: 4 } }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
            </Box>
            
            <DialogContent sx={{ pt: 0 }}>
                <Typography variant="h5" fontWeight="800" align="center" gutterBottom>
                    {tabIndex === 0 ? "Welcome Back" : "Create Account"}
                </Typography>

                <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} centered sx={{ mb: 3 }}>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <Stack spacing={2}>
                    {tabIndex === 1 && (
                        <TextField 
                            fullWidth label="Full Name" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)} 
                        />
                    )}
                    <TextField 
                        fullWidth label="Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <TextField 
                        fullWidth label="Password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />

                    <Button 
                        variant="contained" 
                        fullWidth 
                        size="large" 
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ mt: 2, fontWeight: 'bold', height: 50, borderRadius: 2 }}
                    >
                        {loading ? "Authenticating..." : (tabIndex === 0 ? "Sign In" : "Register")}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;