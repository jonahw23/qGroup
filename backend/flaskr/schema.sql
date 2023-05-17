PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS Users
  (user_id INTEGER PRIMARY KEY,
   name STRING UNIQUE,
   password STRING);

CREATE TABLE IF NOT EXISTS Classrooms
  (class_id INTEGER PRIMARY KEY,
   name STRING);
  
CREATE TABLE IF NOT EXISTS Students
  (id INTEGER PRIMARY KEY,
   first_name STRING,
   last_name STRING);

CREATE TABLE IF NOT EXISTS ClassroomStudentMap
  (classroom_id INTEGER,
   student_id INTEGER);

CREATE TABLE IF NOT EXISTS UserClassroomMap
  (user_id INTEGER,
   classroom_id INTEGER);

CREATE TABLE IF NOT EXISTS MetaGroup
  (meta_group_id INTEGER PRIMARY KEY,
   name STRING);

CREATE TABLE IF NOT EXISTS StudentGroup
  (id INTEGER PRIMARY KEY,
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
  (seating_id INTEGER PRIMARY KEY,
   name STRING,
   class_id INTEGER,
   FOREIGN KEY(class_id) REFERENCES Classrooms(class_id) ON DELETE CASCADE);

CREATE TABLE IF NOT EXISTS UserSeatingMap
  (user_id INTEGER,
   seating_id INTEGER);

CREATE TABLE IF NOT EXISTS ClassroomSeatingMap
  (classroom_id INTEGER,
   seating_id INTEGER);

CREATE TABLE IF NOT EXISTS Furniture
  (furn_id INTEGER PRIMARY KEY,
   type STRING,
   x FLOAT,
   y FLOAT,
   theta FLOAT,
   seating_id INTEGER,
   FOREIGN KEY(seating_id) REFERENCES Seating(seating_id) ON DELETE CASCADE);

CREATE TABLE IF NOT EXISTS StudentFurnMap
  (student_id INTEGER,
  furn_id INTEGER);

CREATE TABLE IF NOT EXISTS tableGroup
  (table_id INTEGER PRIMARY KEY,
  name STRING);

CREATE TABLE IF NOT EXISTS FurnitureTableGroupMap
  (furniture_id INTEGER,
   table_group_id INTEGER,
   FOREIGN KEY(furniture_id) REFERENCES Furniture(furn_id) ON DELETE CASCADE);

CREATE TABLE IF NOT EXISTS tableGroupSeatingMap
  (table_group_id INTEGER,
   seating_id INTEGER);