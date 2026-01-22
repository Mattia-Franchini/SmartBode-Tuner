/**
 * @file HistorySidebar.tsx
 * @description Displays a list of previous designs for the logged-in user.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

import React from 'react';
import { List, ListItemButton, ListItemText, Typography, Paper, Divider, Box, Tooltip } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import LaunchIcon from '@mui/icons-material/Launch';

interface HistorySidebarProps {
    projects: any[];
    onSelectProject: (project: any) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ projects, onSelectProject }) => {
    return (
        <Paper elevation={3} sx={{ borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon />
                <Typography variant="h6" fontWeight="bold">History</Typography>
            </Box>
            
            <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
                {projects.length === 0 ? (
                    <Typography variant="body2" sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                        No saved designs yet.
                    </Typography>
                ) : (
                    projects.map((proj) => (
                        <React.Fragment key={proj._id}>
                            <ListItemButton onClick={() => onSelectProject(proj)} sx={{ py: 2 }}>
                                <ListItemText 
                                    primary={proj.projectName}
                                    secondary={new Date(proj.createdAt).toLocaleDateString()}
                                    primaryTypographyProps={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                                />
                                <Tooltip title="Load Design">
                                    <LaunchIcon fontSize="small" color="action" />
                                </Tooltip>
                            </ListItemButton>
                            <Divider />
                        </React.Fragment>
                    ))
                )}
            </List>
        </Paper>
    );
};

export default HistorySidebar;