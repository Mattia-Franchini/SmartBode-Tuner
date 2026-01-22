/**
 * @file LockedView.tsx
 * @description Placeholder component for unauthenticated users.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

import React from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import LoginIcon from '@mui/icons-material/Login';

interface LockedViewProps {
    /** Function to open the Auth Modal from the parent */
    onOpenAuth: () => void;
}

const LockedView: React.FC<LockedViewProps> = ({ onOpenAuth }) => {
    return (
        <Box 
            sx={{ 
                height: '70vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center'
            }}
        >
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 5, 
                    maxWidth: 500, 
                    bgcolor: 'background.paper', 
                    borderRadius: 4,
                    border: '1px dashed',
                    borderColor: 'divider'
                }}
            >
                <Stack spacing={3} alignItems="center">
                    <Box 
                        sx={{ 
                            width: 80, 
                            height: 80, 
                            bgcolor: 'primary.main', 
                            color: 'white', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mb: 2
                        }}
                    >
                        <LockPersonIcon sx={{ fontSize: 40 }} />
                    </Box>

                    <Typography variant="h5" fontWeight="800">
                        Design Area Restricted
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary">
                        To access the AI-driven tuning tools, Bode diagrams, and project persistence, 
                        you must be part of our engineering community.
                    </Typography>

                    <Button 
                        variant="contained" 
                        size="large" 
                        startIcon={<LoginIcon />}
                        onClick={onOpenAuth}
                        sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                    >
                        Sign In to Unlock
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default LockedView;