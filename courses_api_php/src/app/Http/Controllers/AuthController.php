<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Buscar estudiante por email
        $student = Student::where('email', $request->email)->first();

        // Verificar que el estudiante existe y la contraseña es correcta (sin hash)
        if (!$student || $student->password !== $request->password) {
            return response()->json(['error' => 'Credenciales incorrectas'], 401);
        }

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'student' => [
                'id' => $student->id,
                'full_name' => $student->full_name,
                'email' => $student->email
            ]
        ], 200);
    }
}
