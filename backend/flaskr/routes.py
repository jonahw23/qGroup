from flask import Blueprint
from flask import request
from flask_cors import cross_origin
from . import database
from . import student_algorithms

routes = Blueprint("routes", __name__)


@routes.route("/api/users/<user_id>/class/new", methods=["POST"])
@cross_origin()
def create_class(user_id=0):
  db = database.get_db()
  print("""
    INSERT INTO Classrooms (name)
      VALUES ("{}")
      RETURNING id
  """.format(request.json["name"]))
  res = db.execute("""
    INSERT INTO Classrooms (name)
      VALUES ("{}")
  """.format(request.json["name"]))

  class_id = db.execute("""SELECT * FROM Classrooms ORDER BY id DESC LIMIT 1""").fetchone()[0]
  user_id = request.json["user_id"]
  db.execute("""
    INSERT INTO UserClassroomMap (classroom_id, user_id)
      VALUES ({}, {})
  """.format(class_id, user_id))
  db.commit()
  return res.fetchall()

@routes.route("/api/class/list", methods=["GET"])
@cross_origin()
def list_classes():
  db = database.get_db()
  res = db.execute("""
    SELECT * FROM Classrooms c
  """)
  return [dict(row) for row in res.fetchall()]

@routes.route("/api/users/<user_id>/class/<class_id>/students", methods=["GET"])
@cross_origin()
def get_class_students(class_id):
  db = database.get_db()
  res = db.execute(f"""
    SELECT s.* FROM Classrooms c
      JOIN ClassroomStudentMap m ON m.classroom_id = c.id
      JOIN Students s ON m.student_id = s.id
      WHERE c.id = {class_id}
  """)
  return [dict(row) for row in res.fetchall()]

@routes.route("/api/users/<user_id>/class/<class_id>/add_student", methods=["POST"])
@cross_origin()
def add_student(class_id):
  db = database.get_db()

  res1 = db.execute(f"""
    INSERT INTO Students (first_name, last_name)
      VALUES (
        "{request.json["first_name"]}",
        "{request.json["last_name"]}"
      )
  """)
  student_id = db.execute("SELECT id FROM Students ORDER BY id DESC").fetchone()[0]

  res = db.execute(f"""
    INSERT INTO ClassroomStudentMap
      VALUES ({class_id}, {student_id})
  """)

  db.commit()
  return res.fetchall()
  
@routes.route("/api/student/list_students", methods = ["GET"])
@cross_origin()
def list_students():
  db = database.get_db()
  res = db.execute("""
    SELECT * FROM Users
  """)
  return [dict(row) for row in res.fetchall()]

@routes.route("/api/user/<user_id>/class/<class_id>/students/remove_student", methods = ["DELETE"])
@cross_origin()
def remove_student():
  db = database.get_db()
  db.execute("""
    DELETE ClassroomsStudentMap, StudentGroupMap, Students
    FROM Students
    LEFT JOIN ClassroomStudentMap ON ClassroomStudentMap.student_id = Students.id
    LEFT JOIN StudentGroupMap ON StudentGroupMap.student_id = Students.id
    WHERE Students.id = (?)
  """, (request.json["student_id"],))
  db.commit()
  
@routes.route("/api/users/new", methods = ["POST"])
@cross_origin()
def add_user():
  db = database.get_db()
  print("got")
  print(request.json, request.get_json())
  db.execute(f"""
    INSERT INTO Users (name, password)
      VALUES (
        "{request.json["name"]}",
        "{request.json["password"]}"
        );
  """)
  
  db.commit()

  return "", 201

@routes.route("/api/users/list", methods = ["GET"])
@cross_origin()
def list_users():
  db = database.get_db()
  res = db.execute("""
    SELECT * FROM Users
  """)
  return [dict(row) for row in res.fetchall()]

@routes.route("/api/users/<user_id>/class/<class_id>/seating/new_seating", methods = ["POST"])
@cross_origin()
def new_seating():
  db = database.get_db()
  db.execute(f"""
    INSERT INTO Seating
      VALUES (
        "{request.json["name"]}"
      )
  """)
  seating_id = db.execute("SELECT id FROM Seating ORDER BY id DESC").fetchone()[0]
  db.execute("""
    INSERT INTO UserSeatingMap
      VALUES ({user_id}, {seating_id})
    """)
  db.execute("""
    INSERT INTO ClassroomSeatingMap
      VALUES ({class_id}, {seating_id})
    """)
  db.commit()

  return "", 201

@routes.route("/api/users/<user_id>/class/<class_id>/meta_group/make_groups", methods = ["POST"])
@cross_origin()
def make_groups(user_id, class_id):
  db = database.get_db()
  db.execute("""
    INSERT INTO MetaGroup (name)
      VALUES (?)
  """, (request.json["meta_group_name"],))
  meta_group_id = db.execute("SELECT id FROM MetaGroup ORDER BY id DESC").fetchone()[0]
  db.execute("""
    INSERT INTO ClassroomMetaGroupMap
      VALUES (?,?)
  """, (class_id, meta_group_id))
  
  students = get_class_students(class_id)

  students.sort(key = lambda a: a["id"])
  
  groups = student_algorithms.group_students(students, group_amount=request.json["group_amount"], group_size=request.json["group_size"])

  for i, group in enumerate(groups):
    group_name = "Group " + str(i + 1)
    db.execute("""
      INSERT INTO StudentGroup (name)
        VALUES (?)
    """, (group_name,))
    group_id = db.execute("SELECT id FROM StudentGroup ORDER BY id DESC").fetchone()[0]
    for student in group:
      db.execute("""
        INSERT INTO StudentGroupMap (student_id, group_id)
          VALUES (?,?)
      """, (students[student]["id"], group_id)) #student should be in order of ID
  db.commit()

@routes.route("/api/users/<user_id>/class/<class_id>/meta_groups/<meta_group_id>/delete_meta_group", methods = ["DELETE"])
@cross_origin()
def delete_meta_group(class_id, meta_group_id):
  db = database.get_db()
  res = db.execute("""
    SELECT group_id FROM MetaGroupGroupMap
      WHERE meta_group_id = (?)
  """, (meta_group_id,))
  student_group_id_set = res.fetchall()
  for id in student_group_id_set:
    db.execute("""
      DELETE StudentGroupMap, StudentGroup
        FROM StudentGroup
        LEFT JOIN StudentGroupMap ON StudentGroupMap.group_id = StudentGroup.id
        WHERE StudentGroup.id = (?)
    """, (id,))
  
  db.execute("""
    DELETE FROM MetaGroupGroupMap
      WHERE meta_group_id = (?)
  """, (meta_group_id,))
  db.execute("""
    DELETE FROM ClassroomMetaGroupMap
      WHERE meta_group_id = (?)
  """, (meta_group_id,))
  db.execute("""
    DELETE FROM MetaGroup
      WHERE id = (?)
  """, (meta_group_id,))
  db.commit()
