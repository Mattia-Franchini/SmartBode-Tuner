/**
 * @file DashboardSkeleton.tsx
 * @description Specialized skeletons for the Bento Grid layout.
 * Mimics the exact structure of the results area to prevent layout shift.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.1.0
 */

import React from 'react';
import { Grid, Box, Skeleton, Stack } from '@mui/material';
import BentoTile from './BentoTile';

const DashboardSkeleton = () => {
    return (
        <Grid container spacing={3}>
            {/* 1. KPI Skeletons (Row 1) */}
            <Grid size={{ xs: 12 }}>
                <Grid container spacing={2}>
                    {[1, 2, 3].map((i) => (
                        <Grid size={{ xs: 12, sm: 4 }} key={i}>
                            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 4 }} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            {/* 2. Bode Plot Skeleton (Row 2 - Right part) */}
            <Grid size={{ xs: 12 }}>
                <BentoTile title="Analysis" sx={{ height: 450 }}>
                    <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" width="100%" height={350} sx={{ borderRadius: 2 }} />
                </BentoTile>
            </Grid>

            {/* 3. Bottom Row Skeletons (Row 3 - 4+4+4) */}
            {[1, 2, 3].map((i) => (
                <Grid size={{ xs: 12, md: 4 }} key={i}>
                    <BentoTile sx={{ height: 300 }}>
                        <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
                        <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: 2 }} />
                        <Stack spacing={1} sx={{ mt: 2 }}>
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="60%" />
                        </Stack>
                    </BentoTile>
                </Grid>
            ))}
        </Grid>
    );
};

export default DashboardSkeleton;