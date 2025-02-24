/**
 * Envía una solicitud para crear un nuevo curso.
 *
 * @param {Object} courseData - Los datos del curso a crear.
 * @returns {Object} La respuesta de la API.
 * @throws {Error} Si ocurre un error al crear el curso.
 */
const createCourse = async (courseData) => { 
    console.log("Ejecutando createCourse..."); // ← Si esto no aparece, la función nunca es llamada

    try {
        console.log("Enviando datos a la API:", JSON.stringify(courseData, null, 2));

        const response = await fetch('http://localhost:8080/api/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': 'MICLAVESECRETA' // Agregando API Key
            },
            body: JSON.stringify(courseData)
        });

        console.log("Código de respuesta:", response.status);
        
        const responseText = await response.text(); 
        console.log("Respuesta de la API:", responseText);

        if (!response.ok) {
            throw new Error(`Error al crear el curso: ${response.status} - ${responseText}`);
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error('Error en createCourse:', error.message);
        throw error;
    }
};

export default createCourse;
