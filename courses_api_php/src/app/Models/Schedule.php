<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'schedules';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'course_id',
        'weekday',
        'start_time',
        'end_time'
    ];

    // Deshabilitar las marcas de tiempo (created_at y updated_at)
    public $timestamps = false;

    /**
     * Relación inversa: Un horario pertenece a un curso.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    /**
     * Relación con Reservation (un horario tiene muchas reservas).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
