CREATE TABLE IF NOT EXISTS Classrooms
  (id INTEGER PRIMARY KEY,
   name STRING);
  
CREATE TABLE IF NOT EXISTS Students
  (id INTEGER PRIMARY KEY,
   first_name STRING,
   last_name STRING);

CREATE TABLE IF NOT EXISTS ClassroomStudentMap
  (classroom_id INTEGER,
   student_id INTEGER);

CREATE TABLE IF NOT EXISTS User
  (id INTEGER PRIMARY KEY,
   name STRING,
   password STRING);

CREATE TABLE IF NOT EXISTS UserClassroomMap
  (user_id INTEGER,
   classroom_id INTEGER);

CREATE TABLE IF NOT EXISTS Group
  (id INTEGER PRIMARY KEY,
   name STRING);

CREATE TABLE IF NOT EXISTS StudentGroupMap
  (student_id INTEGER,
   group_id INTEGER);

CREATE TABLE IF NOT EXISTS ClassroomGroupMap
  (classroom_id INTEGER,
   group_id INTEGER);

CREATE TABLE IF NOT EXISTS StudentStudentMap
  (student_id1 INTEGER,
   student_id2 INTEGER,
   weight INTEGER);

CREATE TABLE IF NOT EXISTS Seating
  (id INTEGER PRIMARY KEY,
   name STRING);

CREATE TABLE IF NOT EXISTS UserSeatingMap
  (user_id INTEGER,
   seating_id INTEGER);

CREATE TABLE IF NOT EXISTS ClassroomSeatingMap
  (classroom_id INTEGER,
   seating_id INTEGER);

CREATE TABLE IF NOT EXISTS Furniture
  (id INTEGER PRIMARY KEY,
   type STRING,
   x FLOAT,
   y FLOAT,
   theta FLOAT);

CREATE TABLE IF NOT EXISTS FurnitureSeatingMap
  (furniture_id INTEGER,
   seating_id INTEGER);