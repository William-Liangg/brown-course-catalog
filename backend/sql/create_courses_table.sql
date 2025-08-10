CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  days VARCHAR(20),
  start_time TIME,
  end_time TIME,
  location VARCHAR(100),
  professor VARCHAR(100)
); 