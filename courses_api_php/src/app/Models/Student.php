<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Student extends Authenticatable
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'students';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'full_name',
        'email',
        'password',
    ];

    // Deshabilitar las marcas de tiempo (created_at y updated_at)
    public $timestamps = false;

    // Ocultar el password en respuestas JSON
    protected $hidden = [
        'password',
    ];

    /**
     * Relación con Reservation (un estudiante tiene muchas reservas).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
