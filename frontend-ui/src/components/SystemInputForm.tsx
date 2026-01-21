/**
 * @file SystemInputForm.tsx
 * @description Enhanced Input Interface with better vertical distribution.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.2.0
 */

import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box, Grid, Divider, Stack } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import type { SystemInput } from '../types/ControlSystems';

interface SystemInputFormProps {
    onSubmit: (data: SystemInput) => void;
    isLoading: boolean;
}

const SystemInputForm: React.FC<SystemInputFormProps> = ({ onSubmit, isLoading }) => {
    const [numStr, setNumStr] = useState<string>("10");
    const [denStr, setDenStr] = useState<string>("1, 2, 10");
    const [pmStr, setPmStr] = useState<string>("50");

    const parseCSV = (input: string): number[] => {
        return input.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: SystemInput = {
            numerator: parseCSV(numStr),
            denominator: parseCSV(denStr),
            targetPhaseMargin: parseFloat(pmStr) || 45
        };
        onSubmit(payload);
    };

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <SettingsInputComponentIcon color="primary" />
                    <Typography variant="h6" fontWeight="800">System Config</Typography>
                </Stack>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    Define your plant G(s) coefficients and stability targets.
                </Typography>

                {/* Spaziatura aumentata tra i campi (spacing 4 invece di 3) */}
                <Stack spacing={4}>
                    <TextField
                        label="Numerator Coefficients"
                        placeholder="e.g. 10"
                        fullWidth
                        value={numStr}
                        onChange={(e) => setNumStr(e.target.value)}
                        disabled={isLoading}
                        variant="filled"
                    />

                    <TextField
                        label="Denominator Coefficients"
                        placeholder="e.g. 1, 2, 10"
                        fullWidth
                        value={denStr}
                        onChange={(e) => setDenStr(e.target.value)}
                        disabled={isLoading}
                        variant="filled"
                    />

                    <Divider>
                        <Typography variant="caption" color="text.disabled">REQUIREMENTS</Typography>
                    </Divider>

                    <TextField
                        label="Target Phase Margin (°)"
                        type="number"
                        fullWidth
                        value={pmStr}
                        onChange={(e) => setPmStr(e.target.value)}
                        disabled={isLoading}
                        variant="filled"
                        inputProps={{ step: "0.1" }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<TuneIcon />}
                        disabled={isLoading}
                        sx={{ height: 60, fontWeight: 'bold', borderRadius: 3, mt: 2 }}
                    >
                        {isLoading ? "Computing..." : "Optimize Compensator"}
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};

export default SystemInputForm;