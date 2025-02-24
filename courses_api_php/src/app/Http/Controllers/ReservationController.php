<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;

class ReservationController extends Controller
{
    /**
     * Maneja la creación de una reserva.
     *
     * @param Request $request La solicitud HTTP que contiene los datos de la reserva.
     * @return JsonResponse La respuesta JSON con el resultado de la creación de la reserva.
     */
    public function store(Request $request): JsonResponse
    {
        // Validar la solicitud
        $validated = $request->validate([
            'student_id' => 'required|integer',
            'schedule_id' => 'required|integer'
        ]);

        // URL del microservicio en FastAPI
        $fastApiUrl = 'http://reservations_api_python:8001/reservas';

        try {
            // Enviar la solicitud a FastAPI
            $response = Http::timeout(10)->post($fastApiUrl, $validated);

            // Verificar si la solicitud fue exitosa
            if ($response->successful()) {
                return response()->json($response->json(), $response->status());
            }

            // Si FastAPI devuelve un error, devolverlo sin modificar su estructura
            return response()->json($response->json(), $response->status());

        } catch (RequestException $e) {
            // Manejar errores de conexión con FastAPI
            return response()->json([
                'detail' => 'No se pudo conectar con FastAPI',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
