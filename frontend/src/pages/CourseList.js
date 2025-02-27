import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Table, 
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, 
  Paper,
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

   // Carga la lista de las clases, solo si tienen asignado un horario
  const fetchAndSetClasses = async () => {
    setLoadingClasses(true);
    try {
      const data = await fetchClasses();
      setClasses(data.filter(course => course.schedules.length > 0));
    } catch (error) {
      console.error('Error al obtener las clases:', error);
    } finally {
      setLoadingClasses(false);
    }
  };
  // llama a la función fetchAndSetClasses
  useEffect(() => {
    fetchAndSetClasses();
  }, []);





  // Handle the registration for a class
  const handleRegister = async (scheduleId) => {
    setLoadingRegister(true);
    const result = await registerForClass(scheduleId);
    setLoadingRegister(false);
    setDialogMessage(result.message);
    setDialogSeverity(result.success ? 'success' : 'error');
    setDialogOpen(true);

    if (result.success) {
      fetchAndSetClasses(); 
    }
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
            Listado de Clases Disponibles
          </Typography>

          {/* Overlay de carga de clases */}
          {loadingClasses && <LoadingOverlay loading={true} message="Cargando las clases..." />}

          {!loadingClasses && classes.map((course) => (
            <Card key={course.id} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                  {course.course_name}
                </Typography>                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {course.course_description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Día</strong></TableCell>
                          <TableCell><strong>Horario</strong></TableCell>
                          <TableCell><strong>Docente</strong></TableCell>
                          <TableCell><strong>Cupos</strong></TableCell>
                          <TableCell align="center"><strong>Acción</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {course.schedules.map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell>{schedule.weekday}</TableCell>
                            <TableCell>{schedule.start_time} - {schedule.end_time}</TableCell>
                            <TableCell>{schedule.teacher_name}</TableCell>
                            <TableCell>
                              {schedule.max_capacity - schedule.reservations_count} / {schedule.max_capacity}
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleRegister(schedule.id)}
                              >
                                Registrarme
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
