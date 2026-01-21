/**
 * @file SystemInputForm.tsx
 * @description Input Interface for LTI System parameters and design targets.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.1.0
 */

import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box, Grid, Divider } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import type { SystemInput } from '../types/ControlSystems';

interface SystemInputFormProps {
    /** Callback triggered when the user submits the form for optimization */
    onSubmit: (data: SystemInput) => void;
    /** Disables inputs while the AI engine is computing */
    isLoading: boolean;
}

const SystemInputForm: React.FC<SystemInputFormProps> = ({ onSubmit, isLoading }) => {
    // Local state for the text fields
    const [numStr, setNumStr] = useState<string>("10");
    const [denStr, setDenStr] = useState<string>("1, 2, 10");
    const [pmStr, setPmStr] = useState<string>("50");

    /**
     * Parses a comma-separated string into an array of numbers.
     * @param input String like "1, 2, 10"
     */
    const parseCSV = (input: string): number[] => {
        return input
            .split(',')
            .map(val => parseFloat(val.trim()))
            .filter(val => !isNaN(val));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Construct the strictly typed payload
        const payload: SystemInput = {
            numerator: parseCSV(numStr),
            denominator: parseCSV(denStr),
            targetPhaseMargin: parseFloat(pmStr) || 45
        };

        onSubmit(payload);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                    System Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Specify the Plant Transfer Function G(s) and your stability requirements.
                </Typography>

                <Grid container spacing={3}>
                    {/* Numerator Input */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Numerator Coefficients"
                            placeholder="e.g. 1, 10"
                            fullWidth
                            value={numStr}
                            onChange={(e) => setNumStr(e.target.value)}
                            disabled={isLoading}
                            helperText="Comma-separated (descending powers of s)"
                        />
                    </Grid>

                    {/* Denominator Input */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Denominator Coefficients"
                            placeholder="e.g. 1, 2, 10"
                            fullWidth
                            value={denStr}
                            onChange={(e) => setDenStr(e.target.value)}
                            disabled={isLoading}
                            helperText="e.g. '1, 2' represents s + 2"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    {/* Target Specification */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Target Phase Margin (°)"
                            type="number"
                            fullWidth
                            value={pmStr}
                            onChange={(e) => setPmStr(e.target.value)}
                            disabled={isLoading}
                            inputProps={{ step: "0.1" }}
                        />
                    </Grid>

                    {/* Action Button */}
                    <Grid size={{ xs: 12 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<TuneIcon />}
                            disabled={isLoading}
                            sx={{ mt: 2, height: 50, fontWeight: 'bold' }}
                        >
                            {isLoading ? "Computing..." : "Optimize Compensator"}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default SystemInputForm;