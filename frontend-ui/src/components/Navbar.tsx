/**
 * @file Navbar.tsx
 * @description Main navigation bar with Authentication links and Theme toggle.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.2.0
 */

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Stack, Container } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import TuneIcon from '@mui/icons-material/Tune';
import LogoutIcon from '@mui/icons-material/Logout';


interface NavbarProps {
    /** Current theme mode */
    mode: 'light' | 'dark';
    /** Function to toggle between light and dark mode */
    onToggleTheme: () => void;
    onOpenAuth: () => void;   
    isLoggedIn: boolean;      
    onLogout: () => void; 
}

const Navbar: React.FC<NavbarProps> = ({ mode, onToggleTheme, onOpenAuth, isLoggedIn, onLogout }) => {
    return (
        <>
            <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', color: 'text.primary' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {/* LOGO & TITLE */}
                        <TuneIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '.1rem', color: 'inherit', textDecoration: 'none' }}
                        >
                            SmartBode Tuner
                        </Typography>

                        {/* RIGHT SIDE: AUTH & THEME */}
                        <Stack direction="row" spacing={2} alignItems="center">

                            {/* THEME TOGGLE */}
                            <IconButton onClick={onToggleTheme} color="inherit">
                                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                            </IconButton>

                            {isLoggedIn ? (
                            <Button 
                                color="error" 
                                variant="outlined" 
                                size="small" 
                                startIcon={<LogoutIcon />} 
                                onClick={onLogout}
                            >
                                Logout
                            </Button>
                        ) : (
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Button color="inherit" onClick={onOpenAuth}>Login</Button>
                                <Button variant="contained" sx={{ ml: 1 }} onClick={onOpenAuth}>Register</Button>
                            </Box>
                        )}
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
};

export default Navbar;