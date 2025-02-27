import sys
import os

# Agregar el directorio 'src' al sys.path debido a problemas con la importacion
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))

import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Reservation, Schedule
from routes.reservations import verificar_reserva_existente 

def test_verificar_reserva_existente_reserva_ya_existente():
    # Crear un mock de la sesión de la base de datos
    db = MagicMock(spec=Session)

    # Simular course_id para el schedule dado
    db.query().filter().scalar.return_value = 1  # Simula que el schedule existe y pertenece a un curso

    # Simular los schedules asociados al mismo curso
    db.query().filter().all.return_value = [(1,), (2,), (3,)]

    # Simular que el estudiante ya tiene una reserva en otro horario de ese curso
    db.query().filter().first.return_value = MagicMock(spec=Reservation)

    # Verificar que se lanza la excepción HTTP 400
    with pytest.raises(HTTPException) as exc_info:
        verificar_reserva_existente(db, student_id=123, schedule_id=2)
    
    assert exc_info.value.status_code == 400
    assert "El estudiante ya está registrado en otro horario de este curso" in exc_info.value.detail

def test_verificar_reserva_existente_sin_conflictos():
    db = MagicMock(spec=Session)
    db.query().filter().scalar.return_value = 1  # Simula que el schedule existe y pertenece a un curso
    db.query().filter().all.return_value = [(1,), (2,), (3,)]
    db.query().filter().first.return_value = None  # No hay reservas en ese curso

    # No debe lanzar excepción si no hay conflicto
    try:
        verificar_reserva_existente(db, student_id=123, schedule_id=2)
    except HTTPException:
        pytest.fail("Se lanzó una excepción cuando no debería")

def test_verificar_reserva_existente_horario_inexistente():
    db = MagicMock(spec=Session)
    db.query().filter().scalar.return_value = None  # Simula que el horario no existe

    with pytest.raises(HTTPException) as exc_info:
        verificar_reserva_existente(db, student_id=123, schedule_id=999)
    
    assert exc_info.value.status_code == 404
    assert "El horario no existe" in exc_info.value.detail
