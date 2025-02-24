# Sistema de Agendamiento de Clases

## Descripción

Este proyecto es un sistema de agendamiento de clases basado en microservicios, desarrollado utilizando **Laravel, FastAPI, MySQL y React**. El sistema permite la gestión de cursos, programación de horarios y reservas de estudiantes mediante una arquitectura distribuida desplegada con **Docker y docker-compose**.

## Arquitectura del Sistema

El sistema se compone de los siguientes microservicios:

1. **API de Cursos (Laravel)**: Permite la creación y consulta de cursos con su programación de horarios.
2. **API de Reservas (Laravel)**: Recibe las solicitudes de reserva desde el frontend y las redirige a FastAPI.
3. **API de Procesamiento de Reservas (FastAPI)**: Evalúa si una reserva puede ser almacenada en la base de datos.
4. **Base de Datos (MySQL)**: Almacena la información de cursos, horarios, estudiantes y reservas.
5. **Frontend (React)**: Proporciona la interfaz de usuario para la gestión y visualización de reservas.
6. **Servidor Web (Nginx)**: Actúa como proxy inverso para las APIs y sirve el frontend.

## Decisiones de Diseño

- **Microservicios**: Se optó por una arquitectura basada en microservicios para mejorar la escalabilidad y modularidad del sistema.
- **FastAPI para Procesamiento de Reservas**: Debido a su alto rendimiento y capacidad para manejar concurrencia de manera eficiente.
- **Laravel para Gestión de Cursos y Reservas**: Laravel proporciona una estructura robusta para manejar autenticación y lógica de negocio.
- **Docker y docker-compose**: Facilita el despliegue y la configuración de los servicios en cualquier entorno.

## Instalación y Puesta en Marcha

Para levantar el proyecto, asegúrese de tener instalado **Docker y docker-compose** en su máquina.

1. Clone el repositorio:
   ```sh
   git clone https://github.com/FrayJaramillo/Agendar_Clases/
   cd Agendar_Clases
   ```
2. Cree un archivo `.env` en la raíz del proyecto y configure las variables de entorno necesarias.
   ```properties
   MYSQL_DATABASE=university_db
   MYSQL_USER=admin
   MYSQL_PASSWORD=admin123
   MYSQL_ROOT_PASSWORD=root123
   ```

3. En `reservations_api_python/src/database.py` también deberá fijar estas variables.

4. En el `.env` de `courses_api_php/src/.env` también deberá definir las variables:
   ```properties
   DB_CONNECTION=mysql
   DB_HOST=db_service_mysql  # Debe coincidir con el nombre del servicio en Docker
   DB_PORT=3306
   DB_DATABASE=university_db
   DB_USERNAME=admin  # Aquí pon el usuario correcto
   DB_PASSWORD=admin123  # Aquí pon la contraseña correcta
   API_KEY_SECRET=MICLAVESECRETA
   ```

5. Levante los contenedores con Docker:
   ```sh
   docker-compose up -d --build
   ```

6. Acceda al sistema desde el navegador en `http://localhost:3000`

## Endpoints de las APIs

Las API, excepto la de login, están protegidas por API KEY.

### **API de Cursos (Laravel)**

- **POST** `/api/courses` - Registra los cursos junto con su respectivo horario.
  #### Ejemplo de solicitud:
  ```json
  {
    "course_name": "Matemáticas Avanzadas",
    "course_description": "Curso avanzado de matemáticas",
    "max_capacity": 30,
    "schedules": [
      {
        "weekday": "Lunes",
        "start_time": "08:00",
        "end_time": "10:00"
      },
      {
        "weekday": "Miércoles",
        "start_time": "08:00",
        "end_time": "10:00"
      }
    ]
  }
  ```

- **GET** `/api/courses` - Devuelve todos los cursos con los horarios.

### **API de Reservas (Laravel)**

- **POST** `/api/reservas` - Recibe la petición de reserva del frontend y la envía a FastAPI.
  #### Ejemplo de solicitud:
  ```json
  {
    "student_id": 1,
    "schedule_id": 2
  }
  ```

### **API de Procesamiento de Reservas (FastAPI)**

- **POST** `http://reservations_api_python:8001/reservas` - Recibe la petición de reserva desde Laravel y evalúa si se puede guardar en la base de datos.
  #### Ejemplo de solicitud:
  ```json
  {
    "student_id": 1,
    "schedule_id": 2
  }
  ```

### **Autenticación**

- **POST** `/api/login` - Endpoint de autenticación.
  #### Ejemplo de solicitud:
  ```json
  {
    "username": "usuario",
    "password": "contraseña"
  }
  ```

### **API de Horarios de Estudiantes**

- **GET** `/api/student-schedules/{idstudent}` - Devuelve el listado de horarios y cursos en los que está registrado el estudiante.

## Tecnologías Utilizadas

- **Backend:** Laravel (PHP), FastAPI (Python)
- **Base de Datos:** MySQL
- **Frontend:** React
- **Servidor Web:** Nginx
- **Despliegue:** Docker, docker-compose

## Configuración de Docker Compose

El archivo `docker-compose.yml` define los servicios y la red utilizada por el sistema. A continuación se describe la configuración de cada servicio y la red:

### **Servicios**

![alt text](/Readme.images/image.png)

- **courses_api_php:** Servicio de API en PHP (Laravel) para la gestión de cursos.
- **reservations_api_python:** Servicio de API en Python (FastAPI) para el procesamiento de reservas.
- **frontend:** Servicio de frontend en React.
- **db_service_mysql:** Servicio de base de datos MySQL.

### **Red**

- **university_network:** Red de tipo bridge que permite la comunicación entre los servicios.

---

## Estructura de la Base de Datos

La estructura de la base de datos está diseñada de la siguiente manera:

![alt text](/Readme.images/EstructuraBD.png)

**Nota:** Este aplicativo **no permite la creación de usuarios desde la interfaz**. Los usuarios deben ser creados manualmente en la base de datos o importados de otro sistema. Estos usuarios serán validados al momento de iniciar sesión en la aplicación.


