import os

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATABASE = os.path.join(BASE_DIR, 'database', 'react-flask-memo.db')
    SECRET_KEY = os.urandom(24)
    SESSION_COOKIE_SAMESITE = "None" 
    SESSION_COOKIE_SECURE = True