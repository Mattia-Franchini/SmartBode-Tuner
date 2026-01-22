/**
 * @file App.tsx
 * @description Main Application Entry Point for SmartBode Tuner.
 * Orchestrates Authentication, Theme Management, Data Flow, and UI Layout.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.5.0
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
import { performOptimization, getUserProjects, deleteProject } from './services/apiService';
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
   * Main Handler: Sends input data to Node.js Backend.
   */
  const handleOptimization = async (input: SystemInput) => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    try {
      const response = await performOptimization(input, currentUser.id);
      setData(response);
      loadHistory(currentUser.id);
    } catch (err) {
      setError("Cannot connect to the Backend Server. Ensure Node.js is running.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles project deletion via API and updates UI.
   */
  const handleDeleteProject = async (projectId: string) => {
    if (!currentUser) return;

    if (window.confirm("Are you sure you want to delete this design?")) {
      try {
        await deleteProject(projectId);
        loadHistory(currentUser.id); // Refresh list
        setData(null); // Clear current view if deleted
      } catch (err) {
        console.error("Failed to delete project", err);
      }
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
            setHistory([]); 
            setData(null);
          }}
          user={currentUser}
        />

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Box sx={{ mb: 2, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              System Architects: <strong>Mattia Franchini & Michele Bisignano</strong>
            </Typography>
          </Box>

          {isLoggedIn ? (
            <Grid container spacing={3}>

              {/* COLUMN 1: HISTORY SIDEBAR (Width: 2.5/12) */}
              <Grid size={{ xs: 12, md: 2.5 }}>
                <HistorySidebar
                  projects={history}
                  onDeleteProject={handleDeleteProject} // FIX: Posizionato correttamente qui!
                  onSelectProject={(proj) => {
                    // Safe Data Reconstruction
                    setData({
                      success: true,
                      compensator: proj.results,
                      // Use defaults (|| 0) to prevent crashes on old data
                      margins: { 
                        pm: proj.results.pm || 0, 
                        gm: proj.results.gm || 0 
                      },
                      // Mock points for history viewing (prevents white chart)
                      bode: {
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
            if (userData.id) loadHistory(userData.id);
          }}
        />

      </Box>
    </ThemeProvider>
  );
}

export default App;