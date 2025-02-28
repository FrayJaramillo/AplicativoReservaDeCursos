<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\CorsMiddleware; // Import your Cors middleware

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'api.key' => \App\Http\Middleware\ApiKeyMiddleware::class,
            'cors' => CorsMiddleware::class, // Add the CORS middleware alias
        ]);
    })
    
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
