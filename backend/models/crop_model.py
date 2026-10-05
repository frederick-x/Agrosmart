from database.db import query


def list_crops(search=""):
    if search:
        like = f"%{search}%"
        return query("SELECT * FROM crop_information WHERE crop_name LIKE %s OR description LIKE %s "
                     "OR soil_type LIKE %s ORDER BY crop_name", (like, like, like))
    return query("SELECT * FROM crop_information ORDER BY crop_name")


def get_crop(crop_id):
    return query("SELECT * FROM crop_information WHERE id=%s", (crop_id,), one=True)


def get_by_key(key):
    """key = dataset label such as 'kidneybeans' -> matches 'Kidney Beans'."""
    return query("SELECT * FROM crop_information WHERE REPLACE(LOWER(crop_name),' ','')=%s", (key,), one=True)
