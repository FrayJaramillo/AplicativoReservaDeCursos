from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db  # Importa la sesión de la base de datos
from models import Reservation, Student, Schedule
from schemas import ReservationRequest

router = APIRouter()
def verificar_reserva_existente(db: Session, student_id: int, schedule_id: int):
    """
    Verifica si el estudiante ya tiene una reserva en otro horario del mismo curso.
    """
    # Obtener el course_id del horario solicitado
    course_id = db.query(Schedule.course_id).filter(Schedule.id == schedule_id).scalar()

    if not course_id:
        raise HTTPException(status_code=404, detail="El horario no existe")

    # Obtener todos los schedules asociados a ese curso
    schedule_ids_query = db.query(Schedule.id).filter(Schedule.course_id == course_id)
    schedule_ids = [s[0] for s in schedule_ids_query.all()]

    # Verificar si el estudiante ya tiene una reserva en alguno de esos schedules
    existing_reservation = db.query(Reservation).filter(
        Reservation.student_id == student_id,
        Reservation.schedule_id.in_(schedule_ids)  # Buscar en los horarios del mismo curso
    ).first()

    if existing_reservation:
        raise HTTPException(status_code=400, detail="El estudiante ya está registrado en otro horario de este curso")

@router.post("/reservas")
def create_reservation(reservation: ReservationRequest, db: Session = Depends(get_db)):
    """
    Crea una nueva reserva para un estudiante en un horario específico.
    """
    # 4️ Verificar si el estudiante ya está registrado en otro horario del mismo curso
    verificar_reserva_existente(db, reservation.student_id, reservation.schedule_id)


    # 1️ Verificar si el estudiante existe
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
    
    #4️ Verificar si el estudiante ya está registrado en otro horario del mismo curso
    verificar_reserva_existente(db, reservation.student_id, reservation.schedule_id)

    # 5️ Verificar si el estudiante tiene otro curso en el mismo día con solapamiento de horario
    overlapping_reservations = db.query(Schedule).join(Reservation).filter(
        Reservation.student_id == reservation.student_id,
        Schedule.weekday == schedule.weekday,
        Schedule.start_time < schedule.end_time,
        Schedule.end_time > schedule.start_time
    ).all()

    if overlapping_reservations:
        raise HTTPException(status_code=400, detail="El estudiante ya tiene un curso en un horario que se solapa")

    # 6️ Verificar la capacidad del curso
    total_enrolled = db.query(Reservation).filter(Reservation.schedule_id == reservation.schedule_id).count()
    if total_enrolled >= schedule.max_capacity:
        raise HTTPException(status_code=400, detail="El curso ha alcanzado su capacidad máxima")

    # 7️ Insertar la reserva en la base de datos
    new_reservation = Reservation(student_id=reservation.student_id, schedule_id=reservation.schedule_id)
    db.add(new_reservation)
    db.commit()

    return {"message": "Reserva creada con éxito"}
