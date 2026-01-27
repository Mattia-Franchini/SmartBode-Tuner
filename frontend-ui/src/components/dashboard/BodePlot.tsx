/**
 * @file BodePlot.tsx
 * @description Advanced Visualization Component for Bode Diagrams with Comparison Mode.
 * 
 * This component renders both Original (Uncompensated) and Compensated frequency 
 * responses. It uses a synchronized dual-plot grid layout (Magnitude/Phase) 
 * and handles Plotly's TypeScript constraints via explicit axis mapping.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.2.0
 */

import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { Paper, Typography, Box, CircularProgress, Stack, FormControlLabel, Switch } from '@mui/material';
import type { Data, Layout } from 'plotly.js';
import type { BodePlotData } from '../../types/ControlSystems';

interface BodePlotProps {
  /** The optimized system data */
  data: BodePlotData | null;
  /** The raw plant data (before control) */
  originalData?: BodePlotData | null;
  /** Chart title */
  title?: string;
  /** Loading state flag */
  isLoading?: boolean;
}

const BodePlot: React.FC<BodePlotProps> = ({
  data,
  originalData,
  title = 'Bode Diagram',
  isLoading = false
}) => {
  // Local state to toggle the visibility of the original system traces
  const [showOriginal, setShowOriginal] = useState(true);

  // 1. Loading State
  if (isLoading) {
    return (
      <Paper elevation={3} sx={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Simulating Frequency Response...</Typography>
      </Paper>
    );
  }

  // 2. Empty State
  if (!data) {
    return (
      <Paper elevation={3} sx={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
        <Typography color="text.secondary">Ready for System Analysis</Typography>
      </Paper>
    );
  }

  /**
   * 3. Trace Construction
   * We use the 'any' cast for specific plotly attributes to bypass the 
   * Partial<DataTitle> TypeScript bug while maintaining overall structure.
   */
  const plotTraces: Data[] = [];

  // Add Original System Traces (Dashed, Gray) if available and toggled ON
  if (originalData && showOriginal) {
    plotTraces.push(
      {
        x: originalData.frequency,
        y: originalData.magnitude,
        type: 'scatter',
        mode: 'lines',
        name: 'Original Mag (dB)',
        line: { color: 'rgba(150, 150, 150, 0.5)', width: 2, dash: 'dot' },
        xaxis: 'x' as any,
        yaxis: 'y' as any
      },
      {
        x: originalData.frequency,
        y: originalData.phase,
        type: 'scatter',
        mode: 'lines',
        name: 'Original Phase (deg)',
        line: { color: 'rgba(150, 150, 150, 0.5)', width: 2, dash: 'dot' },
        xaxis: 'x2' as any,
        yaxis: 'y2' as any
      }
    );
  }

  // Add Compensated System Traces (Solid, Bold colors)
  plotTraces.push(
    {
      x: data.frequency,
      y: data.magnitude,
      type: 'scatter',
      mode: 'lines',
      name: 'Compensated Mag (dB)',
      line: { color: '#1976d2', width: 3 },
      xaxis: 'x' as any,
      yaxis: 'y' as any
    },
    {
      x: data.frequency,
      y: data.phase,
      type: 'scatter',
      mode: 'lines',
      name: 'Compensated Phase (deg)',
      line: { color: '#d32f2f', width: 3 },
      xaxis: 'x2' as any,
      yaxis: 'y2' as any
    }
  );

  // 4. Layout Configuration (Grid-based to solve TS Overload issues)
  const layout: Partial<Layout> = {
    grid: { rows: 2, columns: 1, pattern: 'independent' },
    showlegend: true,
    legend: { orientation: 'h', x: 0, y: 1.1 },
    margin: { t: 30, b: 50, l: 60, r: 20 },
    hovermode: 'closest',
    
    // Top Subplot (Magnitude)
    xaxis: {
      type: 'log',
      title: { text: 'Frequency (rad/s)' },
      gridcolor: '#eee',
      zeroline: false
    },
    yaxis: {
      title: { text: 'Magnitude (dB)' },
      domain: [0.55, 1],
      gridcolor: '#eee',
      zeroline: true
    },

    // Bottom Subplot (Phase)
    xaxis2: {
      type: 'log',
      title: { text: 'Frequency (rad/s)' },
      gridcolor: '#eee',
      zeroline: false,
      anchor: 'y2'
    },
    yaxis2: {
      title: { text: 'Phase (deg)' },
      domain: [0, 0.45],
      gridcolor: '#eee',
      range: [-270, 90]
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%', minHeight: '550px', borderRadius: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          {title}
        </Typography>
        
        {/* Toggle switch for Comparison Mode */}
        {originalData && (
          <FormControlLabel
            control={
              <Switch 
                checked={showOriginal} 
                onChange={(e) => setShowOriginal(e.target.checked)} 
                color="primary"
              />
            }
            label={<Typography variant="body2" color="text.secondary">Show Original</Typography>}
          />
        )}
      </Stack>

      <Box sx={{ width: '100%', height: 450 }}>
        <Plot
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
          data={plotTraces}
          layout={layout}
          config={{ 
            responsive: true, 
            displayModeBar: true, 
            displaylogo: false,
            toImageButtonOptions: { format: 'png', filename: 'smartbode_plot' }
          }}
        />
      </Box>
    </Paper>
  );
};

export default BodePlot;