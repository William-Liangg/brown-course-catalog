CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  days TEXT,
  start_time TIME,
  end_time TIME,
  location TEXT,
  professor TEXT
); 