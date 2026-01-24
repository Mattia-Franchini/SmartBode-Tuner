/**
 * @file FeedbackSnackbar.tsx
 * @description Global notification component for user feedback (Success, Error, Info).
 * Uses explicit type imports to comply with verbatimModuleSyntax.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

import React from 'react';
import { Snackbar, Alert } from '@mui/material';
// FIX: Import 'AlertColor' as a type
import type { AlertColor } from '@mui/material';

interface FeedbackSnackbarProps {
    /** Whether the notification is visible */
    open: boolean;
    /** The message string to display */
    message: string;
    /** Style variant: 'success', 'error', 'info', or 'warning' */
    severity: AlertColor;
    /** Function to close the snackbar */
    onClose: () => void;
}

const FeedbackSnackbar: React.FC<FeedbackSnackbarProps> = ({ open, message, severity, onClose }) => {
    return (
        <Snackbar 
            open={open} 
            autoHideDuration={4000} 
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert 
                onClose={onClose} 
                severity={severity} 
                variant="filled" 
                sx={{ width: '100%', borderRadius: 2, fontWeight: 'bold' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default FeedbackSnackbar;