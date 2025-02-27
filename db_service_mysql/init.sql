-- Crear la base de datos con el conjunto de caracteres y la intercalación correctos
CREATE DATABASE IF NOT EXISTS university_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seleccionar la base de datos
USE university_db;

-- Crear tabla de estudiantes
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear tabla de cursos
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear tabla de horarios
CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    weekday ENUM('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    teacher_name VARCHAR(100) NOT NULL,
    max_capacity INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear tabla de reservas
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    schedule_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insertar 3 usuarios de prueba en la tabla students
INSERT INTO students (full_name, email, password) VALUES
('Fray Smith Jaramillo', 'fray.jaramillo@gmail.com', 'fray123'),
('Camilo Sanchez', 'camilo.sanchez@gmail.com', 'camilo123'),
('Santiago Cadavid', 'santiago.cadavid@gmail.com', 'santiago123'),
('Daniela Sanchez', 'daniela.sanchez@gmail.com', 'daniela123');

-- Insertar más cursos de prueba en la tabla courses
INSERT INTO courses (course_name, course_description) VALUES
('Algebra Lineal', 'Conceptos y aplicaciones del algebra lineal'),
('Bases de Datos', 'Introduccion a la creacion y gestion de bases de datos'),
('Redes de Computadoras', 'Principios de redes y protocolos de comunicacion'),
('Estructuras de Datos', 'Analisis y aplicacion de estructuras de datos en programacion'),
('Ingenieria de Software', 'Metodologias y herramientas para el desarrollo de software'),
('Quimica Organica', 'Estudio de la estructura y reactividad de compuestos organicos'),
('Robotica', 'Fundamentos de la robotica y su aplicacion en la industria'),
('Geometria Analitica', 'Analisis geometrico usando metodos algebraicos'),
('Inteligencia Artificial', 'Conceptos basicos de aprendizaje automatico y redes neuronales'),
('Economia', 'Principios fundamentales de la economia y su aplicacion practica');
