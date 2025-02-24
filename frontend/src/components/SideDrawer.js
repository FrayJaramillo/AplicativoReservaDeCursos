import React from 'react';
import { Drawer, Toolbar, Divider, List, ListItem, ListItemText, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const SideDrawer = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation(); // Obtiene la ruta actual

  const menuItems = [
    { text: 'Inicio', path: '/home' },
    { text: 'Listar o reservar Cursos', path: '/listarCursos' },
    { text: 'Mis Reservas', path: '/misclases' },
    { text: 'Crear Clase', path: '/CrearClase' },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path; // Verifica si la ruta actual es la del item

          return (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                backgroundColor: isActive ? '#1976d2' : 'transparent', // Color azul si está activo
                color: isActive ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: isActive ? '#1565c0' : '#e3f2fd', // Diferente hover para activo/inactivo
                },
                borderRadius: 2, // Bordes redondeados para mejor apariencia
                marginBottom: 1, // Espaciado entre elementos
              }}
            >
              <ListItemText primary={item.text} sx={{ textAlign: 'center' }} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Drawer temporal para dispositivos móviles */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
      >
        {drawer}
      </Drawer>
      {/* Drawer permanente para pantallas grandes */}
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default SideDrawer;
