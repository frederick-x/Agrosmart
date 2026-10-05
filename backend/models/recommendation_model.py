from database.db import query


def create(user_id, d, crop, confidence):
    return query(
        "INSERT INTO recommendations (user_id,nitrogen,phosphorus,potassium,ph,temperature,humidity,rainfall,"
        "soil_type,location,recommended_crop,confidence) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
        (user_id, d["nitrogen"], d["phosphorus"], d["potassium"], d["ph"], d["temperature"], d["humidity"],
         d["rainfall"], d["soil_type"], d["location"], crop, confidence), write=True)


def list_for_user(user_id, saved_only=False):
    sql = "SELECT * FROM recommendations WHERE user_id=%s"
    if saved_only:
        sql += " AND is_saved=1"
    return query(sql + " ORDER BY created_at DESC, id DESC LIMIT 200", (user_id,))


def mark_saved(rec_id, user_id):
    query("UPDATE recommendations SET is_saved=1 WHERE id=%s AND user_id=%s", (rec_id, user_id), write=True)
    return query("SELECT * FROM recommendations WHERE id=%s AND user_id=%s", (rec_id, user_id), one=True)
