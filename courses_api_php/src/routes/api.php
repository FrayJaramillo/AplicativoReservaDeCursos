<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentScheduleController;

// Rutas protegidas por API Key
Route::middleware('api.key')->group(function () {
    // Obtener todos los cursos
    Route::get('/courses', [CourseController::class, 'index']);
    
    // Crear un nuevo curso
    Route::post('/courses', [CourseController::class, 'store']);
    
    // Obtener los horarios de un estudiante
    Route::get('/student-schedules/{id}', [StudentScheduleController::class, 'getStudentSchedules']);
    // Crear una nueva reserva
    Route::post('/reservas', [ReservationController::class, 'store']);
});

// Ruta pública sin API Key
// Inicio de sesión
Route::post('/login', [AuthController::class, 'login']);
