import mysql.connector

def get_db_connection():
    """
    Establece una conexión a la base de datos MySQL.

    Returns:
        mysql.connector.connection.MySQLConnection: Objeto de conexión a la base de datos.
    """
    return mysql.connector.connect(
        host="db_service_mysql",  # Nombre del servicio de base de datos definido en docker-compose.yml
        user="admin",             # Usuario de la base de datos
        password="admin123",      # Contraseña del usuario de la base de datos
        database="university_db", # Nombre de la base de datos
        port="3306"               # Puerto de la base de datos
    )
