/**
 * @file App.tsx
 * @description Optimized Dashboard Layout for SmartBode Tuner.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.3.0
 */

import React, { useState, useMemo } from 'react';
import { CssBaseline, Container, Box, Grid, Alert, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Stack } from '@mui/material';
import MethodologyCard from './components/MethodologyCard';

// Component Imports
import Navbar from './components/Navbar';
import BodePlot from './components/BodePlot';
import SystemInputForm from './components/SystemInputForm';
import CompensatorDetails from './components/CompensatorDetails';
import LockedView from './components/LockedView';
import AuthModal from './components/AuthModal';

// Logic & Types
//import { mockOptimization } from './services/optimizerMock';
import { performOptimization } from './services/apiService';
import type { OptimizationResponse, SystemInput, User } from './types/ControlSystems';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [data, setData] = useState<OptimizationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      background: {
        default: mode === 'light' ? '#f8f9fa' : '#0a1929',
        paper: mode === 'light' ? '#ffffff' : '#102031',
      },
    },
    shape: { borderRadius: 12 },
  }), [mode]);

  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const handleOptimization = async (input: SystemInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await performOptimization(input);
      setData(response);
    } catch (err) {
      setError("Cannot connect to the Backend Server. Make sure Node.js is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ minHeight: '100vh', pb: 6, bgcolor: 'background.default' }}>
        <Navbar
          mode={mode}
          onToggleTheme={toggleTheme}
          onOpenAuth={() => setAuthOpen(true)}
          isLoggedIn={isLoggedIn}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentUser(null);
          }}
          user={currentUser}
        />

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {/* Authors Tag */}
          <Box sx={{ mb: 2, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              System Architects: <strong>Mattia Franchini & Michele Bisignano</strong>
            </Typography>
          </Box>

          {isLoggedIn ? (
            <Grid container spacing={3}>

              {/* 1. LEFT COLUMN: CONFIGURATION PANEL (MD=4) */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={3}>
                  <SystemInputForm onSubmit={handleOptimization} isLoading={loading} />

                  <MethodologyCard />

                  {error && (
                    <Alert severity="error" sx={{ borderRadius: 3 }}>
                      {error}
                    </Alert>
                  )}
                </Stack>
              </Grid>

              {/* 2. RIGHT COLUMN: RESULTS AREA (MD=8) */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Grid container spacing={3}>

                  {/* Top: Bode Plot Chart */}
                  <Grid size={{ xs: 12 }}>
                    <BodePlot
                      data={data ? data.bode.compensated : null}
                      originalData={data ? data.bode.original : null}
                      isLoading={loading}
                      title="Frequency Response Analysis"
                    />
                  </Grid>

                  {/* Bottom: Optimal Solution Details (Only visible when data is present) */}
                  {data && !loading && (
                    <Grid size={{ xs: 12 }}>
                      <CompensatorDetails
                        compensator={data.compensator}
                        pm={data.margins?.pm || 0}
                        gm={data.margins?.gm || 0}
                      />
                    </Grid>
                  )}

                </Grid>
              </Grid>

            </Grid>
          ) : (
            <LockedView onOpenAuth={() => setAuthOpen(true)} />
          )}
        </Container>

        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          onLoginSuccess={(userData) => {
            setCurrentUser(userData); 
            setIsLoggedIn(true);
            setAuthOpen(false);
            //console.log("User session started for:", userData.fullName);
          }}
        />

      </Box>
    </ThemeProvider>
  );
}

export default App;