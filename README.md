# LotTracker GEstionale
Management software for tracking rental lots

### DEV info
## Prerequisites
required `python 3.11`

pip `23.0.1`

Docker

Node JS `18.16.0`

## Commands

### Virtual Enviroment 
Create virtual enviroment
``` bash
python -m vev venv
```
Activate virtual enviroment
``` bash
./venv/Scripts/activate # Windows only
source venv/bin/activate # MacOs
source bin/activate # Linux
```
Deactivate virtual enviroment
``` bash
deactivate
```
### Docker
Create database with docker 
``` bash
cd django
docker compose -f docker/docker-compose.yaml build
docker compose -f docker/docker-compose.yaml up -d
```
### Django
Start django apps
``` bash
cd django
python manage.py migrate # Only first run
python manage.py runserver
```
### React (Node Enviroment)
Start django apps
``` bash
npm install
npm run dev # For developing
```
Remeber start node js server and django server at the same time



# Installation
For quick installation of LotTracker we need:

Python: `3.11`
pip `23.0.1`

installed in your machine.

## Installation checklist 

1) Download last release zip `release_files.zip`
   
2) Generate new secrets
```bash
linux / macos
python3 -c 'import secrets; print(secrets.token_hex(50))'

windows
python -c 'import secrets; print(secrets.token_hex(50))'
```
this secrets  need for settings file

3) Edit django configuration 
- Update DEBUG Mode 
folder: `django/app/settings.py`

```python
DEBUG=True -> DEBUG=False
SECRET_KEY=... -> SECRET_KEY=new generated secrets

# Optional 
## Settings db
```

4) Install dependencies
```bash
pip install -r requirements.txt

```

5) Generate db
```bash
linux / macos
python3 manage.py migrate

windows
python manage.py migrate
```
stop server after run

6) Create admin user
```bash
linux / macos
python3 manage.py createsuperuser

windows
python manage.py createsuperuser
```

7) Run server
```bash
linux / macos
python3 manage.py runserver

windows
python manage.py runserver
```


### Optional migrate old data MyGas
Update db credentials in command core/management/management/commands/db_migrate

Run command
```bash
python ./django/manage.py db_migrate -database database_name
```

fix eventually error generate in the csv file 

