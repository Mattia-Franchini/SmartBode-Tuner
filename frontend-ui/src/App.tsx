/**
 * @file App.tsx
 * @description Main Entry Point for SmartBode Tuner Frontend.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.1.0
 */

import React, { useState } from 'react';
import { CssBaseline, Container, Typography, Box, Grid, Alert } from '@mui/material';
import BodePlot from './components/BodePlot';
import SystemInputForm from './components/SystemInputForm';
import CompensatorDetails from './components/CompensatorDetails';
import { mockOptimization } from './services/optimizerMock';
import type { OptimizationResponse, SystemInput } from './types/ControlSystems';

function App() {
  const [data, setData] = useState<OptimizationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Optimization Handler
   * Triggers the mock service and updates the global state.
   */
  const handleOptimization = async (input: SystemInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockOptimization(input);
      setData(response);
    } catch (err) {
      setError("An error occurred during the optimization process.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh', pb: 10 }}>
        
        {/* Navigation / Header */}
        <Box sx={{ backgroundColor: '#fff', py: 3, borderBottom: '1px solid #e0e0e0', mb: 4 }}>
          <Container maxWidth="xl">
            <Typography variant="h4" fontWeight="800" color="primary">
              SmartBode Tuner
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Developed by Mattia Franchini & Michele Bisignano
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="xl">
          {/* 
              In MUI v6, 'container' is still used, 
              but children use the 'size' prop instead of 'item' and 'xs/md'.
          */}
          <Grid container spacing={4}>
            
            {/* Sidebar: Inputs and Numeric Results */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <SystemInputForm onSubmit={handleOptimization} isLoading={loading} />
                </Grid>
                
                {data && !loading && (
                  <Grid size={{ xs: 12 }}>
                    <CompensatorDetails 
                        compensator={data.compensator} 
                        pm={data.margins.pm} 
                        gm={data.margins.gm} 
                    />
                  </Grid>
                )}

                {error && (
                  <Grid size={{ xs: 12 }}>
                    <Alert severity="error">{error}</Alert>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Main Area: Charts */}
            <Grid size={{ xs: 12, md: 8 }}>
                <BodePlot 
                    data={data ? data.bode.compensated : null} 
                    isLoading={loading} 
                    title="Frequency Response (Bode Plot)" 
                />
            </Grid>

          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default App;