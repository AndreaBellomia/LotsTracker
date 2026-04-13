#!/bin/bash
set -e

echo ""
echo " LotsTracker - Setup Iniziale"
echo " =============================="
echo ""

# Verifica che Docker sia in esecuzione
if ! docker info >/dev/null 2>&1; then
    echo "[ERRORE] Docker non è in esecuzione. Avviarlo e riprovare."
    exit 1
fi

# Crea cartella dati persistenti se non esiste
if [ ! -d "data" ]; then
    echo "[1/5] Creazione cartella dati persistenti..."
    mkdir -p data/media
    echo "       Cartella ./data creata."
else
    echo "[1/5] Cartella dati già presente."
    mkdir -p data/media
fi

# Crea il file .env se non esiste
if [ ! -f ".env" ]; then
    echo "[2/5] Creazione file di configurazione .env..."
    cp .env.example .env
    echo ""
    echo " -------------------------------------------------------"
    echo " ATTENZIONE: occorre configurare il file .env"
    echo " -------------------------------------------------------"
    echo " Aprire .env con un editor di testo e impostare:"
    echo "   - IMAGE_NAME  : percorso dell'immagine Docker"
    echo "                   es. ghcr.io/mia-azienda/lotsTracker"
    echo "   - SECRET_KEY  : chiave segreta casuale e lunga"
    echo "   - ALLOWED_HOSTS: indirizzo IP del server (o * per tutti)"
    echo " -------------------------------------------------------"
    echo ""
    echo "Premere Invio dopo aver salvato il file .env per continuare..."
    read -r
else
    echo "[2/5] File .env già presente."
fi

# Scarica l'immagine
echo "[3/5] Download immagine Docker..."
docker compose pull
if [ $? -ne 0 ]; then
    echo "[ERRORE] Download fallito. Verificare IMAGE_NAME in .env e le credenziali Docker."
    echo "         Consultare DEPLOY.md sezione 'Autenticazione GHCR'."
    exit 1
fi

# Avvia il servizio
echo "[4/5] Avvio del servizio..."
docker compose up -d

echo "[5/5] Setup completato!"
echo ""
echo " ================================================================"
echo "  Servizio LotsTracker avviato con successo!"
echo "  Aprire il browser su: http://localhost:8000"
echo ""
echo "  Per creare il primo utente amministratore eseguire:"
echo "    docker exec -it lotstracker python manage.py createsuperuser"
echo ""
echo "  Per i prossimi aggiornamenti usare: bash scripts/update.sh"
echo " ================================================================"
echo ""
