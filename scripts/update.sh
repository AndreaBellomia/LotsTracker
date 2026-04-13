#!/bin/bash
set -e

echo ""
echo " LotsTracker - Aggiornamento Servizio"
echo " ======================================"
echo ""

if [ ! -f ".env" ]; then
    echo "[ERRORE] File .env non trovato."
    echo "         Eseguire prima setup.sh per il setup iniziale."
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "[ERRORE] Docker non è in esecuzione. Avviarlo e riprovare."
    exit 1
fi

echo "[1/3] Download nuova versione dell'immagine..."
docker compose pull

echo "[2/3] Riavvio del servizio con la nuova versione..."
docker compose up -d

echo "[3/3] Pulizia immagini vecchie..."
docker image prune -f

echo ""
echo " ================================================================"
echo "  Servizio aggiornato e avviato!"
echo "  Aprire il browser su: http://localhost:8000"
echo " ================================================================"
echo ""
