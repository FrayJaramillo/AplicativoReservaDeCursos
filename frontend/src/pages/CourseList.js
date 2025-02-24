import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import TopBar from '../components/TopBar';
import SideDrawer from '../components/SideDrawer';
import { registerForClass } from '../utils/RegisterClass';
import { fetchClasses } from '../utils/ListCourses';
import LoadingOverlay from '../components/LoadingOverlay';

const drawerWidth = 240;

const CourseList = () => {
  // State to store the list of classes
  const [classes, setClasses] = useState([]);
  // State to manage the loading state of fetching classes
  const [loadingClasses, setLoadingClasses] = useState(true);
  // State to manage the loading state of registering for a class
  const [loadingRegister, setLoadingRegister] = useState(false);
  // State to manage the dialog open state
  const [dialogOpen, setDialogOpen] = useState(false);
  // State to store the dialog message
  const [dialogMessage, setDialogMessage] = useState('');
  // State to store the dialog severity (success or error)
  const [dialogSeverity, setDialogSeverity] = useState('success');

  // Get the user name from local storage
  const userName = localStorage.getItem('userName');

  // Fetch the list of classes when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoadingClasses(true);
      try {
        const data = await fetchClasses();
        setClasses(data);
      } catch (error) {
        console.error('Error al obtener las clases:', error);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchData();
  }, []);

  // Handle the registration for a class
  const handleRegister = async (scheduleId) => {
    setLoadingRegister(true);
    console.log('Registrando reserva con scheduleId:', scheduleId);
    const result = await registerForClass(scheduleId);
    setLoadingRegister(false);
    setDialogMessage(result.message);
    setDialogSeverity(result.success ? 'success' : 'error');
    setDialogOpen(true);
  };

  // Handle the closing of the dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar userName={userName} drawerWidth={drawerWidth} />
      <SideDrawer drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Container>
          <Typography variant="h4" gutterBottom>
            Listado de Clases
          </Typography>

          {/* Overlay de carga de clases */}
          {loadingClasses && <LoadingOverlay loading={true} message="Cargando las clases..." />}

          {!loadingClasses && classes.map((course) => (
            <Card key={course.id} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5">{course.course_name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {course.course_description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Capacidad máxima: {course.max_capacity}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Horarios:
                  </Typography>
                  {course.schedules.map((schedule) => (
                    <Box key={schedule.id} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip
                        label={`${schedule.weekday}: ${schedule.start_time} - ${schedule.end_time}`}
                        sx={{ mr: 1 }}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleRegister(schedule.id)}
                      >
                        Registrarme
                      </Button>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Container>
      </Box>

      {/* Overlay de carga de registro */}
      {loadingRegister && <LoadingOverlay loading={true} message="Procesando registro..." />}

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogSeverity === 'success' ? 'Éxito' : 'Error'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseList;
