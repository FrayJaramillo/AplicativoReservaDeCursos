import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SideDrawer from '../components/SideDrawer';
import TopBar from '../components/TopBar';
import createCourse from '../utils/CreateCourse';
import LoadingOverlay from '../components/LoadingOverlay';
import { fetchClasses } from '../utils/ListCourses'; // Función para obtener los cursos

const weekdays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

const generateTimeOptions = () => {
    const times = [];
    for (let h = 7; h < 20; h++) {
        for (let m of [0, 30]) {
            const hour = h.toString().padStart(2, '0');
            const minute = m.toString().padStart(2, '0');
            times.push(`${hour}:${minute}`);
        }
    }
    return times;
};

const timeOptions = generateTimeOptions();

const CourseForm = () => {
    const [loadingCourses, setLoadingCourses] = useState(true);

    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState({
        course_id: '',
        schedules: [{ weekday: '', start_time: '', end_time: '', teacher_name: '', max_capacity: '' }]
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoadingCourses(true); // Inicia la carga
                const courseList = await fetchClasses();
                setCourses(courseList);
            } catch (error) {
                console.error('Error al obtener los cursos', error);
            } finally {
                setLoadingCourses(false);
            }
        };
        loadCourses();
    }, []);

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleScheduleChange = (index, e) => {
        const { name, value } = e.target;
        const newSchedules = [...course.schedules];
        if (name === "end_time" && newSchedules[index].start_time && value < newSchedules[index].start_time) {
            alert("La hora de finalización no puede ser menor que la de inicio");
            return;
        }
        newSchedules[index][name] = value;
        setCourse({ ...course, schedules: newSchedules });
    };

    const addSchedule = () => {
        setCourse({ ...course, schedules: [...course.schedules, { weekday: '', start_time: '', end_time: '', teacher_name: '', max_capacity: '' }] });
    };

    const removeSchedule = (index) => {
        const newSchedules = course.schedules.filter((_, i) => i !== index);
        setCourse({ ...course, schedules: newSchedules });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createCourse(course);
            setLoading(false);
            alert('Curso creado con éxito');
            setCourse({ course_id: '', schedules: [{ weekday: '', start_time: '', end_time: '', teacher_name: '', max_capacity: '' }] });
        } catch (error) {
            setLoading(false);
            alert('Error al crear el curso');
        }
    };

    const drawerWidth = 240;

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <TopBar drawerWidth={drawerWidth} />
                <SideDrawer drawerWidth={drawerWidth} />
            </Box>
            <LoadingOverlay loading={loading} message="Creando curso y horarios" />
            <Typography variant="h4" gutterBottom>
                Registrar nueva clase y horarios
            </Typography>
            {!loading && (
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500, margin: 'auto', marginTop: 8, padding: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}
                >
                    <Typography variant="h5" sx={{ textAlign: 'center' }}>Crear Clase</Typography>
                    <TextField
                        select
                        label={loadingCourses ? "Cargando cursos..." : "Nombre del curso"} // 👈 Aquí se cambia dinámicamente
                        name="course_id"
                        value={course.course_id}
                        onChange={handleChange}
                        required
                        disabled={loadingCourses} // Deshabilita mientras carga
                    >
                        {courses.map((c) => (
                            <MenuItem key={c.id} value={c.id}>{c.course_name}</MenuItem>
                        ))}
                    </TextField>
                    {course.schedules.map((schedule, index) => (
                        <Box key={index} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                            <TextField select label="Día" name="weekday" value={schedule.weekday} onChange={(e) => handleScheduleChange(index, e)} required sx={{ minWidth: 120 }}>
                                {weekdays.map((day) => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
                                ))}
                            </TextField>
                            <TextField select label="Inicio" name="start_time" value={schedule.start_time} onChange={(e) => handleScheduleChange(index, e)} required sx={{ minWidth: 120 }}>
                                {timeOptions.map((time) => (
                                    <MenuItem key={time} value={time}>{time}</MenuItem>
                                ))}
                            </TextField>
                            <TextField select label="Fin" name="end_time" value={schedule.end_time} onChange={(e) => handleScheduleChange(index, e)} required sx={{ minWidth: 120 }}>
                                {timeOptions.map((time) => (
                                    <MenuItem key={time} value={time}>{time}</MenuItem>
                                ))}
                            </TextField>
                            <TextField label="Docente" name="teacher_name" value={schedule.teacher_name} onChange={(e) => handleScheduleChange(index, e)} required sx={{ minWidth: 120 }} />
                            <TextField label="Capacidad Max" name="max_capacity" type="number" value={schedule.max_capacity} onChange={(e) => handleScheduleChange(index, e)} required sx={{ minWidth: 120 }} />
                            <IconButton onClick={() => removeSchedule(index)} color="error" disabled={course.schedules.length === 1}>
                                <RemoveIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button onClick={addSchedule} startIcon={<AddIcon />} variant="outlined">Agregar Horario</Button>
                    <Button type="submit" variant="contained">Guardar Clase</Button>
                </Box>
            )}
        </>
    );
};

export default CourseForm;
