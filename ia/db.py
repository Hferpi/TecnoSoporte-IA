import psycopg2

DB_CONFIG = {
    "host": "postgres",
    "database": "mails",
    "user": "n8n",
    "password": "n8npass",
    "port": 5432
}

def get_db():
    return psycopg2.connect(**DB_CONFIG)
