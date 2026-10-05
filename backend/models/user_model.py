from database.db import query


def get_by_email(email):
    return query("SELECT * FROM users WHERE email=%s", (email,), one=True)


def create(name, email, phone, password_hash, location):
    return query("INSERT INTO users (name,email,phone,password_hash,location) VALUES (%s,%s,%s,%s,%s)",
                 (name, email, phone, password_hash, location), write=True)
