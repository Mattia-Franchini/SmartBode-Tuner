/**
 * @file Navbar.tsx
 * @description Navigation bar with extended User Dropdown Menu (Profile, Settings, Projects).
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.5.0
 */

import React, { useState } from 'react';
import { 
    AppBar, Toolbar, Typography, Button, IconButton, Box, Stack, Container, 
    Avatar, Menu, MenuItem, ListItemIcon, Divider 
} from '@mui/material';

// Icons
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import TuneIcon from '@mui/icons-material/Tune';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';     
import SettingsIcon from '@mui/icons-material/Settings'; 

import type { User } from '../types/ControlSystems';

interface NavbarProps {
    mode: 'light' | 'dark';
    onToggleTheme: () => void;
    onOpenAuth: () => void;   
    isLoggedIn: boolean;      
    onLogout: () => void; 
    user: User | null;
    onOpenProjects: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, onToggleTheme, onOpenAuth, isLoggedIn, onLogout, user, onOpenProjects }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Placeholder function for future features
    const handlePlaceholderAction = (actionName: string) => {
        handleMenuClose();
        alert(`${actionName} feature coming soon in v1.1!`);
    };

    const handleOpenProjects = () => {
        handleMenuClose();
        onOpenProjects();
    };

    const handleLogout = () => {
        handleMenuClose();
        onLogout();
    };

    return (
        <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', color: 'text.primary' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* LOGO */}
                    <TuneIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '.1rem', color: 'inherit' }}>
                        SmartBode
                    </Typography>

                    {/* ACTIONS */}
                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton onClick={onToggleTheme} color="inherit">
                            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>

                        {isLoggedIn && user ? (
                            <>
                                {/* USER DROPDOWN TRIGGER */}
                                <Button 
                                    onClick={handleMenuClick}
                                    color="inherit"
                                    endIcon={<KeyboardArrowDownIcon />}
                                    sx={{ textTransform: 'none', px: 1, borderRadius: 2 }}
                                >
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', mr: 1, fontSize: '0.9rem' }}>
                                        {user.fullName.charAt(0)}
                                    </Avatar>
                                    <Typography variant="body2" fontWeight="bold" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                        {user.fullName.split(' ')[0]}
                                    </Typography>
                                </Button>

                                {/* DROPDOWN MENU */}
                                <Menu
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={handleMenuClose}
                                    onClick={handleMenuClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                                            mt: 1.5,
                                            borderRadius: 3,
                                            minWidth: 200,
                                            '&:before': { // Freccina in alto
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    {/* 1. PROFILE */}
                                    <MenuItem onClick={() => handlePlaceholderAction("Profile")}>
                                        <ListItemIcon>
                                            <PersonIcon fontSize="small" />
                                        </ListItemIcon>
                                        My Profile
                                    </MenuItem>

                                    {/* 2. PROJECTS */}
                                    <MenuItem onClick={handleOpenProjects}>
                                        <ListItemIcon>
                                            <FolderSharedIcon fontSize="small" />
                                        </ListItemIcon>
                                        My Projects
                                    </MenuItem>

                                    {/* 3. SETTINGS */}
                                    <MenuItem onClick={() => handlePlaceholderAction("Settings")}>
                                        <ListItemIcon>
                                            <SettingsIcon fontSize="small" />
                                        </ListItemIcon>
                                        Settings
                                    </MenuItem>

                                    <Divider />

                                    {/* 4. LOGOUT */}
                                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                        <ListItemIcon>
                                            <LogoutIcon fontSize="small" color="error" />
                                        </ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button color="inherit" onClick={onOpenAuth}>Login</Button>
                                <Button variant="contained" onClick={onOpenAuth} sx={{ fontWeight: 'bold' }}>Register</Button>
                            </Box>
                        )}
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;