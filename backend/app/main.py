import os
import pymysql
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CI/CD Demo API")

# Cấu hình CORS để Frontend (React) gọi API không bị chặn
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    return pymysql.connect(
        host=os.getenv("DB_HOST", "db"),
        user=os.getenv("DB_USER", "app_user"),
        password=os.getenv("DB_PASSWORD", "app_password"),
        database=os.getenv("DB_NAME", "demo_db"),
        cursorclass=pymysql.cursors.DictCursor
    )

@app.get("/health")
def health_check():
    return {"status": "UP", "service": "Python FastAPI"}

@app.get("/api/users")
def get_users():
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, name, email FROM users")
            users = cursor.fetchall()
        connection.close()
        return {"success": True, "data": users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))