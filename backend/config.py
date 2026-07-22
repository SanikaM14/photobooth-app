import os
from urllib.parse import quote_plus

# MySQL Connection (can be overridden with DATABASE_URL env var)
_MYSQL_USER = os.getenv("MYSQL_USER", "sanika")
_MYSQL_PASS = os.getenv("MYSQL_PASSWORD", "Iamthebest@14")
_MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
_MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
_MYSQL_DB   = os.getenv("MYSQL_DB",   "rose_photobooth")

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"mysql+pymysql://{_MYSQL_USER}:{quote_plus(_MYSQL_PASS)}@{_MYSQL_HOST}:{_MYSQL_PORT}/{_MYSQL_DB}"
)


JWT_SECRET           = os.getenv("JWT_SECRET", "rose_photobooth_secure_jwt_secret_key_2026")
JWT_ALGORITHM        = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRY_MINUTES   = int(os.getenv("JWT_EXPIRY_MINUTES", "1440"))
DEBUG                = os.getenv("DEBUG", "true").lower() == "true"

# File storage
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "static", "uploads")
