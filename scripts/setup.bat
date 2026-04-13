@echo off
setlocal enabledelayedexpansion

echo.
echo  LotsTracker - Setup Iniziale
echo  ==============================
echo.

:: Verifica che Docker sia in esecuzione
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRORE] Docker Desktop non e' in esecuzione.
    echo          Avviarlo dalla barra delle applicazioni e riprovare.
    echo.
    pause
    exit /b 1
)

:: Crea la cartella dati persistenti se non esiste
if not exist "data" (
    echo [1/5] Creazione cartella dati persistenti...
    mkdir data
    mkdir data\media
    echo        Cartella ./data creata.
) else (
    echo [1/5] Cartella dati gia' presente.
    if not exist "data\media" mkdir data\media
)

:: Crea o configura il file .env
if not exist ".env" (
    echo [2/5] Creazione file di configurazione .env...
    copy .env.example .env >nul
    echo.
    echo  -------------------------------------------------------
    echo  ATTENZIONE: occorre configurare il file .env
    echo  -------------------------------------------------------
    echo  Aprire .env con un editor di testo e impostare:
    echo    - IMAGE_NAME  : percorso dell'immagine Docker
    echo                    es. ghcr.io/mia-azienda/lotsTracker
    echo    - SECRET_KEY  : chiave segreta casuale e lunga
    echo    - ALLOWED_HOSTS: indirizzo IP del server (o * per tutti)
    echo.
    echo  Il file si aprira' in Notepad. Salvarlo e chiuderlo
    echo  per continuare con il setup.
    echo  -------------------------------------------------------
    echo.
    pause
    notepad .env
    echo.
    echo  Una volta salvato il file .env premere un tasto per continuare...
    pause >nul
) else (
    echo [2/5] File .env gia' presente.
)

:: Autentica Docker con GHCR se necessario
echo [3/5] Verifica autenticazione GitHub Container Registry...
echo  Se richiesto, inserire le credenziali GitHub (username + token PAT).
echo  Per saltare premere Ctrl+C se l'immagine e' gia' disponibile localmente.
echo.
for /f "tokens=2 delims==" %%a in ('findstr /i "IMAGE_NAME" .env') do set IMG_NAME=%%a
docker pull %IMG_NAME%:latest
if %errorlevel% neq 0 (
    echo.
    echo [ERRORE] Impossibile scaricare l'immagine.
    echo          Verificare IMAGE_NAME in .env e le credenziali Docker.
    echo          Consultare DEPLOY.md sezione "Autenticazione GHCR".
    echo.
    pause
    exit /b 1
)

:: Esegue il servizio
echo [4/5] Avvio del servizio...
docker compose up -d
if %errorlevel% neq 0 (
    echo [ERRORE] Avvio del servizio fallito. Controllare i log con:
    echo          docker logs lotstracker
    pause
    exit /b 1
)

echo [5/5] Setup completato!
echo.
echo  ================================================================
echo   Servizio LotsTracker avviato con successo!
echo   Aprire il browser su: http://localhost:8000
echo.
echo   Per creare il primo utente amministratore eseguire:
echo     docker exec -it lotstracker python manage.py createsuperuser
echo.
echo   Per i prossimi aggiornamenti usare: scripts\update.bat
echo  ================================================================
echo.
pause
