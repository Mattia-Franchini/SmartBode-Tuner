/**
 * @file CompensatorDetails.tsx
 * @description Stabilized technical results card featuring mathematical fraction rendering 
 * and an interactive gain tuning slider for stability sensitivity analysis.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.3.0
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Grid, Divider, Chip, Button, Stack, Slider, IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TuneIcon from '@mui/icons-material/Tune';
import type { Compensator } from '../types/ControlSystems';

interface CompensatorDetailsProps {
    /** Optimal compensator parameters returned by the AI engine */
    compensator: Compensator;
    /** Achieved Phase Margin in degrees */
    pm: number;
    /** Achieved Gain Margin in dB */
    gm: number;
}

const CompensatorDetails: React.FC<CompensatorDetailsProps> = ({ compensator, pm, gm }) => {
    // 1. Local state to track the user-modified gain value (K)
    const [currentK, setCurrentK] = useState<number>(compensator.K);

    // 2. STABILIZATION: Define fixed slider boundaries relative to the initial AI suggestion
    // This prevents the slider from jumping or becoming unstable during interaction.
    const minLimit = compensator.K * 0.1; // 10% of the AI value
    const maxLimit = compensator.K * 5.0; // 500% of the AI value

    // Synchronize local state whenever a new optimization result is provided by the props
    useEffect(() => {
        setCurrentK(compensator.K);
    }, [compensator.K]);
    
    /**
     * Logic to export the current design (including manual tuning) as a JSON file.
     */
    const handleExportJSON = () => {
        const dataToExport = {
            project: "SmartBode Tuner Design",
            authors: ["Mattia Franchini", "Michele Bisignano"],
            timestamp: new Date().toISOString(),
            results: { 
                compensator: { ...compensator, K: currentK }, 
                ai_calculated_pm: pm,
                ai_calculated_gm: gm
            }
        };

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `smartbode_design_export.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, borderLeft: '6px solid #4caf50', borderRadius: 4 }}>
            {/* Header: Title and Network Topology Identifier */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="800" color="success.main">
                    Optimal Solution
                </Typography>
                <Chip 
                    label={compensator.type} 
                    color="primary" 
                    variant="filled" 
                    size="small" 
                    sx={{ fontWeight: 'bold' }} 
                />
            </Stack>
            
            <Divider sx={{ mb: 2 }} />

            {/* PROFESSIONAL MATHEMATICAL FORMULA BOX */}
            <Box sx={{ 
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                p: 3, borderRadius: 2, mb: 2, border: '1px solid', borderColor: 'divider',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, letterSpacing: 1, fontWeight: 'bold' }}>
                    COMPENSATOR TRANSFER FUNCTION
                </Typography>

                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    fontFamily: '"Times New Roman", Times, serif', 
                    fontStyle: 'italic', 
                    fontSize: '1.4rem',
                    color: 'text.primary'
                }}>
                    {/* C(s) Notation */}
                    <Box sx={{ mr: 1, fontWeight: 'bold' }}>C(s) = </Box>

                    {/* Tuned Gain Value (K) */}
                    <Box sx={{ mr: 1, color: 'primary.main', fontWeight: 'bold' }}>
                        {currentK.toFixed(2)} · 
                    </Box>

                    {/* Fraction (Numerator / Denominator) */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Numerator: (1 + Ts) */}
                        <Box sx={{ px: 1 }}>(1 + {compensator.T.toFixed(3)}s)</Box>
                        
                        {/* Horizontal Fraction Bar */}
                        <Box sx={{ width: '100%', height: '1.5px', bgcolor: 'text.primary', my: 0.5 }} />
                        
                        {/* Denominator: (1 + alpha*Ts) */}
                        <Box sx={{ px: 1 }}>(1 + {(compensator.alpha * compensator.T).toFixed(3)}s)</Box>
                    </Box>
                </Box>
            </Box>

            {/* INTERACTIVE FINE-TUNING SECTION */}
            <Box sx={{ px: 1, mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TuneIcon fontSize="small" color="primary" />
                        <Typography variant="caption" fontWeight="bold" color="primary">
                            INTERACTIVE GAIN TUNING
                        </Typography>
                    </Stack>
                    
                    {/* RESET ACTION: Revert to the original AI suggestion */}
                    <Tooltip title="Reset to AI Suggestion">
                        <IconButton 
                            size="small" 
                            onClick={() => setCurrentK(compensator.K)} 
                            disabled={currentK === compensator.K}
                        >
                            <RestartAltIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Slider
                    value={currentK}
                    min={minLimit}
                    max={maxLimit}
                    step={0.01}
                    onChange={(_, value) => setCurrentK(value as number)}
                    valueLabelDisplay="auto"
                />
                <Typography variant="caption" color="text.secondary" display="block" align="center">
                    Adjust K to observe stability sensitivity (Current: {((currentK / compensator.K) * 100).toFixed(0)}% of AI value)
                </Typography>
            </Box>

            {/* NUMERICAL PARAMETERS SUMMARY */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">Tuned Gain (K)</Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ fontFamily: 'Monospace' }}>
                        {currentK.toFixed(4)}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">Target Phase Margin</Typography>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: 'Monospace' }}>
                        {pm.toFixed(2)}°
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ mb: 2 }} />

            {/* EXPORT ACTIONS */}
            <Stack direction="row" spacing={1}>
                <Button 
                    variant="outlined" 
                    fullWidth 
                    size="small" 
                    startIcon={<DownloadIcon />} 
                    onClick={handleExportJSON}
                    sx={{ borderRadius: 2 }}
                >
                    JSON
                </Button>
                <Button 
                    variant="outlined" 
                    fullWidth 
                    size="small" 
                    startIcon={<PictureAsPdfIcon />} 
                    onClick={() => window.print()}
                    sx={{ borderRadius: 2 }}
                >
                    Print
                </Button>
            </Stack>
        </Paper>
    );
};

export default CompensatorDetails;