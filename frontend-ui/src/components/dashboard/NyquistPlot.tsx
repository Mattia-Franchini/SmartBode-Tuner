/**
 * @file NyquistPlot.tsx
 * @description Visualization of the system frequency response in the complex plane.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

import React from 'react';
import Plot from 'react-plotly.js';
import { Box } from '@mui/material';
import type { Data, Layout } from 'plotly.js';
import type { NyquistData } from '../../types/ControlSystems';

interface NyquistProps {
    data: NyquistData | undefined;
}

const NyquistPlot: React.FC<NyquistProps> = ({ data }) => {
    if (!data || data.real.length === 0) return <Box sx={{ textAlign: 'center', py: 5, opacity: 0.5 }}>No complex data</Box>;

    const traces: Data[] = [
        {
            x: data.real,
            y: data.imag,
            type: 'scatter',
            mode: 'lines',
            name: 'L(jw)',
            line: { color: '#673ab7', width: 3 }
        },
        // CRITICAL POINT (-1, 0)
        {
            x: [-1],
            y: [0],
            type: 'scatter',
            mode: 'markers',
            name: 'Critical Point',
            marker: { color: 'red', size: 10, symbol: 'x' }
        }
    ];

    const layout: Partial<Layout> = {
        margin: { t: 10, b: 40, l: 40, r: 10 },
        xaxis: { title: { text: 'Real' }, gridcolor: '#eee', zeroline: true },
        yaxis: { title: { text: 'Imaginary' }, gridcolor: '#eee', zeroline: true },
        height: 350,
        autosize: true,
        hovermode: 'closest',
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        showlegend: false
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Plot
                useResizeHandler
                style={{ width: '100%', height: '100%' }}
                data={traces}
                layout={layout}
                config={{ responsive: true, displaylogo: false }}
            />
        </Box>
    );
};

export default NyquistPlot;