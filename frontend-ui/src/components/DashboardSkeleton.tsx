/**
 * @file DashboardSkeleton.tsx
 * @description Pulsating placeholders that mimic the results dashboard layout.
 * Used to improve perceived performance during AI computation.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

import React from 'react';
import { Grid, Paper, Box, Skeleton, Stack } from '@mui/material';

const DashboardSkeleton: React.FC = () => {
    return (
        <Grid container spacing={3}>
            {/* 1. KPI Cards Skeletons (The 3 Summary Cards) */}
            <Grid size={{ xs: 12 }}>
                <Grid container spacing={2}>
                    {[1, 2, 3].map((item) => (
                        <Grid size={{ xs: 12, sm: 4 }} key={item}>
                            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                                    <Box sx={{ width: '100%' }}>
                                        <Skeleton variant="text" width="60%" height={20} />
                                        <Skeleton variant="text" width="40%" height={30} />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            {/* 2. Bode Plot Skeleton (The Big Chart) */}
            <Grid size={{ xs: 12 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" width="100%" height={450} sx={{ borderRadius: 2 }} />
                </Paper>
            </Grid>

            {/* 3. Results Card and Step Response Skeleton */}
            <Grid size={{ xs: 12 }}>
                <Stack spacing={3}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Skeleton variant="rectangular" width="40%" height={30} />
                            <Skeleton variant="rectangular" width="15%" height={25} />
                        </Box>
                        <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: 2, mb: 2 }} />
                        <Grid container spacing={2}>
                            {[1, 2, 3, 4].map((i) => (
                                <Grid size={{ xs: 6 }} key={i}>
                                    <Skeleton variant="text" width="80%" />
                                    <Skeleton variant="text" width="50%" height={30} />
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                    <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 4 }} />
                </Stack>
            </Grid>
        </Grid>
    );
};

export default DashboardSkeleton;