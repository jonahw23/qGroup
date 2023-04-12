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
      RETURNING class_id
  """.format(request.json["name"]))
  res = db.execute("""
    INSERT INTO Classrooms (name)
      VALUES ("{}")
  """.format(request.json["name"]))

  class_id = db.execute("""SELECT * FROM Classrooms ORDER BY class_id DESC LIMIT 1""").fetchone()[0]
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

@routes.route("/api/users/<user_id>/get_classes", methods = ["GET"])
@cross_origin()
def list_classes_user(user_id):
  db = database.get_db()
  res = db.execute("""
    SELECT * FROM Classrooms c 
      JOIN UserClassroomMap m ON m.classroom_id = c.class_id
      WHERE m.user_id = (?)
  """, (user_id))
  return [dict(row) for row in res.fetchall()]
  
@routes.route("/api/users/<user_id>/class/<class_id>/students", methods=["GET"])
@cross_origin()
def get_class_students(user_id, class_id):
  db = database.get_db()
  res = db.execute(f"""
    SELECT s.* FROM Classrooms c
      JOIN ClassroomStudentMap m ON m.classroom_id = c.class_id
      JOIN Students s ON m.student_id = s.id
      WHERE c.class_id = {class_id}
  """)
  return [dict(row) for row in res.fetchall()]

@routes.route("/api/users/<user_id>/class/<class_id>/add_student", methods=["POST"])
@cross_origin()
def add_student(user_id, class_id):
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

@routes.route("/api/users/<user_id>/class/<class_id>/students/remove_student", methods = ["DELETE"])
@cross_origin()
def remove_student(user_id, class_id):
  db = database.get_db()
  stud_id = request.json["student_id"]

  db.execute("DELETE FROM Students WHERE id = (?)", (stud_id,))
  db.execute("DELETE FROM ClassroomStudentMap WHERE student_id = (?)", (stud_id,))
  db.execute("DELETE FROM StudentGroupMap WHERE student_id = (?)", (stud_id,))
  db.execute("DELETE FROM StudentStudentMap WHERE student_id1 = (?) OR student_id2 = (?)", (stud_id, stud_id))
  
  db.commit()
  return "", 201
  
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
def new_seating(user_id, class_id):
  db = database.get_db()
  db.execute("""
    INSERT INTO Seating (name, class_id)
      VALUES (?, ?)
  """, (request.json["name"], class_id))
  seating_id = db.execute("SELECT id FROM Seating ORDER BY id DESC").fetchone()[0]
  db.execute("""
    INSERT INTO UserSeatingMap
      VALUES (?,?)
    """, (user_id, seating_id))
  db.commit()

  return "", 201

@routes.route("/api/users/<user_id>/class/<class_id>/seating/<seating_id>/new_furniture", methods = ["POST"])
@cross_origin()
def new_furniture(user_id, class_id, seating_id):
  db = database.get_db()
  db.execute("""
    INSERT INTO Furniture (type, x, y, theta, seating_id)
      VALUES (?, ?, ?, ?, ?) 
  """, (request.json["furn_type"], request.json["x"], request.json["y"], request.json["theta"], seating_id))
  #Should position be hard coded in or set by the user?
  furn_id = db.execute("SELECT furn_id FROM Furniture ORDER BY furn_id DESC").fetchone()[0]
  db.commit()
  return { "furn_id": furn_id }, 201

@routes.route("/api/users/<user_id>/class/<class_id>/seating/<seating_id>/furniture/<furniture_id>/move_furn", methods = ["PUT"])
@cross_origin()
def move_furn(user_id, class_id, seating_id, furniture_id):
  db = database.get_db()
  db.execute("""
    UPDATE Furniture
    SET x = (?), y = (?), theta = (?)
      WHERE furn_id = (?)
  """, (request.json["new_x"], request.json["new_y"], request.json["new_theta"], furniture_id))
  db.commit()
  return "", 200

@routes.route("/api/users/<user_id>/class/<class_id>/seating/<seating_id>/furniture/get_furniture_loc", methods = ["GET"])
@cross_origin()
def furniture_locations(user_id, class_id, seating_id):
  db = database.get_db()
  res = db.execute("""
    SELECT * FROM Furniture
      WHERE seating_id = (?)
  """, (seating_id,))
  return [dict(row) for row in res.fetchall()]
  
@routes.route("/api/users/<user_id>/class/<class_id>/seating/<seating_id>/new_tableGroup", methods = ["POST"])
@cross_origin()
def new_tableGroup(seating_id):
  db = database.get_db()
  db.execute("""
    INSERT INTO tableGroup (name)
      VALUES (?)
  """, (request.json["table_group_name"],))
  tableGroup_id = db.execute("SELECT id FROM tableGroup ORDER BY id DESC").fetchone()[0]
  db.execute("""
    INSERT INTO tableGroupSeatingMap
      VALUES (?,?)
  """, (tableGroup_id, seating_id))
  db.commit()
  return "", 201

@routes.route("/api/users/<user_id>/class/<class_id>/seating/<seating_id>/<table_group_id>/map_furn", methods = ["POST"])
@cross_origin()
def map_furn_group(table_group_id):
  db = database.get_db()
  db.execute("""
    INSERT INTO FurnitureTableGroupMap
      VALUES (?,?)
  """, (request.json["furn_id"], request.json["table_group_id"]))
  db.commit()
  return "", 201

@routes.route("/api/users/<user_id>/class/<class_id>/<seating_id>", methods = ["POST"])
@cross_origin()
def map_stud_furn(user_id, class_id, seating_id):
  db = database.get_db()

  students = get_class_students(user_id, class_id).json

  res = db.execute("""
    SELECT furn_id FROM Furniture
      WHERE seating_id = (?) AND type = (?)
  """, (seating_id, "desk"))
  seats = res.fetchall()

  for i,student in enumerate(students): 
    #Assumes the number of students is greater than or equal to the number of seats
    db.execute("""
      INSERT INTO StudentFurnMap 
        VALUES (?, ?)
    """, (students[student]["id"], seats[i])) 

  db.commit()
  return "", 201

@routes.route("/api/users/<user_id>/class/<class_id>/students/set_weight", methods = ["POST"])
@cross_origin()
def set_weight(user_id, class_id):
  db = database.get_db()
  db.execute("""
    INSERT INTO StudentStudentMap
      VALUES (?, ?, ?)
  """, (request.json["stud_id1"], request.json["stud_id2"], request.json["weight"]))
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
  meta_group_id = db.execute("SELECT meta_group_id FROM MetaGroup ORDER BY meta_group_id DESC").fetchone()[0]
  db.execute("""
    INSERT INTO ClassroomMetaGroupMap
      VALUES (?,?)
  """, (class_id, meta_group_id))
  
  students = get_class_students(user_id, class_id).json

  students.sort(key = lambda a: a["id"])
  
  print("Amount:", request.json["group_amount"])
  print("size:", {request.json["group_size"]})

  w = request.json["weights"]

  for s1 in w:
    text = str(s1)+":"
    for s2 in w[s1]:
        if w[s1][s2] != 0:
          text = text + " ("+str(s2)+", "+str(w[s1][s2])+")"
    print(text)

  groups = student_algorithms.group_students(
    students, 
    group_amount=request.json["group_amount"], 
    group_size=request.json["group_size"],
    #weights=request.json["weights"]
  )

  for i, group in enumerate(groups):
    group_name = "Group " + str(i + 1)
    db.execute("""
      INSERT INTO StudentGroup (name)
        VALUES (?)
    """, (group_name,))
    group_id = db.execute("SELECT id FROM StudentGroup ORDER BY id DESC").fetchone()[0]
    db.execute("""
      INSERT INTO MetaGroupGroupMap
        VALUES (?,?)
    """, (meta_group_id, group_id))
    for student in group:
      db.execute("""
        INSERT INTO StudentGroupMap (student_id, group_id)
          VALUES (?,?)
      """, (students[int(student)]["id"], group_id)) #student should be in order of ID
  db.commit()
  
  return groups

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


@routes.route("/api/users/<user_id>/class/<class_id>/upload_students", methods = ["POST"])
@cross_origin()
def upload_students(class_id, user_id):
    db = database.get_db()
    print(request)
    students = request.json["students"]
    for i in range(len(students)):
      student = students[i]
      res1 = db.execute(f"""
    INSERT INTO Students (first_name, last_name)
      VALUES (
        "{student["first_name"]}",
        "{student["last_name"]}"
      )
      """)
      student_id = db.execute("SELECT id FROM Students ORDER BY id DESC").fetchone()[0]

      res = db.execute(f"""
      INSERT INTO ClassroomStudentMap
      VALUES ({class_id}, {student_id})
      """)

    db.commit()
    return "done"

@routes.route("/api/users/<user_id>/class/<class_id>/get_weights", methods = ["GET"])
@cross_origin()
def get_weights(class_id, user_id):
    db = database.get_db()

    weights = {}

    students = get_class_students(user_id, class_id).json

    for student in students:
      res = db.execute(f"""SELECT * FROM StudentStudentMap WHERE student_id1 = ({student["id"]})""")
      student_weights = [dict(row) for row in res.fetchall()]
      
      if(not student["id"] in weights):
        weights[student["id"]] = {}
        
      for key in weights:
        student_weights.append({"student_id1":student["id"], "student_id2":key, "weight":0})
      
      for weight in student_weights:
        if(not (weight["weight"] == 0) or not weight["student_id2"] in weights[weight["student_id1"]]):
          weights[weight["student_id1"]][weight["student_id2"]] = weight["weight"]
          if(weight["student_id2"] in weights):
            weights[weight["student_id2"]][weight["student_id1"]] = weight["weight"]
          else:
            weights[weight["student_id2"]] = {}
            weights[weight["student_id2"]][weight["student_id1"]] = weight["weight"]
      
    print("weights:", weights)
    return weights


