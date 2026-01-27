/**
 * @file StepResponsePlot.tsx
 * @description Visualization component for Time-Domain Step Response.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.1
 */

import React from 'react';
import Plot from 'react-plotly.js';
import {Box, CircularProgress, Typography } from '@mui/material';
import type { Data, Layout } from 'plotly.js';
import type { StepResponseData } from '../../types/ControlSystems';

interface StepResponseProps {
    data: StepResponseData | undefined; 
    isLoading?: boolean;
}

const StepResponsePlot: React.FC<StepResponseProps> = ({ data, isLoading }) => {
    
    if (isLoading) {
        return (
            <Box>
                <CircularProgress size={30} />
                <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>Simulating Step Response...</Typography>
            </Box>
        );
    }

    if (!data) return null;

    const traces: Data[] = [{
        x: data.time,
        y: data.amplitude,
        type: 'scatter',
        mode: 'lines',
        name: 'Step Response',
        line: { color: '#2e7d32', width: 3 }
    }];

    const layout: Partial<Layout> = {
        title: { 
            text: '<b>Closed-Loop Step Response</b>', 
            font: { size: 16, color: '#1976d2' } 
        },
        margin: { t: 40, b: 40, l: 50, r: 20 },
        xaxis: { 
            title: { text: 'Time (s)' }, 
            gridcolor: '#eee',
            zeroline: false
        },
        yaxis: { 
            title: { text: 'Amplitude' }, 
            gridcolor: '#eee',
            zeroline: false
        },
        hovermode: 'closest',
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        showlegend: false
    };

    return (
        <Box>
            <Box sx={{ width: '100%', height: 300 }}>
                <Plot
                    useResizeHandler
                    style={{ width: '100%', height: '100%' }}
                    data={traces}
                    layout={layout}
                    config={{ responsive: true, displaylogo: false }}
                />
            </Box>
        </Box>
    );
};

export default StepResponsePlot;