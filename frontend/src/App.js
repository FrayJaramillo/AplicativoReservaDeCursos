import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home";
import StudentClass from "./pages/StudentClass";
import Login from "./pages/Login";
import CourseForm from "./pages/CourseForm";
import CourseList from "./pages/CourseList";
import Footer from "./components/Footer"; // Importamos el Footer
import { Box } from "@mui/material";

// Obtener el nombre de usuario del almacenamiento local
const userName = localStorage.getItem('userName');

function App() {
  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Asegura que la página ocupa toda la altura de la pantalla
        }}
      >
        {/* Contenido principal */}
        <Box sx={{ flex: 1 }}>
          <Routes>
            {/* Ruta para la página de inicio de sesión */}
            <Route path="/" element={<Login />} />
            {/* Ruta para la página de inicio, redirige a login si no hay usuario */}
            <Route path="/home" element={!userName ? <Navigate to="/" /> : <HomePage />} />
            {/* Ruta para listar cursos, redirige a login si no hay usuario */}
            <Route path="/listarCursos" element={!userName ? <Navigate to="/" /> : <CourseList />} />
            {/* Ruta para ver las clases del estudiante, redirige a login si no hay usuario */}
            <Route path="/misclases" element={!userName ? <Navigate to="/" /> : <StudentClass />} />
            {/* Ruta para crear una nueva clase, redirige a login si no hay usuario */}
            <Route path="/CrearClase" element={!userName ? <Navigate to="/" /> : <CourseForm />} />
            {/* Ruta por defecto, redirige a login */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>

        {/* Footer siempre abajo */}
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
