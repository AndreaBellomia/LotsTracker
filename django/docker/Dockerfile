FROM python:3.11

ENV PYTHONUNBUFFERED 1
RUN pip install --upgrade pip
RUN mkdir /app
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt
COPY ./detergo /app
ENV DEBUG=True
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
