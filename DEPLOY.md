# LotsTracker — Guida al Deploy con Docker

## Indice
1. [Requisiti](#1-requisiti)
2. [Prima installazione (Setup)](#2-prima-installazione-setup)
3. [Autenticazione GitHub Container Registry](#3-autenticazione-github-container-registry-ghcr)
4. [Aggiornamento del servizio](#4-aggiornamento-del-servizio)
5. [Struttura dei dati persistenti](#5-struttura-dei-dati-persistenti)
6. [Backup e ripristino](#6-backup-e-ripristino)
7. [Comandi utili](#7-comandi-utili)
8. [Pubblicare una nuova versione (sviluppatori)](#8-pubblicare-una-nuova-versione-sviluppatori)
9. [Risoluzione dei problemi](#9-risoluzione-dei-problemi)

---

## 1. Requisiti

| Requisito | Versione minima | Note |
|---|---|---|
| **Docker Desktop** | 4.x | Avviarlo prima di ogni operazione |
| **Sistema operativo** | Windows 10/11 | WSL2 abilitato consigliato |
| Connessione internet | — | Solo per il primo download e gli aggiornamenti |

> Per verificare che Docker funzioni, aprire un terminale (Prompt dei comandi o PowerShell) e digitare: `docker --version`

---

## 2. Prima installazione (Setup)

### Passo 1 — Scaricare i file di deploy

Dal repository GitHub, scaricare l'ultima release disponibile nella sezione **Releases** e decomprimere lo ZIP in una cartella del server (es. `C:\LotsTracker\`).

La struttura attesa è:
```
C:\LotsTracker\
  docker-compose.yml
  .env.example
  scripts\
    setup.bat
    update.bat
```

### Passo 2 — Configurare il file `.env`

Copiare il file `.env.example` e rinominarlo `.env`:
```
copy .env.example .env
```

Aprire `.env` con Notepad e compilare i campi:

```dotenv
# Immagine Docker — fornita dal team di sviluppo
IMAGE_NAME=ghcr.io/GITHUB_USERNAME/lotsTracker
IMAGE_TAG=latest

# Chiave segreta Django — generare un valore casuale e lungo
# Esempio di generazione: aprire Python e digitare:
#   import secrets; print(secrets.token_hex(50))
SECRET_KEY=inserire_qui_una_chiave_lunga_e_casuale

# Indirizzi autorizzati (IP del server o * per tutti)
ALLOWED_HOSTS=*
```

> **IMPORTANTE:** Non condividere mai il file `.env` — contiene la chiave segreta dell'applicazione.

### Passo 3 — Eseguire il setup automatico

Aprire il Prompt dei comandi **nella cartella `C:\LotsTracker\`** e digitare:
```
scripts\setup.bat
```

Lo script eseguirà automaticamente:
- Creazione della cartella `data\` per i dati persistenti
- Download dell'immagine Docker
- Avvio del servizio
- Applicazione delle migrazioni del database

### Passo 4 — Creare il primo utente amministratore

Dopo il setup, aprire un terminale ed eseguire:
```
docker exec -it lotstracker python manage.py createsuperuser
```

Inserire username, email e password quando richiesto.

### Passo 5 — Accedere all'applicazione

Aprire il browser e navigare su:
```
http://localhost:8000
```

---

## 3. Autenticazione GitHub Container Registry (GHCR)

L'immagine è ospitata su GitHub Container Registry (ghcr.io). Per poterla scaricare potrebbe essere necessario autenticarsi.

### Pacchetto pubblico (scenario più semplice)
Se l'immagine è configurata come **pubblica** su GitHub, non è necessaria nessuna autenticazione. Il pull avviene automaticamente.

### Pacchetto privato
Se il repository GitHub è privato, occorre autenticarsi con un **Personal Access Token (PAT)**:

1. Andare su GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Creare un token con il permesso `read:packages`
3. Nel terminale del server eseguire:
   ```
   docker login ghcr.io -u GITHUB_USERNAME
   ```
   Inserire il token PAT come password quando richiesto.
4. Dopo il login, Docker salverà le credenziali e i pull futuri saranno automatici.

> Il token PAT deve essere generato dall'account GitHub che ha accesso al repository.

---

## 4. Aggiornamento del servizio

Quando il team di sviluppo rilascia una nuova versione, per aggiornare il servizio basta aprire il Prompt dei comandi nella cartella `C:\LotsTracker\` ed eseguire:

```
scripts\update.bat
```

Lo script eseguirà:
1. Download dell'ultima versione dell'immagine
2. Riavvio del container con la nuova versione (automatico)
3. Applicazione delle nuove migrazioni del database (automatica all'avvio)
4. Pulizia delle immagini vecchie

> **Il database e tutti i dati sono al sicuro** — rimangono nella cartella `data\` sul server host e non vengono mai toccati dall'aggiornamento.

---

## 5. Struttura dei dati persistenti

Tutti i dati dell'applicazione vengono salvati nella cartella `data\` nella stessa directory di `docker-compose.yml`:

```
C:\LotsTracker\
  data\
    database.sqlite    ← database principale dell'applicazione
    media\             ← file caricati dagli utenti (immagini, documenti, ecc.)
```

Questa cartella **non è mai cancellata** durante gli aggiornamenti. Il container Docker può essere fermato, cancellato e ricreato senza perdere nessun dato.

---

## 6. Backup e ripristino

### Backup
Per fare un backup completo dell'applicazione è sufficiente copiare la cartella `data\`:

```bat
xcopy /E /I /Y "C:\LotsTracker\data" "C:\Backup\LotsTracker\data_%date:~-4,4%%date:~-7,2%%date:~0,2%"
```

Oppure con robocopy (consigliato per backup automatici):
```bat
robocopy "C:\LotsTracker\data" "C:\Backup\LotsTracker\data" /E /Z /COPYALL
```

### Ripristino
Per ripristinare un backup:
1. Fermare il servizio: `docker compose down`
2. Sovrascrivere la cartella `data\` con il backup
3. Riavviare: `docker compose up -d`

---

## 7. Comandi utili

Tutti i comandi vanno eseguiti in un terminale nella cartella `C:\LotsTracker\`.

| Operazione | Comando |
|---|---|
| Avviare il servizio | `docker compose up -d` |
| Fermare il servizio | `docker compose down` |
| Vedere i log in tempo reale | `docker logs -f lotstracker` |
| Vedere i log recenti | `docker logs --tail 100 lotstracker` |
| Stato del container | `docker ps` |
| Creare utente amministratore | `docker exec -it lotstracker python manage.py createsuperuser` |
| Aprire una shell nel container | `docker exec -it lotstracker sh` |
| Riavviare il servizio | `docker compose restart` |

---

## 8. Pubblicare una nuova versione (sviluppatori)

Il rilascio di una nuova versione è completamente automatizzato tramite GitHub Actions.

### Workflow
1. Andare su GitHub → Actions → **Build and Push Docker Image**
2. Cliccare **Run workflow**
3. La pipeline eseguirà automaticamente:
   - Build dell'applicazione React (frontend)
   - Build dell'immagine Docker multi-stage
   - Push dell'immagine su `ghcr.io` con i tag `latest` e `YYYYMMDD-HHmmss`
   - Creazione di una GitHub Release con i file di deploy allegati

### Rendere l'immagine accessibile sul server
Se il repository è privato, dopo il primo push andare su:
`GitHub → Packages → lotsTracker → Package settings → Change visibility → Public`

Oppure fornire al server un PAT con permesso `read:packages` (vedi sezione 3).

### Requisiti per la pipeline
- Il repository deve avere **GitHub Actions abilitato**
- Il `GITHUB_TOKEN` ha già i permessi necessari (`packages: write`) — non serve configurare segreti aggiuntivi

---

## 9. Risoluzione dei problemi

### Il servizio non si avvia
```
docker logs lotstracker
```
Leggere i messaggi di errore. Cause comuni:
- **SECRET_KEY non configurata** nel file `.env`
- **Porta 8000 già occupata** — cambiare la porta in `docker-compose.yml` (es. `8080:8000`)

### "Cannot connect to the Docker daemon"
Docker Desktop non è in esecuzione. Aprirlo dalla barra delle applicazioni di Windows.

### "pull access denied" o "unauthorized"
L'immagine è privata e Docker non è autenticato. Seguire la sezione [3 — Autenticazione GHCR](#3-autenticazione-github-container-registry-ghcr).

### Il database sembra vuoto dopo un aggiornamento
Verificare che la cartella `data\` esista nella stessa directory di `docker-compose.yml` e che il file `data\database.sqlite` non sia stato cancellato accidentalmente.

### Errore "No such file or directory: database.sqlite"
La cartella `data\` non esiste. Crearla manualmente:
```
mkdir data
```
Poi riavviare con `docker compose up -d`. Le migrazioni creeranno il database automaticamente.

### Cambiare la porta di accesso
Nel file `docker-compose.yml`, modificare la riga sotto `ports`:
```yaml
ports:
  - "NUOVA_PORTA:8000"   # es. "8080:8000" → accesso su http://localhost:8080
```
Poi riavviare: `docker compose up -d`
