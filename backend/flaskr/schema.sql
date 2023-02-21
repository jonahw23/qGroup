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
