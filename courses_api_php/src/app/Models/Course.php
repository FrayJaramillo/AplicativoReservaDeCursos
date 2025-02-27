<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'courses';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'course_name',
        'course_description'
    ];

    // Deshabilitar las marcas de tiempo (created_at y updated_at)
    public $timestamps = false;

    /**
     * Relación con Schedule (un curso tiene varios horarios).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'course_id');
    }
}
