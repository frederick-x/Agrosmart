"""MySQL connection pool + a tiny query helper.
All queries use %s placeholders (parameterised) => protects against SQL injection."""
import datetime
import decimal
from mysql.connector import pooling
from config import Config

_pool = None


def _get_pool():
    global _pool
    if _pool is None:
        _pool = pooling.MySQLConnectionPool(
            pool_name="agro_pool", pool_size=5, host=Config.DB_HOST, port=Config.DB_PORT,
            user=Config.DB_USER, password=Config.DB_PASSWORD, database=Config.DB_NAME,
        )
    return _pool


def _clean(row):
    for k, v in row.items():
        if isinstance(v, decimal.Decimal):
            row[k] = float(v)
        elif isinstance(v, (datetime.datetime, datetime.date)):
            row[k] = v.isoformat()
    return row


def query(sql, params=(), one=False, write=False):
    """write=True -> commits and returns lastrowid. Otherwise returns rows (or one row)."""
    conn = _get_pool().get_connection()
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
