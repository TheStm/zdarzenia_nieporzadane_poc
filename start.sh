#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

echo "============================================="
echo "  Zdarzenia Niepożądane — System Raportowania"
echo "============================================="
echo ""

# Sprawdź Docker
if ! command -v docker > /dev/null 2>&1; then
    echo "BŁĄD: Docker nie jest zainstalowany."
    echo "Zainstaluj Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Sprawdź czy Docker daemon działa
if ! docker info > /dev/null 2>&1; then
    echo "BŁĄD: Docker daemon nie działa. Uruchom Docker Desktop."
    exit 1
fi

# Ustal komendę compose
if docker compose version > /dev/null 2>&1; then
    compose() { docker compose "$@"; }
elif command -v docker-compose > /dev/null 2>&1; then
    compose() { docker-compose "$@"; }
else
    echo "BŁĄD: Docker Compose nie jest dostępny."
    exit 1
fi

echo "[1/5] Buduję kontenery..."
compose build

echo "[2/5] Uruchamiam bazę danych, backend i frontend..."
compose up -d

echo "[3/5] Czekam na bazę danych..."
RETRIES=30
until compose exec -T db pg_isready -U zdarzenia > /dev/null 2>&1; do
    RETRIES=$((RETRIES - 1))
    if [ "$RETRIES" -le 0 ]; then
        echo "BŁĄD: Baza danych nie odpowiada po 30 sekundach."
        echo "Sprawdź logi: docker compose logs db"
        exit 1
    fi
    sleep 1
done
echo "  Baza danych gotowa."

echo "[4/5] Aktualizuję schemat bazy danych..."
compose exec -T backend alembic upgrade head

echo "[5/5] Ładuję przykładowe dane (pomija jeśli istnieją)..."
compose exec -T backend python seed.py

echo ""
echo "============================================="
echo "  System gotowy!"
echo "============================================="
echo ""
echo "  Frontend:  http://localhost:5173"
echo "  API:       http://localhost:8000"
echo "  API Docs:  http://localhost:8000/docs"
echo ""
echo "  Konta testowe:"
echo "    admin@example.com / admin123       (Administrator)"
echo "    koordynator@example.com / koordynator123  (Koordynator)"
echo "    reporter@example.com / reporter123  (Zgłaszający)"
echo ""
echo "  Aby zatrzymać:   docker compose down"
echo "  Aby usunąć dane: docker compose down -v"
echo ""
