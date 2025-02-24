<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('X-API-KEY');
        $validApiKey = env('API_KEY_SECRET');

        if (!$apiKey || $apiKey !== $validApiKey) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        return $next($request);
    }
}
