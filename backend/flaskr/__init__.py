from flask import Flask, request
from . import database
from . import routes
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
  app.register_blueprint(routes.routes)

  return app

