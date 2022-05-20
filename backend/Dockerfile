# syntax=docker/dockerfile:1

FROM python:3.9-slim-buster

WORKDIR /app

COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock
RUN pip3 install pipenv
RUN pipenv install
RUN pipenv install gunicorn

COPY . .

EXPOSE 5000
CMD ["pipenv", "run", "gunicorn", "-b", ":5000", "server:app", "--worker-class", "aiohttp.GunicornWebWorker"]
