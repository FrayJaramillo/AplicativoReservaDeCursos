Esto es lo que llevo del readme, ayudame a estructurarlo mejor o cambiar cosas que se puedan mejorar
# Sistema de Agendamiento de Clases

## Descripción
Este proyecto es un sistema de agendamiento de clases basado en microservicios, desarrollado utilizando Laravel, FastAPI, MySQL y React. El sistema permite la gestión de cursos, programación de horarios y reservas de estudiantes mediante una arquitectura distribuida desplegada con Docker y docker-compose.

## Arquitectura del Sistema
El sistema se compone de los siguientes microservicios:

1. **API de Cursos (Laravel):** Permite la creación y consulta de cursos con su programación de horarios.
2. **API de Reservas (Laravel):** Recibe las solicitudes de reserva desde el frontend y las redirige a FastAPI.
3. **API de Procesamiento de Reservas (FastAPI):** Evalúa si una reserva puede ser almacenada en la base de datos.
4. **Base de Datos (MySQL):** Almacena la información de cursos, horarios, estudiantes y reservas.
5. **Frontend (React):** Proporciona la interfaz de usuario para la gestión y visualización de reservas.
6. **Servidor Web (Nginx):** Actúa como proxy inverso para las APIs y sirve el frontend.

## Decisiones de Diseño
- **Microservicios:** Se optó por una arquitectura basada en microservicios para mejorar la escalabilidad y modularidad del sistema.
- **FastAPI y MysqlAclhemy para Procesamiento de Reservas:** Debido a su alto rendimiento y capacidad para manejar concurrencia de manera eficiente.
- **Laravel para Gestión de Cursos y Reservas:** Laravel proporciona una estructura robusta para manejar autenticación y lógica de negocio.
- **Docker y docker-compose:** Facilita el despliegue y la configuración de los servicios en cualquier entorno.

## Instalación y Puesta en Marcha
Para levantar el proyecto, asegúrese de tener instalado Docker y docker-compose en su máquina.

1. Clone el repositorio:
   
sh
   git clone <https://github.com/FrayJaramillo/AplicativoReservaDeCursos>
   cd <Agendar_Clases>


2. Cree un archivo .env en la raíz del proyecto y configure las variables de entorno necesarias.

3. Levante los contenedores con Docker:
   
sh
   docker-compose up -d --build


4. Acceda al sistema desde el navegador en http://localhost:8080

## Endpoints de las APIs

### API de Cursos (Laravel)
- **POST** http://localhost:8080/api/courses → Registra los horarios, profesores y cupo, asosiandolos a un curso previamente creado
  #### Ejemplo de solicitud:
  
json
  {
    "course_id" 1
    "schedules": [
      {
        "weekday": "Lunes",
        "start_time": "08:00",
        "end_time": "10:00",
        "teacher_name: "Alfonso",
        "max_capacity: 20

      },
      {
        "weekday": "Miercoles",
        "start_time": "08:00",
        "end_time": "10:00"
        "teacher_name: "Juan",
        "max_capacity: 25
      }
    ]
  }


- **GET** http://localhost:8080/api/courses → Devuelve todos los cursos con los horarios.

### API de Reservas (Laravel)
- **POST** http://localhost:8080/api/reservas → Recibe la petición de reserva del frontend y la envía a FastAPI.
  #### Ejemplo de solicitud:
  
json
  {
    "student_id": 1,
    "schedule_id": 2
  }


### API de Procesamiento de Reservas (FastAPI)
- **POST** http://reservations_api_python:8001/reservas → Recibe la petición de reserva desde Laravel y evalúa si se puede guardar en la base de datos.
  #### Ejemplo de solicitud:
  
json
  {
    "student_id": 1,
    "schedule_id": 2
  }


### Autenticación
- **POST** http://localhost:8080/api/login → Endpoint de autenticación.
  #### Ejemplo de solicitud:
  
json
  {
    "username": "usuario",
    "password": "contraseña"
  }


### API de Horarios de Estudiantes
- **GET** http://localhost:8080/api/student-schedules/{idstudent} → Devuelve el listado de horarios y cursos en los que está registrado el estudiante.

## Tecnologías Utilizadas
- **Backend:** Laravel (PHP), FastAPI (Python), Sqlalchemy (ORM python)
- **Base de Datos:** MySQL
- **Frontend:** React
- **Servidor Web:** Nginx
- **Despliegue:** Docker, docker-compose

## Configuración de Docker Compose
El archivo docker-compose.yml define los servicios y la red utilizada por el sistema. A continuación se describe la configuración de cada servicio y la red:

![alt text](/Readme.images/Microservicios.png)

### Servicios
- **courses_api_php:** Servicio de API en PHP (Laravel) para la gestión de cursos.
- **reservations_api_python:** Servicio de API en Python (FastAPI) para el procesamiento de reservas.
- **frontend:** Servicio de frontend en React.
- **db_service_mysql:** Servicio de base de datos MySQL.

### Red
- **university_network:** Red de tipo bridge que permite la comunicación entre los servicios.


###Estructura bd
Tambien muestro como esta diseñada la estructura de la base de datos la cual es la siguiente:
![alt text](/Readme.images/EstructuraBD.png)

Este aplicativo no permite la creación de usuarios, por lo cual deben ser creados manualmente en la base de datos o traidos de otro lugar, estos usuarios serán los que se validaran al momento de iniciar sesion en la aplicación.