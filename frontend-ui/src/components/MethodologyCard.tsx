/**
 * @file MethodologyCard.tsx
 * @description Academic context card showcasing the AI optimization strategy.
 * Features improved mathematical symbol rendering for K, T, and Alpha.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.2.1
 */

import React from 'react';
import { Typography, Box, Stack, List, ListItem, ListItemIcon, ListItemText, Divider, Chip } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

/**
 * A small helper component to render mathematical variables 
 * with a LaTeX-like serif italic style.
 */
const MathVar = ({ children }: { children: React.ReactNode }) => (
    <Box 
        component="span" 
        sx={{ 
            fontFamily: '"Times New Roman", Times, serif', 
            fontStyle: 'italic', 
            fontWeight: 'bold',
            mx: 0.2,
            fontSize: '1.1rem',
            color: 'primary.main'
        }}
    >
        {children}
    </Box>
);

const MethodologyCard = () => {
    return (
        <Box sx={{ p: 1 }}>
            <Stack spacing={2.5}>
                {/* 1. Introductory Text with Formatted Math Variables */}
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    The synthesis engine employs a <strong>Differential Evolution (DE)</strong> metaheuristic to identify the global optimum in the 
                    <MathVar>K</MathVar>, <MathVar>T</MathVar>, <MathVar>α</MathVar> parameter space.
                </Typography>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {/* 2. Core Pillars of the Algorithm */}
                <Typography variant="caption" fontWeight="800" color="primary" sx={{ textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Optimization Pillars
                </Typography>

                <List sx={{ p: 0 }}>
                    <ListItem disableGutters sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                            <SecurityIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Stability Enforcement" 
                            secondary="Strict pole-placement verification."
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                        />
                    </ListItem>

                    <ListItem disableGutters sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                            <AutoGraphIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Fitness Logic" 
                            secondary="Quadratic error minimization for Target PM."
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                        />
                    </ListItem>

                    <ListItem disableGutters sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                            <SpeedIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Stochastic Search" 
                            secondary="Ensures finding the global minimum."
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                        />
                    </ListItem>
                </List>

                {/* 3. Technical Meta-data Chips */}
                <Box sx={{ 
                    mt: 1, 
                    p: 2, 
                    borderRadius: 3, 
                    bgcolor: 'action.hover', 
                    border: '1px solid', 
                    borderColor: 'divider' 
                }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                        <PrecisionManufacturingIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="caption" fontWeight="bold">COMPUTATIONAL SPECS</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip label="LTI Model" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                        <Chip label="Lead/Lag" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                        <Chip label="Evolutionary" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default MethodologyCard;