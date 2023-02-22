from flask import Flask, request
from . import database
import os

def create_app():
  
  app = Flask(__name__)
  app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
  )
  
  app.config.from_pyfile('config.py', silent=True)

  try:
    os.makedirs(app.instance_path)
  except OSError:
    pass

  database.init_app(app)

  @app.route("/api/class/new", methods=["POST"])
  def create_class():
    db = database.get_db()
    res = db.execute("""
      INSERT INTO Classrooms (name)
        VALUES ("{}")
    """.format(request.args["name"]))
    db.commit()
    return res.fetchall()

  @app.route("/api/class/list", methods=["GET"])
  def list_classes():
    db = database.get_db()
    res = db.execute("""
      SELECT * FROM Classrooms c
    """)
    return [dict(row) for row in res.fetchall()]

  @app.route("/api/class/<class_id>/students", methods=["GET"])
  def get_class_students(class_id):
    db = database.get_db()
    res = db.execute(f"""
      SELECT s.* FROM Classrooms c
        JOIN ClassroomStudentMap m ON m.classroom_id = c.id
        JOIN Students s ON m.student_id = s.id
        WHERE c.id = {class_id}
    """)
    return [dict(row) for row in res.fetchall()]

  @app.route("/api/class/<class_id>/add_student", methods=["POST"])
  def add_student(class_id):
    db = database.get_db()

    res1 = db.execute(f"""
      INSERT INTO Students (first_name, last_name)
        VALUES (
          "{request.args["first_name"]}",
          "{request.args["last_name"]}"
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
    

  return app

