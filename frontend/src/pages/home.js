import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Container,
  Typography,
  Button,
} from '@mui/material';
import TopBar from '../components/TopBar';
import SideDrawer from '../components/SideDrawer';

const drawerWidth = 240;

// HomePage component
const HomePage = () => {
  // Retrieve the userName from localStorage or default to 'Estudiante'
  const [userName] = useState(localStorage.getItem('userName') || 'Estudiante');

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* TopBar component with userName and drawerWidth props */}
      <TopBar userName={userName} drawerWidth={drawerWidth} />
      {/* SideDrawer component with drawerWidth prop */}
      <SideDrawer drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundImage: 'url(https://img.freepik.com/free-photo/class-school_1048-3250.jpg?t=st=1740362143~exp=1740365743~hmac=81bc5421d1fdb7a3b4914b32f54a2e7344974d6dd9437d37a9668fe7cdf56ba4&w=996)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Container maxWidth="md" sx={{ bgcolor: 'rgba(0,0,0,0.6)', p: 4, borderRadius: 2 }}>
          <Typography variant="h3" fontWeight="bold">
            ¡Bienvenido/a, {userName}!
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Gestiona y reserva tus clases universitarias de manera fácil y rápida.
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Explora la oferta académica, consulta horarios y reserva tus clases en solo unos clics.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
            href="/listarCursos"
          >
            Explorar Clases
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
