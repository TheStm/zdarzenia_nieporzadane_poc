#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

echo "============================================="
echo "  Zdarzenia Niepożądane — System Raportowania"
echo "============================================="
echo ""

# Sprawdź Docker
if ! command -v docker &> /dev/null; then
    echo "BŁĄD: Docker nie jest zainstalowany."
    echo "Zainstaluj Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &> /dev/null 2>&1; then
    echo "Docker wymaga uprawnień. Próbuję z sudo..."
    DOCKER="sudo docker"
    COMPOSE="sudo docker compose"
else
    DOCKER="docker"
    COMPOSE="docker compose"
fi

# Sprawdź docker compose
if ! $COMPOSE version &> /dev/null 2>&1; then
    echo "BŁĄD: Docker Compose nie jest dostępny."
    exit 1
fi

echo "[1/5] Buduję kontenery..."
$COMPOSE build --quiet

echo "[2/5] Uruchamiam bazę danych, backend i frontend..."
$COMPOSE up -d

echo "[3/5] Czekam na bazę danych..."
for i in $(seq 1 30); do
    if $COMPOSE exec -T db pg_isready -U zdarzenia &> /dev/null; then
        break
    fi
    sleep 1
done

echo "[4/5] Uruchamiam migracje bazy danych..."
$COMPOSE exec -T backend alembic upgrade head

echo "[5/5] Ładuję przykładowe dane..."
$COMPOSE exec -T backend pip install httpx -q 2>/dev/null
$COMPOSE exec -T backend python seed.py

echo ""
echo "============================================="
echo "  System gotowy!"
echo "============================================="
echo ""
echo "  Frontend:  http://localhost:5173"
echo "  API:       http://localhost:8000"
echo "  API Docs:  http://localhost:8000/docs"
echo ""
echo "  Aby zatrzymać: $COMPOSE down"
echo "  Aby usunąć dane: $COMPOSE down -v"
echo ""
