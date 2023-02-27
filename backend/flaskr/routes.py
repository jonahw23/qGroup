from flask import Blueprint
from flask import request
from . import database

routes = Blueprint("routes", __name__)


@routes.route("/api/class/new", methods=["POST"])
def create_class():
  """
  **POST /api/class/new**

  Create a new class for a given user.

  Example request:
  ``POST /api/class/new``

  URI Parameters: *None*

  Request body:

  .. csv-table::
    :header: Name, Required, Type, Description

    name,    True, String,  "The name of the class to be created."
    user_id, True, Integer, "The ID of the user this class belongs to."

  Example response:
  ``HTTP 201 Created``

  """

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
  """
  **GET /api/class/list**

  Retrieve a list of all classes.

  Example request:
  ``GET /api/class/list``

  URI Parameters: *None*

  Request body: *None*

  Example response:

  .. code-block:: javascript

    [
      {id: 1, name: "Algebra Period 4"},
      {id: 2, name: "Algebra Period 6"},
      {id: 3, name: "Geometry Period 7"},
    ]

  """

  db = database.get_db()
  res = db.execute("""
    SELECT * FROM Classrooms c
  """)
  return [dict(row) for row in res.fetchall()]


@routes.route("/api/class/<class_id>/students", methods=["GET"])
def get_class_students(class_id):
  """
  **GET /api/class/<class_id>/students**

  Retrieve a list of students in a given class.

  Example request:
  ``GET /api/class/1/students``

  URI Parameters:

  .. csv-table::
    :header: Name, In, Required, Type, Description

    class_id, Path, True, Integer, "The ID of the class to get students from."

  Request body: *None*

  Example response:

  .. code-block:: javascript

    [
      {id: 1, name: "Student 1"},
      {id: 2, name: "Student 2"},
      {id: 3, name: "Student 3"},
    ]

  """

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
  """
  **POST /api/class/<class_id>/add_student**

  Creates a student in a given class.

  Example request:
  ``POST /api/class/1/add_student``

  URI Parameters:

  .. csv-table::
    :header: Name, In, Required, Type, Description

    class_id, Path, True, Integer, "The ID of the class to get students from."

  Request body:

  .. csv-table::
    :header: Name, Required, Type, Description

    first_name, True, String, "The first name of the new student."
    last_name,  True, String, "The last name of the new student."

  Example response:
  ``HTTP 201 Created``

  """

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
  """
  **POST /api/user/new**

  Create a new user.

  Example request:
  ``POST /api/user/new``

  URI Parameters: *None*

  Request body:

  .. csv-table::
    :header: Name, Required, Type, Description

    user_id,  True, Integer, "The ID of the new user."
    name,     True, String,  "The username of the new user."
    password, True, String,  "The password of the new user."

  Example response:
  ``HTTP 201 Created``
  """

  db = database.get_db()
  print("got")
  print(request.json,request.get_json())
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
  """
  **POST /api/user/<user_id>/class/<class_id>/seating/new_seating**

  Create a new seating layout in a given user's class.

  Example request:
  ``POST /api/user/1/class/1/seating/new_seating``

  URI Parameters:

  .. csv-table::
    :header: Name, In, Required, Type, Description

    user_id,  Path, True, Integer, "The ID of the user this class belongs to."
    class_id, Path, True, Integer, "The ID of the class to make a seating layout for."

  Request body:

  .. csv-table::
    :header: Name, Required, Type, Description

    name, True, String, "The name of the new seating layout."

  Example response:
  ``HTTP 201 Created``

  """

  db = database.get_db()
  res = db.execute(f"""
    INSERT INTO Seating
      VALUES (
        "{request.json["name"]}"
      )
      RETURNING id
  """)
  seating_id = res.fetchone()[0]

  db.execute(f"""
    INSERT INTO UserSeatingMap
      VALUES ({user_id}, {seating_id})
    """)
  db.execute(f"""
    INSERT INTO ClassroomSeatingMap
      VALUES ({class_id}, {seating_id})
    """)
  db.commit()
