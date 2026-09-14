#!/bin/bash
set -e

# Start MariaDB if not running
if ! mysqladmin ping --silent 2>/dev/null; then
    echo "[CIVICFIX] Starting MariaDB MySQL Server..."
    mariadbd-safe --user=root > /tmp/mariadb.log 2>&1 &
    for i in {1..30}; do
        if mysqladmin ping --silent 2>/dev/null; then
            echo "[CIVICFIX] MariaDB is up and responding."
            break
        fi
        sleep 1
    done
fi

# Ensure database and seed user exist
mysql -u root -e "
CREATE DATABASE IF NOT EXISTS civicfix_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'civicfix_user'@'localhost' IDENTIFIED BY 'civicfix_secure_password';
GRANT ALL PRIVILEGES ON civicfix_db.* TO 'civicfix_user'@'localhost';
FLUSH PRIVILEGES;
" 2>/dev/null || true

# Start Spring Boot backend if not running
if ! pgrep -f "CivicFixApplication" > /dev/null; then
    echo "[CIVICFIX] Starting Spring Boot Java Backend on port 8085..."
    nohup mvn spring-boot:run > /tmp/spring-boot.log 2>&1 &
    for i in {1..40}; do
        if curl -s http://127.0.0.1:8085/api/departments > /dev/null 2>&1; then
            echo "[CIVICFIX] Spring Boot backend is healthy."
            break
        fi
        sleep 1
    done
fi

echo "[CIVICFIX] Starting Frontend Dev Server on port 3000..."
exec npx vite --port=3000 --host=0.0.0.0
