from pydantic import BaseModel

class ReservationRequest(BaseModel):
    student_id: int
    schedule_id: int
