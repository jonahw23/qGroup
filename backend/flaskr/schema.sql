CREATE TABLE IF NOT EXISTS Classrooms
  (id INTEGER PRIMARY KEY AUTOINCREMENT,
   name STRING);
  
CREATE TABLE IF NOT EXISTS Students
  (id INTEGER PRIMARY KEY AUTOINCREMENT,
   first_name STRING,
   last_name STRING);

CREATE TABLE IF NOT EXISTS ClassroomStudentMap
  (classroom_id INTEGER,
   student_id INTEGER);

CREATE TABLE IF NOT EXISTS Users
  (id INTEGER PRIMARY KEY AUTOINCREMENT,
   name STRING,
   password STRING);

CREATE TABLE IF NOT EXISTS UserClassroomMap
  (user_id INTEGER,
   classroom_id INTEGER);

CREATE TABLE IF NOT EXISTS MetaGroup
  (id INTEGER PRIMARY KEY AUTOINCREMENT,
   name STRING);

CREATE TABLE IF NOT EXISTS StudentGroup
  (id INTEGER PRIMARY KEY AUTOINCREMENT,
   name STRING);

CREATE TABLE IF NOT EXISTS StudentGroupMap
  (student_id INTEGER,
   group_id INTEGER);

CREATE TABLE IF NOT EXISTS ClassroomMetaGroupMap
  (classroom_id INTEGER,
   meta_group_id INTEGER);

CREATE TABLE IF NOT EXISTS MetaGroupGroupMap
  (meta_group_id INTEGER,
   group_id INTEGER);

CREATE TABLE IF NOT EXISTS StudentStudentMap
  (student_id1 INTEGER,
   student_id2 INTEGER,
   weight INTEGER);

CREATE TABLE IF NOT EXISTS Seating
  (id INTEGER PRIMARY KEY AUTOINCREMENT,
   name STRING);

CREATE TABLE IF NOT EXISTS UserSeatingMap
  (user_id INTEGER,
   seating_id INTEGER);

CREATE TABLE IF NOT EXISTS ClassroomSeatingMap
  (classroom_id INTEGER,
   seating_id INTEGER);

CREATE TABLE IF NOT EXISTS Furniture
  (id INTEGER PRIMARY KEY AUTOINCREMENT,
   type STRING,
   x FLOAT,
   y FLOAT,
   theta FLOAT);

CREATE TABLE IF NOT EXISTS FurnitureSeatingMap
  (furniture_id INTEGER,
   seating_id INTEGER);