# Imagen base con PHP-FPM
FROM php:8.2-fpm

# Instalar dependencias del sistema y extensiones de PHP necesarias
RUN apt-get update && apt-get install -y \
    nginx \
    zip unzip \
    git curl \
    libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar archivos del proyecto
COPY . .

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 🔹 Crear los directorios necesarios antes de cambiar permisos
RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Exponer puertos
EXPOSE 80 9000

# Iniciar PHP-FPM y Nginx
CMD service nginx start && php-fpm
