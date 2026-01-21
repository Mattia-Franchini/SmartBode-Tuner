import { CssBaseline, Container, Typography, Box } from '@mui/material';

function App() {
  return (
    <>
      <CssBaseline /> 
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            SmartBode Tuner
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Engineering Dashboard v0.1.0
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default App;