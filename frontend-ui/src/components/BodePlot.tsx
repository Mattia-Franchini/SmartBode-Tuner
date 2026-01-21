/**
 * @file BodePlot.tsx
 * @description Reusable Visualization Component for Bode Diagrams.
 * 
 * This component utilizes `react-plotly.js` to render high-performance,
 * interactive frequency response charts. It uses a "Grid" layout approach
 * to handle dual subplots (Magnitude and Phase) avoiding TypeScript conflicts.
 * 
 * @author [Mattia Franchini & Michele Bisignano]
 * @version 1.1.0
 */

import React from 'react';
import Plot from 'react-plotly.js';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import type { Data, Layout } from 'plotly.js';
import type { BodePlotData } from '../types/ControlSystems';

interface BodePlotProps {
  /** The raw frequency response data (mag, phase, freq). Null if not yet calculated. */
  data: BodePlotData | null;
  /** Optional title for the chart card. */
  title?: string;
  /** Boolean flag to show loading spinner. */
  isLoading?: boolean;
}

const BodePlot: React.FC<BodePlotProps> = ({
  data,
  title = 'Bode Diagram',
  isLoading = false
}) => {
  
  // 1. Loading State
  if (isLoading) {
    return (
      <Paper elevation={3} sx={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Computing Frequency Response...</Typography>
      </Paper>
    );
  }

  // 2. Empty State
  if (!data) {
    return (
      <Paper elevation={3} sx={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">
          No data available. Run optimization to view results.
        </Typography>
      </Paper>
    );
  }

  // 3. Data Definitions
  // We removed explicit 'xaxis'/'yaxis' mapping here to solve TypeScript conflicts.
  // Plotly's Grid layout handles the assignment automatically (Trace 1 -> Row 1, Trace 2 -> Row 2).
  const plotTraces: Data[] = [
    {
      x: data.frequency,
      y: data.magnitude,
      type: 'scatter',
      mode: 'lines',
      name: 'Magnitude (dB)',
      line: { color: '#1976d2', width: 2.5 }
    },
    {
      x: data.frequency,
      y: data.phase,
      type: 'scatter',
      mode: 'lines',
      name: 'Phase (deg)',
      line: { color: '#d32f2f', width: 2.5 }
    }
  ];

  // 4. Layout Configuration
  // We define two X-axes and two Y-axes to support the stacked subplot structure.
  const layout: Partial<Layout> = {
    grid: { rows: 2, columns: 1, pattern: 'independent' },
    showlegend: true,
    legend: { orientation: 'h', x: 0, y: 1.1 },
    margin: { t: 30, b: 50, l: 60, r: 20 },

    // Top Subplot (Magnitude)
    xaxis: {
      type: 'log',
      title: { text: 'Frequency (rad/s)' },
      gridcolor: '#eee',
      zeroline: false
    },
    yaxis: {
      title: { text: 'Magnitude (dB)' },
      domain: [0.55, 1], // Top 45%
      gridcolor: '#eee',
      zeroline: true
    },

    // Bottom Subplot (Phase)
    // Note: We define 'xaxis2' and 'yaxis2' for the second grid cell
    xaxis2: {
      type: 'log',
      title: { text: 'Frequency (rad/s)' },
      gridcolor: '#eee',
      zeroline: false
    },
    yaxis2: {
      title: { text: 'Phase (deg)' },
      domain: [0, 0.45], // Bottom 45%
      gridcolor: '#eee',
      range: [-270, 90]
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%', minHeight: '500px' }}>
      <Typography variant="h6" gutterBottom color="primary">
        {title}
      </Typography>

      <Box sx={{ width: '100%', height: 450 }}>
        <Plot
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
          data={plotTraces}
          layout={layout}
          config={{ responsive: true, displayModeBar: true, displaylogo: false }}
        />
      </Box>
    </Paper>
  );
};

export default BodePlot;