/**
 * @file SystemInputForm.tsx
 * @description Enhanced Input Interface with better vertical distribution.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.3.0
 */

import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box, Divider, Stack, Tooltip, InputAdornment } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { SystemInput } from '../types/ControlSystems';
import { parseCSVToNumbers } from '../utils/mathUtils';

interface SystemInputFormProps {
    onSubmit: (data: SystemInput) => void;
    isLoading: boolean;
}

const SystemInputForm: React.FC<SystemInputFormProps> = ({ onSubmit, isLoading }) => {
    const [numStr, setNumStr] = useState<string>("10");
    const [denStr, setDenStr] = useState<string>("1, 2, 10");
    const [pmStr, setPmStr] = useState<string>("50");

    const isValidCSV = (str: string) => /^[0-9,.\s-]+$/.test(str);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidCSV(numStr) || !isValidCSV(denStr)) return;
        
        onSubmit({
            numerator: parseCSVToNumbers(numStr),
            denominator: parseCSVToNumbers(denStr),
            targetPhaseMargin: parseFloat(pmStr) || 45
        });
    };

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" fontWeight="800" gutterBottom>System Config</Typography>
                
                <Stack spacing={3} sx={{ mt: 2 }}>
                    <TextField
                        label="Numerator G(s)"
                        error={!isValidCSV(numStr)}
                        helperText={!isValidCSV(numStr) ? "Invalid format (use 1, 2, 3)" : "Descending powers of s"}
                        value={numStr}
                        onChange={(e) => setNumStr(e.target.value)}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Example: '10' for a constant gain or '1, 0' for 's'">
                                        <HelpOutlineIcon sx={{ fontSize: 18, cursor: 'help' }} />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label="Denominator G(s)"
                        error={!isValidCSV(denStr)}
                        helperText={!isValidCSV(denStr) ? "Invalid format" : "Example: '1, 2, 1' for s^2 + 2s + 1"}
                        value={denStr}
                        onChange={(e) => setDenStr(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />

                    <Divider />

                    <TextField
                        label="Target Phase Margin (°)"
                        type="number"
                        value={pmStr}
                        onChange={(e) => setPmStr(e.target.value)}
                        fullWidth
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isLoading || !isValidCSV(numStr) || !isValidCSV(denStr)}
                        sx={{ height: 55, fontWeight: 'bold', borderRadius: 2 }}
                        startIcon={<TuneIcon />}
                    >
                        {isLoading ? "Optimizing..." : "Start Auto-Tuning"}
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};

export default SystemInputForm;