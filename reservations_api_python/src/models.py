from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SqlEnum, Time, TIMESTAMP, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

# Definir Enum reutilizable para los días de la semana
WeekdayEnum = SqlEnum(
    "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo", name="weekday_enum"
)

# Modelo de Students
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    reservations = relationship("Reservation", back_populates="student", cascade="all, delete")

# Modelo de Courses
class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    course_name = Column(String(100), nullable=False)
    course_description = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    schedules = relationship("Schedule", back_populates="course", cascade="all, delete")

# Modelo de Schedules
class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    weekday = Column(WeekdayEnum, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    teacher_name = Column(String(100), nullable=False)
    max_capacity = Column(Integer, nullable=False)

    course = relationship("Course", back_populates="schedules")
    reservations = relationship("Reservation", back_populates="schedule", cascade="all, delete")

# Modelo de Reservations
class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    schedule_id = Column(Integer, ForeignKey("schedules.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    student = relationship("Student", back_populates="reservations")
    schedule = relationship("Schedule", back_populates="reservations")
