<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Schedule;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    /**
     * Listar todos los cursos con sus horarios.
     *
     * @return \Illuminate\Http\JsonResponse La respuesta JSON con la lista de cursos y sus horarios.
     */
    public function index()
    {
        // Obtener todos los cursos junto con sus horarios
        $courses = Course::with('schedules')->get();
        return response()->json($courses);
    }

    /**
     * Crear un nuevo curso con horarios.
     *
     * @param Request $request La solicitud HTTP que contiene los datos del curso y sus horarios.
     * @return \Illuminate\Http\JsonResponse La respuesta JSON con el resultado de la creación del curso.
     */
    public function store(Request $request)
    {
        // Iniciar una transacción de base de datos
        DB::beginTransaction();

        try {
            // Validar los datos recibidos
            $validatedData = $request->validate([
                'course_name' => 'required|string|max:100',
                'course_description' => 'nullable|string',
                'max_capacity' => 'required|integer|min:1',
                'schedules' => 'required|array',  // Validar que se envíe un arreglo de horarios
                'schedules.*.weekday' => 'required|in:Lunes,Martes,Miercoles,Jueves,Viernes,Sabado,Domingo',
                'schedules.*.start_time' => 'required|date_format:H:i',
                'schedules.*.end_time' => 'required|date_format:H:i|after:schedules.*.start_time',
            ]);

            // Crear el curso
            $course = Course::create([
                'course_name' => $validatedData['course_name'],
                'course_description' => $validatedData['course_description'],
                'max_capacity' => $validatedData['max_capacity']
            ]);

            // Registrar los horarios
            foreach ($validatedData['schedules'] as $schedule) {
                Schedule::create([
                    'course_id' => $course->id,
                    'weekday' => $schedule['weekday'],
                    'start_time' => $schedule['start_time'],
                    'end_time' => $schedule['end_time']
                ]);
            }

            // Confirmar la transacción
            DB::commit();

            return response()->json([
                'message' => 'Curso y horarios creados exitosamente',
                'course' => $course,
                'schedules' => $course->schedules
            ], 201);

        } catch (\Exception $e) {
            // Revertir la transacción en caso de error
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
