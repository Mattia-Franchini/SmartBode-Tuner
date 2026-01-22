/**
 * @file HistorySidebar.tsx
 * @description Displays user history with delete functionality.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.1.0
 */

import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Typography, Paper, Box, IconButton, Tooltip } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';

interface HistorySidebarProps {
    projects: any[];
    onSelectProject: (project: any) => void;
    onDeleteProject: (projectId: string) => void; // Nuova prop
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ projects, onSelectProject, onDeleteProject }) => {
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
                        <ListItem 
                            key={proj._id}
                            disablePadding
                            // Il bottone di cancellazione appare a destra
                            secondaryAction={
                                <Tooltip title="Delete">
                                    <IconButton 
                                        edge="end" 
                                        aria-label="delete"
                                        color="error"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Evita di selezionare il progetto mentre lo cancelli
                                            onDeleteProject(proj._id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                        >
                            <ListItemButton onClick={() => onSelectProject(proj)} sx={{ py: 2 }}>
                                <ListItemText 
                                    primary={proj.projectName}
                                    secondary={new Date(proj.createdAt).toLocaleDateString()}
                                    primaryTypographyProps={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))
                )}
            </List>
        </Paper>
    );
};

export default HistorySidebar;