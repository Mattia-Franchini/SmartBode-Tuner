/**
 * @file CompensatorDetails.tsx
 * @description Enhanced results card with high-fidelity mathematical fraction rendering.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.2.0
 */

import React from 'react';
import { Paper, Typography, Box, Grid, Divider, Chip, Button, Stack } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import type { Compensator } from '../types/ControlSystems';

interface CompensatorDetailsProps {
    compensator: Compensator;
    pm: number;
    gm: number;
}

const CompensatorDetails: React.FC<CompensatorDetailsProps> = ({ compensator, pm, gm }) => {
    
    const handleExportJSON = () => {
        const dataToExport = {
            project: "SmartBode Tuner Design",
            authors: ["Mattia Franchini", "Michele Bisignano"],
            timestamp: new Date().toISOString(),
            results: {
                compensator,
                stability_margins: { phase_margin: pm, gain_margin: gm }
            }
        };
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `smartbode_result.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, borderLeft: '6px solid #4caf50', borderRadius: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="800" color="success.main">
                    Optimal Solution
                </Typography>
                <Chip label={compensator.type} color="primary" variant="filled" size="small" sx={{ fontWeight: 'bold' }} />
            </Stack>
            
            <Divider sx={{ mb: 2 }} />

            {/* REAL MATHEMATICAL FRACTION BOX */}
            <Box sx={{ 
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                p: 3, borderRadius: 2, mb: 3, border: '1px solid', borderColor: 'divider',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, letterSpacing: 1 }}>
                    TRANSFER FUNCTION C(s)
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', fontFamily: '"Times New Roman", Times, serif', fontStyle: 'italic', fontSize: '1.4rem' }}>
                    
                    {/* Identificativo della funzione C(s) */}
                    <Box sx={{ mr: 1, fontWeight: 'bold' }}>
                        C(s) = 
                    </Box>
                    
                    {/* Gain K */}
                    <Box sx={{ mr: 1 }}>
                        {compensator.K.toFixed(2)} ·
                    </Box>

                    {/* Fraction Wrapper */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Numerator */}
                        <Box sx={{ px: 1 }}>
                            (1 + {compensator.T.toFixed(3)}s)
                        </Box>
                        
                        {/* Horizontal Fraction Bar */}
                        <Box sx={{ width: '100%', height: '1.5px', bgcolor: 'text.primary', my: 0.5 }} />
                        
                        {/* Denominator */}
                        <Box sx={{ px: 1 }}>
                            (1 + {(compensator.alpha * compensator.T).toFixed(3)}s)
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* PARAMETERS GRID */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Gain (K)', value: compensator.K.toFixed(4) },
                    { label: 'Time Constant (T)', value: compensator.T.toFixed(4) + 's' },
                    { label: 'Alpha (α)', value: compensator.alpha.toFixed(4) },
                    { label: 'Phase Margin', value: pm.toFixed(2) + '°' }
                ].map((item, index) => (
                    <Grid size={{ xs: 6 }} key={index}>
                        <Typography variant="caption" color="text.secondary" display="block">{item.label}</Typography>
                        <Typography variant="subtitle1" sx={{ fontFamily: 'Monospace', fontWeight: 'bold' }}>
                            {item.value}
                        </Typography>
                    </Grid>
                ))}
            </Grid>

            <Stack direction="row" spacing={1}>
                <Button variant="outlined" fullWidth size="small" startIcon={<DownloadIcon />} onClick={handleExportJSON}>
                    Export JSON
                </Button>
                <Button variant="outlined" fullWidth size="small" startIcon={<PictureAsPdfIcon />} onClick={() => window.print()}>
                    Print Report
                </Button>
            </Stack>
        </Paper>
    );
};

export default CompensatorDetails;