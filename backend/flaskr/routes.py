from flask import Blueprint
from . import database

routes = Blueprint("routes", __name__)


@routes.route("/api/class/new", methods=["POST"])
def create_class():
  db = database.get_db()
  res = db.execute("""
    INSERT INTO Classrooms (name)
      VALUES ("{}")
      RETURNING id
  """.format(request.json["name"]))

  class_id = res.fetchone()[0]
  user_id = request.json["user_id"]
  db.execute("""
    INSERT INTO UserClassroomMap (classroom_id, user_id)
      VALUES ({}, {})
  """.format(class_id, user_id))
  db.commit()
  return res.fetchall()

@routes.route("/api/class/list", methods=["GET"])
def list_classes():
  db = database.get_db()
  res = db.execute("""
    SELECT * FROM Classrooms c
  """)
  return [dict(row) for row in res.fetchall()]

@routes.route("/api/class/<class_id>/students", methods=["GET"])
def get_class_students(class_id):
  db = database.get_db()
  res = db.execute(f"""
    SELECT s.* FROM Classrooms c
      JOIN ClassroomStudentMap m ON m.classroom_id = c.id
      JOIN Students s ON m.student_id = s.id
      WHERE c.id = {class_id}
  """)
  return [dict(row) for row in res.fetchall()]

@routes.route("/api/class/<class_id>/add_student", methods=["POST"])
def add_student(class_id):
  db = database.get_db()

  res1 = db.execute(f"""
    INSERT INTO Students (first_name, last_name)
      VALUES (
        "{request.json["first_name"]}",
        "{request.json["last_name"]}"
      )
      RETURNING id
  """)
  row = res1.fetchone()
  (student_id, ) = row if row else None

  res = db.execute(f"""
    INSERT INTO ClassroomStudentMap
      VALUES ({class_id}, {student_id})
  """)

  db.commit()
  return res.fetchall()
  
@routes.route("/api/user/new", methods = ["POST"])
def add_user():
  db = database.get_db()
  db.execute(f"""
    INSERT INTO Users
      VALUES (
        {int(request.json["user_id"])},
        "{request.json["name"]}",
        "{request.json["password"]}"
        );
  """)
  
  db.commit()

@routes.route("/api/user/<user_id>/class/<class_id>/seating/new_seating", methods = ["POST"])
def new_seating():
  db = database.get_db()
  res = db.execute(f"""
    INSERT INTO Seating
      VALUES (
        "{request.json["name"]}"
      )
      RETURNING id
  """)
  seating_id = res.fetchone()[0]
  
  db.execute("""
    INSERT INTO UserSeatingMap
      VALUES ({user_id}, {seating_id})
    """)
  db.execute("""
    INSERT INTO ClassroomSeatingMap
      VALUES ({class_id}, {seating_id})
    """)
  db.commit()
