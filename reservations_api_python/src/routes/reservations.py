from fastapi import APIRouter, HTTPException
from models import ReservationRequest
from database import get_db_connection
import pymysql

router = APIRouter()

@router.post("/reservas")
def create_reservation(reservation: ReservationRequest):
    """
    Crea una nueva reserva para un estudiante en un horario específico.
    
    Args:
        reservation (ReservationRequest): Los datos de la reserva.
    
    Returns:
        dict: Un mensaje de éxito si la reserva se crea correctamente.
    
    Raises:
        HTTPException: Si ocurre algún error durante la creación de la reserva.
    """
    db = get_db_connection()
    try:
        with db.cursor() as cursor:
            # Verificar si el estudiante existe
            cursor.execute("SELECT id FROM students WHERE id = %s", (int(reservation.student_id),))
            student = cursor.fetchone()
            if student is None:
                raise HTTPException(status_code=404, detail="Estudiante no encontrado")

            # Obtener información del horario solicitado
            cursor.execute("""
                SELECT s.weekday, s.start_time, s.end_time, s.course_id, c.max_capacity 
                FROM schedules s
                JOIN courses c ON s.course_id = c.id
                WHERE s.id = %s
            """, (int(reservation.schedule_id),))
            schedule = cursor.fetchone()
            if schedule is None:
                raise HTTPException(status_code=404, detail="Horario no encontrado")

            weekday, new_start_time, new_end_time, course_id, max_capacity = schedule

            # Verificar si el estudiante ya tiene reservado este mismo horario
            cursor.execute("""
                SELECT id FROM reservations 
                WHERE student_id = %s AND schedule_id = %s
            """, (int(reservation.student_id), int(reservation.schedule_id)))
            duplicate = cursor.fetchone()
            if duplicate is not None:
                raise HTTPException(status_code=400, detail="El estudiante ya tiene reservada este horario")

            # Verificar si el estudiante tiene otro curso en el mismo día con solapamiento de horario
            cursor.execute("""
                SELECT s.start_time, s.end_time FROM reservations r
                JOIN schedules s ON r.schedule_id = s.id
                WHERE r.student_id = %s AND s.weekday = %s
            """, (int(reservation.student_id), weekday))
            existing_schedules = cursor.fetchall()
            for existing_start_time, existing_end_time in existing_schedules:
                # Si el nuevo horario se cruza con un horario existente, se rechaza la reserva
                if new_start_time < existing_end_time and new_end_time > existing_start_time:
                    raise HTTPException(status_code=400, detail="El estudiante ya tiene un curso en un horario que se solapa")

            # Verificar la capacidad del curso
            cursor.execute("""
                SELECT COUNT(*) FROM reservations r
                JOIN schedules s ON r.schedule_id = s.id
                WHERE s.course_id = %s
            """, (int(course_id),))
            enrolled_students = cursor.fetchone()[0]
            if enrolled_students >= max_capacity:
                raise HTTPException(status_code=400, detail="El curso ha alcanzado su capacidad máxima")

            # Insertar la reserva en la base de datos
            query_insert = "INSERT INTO reservations (student_id, schedule_id) VALUES (%s, %s)"
            cursor.execute(query_insert, (int(reservation.student_id), int(reservation.schedule_id)))
            db.commit()
            
            return {"message": "Reserva creada con éxito"}
    
    except pymysql.err.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error de integridad: Verifica si el estudiante y el horario existen")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
