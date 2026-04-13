@echo off
setlocal

echo.
echo  LotsTracker - Aggiornamento Servizio
echo  ======================================
echo.

:: Verifica che il file .env esista
if not exist ".env" (
    echo [ERRORE] File .env non trovato.
    echo          Eseguire prima scripts\setup.bat per il setup iniziale.
    echo.
    pause
    exit /b 1
)

:: Verifica che Docker sia in esecuzione
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRORE] Docker Desktop non e' in esecuzione.
    echo          Avviarlo dalla barra delle applicazioni e riprovare.
    echo.
    pause
    exit /b 1
)

echo [1/3] Download nuova versione dell'immagine...
docker compose pull
if %errorlevel% neq 0 (
    echo [ERRORE] Download fallito. Verificare la connessione internet
    echo          e le credenziali Docker (DEPLOY.md sezione Autenticazione).
    pause
    exit /b 1
)

echo [2/3] Riavvio del servizio con la nuova versione...
docker compose up -d
if %errorlevel% neq 0 (
    echo [ERRORE] Riavvio del servizio fallito.
    echo          Controllare i log con: docker logs lotstracker
    pause
    exit /b 1
)

echo [3/3] Pulizia immagini vecchie (libera spazio disco)...
docker image prune -f

echo.
echo  ================================================================
echo   Servizio aggiornato e avviato!
echo   Aprire il browser su: http://localhost:8000
echo  ================================================================
echo.
pause
