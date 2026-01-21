/**
 * @file CompensatorDetails.tsx
 * @description Technical summary card for the synthesized compensator.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.1.0
 */

import React from 'react';
import { Paper, Typography, Box, Grid, Divider, Chip } from '@mui/material';
import type { Compensator } from '../types/ControlSystems';

interface CompensatorDetailsProps {
    /** Optimal compensator parameters found by the AI */
    compensator: Compensator;
    /** Achieved Phase Margin */
    pm: number;
    /** Achieved Gain Margin */
    gm: number;
}

const CompensatorDetails: React.FC<CompensatorDetailsProps> = ({ compensator, pm, gm }) => {
    return (
        <Paper elevation={3} sx={{ p: 3, borderLeft: '6px solid #4caf50', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                    Optimal Solution
                </Typography>
                <Chip 
                    label={compensator.type === 'LEAD' ? "Lead Network" : "Lag Network"} 
                    color="primary" 
                    variant="outlined" 
                    size="small" 
                />
            </Box>
            
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
                {/* Parameter: K */}
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Gain (K)
                    </Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'Monospace', fontWeight: 'bold' }}>
                        {compensator.K.toFixed(4)}
                    </Typography>
                </Grid>

                {/* Parameter: T */}
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Time Constant (T)
                    </Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'Monospace', fontWeight: 'bold' }}>
                        {compensator.T.toFixed(4)}s
                    </Typography>
                </Grid>

                {/* Parameter: Alpha */}
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Alpha (α)
                    </Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'Monospace', fontWeight: 'bold' }}>
                        {compensator.alpha.toFixed(4)}
                    </Typography>
                </Grid>

                {/* Parameter: Phase Margin */}
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Phase Margin
                    </Typography>
                    <Typography variant="h6" color="primary.main" sx={{ fontFamily: 'Monospace', fontWeight: 'bold' }}>
                        {pm.toFixed(2)}°
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default CompensatorDetails;