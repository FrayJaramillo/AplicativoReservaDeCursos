from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

# Configuración de la URL de la base de datos
DATABASE_URL = "mysql+pymysql://admin:admin123@db_service_mysql/university_db"
# Crear el motor de conexión
engine = create_engine(DATABASE_URL, echo=True)

# Crear la sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Definir la base para los modelos
Base = declarative_base()

# Función para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

