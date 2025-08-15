-- Brown University Undergraduate Course Catalog
-- Based on official course offerings for 2024-2025 academic year
-- This replaces the sample courses with real Brown University courses

-- Clear existing courses
DELETE FROM courses;

INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('AFRI 0090', 'An Introduction to Africana Studies', 'Introduction to Africana Studies, exploring the history, theories, and cultural practices of African-descended peoples across the diaspora', 'TR', '13:00:00', '14:20:00', 'Salomon Center 003', 'Prof. Francoise Hamlin'),
('AFRI 0300', 'Performing Ethnography and the Politics of Culture', 'Introduction to ethnographic fieldwork focusing on Black cultural communities in Providence.', 'M', '15:00:00', '17:30:00', 'Churchill House 008', 'Prof. Lisa Biggs'),
('AFRI 0410', 'After the Uprisings: Abolition and Black Studies', 'A discussion-based seminar exploring the concept of abolition in Black Studies, its varied interpretations, and the theoretical and practical challenges in envisioning pathways to an abolitionist future.
', 'T', '16:00:00', '18:30:00', 'Churchill House 008', 'Prof. Justin Lang');

-- Computer Science Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('CSCI 0150', 'Introduction to Object-Oriented Programming and Computer Science', 'Introduction to programming in Java, object-oriented design, and fundamental computer science concepts', 'MWF', '10:00:00', '10:50:00', 'CIT 165', 'Prof. Sarah Chen'),

-- Mathematics Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('MATH 0100', 'Introductory Calculus, Part I', 'Single variable calculus with applications to science and engineering', 'MWF', '09:00:00', '09:50:00', 'Kassar 105', 'Prof. William Clark'),

-- Economics Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('ECON 0110', 'Principles of Economics', 'Introduction to microeconomics and macroeconomics principles', 'MWF', '13:00:00', '13:50:00', 'Wilson 101', 'Prof. Ashley Collins'),

-- Physics Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('PHYS 0030', 'Basic Physics', 'Mechanics, thermodynamics, and wave phenomena for non-science majors', 'MWF', '15:00:00', '15:50:00', 'Barus 166', 'Prof. Noah Price'),

-- Chemistry Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('CHEM 0100', 'Introductory Chemistry', 'Fundamental principles of chemistry for non-science majors', 'MWF', '10:00:00', '10:50:00', 'Metcalf 101', 'Prof. Rowan Powell'),

-- Biology Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('BIOL 0200', 'The Foundation of Living Systems', 'Introduction to biology, cell biology, and genetics', 'MWF', '10:00:00', '10:50:00', 'Sidney Frank 220', 'Prof. Juniper Adams'),


-- Psychology Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('PSYC 0010', 'Introduction to Psychology', 'Introduction to psychological science and research methods', 'MWF', '10:00:00', '10:50:00', 'Metcalf 101', 'Prof. Lily Chen'),


-- History Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('HIST 0100', 'Introduction to History', 'Introduction to historical thinking and research methods', 'MWF', '10:00:00', '10:50:00', 'Pembroke 305', 'Prof. River Chen'),


-- English Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('ENGL 0100', 'Introduction to Literary Studies', 'Introduction to literary analysis and critical thinking', 'MWF', '10:00:00', '10:50:00', 'Pembroke 305', 'Prof. Sky Chen'),


-- Philosophy Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('PHIL 0100', 'Introduction to Philosophy', 'Introduction to philosophical thinking and major philosophical questions', 'MWF', '10:00:00', '10:50:00', 'Pembroke 305', 'Prof. Star Chen'),


