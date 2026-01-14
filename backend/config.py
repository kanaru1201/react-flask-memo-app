import os
from pathlib import Path

class Config:
    # ---  Path Settings  ---
    BASE_DIR = Path(__file__).resolve().parent

    # ---  Database Settings ---
    DATABASE_URL = os.environ.get(
        'DATABASE_URL', 
        'postgresql://user:password@database:5432/react_flask_memo'
    )

    # ---  JWT Authentication Settings (RS256) ---
    JWT_ALGORITHM = 'RS256'
    JWT_ACCESS_TOKEN_EXPIRES = 3600

    JWT_PRIVATE_KEY = os.environ.get('JWT_PRIVATE_KEY')
    JWT_PUBLIC_KEY = os.environ.get('JWT_PUBLIC_KEY')

    private_key_path = BASE_DIR / 'private_key.pem'
    public_key_path = BASE_DIR / 'public_key.pem'

    if not JWT_PRIVATE_KEY and private_key_path.exists():
        JWT_PRIVATE_KEY = private_key_path.read_text()

    if not JWT_PUBLIC_KEY and public_key_path.exists():
        JWT_PUBLIC_KEY = public_key_path.read_text()

    # ---  Cross-Origin Resource Sharing (CORS) ---
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')