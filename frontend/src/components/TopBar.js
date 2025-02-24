import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg'; // Asegúrate de tener el logo en esta ruta

/**
 * TopBar component renders the top navigation bar of the application.
 * It includes a menu icon, logo, application title, user name, and logout button.
 *
 * @param {function} handleDrawerToggle - Function to handle the drawer toggle.
 * @param {number} drawerWidth - Width of the drawer.
 */
const TopBar = ({ handleDrawerToggle, drawerWidth }) => {
  const userName = localStorage.getItem('userName');
  const navigate = useNavigate();

  /**
   * Handles the logout action by removing user information from local storage
   * and navigating to the home page.
   */
  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` }, // En móviles usa el 100%
        ml: { sm: `${drawerWidth}px` }, // Solo mueve la barra si el drawer está visible
        backgroundColor: '#1976d2',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Contenedor izquierdo: Icono de menú y logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box component="img" src={logo} alt="Logo" sx={{ height: 40, mr: 2 }} />

          <Typography variant="h6" noWrap>
            Plataforma de Reserva de Clases
          </Typography>
        </Box>

        {/* Contenedor derecho: Nombre de usuario y logout */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2, fontWeight: 'bold' }}>
            {userName}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} title="Cerrar sesión">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
