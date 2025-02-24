import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SideDrawer from '../components/SideDrawer';
import TopBar from '../components/TopBar';
import createCourse from '../utils/CreateCourse';
import LoadingOverlay from '../components/LoadingOverlay';

// Días de la semana
const weekdays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

// Generar opciones de tiempo en intervalos de 30 minutos
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
    const [course, setCourse] = useState({
        course_name: '',
        course_description: '',
        max_capacity: '',
        schedules: [{ weekday: '', start_time: '', end_time: '' }]
    });

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    // Manejar cambios en los campos de horarios
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

    // Añadir un nuevo horario
    const addSchedule = () => {
        setCourse({ ...course, schedules: [...course.schedules, { weekday: '', start_time: '', end_time: '' }] });
    };

    // Eliminar un horario
    const removeSchedule = (index) => {
        const newSchedules = course.schedules.filter((_, i) => i !== index);
        setCourse({ ...course, schedules: newSchedules });
    };

    const [loading, setLoading] = useState(false);

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formattedCourse = {
                course_name: course.course_name,
                course_description: course.course_description,
                max_capacity: parseInt(course.max_capacity, 10),
                schedules: course.schedules.map(s => ({
                    weekday: s.weekday,
                    start_time: s.start_time,
                    end_time: s.end_time
                }))
            };
           
            const result = await createCourse(formattedCourse);
            setLoading(false);
            alert('Curso creado con éxito');
            console.log(result);
            
            // Resetear campos del formulario
            setCourse({
                course_name: '',
                course_description: '',
                max_capacity: '',
                schedules: [{ weekday: '', start_time: '', end_time: '' }]
            });
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
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2, 
                        maxWidth: 500, 
                        margin: 'auto', 
                        marginTop: 8, 
                        padding: 3, 
                        backgroundColor: 'white', 
                        borderRadius: 2, 
                        boxShadow: 3 
                    }}
                >
                    <Typography variant="h5" sx={{ textAlign: 'center' }}>Crear Curso</Typography>
                    
                    <TextField label="Nombre del curso" name="course_name" value={course.course_name} onChange={handleChange} required />
                    <TextField label="Descripción" name="course_description" value={course.course_description} onChange={handleChange} required />
                    <TextField label="Capacidad máxima" name="max_capacity" type="number" value={course.max_capacity} onChange={handleChange} required />
                    
                    {course.schedules.map((schedule, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField 
                                select 
                                label="Día" 
                                name="weekday" 
                                value={schedule.weekday} 
                                onChange={(e) => handleScheduleChange(index, e)} 
                                required 
                                sx={{ minWidth: 120 }} // Añadir minWidth
                            >
                                {weekdays.map((day) => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
                                ))}
                            </TextField>

                            <TextField 
                                select 
                                label="Inicio" 
                                name="start_time" 
                                value={schedule.start_time} 
                                onChange={(e) => handleScheduleChange(index, e)} 
                                required 
                                sx={{ minWidth: 120 }} // Añadir minWidth
                            >
                                {timeOptions.map((time) => (
                                    <MenuItem key={time} value={time}>{time}</MenuItem>
                                ))}
                            </TextField>

                            <TextField 
                                select 
                                label="Fin" 
                                name="end_time" 
                                value={schedule.end_time} 
                                onChange={(e) => handleScheduleChange(index, e)} 
                                required 
                                sx={{ minWidth: 120 }} // Añadir minWidth
                            >
                                {timeOptions.map((time) => (
                                    <MenuItem key={time} value={time}>{time}</MenuItem>
                                ))}
                            </TextField>

                            <IconButton onClick={() => removeSchedule(index)} color="error" disabled={course.schedules.length === 1}>
                                <RemoveIcon />
                            </IconButton>
                        </Box>
                    ))}

                    <Button onClick={addSchedule} startIcon={<AddIcon />} variant="outlined">Agregar Horario</Button>
                    <Button type="submit" variant="contained">Guardar Curso</Button>
                </Box>
            )}
        </>
    );
};

export default CourseForm;
