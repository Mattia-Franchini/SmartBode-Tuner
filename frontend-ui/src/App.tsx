/**
 * @file App.tsx
 * @description Main Application Entry Point for SmartBode Tuner.
 * Orchestrates Authentication, Theme Management, Data Flow, and UI Layout.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.4.0
 */

import { useState, useMemo } from 'react';
import { CssBaseline, Container, Box, Grid, Alert, Typography, Stack } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// --- Component Imports ---
import Navbar from './components/Navbar';
import BodePlot from './components/BodePlot';
import SystemInputForm from './components/SystemInputForm';
import CompensatorDetails from './components/CompensatorDetails';
import LockedView from './components/LockedView';
import AuthModal from './components/AuthModal';
import MethodologyCard from './components/MethodologyCard';
import HistorySidebar from './components/HistorySidebar';

// --- Logic & Services ---
import { performOptimization, getUserProjects } from './services/apiService';
import type { OptimizationResponse, SystemInput, User } from './types/ControlSystems';

function App() {
  // Global State Management
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [data, setData] = useState<OptimizationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Theme Configuration (Material UI v6)
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

  /**
   * Fetches the design history for the specific user from the backend.
   * @param userId The unique MongoDB ID of the logged-in user.
   */
  const loadHistory = async (userId: string) => {
    try {
      const projects = await getUserProjects(userId);
      setHistory(projects);
    } catch (err) {
      console.error("Failed to load project history:", err);
    }
  };

  /**
   * Main Handler: Sends input data to Node.js Backend -> Python Engine.
   */
  const handleOptimization = async (input: SystemInput) => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    try {
      const response = await performOptimization(input, currentUser.id);
      setData(response);

      // Refresh history immediately to show the newly saved project
      loadHistory(currentUser.id);
    } catch (err) {
      setError("Cannot connect to the Backend Server. Ensure Node.js is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ minHeight: '100vh', pb: 6, bgcolor: 'background.default' }}>

        {/* Navigation Bar */}
        <Navbar
          mode={mode}
          onToggleTheme={toggleTheme}
          onOpenAuth={() => setAuthOpen(true)}
          isLoggedIn={isLoggedIn}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentUser(null);
            setHistory([]); // Clear sensitive data on logout
            setData(null);
          }}
          user={currentUser}
        />

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {/* Authors Attribution */}
          <Box sx={{ mb: 2, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              System Architects: <strong>Mattia Franchini & Michele Bisignano</strong>
            </Typography>
          </Box>

          {isLoggedIn ? (
            /* --- AUTHENTICATED DASHBOARD LAYOUT --- */
            <Grid container spacing={3}>

              {/* COLUMN 1: HISTORY SIDEBAR (Width: 2.5/12) */}
              <Grid size={{ xs: 12, md: 2.5 }}>
                <HistorySidebar
                  projects={history}
                  onSelectProject={(proj) => {
                    // Reconstruct the optimization response from the saved DB document
                    // TODO: In a real scenario, full Bode points should be stored or re-calculated
                    setData({
                      success: true,
                      compensator: proj.results,
                      margins: { pm: proj.results.pm, gm: proj.results.gm },
                      bode: {
                        // Placeholders if plot data isn't stored in DB
                        original: { frequency: [], magnitude: [], phase: [] },
                        compensated: { frequency: [], magnitude: [], phase: [] }
                      },
                      meta: { executionTime: 0, timestamp: proj.createdAt }
                    });
                  }}
                />
              </Grid>

              {/* COLUMN 2: CONFIGURATION PANEL (Width: 3.5/12) */}
              <Grid size={{ xs: 12, md: 3.5 }}>
                <Stack spacing={3}>
                  <SystemInputForm onSubmit={handleOptimization} isLoading={loading} />
                  <MethodologyCard />
                  {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}
                </Stack>
              </Grid>

              {/* COLUMN 3: RESULTS & VISUALIZATION (Width: 6/12) */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container spacing={3}>

                  {/* Top: Frequency Response Chart */}
                  <Grid size={{ xs: 12 }}>
                    <BodePlot
                      data={data?.bode?.compensated ?? null}
                      originalData={data?.bode?.original ?? null}
                      isLoading={loading}
                      title="Frequency Response Analysis"
                    />
                  </Grid>

                  {/* Bottom: Technical Details Card */}
                  {data && data.compensator && !loading && (
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
            /* --- GUEST VIEW (LOCKED) --- */
            <LockedView onOpenAuth={() => setAuthOpen(true)} />
          )}
        </Container>

        {/* Global Authentication Modal */}
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          onLoginSuccess={(userData) => {
            setCurrentUser(userData);
            setIsLoggedIn(true);
            setAuthOpen(false);

            // Trigger history loading immediately upon login
            if (userData.id) loadHistory(userData.id);
          }}
        />

      </Box>
    </ThemeProvider>
  );
}

export default App;