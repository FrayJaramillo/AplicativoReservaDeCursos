import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import TopBar from "../components/TopBar";
import SideDrawer from "../components/SideDrawer";
import { fetchStudentClasses } from "../utils/ListStudentClass";
import LoadingOverlay from "../components/LoadingOverlay";

const drawerWidth = 240;

// Días de la semana
const weekdays = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const StudentClass = () => {
  const userId = localStorage.getItem('userId');

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true); // Se inicializa en true
  const studentId = userId; // ID del estudiante (debe ser dinámico)

  // Fetch the student's classes when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Activamos la pantalla de carga
      try {
        const data = await fetchStudentClasses(studentId);
        setClasses(data);
      } catch (error) {
        console.error("Error al obtener las clases:", error);
      } finally {
        setLoading(false); // Desactivamos la pantalla de carga después de recibir los datos
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <TopBar drawerWidth={drawerWidth} />
      <SideDrawer drawerWidth={drawerWidth} />
      <Container component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Mis Clases
        </Typography>
        
        <LoadingOverlay loading={loading} message="Cargando tus clases..." />
        
        {!loading && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 2,
              mt: 2,
            }}
          >
            {weekdays.map((day) => (
              <Paper
                key={day}
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  textAlign: "center",
                  minHeight: "200px",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {day}
                </Typography>
                {classes
                  .filter((s) => s.weekday === day)
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((s) => (
                    <Card
                      key={s.schedule_id}
                      sx={{
                        mt: 1,
                        backgroundColor: "#ffffff",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                        "&:hover": { transform: "scale(1.02)", transition: "0.3s" },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold"}}
                        >
                          {s.course.course_name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#555" }}>
                          {s.start_time} - {s.end_time}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default StudentClass;
