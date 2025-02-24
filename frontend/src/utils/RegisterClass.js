/**
 * Registers a student for a class schedule.
 *
 * @param {number} scheduleId - The ID of the class schedule.
 * @returns {Object} An object containing the success status and message.
 */
export const registerForClass = async (scheduleId) => {
  const studentId = localStorage.getItem('userId'); // Obtiene el ID del usuario logueado
  
  if (!studentId) {
    return { success: false, message: "Usuario no autenticado." };
  }

  const payload = { student_id: parseInt(studentId), schedule_id: scheduleId };

  try {
    console.log(studentId, scheduleId); // Verifica los valores que se están enviando
    const response = await fetch('http://localhost:8080/api/reservas', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-KEY': 'MICLAVESECRETA'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "Error al registrar la reserva." };
    }

    return { success: true, message: "Registro exitoso." };
  } catch (error) {
    console.error('Error registering for class:', error);
    return { success: false, message: "Error de conexión." };
  }
};
