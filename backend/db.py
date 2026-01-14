# Third Party Library
import psycopg2
from psycopg2.extras import RealDictCursor

# Local application imports
from config import Config

def get_db():
    dsn = Config.DATABASE_URL

    conn = psycopg2.connect(dsn, cursor_factory=RealDictCursor)
    return conn