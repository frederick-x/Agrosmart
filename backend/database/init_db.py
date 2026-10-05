"""Creates the database/tables from database/schema.sql and loads the crop table.
Run from the backend folder:   python -m database.init_db"""
import os
import mysql.connector
from config import Config
from database.crops_data import CROPS

SCHEMA = os.path.join(os.path.dirname(__file__), "..", "..", "database", "schema.sql")

INSERT = """INSERT INTO crop_information
 (crop_name, description, soil_type, min_ph, max_ph, min_temperature, max_temperature, rainfall,
  min_rainfall, max_rainfall, growing_period, cultivation_info, fertilizer_info, irrigation_info)
 VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
 ON DUPLICATE KEY UPDATE description=VALUES(description), soil_type=VALUES(soil_type),
 min_ph=VALUES(min_ph), max_ph=VALUES(max_ph), min_temperature=VALUES(min_temperature),
 max_temperature=VALUES(max_temperature), rainfall=VALUES(rainfall), min_rainfall=VALUES(min_rainfall),
 max_rainfall=VALUES(max_rainfall), growing_period=VALUES(growing_period),
 cultivation_info=VALUES(cultivation_info), fertilizer_info=VALUES(fertilizer_info),
 irrigation_info=VALUES(irrigation_info)"""


def run():
    conn = mysql.connector.connect(host=Config.DB_HOST, port=Config.DB_PORT,
                                   user=Config.DB_USER, password=Config.DB_PASSWORD)
    cur = conn.cursor()
    sql = open(SCHEMA, encoding="utf8").read()
    sql = "\n".join(l for l in sql.splitlines() if not l.strip().startswith("--"))
    for stmt in sql.split(";"):
        if stmt.strip():
            cur.execute(stmt)
    for c in CROPS:
        name, desc, soil, pmin, pmax, tmin, tmax, rmin, rmax, period, cult, fert, irr = c
        cur.execute(INSERT, (name, desc, soil, pmin, pmax, tmin, tmax, f"{rmin}–{rmax} mm",
                             rmin, rmax, period, cult, fert, irr))
    conn.commit()
    cur.close()
    conn.close()
    print(f"Database ready. {len(CROPS)} crops loaded.")


if __name__ == "__main__":
    run()
