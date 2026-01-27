/**
 * @file App.tsx
 * @description Main Application with Dropdown Navigation and Project Modal.
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.6.0
 */

import { useState, useMemo } from 'react';
import { CssBaseline, Container, Box, Grid, Alert, Typography, Stack } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { AlertColor } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import FunctionsIcon from '@mui/icons-material/Functions';

// Imports
import Navbar from './components/Navbar';
import BodePlot from './components/BodePlot';
import SystemInputForm from './components/SystemInputForm';
import CompensatorDetails from './components/CompensatorDetails';
import LockedView from './components/LockedView';
import AuthModal from './components/AuthModal';
import MethodologyCard from './components/MethodologyCard';
import ProjectsModal from './components/ProjectsModal';
import FeedbackSnackbar from './components/FeedbackSnackbar';
import StepResponsePlot from './components/StepResponsePlot';
import SummaryCards from './components/SummaryCards';
import DashboardSkeleton from './components/DashboardSkeleton';
import BentoTile from './components/BentoTile';

import { performOptimization, getUserProjects, deleteProject, updateProjectName } from './services/apiService';
import type { OptimizationResponse, SystemInput, User } from './types/ControlSystems';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [data, setData] = useState<OptimizationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showNotify = (message: string, severity: AlertColor = 'success') => {
    setSnackbar({ open: true, message, severity });
  };


  // Auth & Modals State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [projectsOpen, setProjectsOpen] = useState<boolean>(false); // Nuovo stato
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [history, setHistory] = useState<any[]>([]);

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

  const loadHistory = async (userId: string) => {
    try {
      const projects = await getUserProjects(userId);
      setHistory(projects);
    } catch (err) { console.error(err); }
  };

  const handleOptimization = async (input: SystemInput) => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const response = await performOptimization(input, currentUser!.id);
      const fullData = { ...response, inputData: input };
      setData(fullData);
      loadHistory(currentUser!.id);
      showNotify("Optimization successful!", "success");
    } catch (err) {
      setError("Backend connection error.");
      showNotify("Optimization failed. Check server status.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!currentUser) return;
    if (window.confirm("Delete this project permanently?")) {
      try {
        await deleteProject(projectId);
        loadHistory(currentUser.id);
        setData(null);
        showNotify("Project removed from database.", "info");
      } catch (err) {
        showNotify("Failed to delete project.", "error");
      }
    }
  };

  const handleSelectProject = (proj: any) => {
    setData({
      success: true,
      compensator: proj.results,
      margins: { pm: proj.results.pm || 0, gm: proj.results.gm || 0 },
      inputData: proj.inputData,
      stepResponse: {
        time: [],
        amplitude: []
      },

      bode: {
        original: { frequency: [], magnitude: [], phase: [] },
        compensated: { frequency: [], magnitude: [], phase: [] }
      },
      meta: { executionTime: 0, timestamp: proj.createdAt }
    });
  };

  const handleRenameProject = async (projectId: string, newName: string) => {
    if (!currentUser) return;
    try {
      await updateProjectName(projectId, newName);
      loadHistory(currentUser.id);
      showNotify("Project renamed successfully", "info");
    } catch (err) {
      showNotify("Failed to rename project", "error");
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
          user={currentUser}
          onOpenProjects={() => setProjectsOpen(true)}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentUser(null);
            setHistory([]);
            setData(null);
            showNotify("Logged out successfully. See you soon!", "info");
          }}
        />

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {/* Authors Tag */}
          <Box sx={{ mb: 2, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              System Architects: <strong>Mattia Franchini & Michele Bisignano</strong>
            </Typography>
          </Box>

          {isLoggedIn ? (
            <Grid container spacing={3} alignItems="stretch">

              {/* --- LEFT COLUMN: ALWAYS VISIBLE --- */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={3} sx={{ height: '100%' }}>
                  <BentoTile title="Design Config" icon={<SettingsInputComponentIcon />}>
                    <SystemInputForm onSubmit={handleOptimization} isLoading={loading} />
                  </BentoTile>
                  {!loading && <BentoTile title="AI Methodology" icon={<PsychologyIcon />}><MethodologyCard /></BentoTile>}
                </Stack>
              </Grid>

              {/* --- RIGHT COLUMN: DYNAMIC AREA --- */}
              <Grid size={{ xs: 12, md: 8 }}>

                {loading ? (
                  <DashboardSkeleton />
                ) : !data ? (
                  <BentoTile sx={{ height: '100%', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed' }}>
                    <Typography color="text.secondary">Configure system parameters to start analysis</Typography>
                  </BentoTile>
                ) : (
                  <Grid container spacing={3}>
                    {/* Row 1: KPI Summary */}
                    <Grid size={{ xs: 12 }}>
                      <SummaryCards pm={data.margins.pm} gain={data.compensator.K} type={data.compensator.type} />
                    </Grid>

                    {/* Row 2: Bode Plot */}
                    <Grid size={{ xs: 12 }}>
                      <BentoTile title="Frequency Response" icon={<ShowChartIcon />}>
                        <BodePlot
                          data={data?.bode?.compensated ?? null}
                          originalData={data?.bode?.original ?? null}
                          title=""
                        />
                      </BentoTile>
                    </Grid>

                    {/* Row 3: Technical Details & Step Response */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <BentoTile title="Compensator Details" icon={<FunctionsIcon />} sx={{ height: '100%' }}>
                        <CompensatorDetails
                          compensator={data.compensator}
                          pm={data.margins.pm}
                          gm={data.margins.gm}
                          plantInput={data.inputData || null}
                        />
                      </BentoTile>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <BentoTile title="Time Domain" icon={<AnalyticsIcon />} sx={{ height: '100%' }}>
                        <StepResponsePlot data={data?.stepResponse} />
                      </BentoTile>
                    </Grid>
                  </Grid>
                )}
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
            const firstName = userData.fullName.split(' ')[0];
            showNotify(`Welcome back, ${firstName}!`, 'success');
          }}
          onNotify={showNotify}
        />

        <ProjectsModal
          open={projectsOpen}
          onClose={() => setProjectsOpen(false)}
          projects={history}
          onSelectProject={handleSelectProject}
          onDeleteProject={handleDeleteProject}
          onRenameProject={handleRenameProject}
        />

      </Box>

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />

    </ThemeProvider>
  );
}

export default App;