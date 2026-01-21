/**
 * @file Navbar.tsx
 * @description Main navigation bar with Authentication links and Theme toggle.
 * 
 * @authors Mattia Franchini & Michele Bisignano
 * @version 1.2.0
 */

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Stack } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import TuneIcon from '@mui/icons-material/Tune';
import AuthModal from './AuthModal';

interface NavbarProps {
    /** Current theme mode */
    mode: 'light' | 'dark';
    /** Function to toggle between light and dark mode */
    onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, onToggleTheme }) => {
    const [authOpen, setAuthOpen] = useState(false);
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

                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Button color="inherit" onClick={() => setAuthOpen(true)}>Login</Button>
                                <Button variant="contained" sx={{ ml: 1 }} onClick={() => setAuthOpen(true)}>Register</Button>
                            </Box>
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>

            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    );
};

// Importazione Container mancante sopra
import { Container } from '@mui/material';

export default Navbar;