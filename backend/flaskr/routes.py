from flask import Blueprint
from flask import request
from flask_cors import cross_origin
from . import database
from . import student_algorithms
from . import furniture_algorithms

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
  db.execute("DELETE FROM StudentFurnMap WHERE student_id = (?)", (stud_id,))
  
  db.commit()
  return "", 200

@routes.route("/api/users/<user_id>/class/<class_id>/delete_class", methods = ["DELETE"])
@cross_origin()
def delete_class(user_id, class_id):
  db = database.get_db()
  
  res = db.execute("""
    SELECT meta_group_id FROM ClassroomMetaGroupMap
      WHERE classroom_id = (?)
  """, (class_id,))
  meta_group_ids = [row[0] for row in res.fetchall()]
  print("meta group ids:")
  print(meta_group_ids)
  for id in meta_group_ids:
    delete_meta_group(user_id, class_id, id)
  
  res = db.execute("""
    SELECT student_id FROM ClassroomStudentMap
      WHERE classroom_id = (?)
  """, (class_id,))
  student_ids = [row[0] for row in res.fetchall()]
  print("student ids: ")
  print(student_ids)
  for id in student_ids:
    db.execute("DELETE FROM Students WHERE id = (?)", (id,))
    db.execute("DELETE FROM ClassroomStudentMap WHERE student_id = (?)", (id,))
    db.execute("DELETE FROM StudentStudentMap WHERE student_id1 = (?) OR student_id2 = (?)", (id, id))
    db.execute("DELETE FROM StudentFurnMap WHERE student_id = (?)", (id,))

  db.execute("""
    DELETE FROM ClassroomSeatingMap
    WHERE class_id = (?)
  """, (class_id,))
  db.execute("""
    DELETE FROM Classrooms
    WHERE class_id = (?)
  """, (class_id,))

  db.commit()
  print("delete class")
  return "", 200

@routes.route("/api/users/new", methods = ["POST"])
@cross_origin()
def add_user():
  db = database.get_db()
  print("got")
  print(request.json, request.get_json())
  db.execute(f"""
    INSERT INTO Users (user_id, name, password)
      VALUES (?, ?, ?)
  """, (request.json["id"], request.json["name"], request.json["password"]))
  
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

@routes.route("/api/users/<user_id>/class/<class_id>/seating/<seating_id>/furniture_groups", methods = ["GET"])
@cross_origin()
def furniture_groups(user_id, class_id, seating_id):
  db = database.get_db()
  res = db.execute("""
    SELECT * FROM FurnitureTableGroupMap m
    JOIN (
      SELECT f.furn_id FROM Furniture f
      WHERE f.seating_id = (?)
    ) ff
    WHERE m.furniture_id = ff.furn_id
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

@routes.route("/api/users/<user_id>/class/<class_id>/seating/<seating_id>/students", methods = ["DELETE"])
@cross_origin()
def clear_stud_furn(user_id, class_id, seating_id):
  db = database.get_db()
  db.execute("""
    DELETE FROM StudentFurnMap AS m
    WHERE m.furn_id IN (
      SELECT f.furn_id FROM Furniture f
      WHERE f.seating_id = (?)
    )
  """, (seating_id))
  db.commit()
  return ""

@routes.route("/api/users/<user_id>/class/<class_id>/seating/<seating_id>/students", methods = ["POST"])
@cross_origin()
def map_stud_furn(user_id, class_id, seating_id):
  db = database.get_db()

  clear_stud_furn(user_id, class_id, seating_id)

  students = get_class_students(user_id, class_id).json

  res = db.execute("""
    SELECT furn_id FROM Furniture
      WHERE seating_id = (?) AND type = (?)
  """, (seating_id, "seat"))
  seats = [dict(x) for x in res.fetchall()]

  res = db.execute("""
    SELECT * FROM ClassroomMetaGroupMap
    WHERE classroom_id = (?)
    ORDER BY meta_group_id DESC
    """, (class_id, ))
  metagroup_id = dict(list(res)[0])["meta_group_id"]

  res = db.execute("""
    SELECT * FROM MetaGroupGroupMap
    WHERE meta_group_id = (?)
    ORDER BY group_id
  """, (metagroup_id, ))
  start_group = dict(list(res)[0])["group_id"]

  for i, student in enumerate(students): 
    if i >= len(seats):
      break

    group = db.execute("""
      SELECT * FROM StudentGroupMap
      WHERE student_id = (?)
    """, (student["id"], ))
    group = [dict(x) for x in group]
    group = sorted(group, key=lambda x: x["group_id"])[-1]["group_id"]
    group = group - start_group

    furn_group = db.execute("""
      SELECT * FROM FurnitureTableGroupMap
      WHERE table_group_id = (?)
      AND furniture_id NOT IN (SELECT furn_id FROM StudentFurnMap)
    """, (group, ))
    furn_group = list(furn_group)
    if len(furn_group) == 0:
      continue
    furn_id = dict(furn_group[0])["furniture_id"]
    
    db.execute("""
      INSERT INTO StudentFurnMap 
        VALUES (?, ?)
    """, (student["id"], furn_id))

  db.commit()
  return "", 201

@routes.route("/api/users/<user_id>/class/<class_id>/seating/<seating_id>/group_furn", methods = ["POST"])
@cross_origin()
def group_furniture(user_id, class_id, seating_id):
  db = database.get_db()

  furn = furniture_locations(user_id, class_id, seating_id).json
  furn = [[x["furn_id"], x["x"], x["y"]] for x in furn]
  furn.sort(key = lambda x: x[0])
  points = [x[1:] for x in furn]
  clusters = furniture_algorithms.cluster(points, request.json["num_groups"]).labels_

  for i, f in enumerate(furn):
    db.execute("""
      DELETE FROM FurnitureTableGroupMap
      WHERE furniture_id = (?)
    """, (f[0], ))
    db.execute("""
      INSERT INTO FurnitureTableGroupMap
        VALUES (?, ?)
    """, (f[0], int(clusters[i])))

  db.commit()
  return "", 201

@routes.route("/api/users/<user_id>/class/<class_id>/seating/<seating_id>/students", methods = ["GET"])
@cross_origin()
def list_students_furniture(user_id, class_id, seating_id):
  db = database.get_db()
  res = db.execute("""
    SELECT s.first_name, s.last_name, ff.furn_id FROM Students s
    JOIN StudentFurnMap m ON m.student_id = s.id
    JOIN (
      SELECT f.* FROM Furniture f
      WHERE f.seating_id = (?)
    ) ff
    ON ff.furn_id = m.furn_id
  """, (seating_id))
  return [dict(row) for row in res.fetchall()]

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

  '''for s1 in w:
    text = str(s1)+":"
    for s2 in w[s1]:
        if w[s1][s2] != 0:
          text = text + " ("+str(s2)+", "+str(w[s1][s2])+")"
    print(text)'''

  groups = []
  if not request.json["disable_weights"]:
    groups = student_algorithms.group_students(
      students, 
      group_amount=request.json["group_amount"], 
      group_size=request.json["group_size"],
      weights=request.json["weights"]
    )
  else:
    groups = student_algorithms.group_students(
      students, 
      group_amount=request.json["group_amount"], 
      group_size=request.json["group_size"],
    )

  print("result:")
  print(groups)

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
      """, (student, group_id)) #student should be in order of ID
  db.commit()
  
  return groups

@routes.route("/api/meta_groups/<meta_group_id>/get_groups_from_metaID", methods = ["GET"])
@cross_origin()
def get_groups(meta_group_id):
  db = database.get_db()
  res = db.execute("""
    SELECT group_id FROM MetaGroupGroupMap
    WHERE meta_group_id = (?)
  """, (meta_group_id,))
  group_ids = [row[0] for row in res.fetchall()]
  print(group_ids)

  groups = []
  for id in group_ids:
    res = db.execute("""
      SELECT s.first_name, s.last_name FROM StudentGroupMap m 
      JOIN Students s ON s.id = m.student_id
      WHERE m.group_id = (?)
    """, (id,))
    group = [dict(row) for row in res.fetchall()]
    print(group)
    groups.append(group)
  
  print(groups)
  return groups, 200

@routes.route("/api/users/<user_id>/class/<class_id>/meta_groups/<meta_group_id>/delete_meta_group", methods = ["DELETE"])
@cross_origin()
def delete_meta_group(user_id, class_id, meta_group_id):
  db = database.get_db()
  print("USER ID:", user_id, "CLASS ID:", class_id, "META ID:", meta_group_id)
  res = db.execute("""
    SELECT group_id FROM MetaGroupGroupMap
      WHERE meta_group_id = (?)
  """, (meta_group_id,))
  group_ids = [(row[0],) for row in res.fetchall()]
  db.executemany("""
    DELETE FROM StudentGroup
      WHERE id = (?)
  """, group_ids)
  db.executemany("""
    DELETE FROM StudentGroupMap
      WHERE group_id = (?)
  """, group_ids)
  
  db.execute("DELETE FROM MetaGroupGroupMap WHERE meta_group_id = (?)", (meta_group_id,))
  db.execute("DELETE FROM ClassroomMetaGroupMap WHERE meta_group_id = (?)", (meta_group_id,))
  db.execute("DELETE FROM MetaGroup WHERE meta_group_id = (?)", (meta_group_id,))

  db.commit()
  return "", 200


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


