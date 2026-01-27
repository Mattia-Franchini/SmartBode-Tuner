/**
 * @file BentoTile.tsx
 * @description A wrapper component for the Bento Grid layout.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

interface BentoTileProps {
    children: React.ReactNode;
    title?: string;
    icon?: React.ReactNode;
    sx?: any;
}

const BentoTile: React.FC<BentoTileProps> = ({ children, title, icon, sx }) => {
    return (
        <Paper 
            elevation={0} 
            sx={{ 
                p: 3, 
                borderRadius: 5, 
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                },
                ...sx 
            }}
        >
            {(title || icon) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    {icon && <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>}
                    {title && <Typography variant="subtitle2" fontWeight="800" sx={{ textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8 }}>{title}</Typography>}
                </Box>
            )}
            <Box sx={{ flexGrow: 1 }}>
                {children}
            </Box>
        </Paper>
    );
};

export default BentoTile;