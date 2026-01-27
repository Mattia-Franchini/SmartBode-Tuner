/**
 * @file SummaryCards.tsx
 * @description Quick-look dashboard cards for key performance indicators (KPIs).
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

import React from 'react';
import { Grid, Paper, Typography, Box, Avatar } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import CategoryIcon from '@mui/icons-material/Category';
import FunctionsIcon from '@mui/icons-material/Functions';

interface SummaryCardsProps {
    pm: number;
    gain: number;
    type: string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ pm, gain, type }) => {
    const getPmColor = (val: number) => {
        if (val >= 45) return '#4caf50'; // Safe Green
        if (val >= 30) return '#ff9800'; // Warning Orange 
        return '#f44336';                // Danger Red
    };

    const cards = [
        {
            title: 'Phase Margin',
            value: `${pm.toFixed(2)}°`,
            icon: <SpeedIcon />,
            color: getPmColor(pm),
            desc: pm >= 30 ? 'Stable System' : 'Low Stability'
        },
        {
            title: 'Network Type',
            value: type,
            icon: <CategoryIcon />,
            color: '#1976d2', // Engineering Blue
            desc: type === 'LEAD' ? 'Phase Advance' : 'Phase Lag'
        },
        {
            title: 'Optimal Gain (K)',
            value: gain.toFixed(3),
            icon: <FunctionsIcon />,
            color: '#9c27b0', // Purple for math
            desc: 'Calculated by AI'
        }
    ];

    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {cards.map((card, index) => (
                <Grid size={{ xs: 12, sm: 4 }} key={index}>
                    <Paper elevation={2} sx={{ 
                        p: 2, 
                        borderRadius: 3, 
                        display: 'flex', 
                        alignItems: 'center',
                        borderBottom: `4px solid ${card.color}`
                    }}>
                        <Avatar sx={{ bgcolor: `${card.color}20`, color: card.color, mr: 2 }}>
                            {card.icon}
                        </Avatar>
                        <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                                {card.title}
                            </Typography>
                            <Typography variant="h6" fontWeight="800">
                                {card.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                                {card.desc}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default SummaryCards;