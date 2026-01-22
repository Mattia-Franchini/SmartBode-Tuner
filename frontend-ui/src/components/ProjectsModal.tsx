/**
 * @file ProjectsModal.tsx
 * @description Dialog to manage and load saved user projects.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.0.0
 */

import React from 'react';
import { 
    Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, 
    ListItemText, IconButton, Typography, Box, Chip, Tooltip, Divider 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CloseIcon from '@mui/icons-material/Close';

interface ProjectsModalProps {
    open: boolean;
    onClose: () => void;
    projects: any[];
    onSelectProject: (project: any) => void;
    onDeleteProject: (id: string) => void;
}

const ProjectsModal: React.FC<ProjectsModalProps> = ({ 
    open, onClose, projects, onSelectProject, onDeleteProject 
}) => {
    
    const handleSelect = (proj: any) => {
        onSelectProject(proj);
        onClose(); // Chiude la modale dopo la selezione
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, minHeight: '50vh' } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FolderOpenIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">My Projects</Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <Divider />

            <DialogContent sx={{ p: 0 }}>
                {projects.length === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, opacity: 0.6 }}>
                        <FolderOpenIcon sx={{ fontSize: 60, mb: 2, color: 'text.disabled' }} />
                        <Typography>No saved projects found.</Typography>
                    </Box>
                ) : (
                    <List>
                        {projects.map((proj) => (
                            <ListItem
                                key={proj._id}
                                secondaryAction={
                                    <Tooltip title="Delete Permanently">
                                        <IconButton edge="end" color="error" onClick={() => onDeleteProject(proj._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                                disablePadding
                            >
                                <ListItemButton onClick={() => handleSelect(proj)} sx={{ py: 2, px: 3 }}>
                                    <ListItemText
                                        primary={
                                            <Typography fontWeight="bold">{proj.projectName}</Typography>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {new Date(proj.createdAt).toLocaleDateString()} at {new Date(proj.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </Typography>
                                                <Chip 
                                                    label={proj.results?.type || 'N/A'} 
                                                    size="small" 
                                                    color="primary" 
                                                    variant="outlined" 
                                                    sx={{ mt: 0.5, height: 20, fontSize: '0.65rem' }} 
                                                />
                                            </React.Fragment>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ProjectsModal;