<?php
namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    // ...existing code...

    /**
     * The application's global HTTP middleware stack.
     *
     * @var array
     */
    protected $middleware = [
        // ...existing middleware...
        \App\Http\Middleware\CorsMiddleware::class, // Add the CORS middleware
    ];

    // ...existing code...
}
