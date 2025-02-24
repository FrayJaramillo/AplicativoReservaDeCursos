// src/api.js
/**
 * Fetches the list of classes from the API.
 *
 * @returns {Array} An array of classes.
 * @throws {Error} If there is an error fetching the classes.
 */
export const fetchClasses = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/courses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': 'MICLAVESECRETA' // Agrega la API Key en el header
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching classes:', error);
        return [];
    }
};

