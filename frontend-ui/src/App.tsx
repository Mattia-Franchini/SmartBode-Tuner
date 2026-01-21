/**
 * @file App.tsx
 * @description Root component with Theme Management and Main Layout.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.2.0
 */

import React, { useState, useMemo } from 'react';
import { CssBaseline, Container, Box, Grid, Alert, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Component Imports
import Navbar from './components/Navbar';
import BodePlot from './components/BodePlot';
import SystemInputForm from './components/SystemInputForm';
import CompensatorDetails from './components/CompensatorDetails';

// Logic & Types
import { mockOptimization } from './services/optimizerMock';
import type { OptimizationResponse, SystemInput } from './types/ControlSystems';

function App() {
  // 1. STATE FOR THEME MODE
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // 2. STATE FOR DATA
  const [data, setData] = useState<OptimizationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 3. CREATE DYNAMIC THEME
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2', // Blue Ingegneria
      },
      background: {
        default: mode === 'light' ? '#f4f6f8' : '#0a1929',
        paper: mode === 'light' ? '#ffffff' : '#102031',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
  }), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleOptimization = async (input: SystemInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockOptimization(input);
      setData(response);
    } catch (err) {
      setError("An error occurred during the optimization process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Manages global background colors based on theme */}
      
      <Box sx={{ minHeight: '100vh', pb: 10, bgcolor: 'background.default' }}>
        
        {/* NAVBAR */}
        <Navbar mode={mode} onToggleTheme={toggleTheme} />

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {/* Authors Attribution */}
          <Box sx={{ mb: 4, textAlign: 'right' }}>
             <Typography variant="caption" color="text.secondary">
               System Architects: <strong>Mattia Franchini & Michele Bisignano</strong>
             </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Sidebar */}
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

            {/* Charts Area */}
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
    </ThemeProvider>
  );
}

export default App;