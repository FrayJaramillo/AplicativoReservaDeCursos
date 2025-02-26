/**
 * Fetches the list of classes for a specific student from the API.
 *
 * @param {number} studentId - The ID of the student.
 * @returns {Array} An array of classes for the student.
 * @throws {Error} If there is an error fetching the classes.
 */
export const fetchStudentClasses = async (studentId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/student-schedules/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'MICLAVESECRETA' // Agregando API Key
      }
    });

    if (!response.ok) throw new Error("Error al obtener clases");
    
    const data = await response.json();
    return data || []; // Evitar `undefined`
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};
