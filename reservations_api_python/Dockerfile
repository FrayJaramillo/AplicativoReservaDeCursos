# Usa una imagen de Python optimizada
FROM python:3.11

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el archivo de requerimientos y la aplicación
COPY requirements.txt .
COPY src/ ./  

# Instalar las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Exponer el puerto en el contenedor
EXPOSE 8001

# Ejecutar FastAPI con Gunicorn y Uvicorn
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8001"]
