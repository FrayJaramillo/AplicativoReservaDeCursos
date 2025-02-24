<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Reservation; 
use App\Models\Schedule;
use App\Models\Course;

class StudentScheduleController extends Controller
{
    /**
     * Obtiene los horarios de un estudiante.
     *
     * @param int $student_id El ID del estudiante.
     * @return \Illuminate\Http\JsonResponse La respuesta JSON con los horarios del estudiante.
     */
    public function getStudentSchedules($student_id)
    {
        // Buscar el estudiante junto con sus reservas, horarios y cursos
        $student = Student::with([
            'reservations.schedule.course'
        ])->find($student_id);

        if (!$student) {
            return response()->json(['message' => 'Estudiante no encontrado'], 404);
        }

        // Mapear las reservas del estudiante a un formato más legible
        $reservations = $student->reservations->map(function ($reservation) {
            return [
                'schedule_id' => $reservation->schedule->id,
                'weekday' => $reservation->schedule->weekday,
                'start_time' => $reservation->schedule->start_time,
                'end_time' => $reservation->schedule->end_time,
                'course' => [
                    'course_id' => $reservation->schedule->course->id,
                    'course_name' => $reservation->schedule->course->course_name,
                    'course_description' => $reservation->schedule->course->course_description,
                ]
            ];
        });

        return response()->json($reservations);
    }
}
