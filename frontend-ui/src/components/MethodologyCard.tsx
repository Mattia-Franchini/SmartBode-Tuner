/**
 * @file MethodologyCard.tsx
 * @description Academic context card to balance the UI layout.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.1.0
 */

import React from 'react';
import { Paper, Typography, Box, Stack, Avatar } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

const MethodologyCard = () => {
    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 4, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                        <PsychologyIcon />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight="bold">AI Engine Status</Typography>
                </Stack>
                
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    The system uses <strong>Differential Evolution</strong> to minimize the error between current and target Phase Margin.
                </Typography>

                <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                    <PrecisionManufacturingIcon sx={{ fontSize: 20, mr: 1 }} />
                    <Typography variant="caption">Status: Ready for Synthesis</Typography>
                </Box>
            </Stack>
        </Paper>
    );
};

export default MethodologyCard;