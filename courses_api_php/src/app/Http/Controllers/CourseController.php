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
        // Obtener cursos con horarios y contar estudiantes inscritos por cada horario
        $courses = Course::with(['schedules' => function ($query) {
            $query->withCount('reservations'); // Cuenta las reservas asociadas a cada horario
        }])->get();
            
    // Asegurar que reservations_count siempre tenga un valor
    $courses->each(function ($course) {
        $course->schedules->each(function ($schedule) {
            $schedule->reservations_count = $schedule->reservations_count ?? 0;
        });
    });
        return response()->json($courses);
    }
    
    /**
     * Registrar horarios en un curso existente.
     *
     * @param Request $request La solicitud HTTP con el ID del curso y sus horarios.
     * @return \Illuminate\Http\JsonResponse La respuesta JSON con el resultado del registro.
     */
    public function store(Request $request)
    {
        // Iniciar una transacción para garantizar la integridad de los datos
        DB::beginTransaction();

        try {
            // Validar los datos recibidos
            $validatedData = $request->validate([
                'course_id' => 'required|exists:courses,id', // Verificar que el curso existe
                'schedules' => 'required|array|min:1',  // Asegurar que se envíe al menos un horario
                'schedules.*.weekday' => 'required|in:Lunes,Martes,Miercoles,Jueves,Viernes,Sabado,Domingo',
                'schedules.*.start_time' => 'required|date_format:H:i',
                'schedules.*.end_time' => 'required|date_format:H:i|after:schedules.*.start_time',
                'schedules.*.teacher_name' => 'required|string|max:100',
                'schedules.*.max_capacity' => 'required|integer|min:1' // Nuevo campo agregado
            ]);

            // Verificar si el curso existe antes de proceder
            $course = Course::findOrFail($validatedData['course_id']);

            // Registrar los horarios en la tabla schedules
            $schedules = [];
            foreach ($validatedData['schedules'] as $schedule) {
                $newSchedule = Schedule::create([
                    'course_id' => $validatedData['course_id'], // Usar directamente el ID validado
                    'weekday' => $schedule['weekday'],
                    'start_time' => $schedule['start_time'],
                    'end_time' => $schedule['end_time'],
                    'teacher_name' => $schedule['teacher_name'],
                    'max_capacity' => $schedule['max_capacity'] // Nuevo campo agregado
                ]);
                $schedules[] = $newSchedule;
            }

            // Confirmar la transacción
            DB::commit();

            return response()->json([
                'message' => 'Horarios creados exitosamente',
                'course' => $course,
                'schedules' => $schedules
            ], 201);

        } catch (\Exception $e) {
            // Revertir la transacción en caso de error
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
