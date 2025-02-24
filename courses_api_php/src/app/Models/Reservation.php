<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    // Campos que se pueden asignar dinamicamente
    protected $fillable = ['student_id', 'schedule_id'];

    /**
     * Relación con Student (una reserva pertenece a un estudiante).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Relación con Schedule (una reserva pertenece a un horario).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
}
