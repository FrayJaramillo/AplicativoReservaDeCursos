from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db  # Corrected import for get_db function
from models import Reservation, Student, Schedule  # Combined imports from models
from schemas import ReservationRequest

router = APIRouter()

@router.post("/reservas")
def create_reservation(reservation: ReservationRequest, db: Session = Depends(get_db)):
    """
    Crea una nueva reserva para un estudiante en un horario específico.
    """

    # 1️Verificar si el estudiante existe
    student = db.query(Student).filter(Student.id == reservation.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    # 2️ Obtener información del horario solicitado
    schedule = db.query(Schedule).filter(Schedule.id == reservation.schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Horario no encontrado")

    # 3️ Verificar si el estudiante ya tiene reservado este mismo horario
    existing_reservation = db.query(Reservation).filter(
        Reservation.student_id == reservation.student_id,
        Reservation.schedule_id == reservation.schedule_id
    ).first()

    if existing_reservation:
        raise HTTPException(status_code=400, detail="El estudiante ya tiene reservada este horario")

    # 4️ Verificar si el estudiante tiene otro curso en el mismo día con solapamiento de horario
    overlapping_reservations = db.query(Schedule).join(Reservation).filter(
        Reservation.student_id == reservation.student_id,
        Schedule.weekday == schedule.weekday,
        Schedule.start_time < schedule.end_time,
        Schedule.end_time > schedule.start_time
    ).all()

    if overlapping_reservations:
        raise HTTPException(status_code=400, detail="El estudiante ya tiene un curso en un horario que se solapa")

    # 5️ Verificar la capacidad del curso
    total_enrolled = db.query(Reservation).filter(Reservation.schedule_id == reservation.schedule_id).count()
    if total_enrolled >= schedule.max_capacity:
        raise HTTPException(status_code=400, detail="El curso ha alcanzado su capacidad máxima")

    # 6️ Insertar la reserva en la base de datos
    new_reservation = Reservation(student_id=reservation.student_id, schedule_id=reservation.schedule_id)
    db.add(new_reservation)
    db.commit()

    return {"message": "Reserva creada con éxito"}
