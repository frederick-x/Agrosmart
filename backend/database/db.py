"""MySQL connection pool + SQLite fallback query helper.
Supports MySQL when available, or automatically falls back to SQLite for Vercel/serverless environments.
All queries use %s placeholders (parameterised) which are converted to ? for SQLite."""
import os
import sqlite3
import datetime
import decimal
import tempfile
from config import Config
from database.crops_data import CROPS

_pool = None
_use_sqlite = False
_sqlite_path = os.path.join(tempfile.gettempdir(), "smart_crop_vercel.db")


def _get_pool():
    global _pool, _use_sqlite
    if _use_sqlite:
        return None
    if _pool is None:
        try:
            from mysql.connector import pooling
            _pool = pooling.MySQLConnectionPool(
                pool_name="agro_pool", pool_size=5, host=Config.DB_HOST, port=Config.DB_PORT,
                user=Config.DB_USER, password=Config.DB_PASSWORD, database=Config.DB_NAME,
                connect_timeout=3
            )
            # Test a connection
            test_conn = _pool.get_connection()
            test_conn.close()
        except Exception as err:
            print(f"[DB] MySQL connection failed ({err}). Falling back to SQLite at {_sqlite_path}")
            _use_sqlite = True
            _pool = None
            _init_sqlite()
    return _pool


def _init_sqlite():
    conn = sqlite3.connect(_sqlite_path)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            password_hash TEXT NOT NULL,
            location TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS crop_information (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_name TEXT UNIQUE NOT NULL,
            description TEXT,
            soil_type TEXT,
            min_ph REAL,
            max_ph REAL,
            min_temperature REAL,
            max_temperature REAL,
            rainfall TEXT,
            min_rainfall REAL,
            max_rainfall REAL,
            growing_period TEXT,
            cultivation_info TEXT,
            fertilizer_info TEXT,
            irrigation_info TEXT
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS recommendations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            nitrogen REAL,
            phosphorus REAL,
            potassium REAL,
            ph REAL,
            temperature REAL,
            humidity REAL,
            rainfall REAL,
            soil_type TEXT,
            location TEXT,
            recommended_crop TEXT,
            confidence REAL,
            is_saved INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()

    # Check if crops are seeded
    cur.execute("SELECT COUNT(*) FROM crop_information")
    if cur.fetchone()[0] == 0:
        insert_sql = """INSERT OR REPLACE INTO crop_information
         (crop_name, description, soil_type, min_ph, max_ph, min_temperature, max_temperature, rainfall,
          min_rainfall, max_rainfall, growing_period, cultivation_info, fertilizer_info, irrigation_info)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"""
        for c in CROPS:
            name, desc, soil, pmin, pmax, tmin, tmax, rmin, rmax, period, cult, fert, irr = c
            cur.execute(insert_sql, (name, desc, soil, pmin, pmax, tmin, tmax, f"{rmin}–{rmax} mm",
                                     rmin, rmax, period, cult, fert, irr))
        conn.commit()
    conn.close()


def _clean(row):
    if isinstance(row, sqlite3.Row):
        row = dict(row)
    for k, v in dict(row).items():
        if isinstance(v, decimal.Decimal):
            row[k] = float(v)
        elif isinstance(v, (datetime.datetime, datetime.date)):
            row[k] = v.isoformat()
    return row


def query(sql, params=(), one=False, write=False):
    """write=True -> commits and returns lastrowid. Otherwise returns rows (or one row)."""
    global _use_sqlite
    pool = _get_pool()
    if pool is not None and not _use_sqlite:
        try:
            conn = pool.get_connection()
            try:
                cur = conn.cursor(dictionary=True)
                cur.execute(sql, params)
                if write:
                    conn.commit()
                    return cur.lastrowid
                rows = [_clean(r) for r in cur.fetchall()]
                return (rows[0] if rows else None) if one else rows
            finally:
                conn.close()
        except Exception as e:
            print(f"[DB] MySQL query failed ({e}). Switching to SQLite...")
            _use_sqlite = True
            _init_sqlite()

    # SQLite query processing
    conn = sqlite3.connect(_sqlite_path)
    conn.row_factory = sqlite3.Row
    try:
        cur = conn.cursor()
        # Convert %s to ? for sqlite
        sqlite_sql = sql.replace("%s", "?")
        cur.execute(sqlite_sql, params)
        if write:
            conn.commit()
            return cur.lastrowid
        raw_rows = cur.fetchall()
        rows = [_clean(r) for r in raw_rows]
        return (rows[0] if rows else None) if one else rows
    finally:
        conn.close()

