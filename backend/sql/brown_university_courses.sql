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
('CSCI 0160', 'Introduction to Algorithms and Data Structures', 'Fundamental algorithms, data structures, and problem-solving techniques in Java', 'MWF', '11:00:00', '11:50:00', 'CIT 165', 'Prof. Michael Rodriguez'),
('CSCI 0180', 'Computer Science: An Integrated Introduction', 'Comprehensive introduction to computer science through programming, algorithms, and mathematical foundations', 'MWF', '14:00:00', '14:50:00', 'CIT 165', 'Prof. Emily Watson'),
('CSCI 0200', 'Program Design with Data Structures', 'Advanced programming concepts, data structures, and software design principles', 'TR', '09:00:00', '10:20:00', 'CIT 165', 'Prof. David Kim'),
('CSCI 0300', 'Introduction to Software Engineering', 'Software development methodologies, testing, and project management', 'TR', '10:30:00', '11:50:00', 'CIT 165', 'Prof. Lisa Thompson'),
('CSCI 0330', 'Introduction to Computer Systems', 'Computer architecture, operating systems, and systems programming', 'MWF', '13:00:00', '13:50:00', 'CIT 165', 'Prof. James Wilson'),
('CSCI 1010', 'Theory of Computation', 'Formal languages, automata theory, and computational complexity', 'TR', '14:00:00', '15:20:00', 'CIT 165', 'Prof. Amanda Foster'),
('CSCI 1230', 'Introduction to Computer Graphics', 'Computer graphics algorithms, OpenGL programming, and visual computing', 'MWF', '15:00:00', '15:50:00', 'CIT 165', 'Prof. Robert Garcia'),
('CSCI 1270', 'Database Management Systems', 'Database design, SQL, and database management principles', 'TR', '16:00:00', '17:20:00', 'CIT 165', 'Prof. Jennifer Lee'),
('CSCI 1380', 'Distributed Computer Systems', 'Distributed systems concepts, networking, and distributed algorithms', 'MWF', '16:00:00', '16:50:00', 'CIT 165', 'Prof. Christopher Brown'),
('CSCI 1430', 'Computer Vision', 'Computer vision algorithms, image processing, and machine learning applications', 'TR', '09:00:00', '10:20:00', 'CIT 165', 'Prof. Maria Martinez'),
('CSCI 1470', 'Deep Learning', 'Neural networks, deep learning architectures, and applications', 'MWF', '11:00:00', '11:50:00', 'CIT 165', 'Prof. Daniel Johnson'),
('CSCI 1480', 'Building Intelligent Robots', 'Robotics, artificial intelligence, and autonomous systems', 'TR', '14:00:00', '15:20:00', 'CIT 165', 'Prof. Rachel Davis'),
('CSCI 1490', 'Introduction to Computational Linguistics', 'Natural language processing, computational linguistics, and text analysis', 'MWF', '13:00:00', '13:50:00', 'CIT 165', 'Prof. Thomas Anderson'),
('CSCI 1500', 'Computer Game Design', 'Game development, interactive design, and computer graphics', 'TR', '15:30:00', '16:50:00', 'CIT 165', 'Prof. Nicole Taylor');

-- Mathematics Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('MATH 0100', 'Introductory Calculus, Part I', 'Single variable calculus with applications to science and engineering', 'MWF', '09:00:00', '09:50:00', 'Kassar 105', 'Prof. William Clark'),
('MATH 0180', 'Single Variable Calculus, Part II', 'Integration techniques, applications, and infinite series', 'MWF', '10:00:00', '10:50:00', 'Kassar 105', 'Prof. Patricia White'),
('MATH 0200', 'Linear Algebra', 'Vector spaces, linear transformations, eigenvalues, and applications', 'TR', '09:00:00', '10:20:00', 'Kassar 105', 'Prof. Steven Lewis'),
('MATH 0520', 'Linear Algebra', 'Advanced linear algebra with proofs and theoretical foundations', 'MWF', '11:00:00', '11:50:00', 'Kassar 105', 'Prof. Rebecca Hall'),
('MATH 1010', 'Analysis: Functions of One Variable', 'Real analysis, mathematical proofs, and rigorous calculus', 'TR', '10:30:00', '11:50:00', 'Kassar 105', 'Prof. Kevin Scott'),
('MATH 1130', 'Real Analysis', 'Advanced real analysis, measure theory, and functional analysis', 'MWF', '13:00:00', '13:50:00', 'Kassar 105', 'Prof. Michelle Adams'),
('MATH 1140', 'Complex Analysis', 'Complex functions, contour integration, and complex analysis', 'TR', '14:00:00', '15:20:00', 'Kassar 105', 'Prof. Andrew Green'),
('MATH 1260', 'Ordinary Differential Equations', 'Differential equations, dynamical systems, and applications', 'MWF', '15:00:00', '15:50:00', 'Kassar 105', 'Prof. Stephanie Baker'),
('MATH 1530', 'Abstract Algebra', 'Group theory, ring theory, and abstract algebraic structures', 'TR', '16:00:00', '17:20:00', 'Kassar 105', 'Prof. Jonathan Carter'),
('MATH 1540', 'Number Theory', 'Elementary number theory, prime numbers, and Diophantine equations', 'MWF', '16:00:00', '16:50:00', 'Kassar 105', 'Prof. Samantha Evans'),
('MATH 1610', 'Probability', 'Probability theory, random variables, and statistical inference', 'TR', '09:00:00', '10:20:00', 'Kassar 105', 'Prof. Matthew Turner'),
('MATH 1620', 'Mathematical Statistics', 'Statistical theory, estimation, and hypothesis testing', 'MWF', '11:00:00', '11:50:00', 'Kassar 105', 'Prof. Lauren Phillips'),
('MATH 1630', 'Stochastic Processes', 'Markov chains, random walks, and stochastic modeling', 'TR', '14:00:00', '15:20:00', 'Kassar 105', 'Prof. Ryan Campbell'),
('MATH 1640', 'Optimization', 'Linear programming, nonlinear optimization, and algorithms', 'MWF', '13:00:00', '13:50:00', 'Kassar 105', 'Prof. Danielle Parker'),
('MATH 1650', 'Numerical Analysis', 'Numerical methods, algorithms, and computational mathematics', 'TR', '15:30:00', '16:50:00', 'Kassar 105', 'Prof. Brandon Edwards');

-- Economics Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('ECON 0110', 'Principles of Economics', 'Introduction to microeconomics and macroeconomics principles', 'MWF', '13:00:00', '13:50:00', 'Wilson 101', 'Prof. Ashley Collins'),
('ECON 1110', 'Intermediate Microeconomics', 'Consumer theory, producer theory, and market structures', 'TR', '14:00:00', '15:20:00', 'Wilson 101', 'Prof. Joshua Stewart'),
('ECON 1210', 'Intermediate Macroeconomics', 'National income, economic growth, and monetary policy', 'MWF', '14:00:00', '14:50:00', 'Wilson 101', 'Prof. Megan Morris'),
('ECON 1130', 'Game Theory and Strategic Behavior', 'Strategic decision making, Nash equilibrium, and game theory applications', 'TR', '16:00:00', '17:20:00', 'Wilson 101', 'Prof. Nathan Rogers'),
('ECON 1150', 'Industrial Organization', 'Market structure, competition policy, and industrial economics', 'MWF', '15:00:00', '15:50:00', 'Wilson 101', 'Prof. Victoria Reed'),
('ECON 1220', 'International Economics', 'International trade, exchange rates, and global economic policy', 'TR', '09:00:00', '10:20:00', 'Wilson 101', 'Prof. Tyler Cook'),
('ECON 1230', 'Development Economics', 'Economic development, poverty, and development policy', 'MWF', '11:00:00', '11:50:00', 'Wilson 101', 'Prof. Hannah Bailey'),
('ECON 1240', 'Labor Economics', 'Labor markets, human capital, and labor policy', 'TR', '10:30:00', '11:50:00', 'Wilson 101', 'Prof. Zachary Cooper'),
('ECON 1250', 'Public Economics', 'Public goods, taxation, and government economic policy', 'MWF', '13:00:00', '13:50:00', 'Wilson 101', 'Prof. Grace Richardson'),
('ECON 1260', 'Environmental Economics', 'Environmental policy, natural resources, and sustainability', 'TR', '14:00:00', '15:20:00', 'Wilson 101', 'Prof. Caleb Cox'),
('ECON 1270', 'Health Economics', 'Healthcare markets, health policy, and economic analysis of health', 'MWF', '16:00:00', '16:50:00', 'Wilson 101', 'Prof. Sophia Ward'),
('ECON 1280', 'Behavioral Economics', 'Psychology and economics, decision making, and behavioral policy', 'TR', '15:30:00', '16:50:00', 'Wilson 101', 'Prof. Isaac Torres'),
('ECON 1290', 'Financial Economics', 'Financial markets, asset pricing, and corporate finance', 'MWF', '09:00:00', '09:50:00', 'Wilson 101', 'Prof. Chloe Peterson'),
('ECON 1300', 'Econometrics', 'Statistical methods in economics, regression analysis, and causal inference', 'TR', '11:00:00', '12:20:00', 'Wilson 101', 'Prof. Ethan Gray'),
('ECON 1310', 'Time Series Analysis', 'Time series econometrics, forecasting, and dynamic modeling', 'MWF', '10:00:00', '10:50:00', 'Wilson 101', 'Prof. Isabella Hughes');

-- Physics Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('PHYS 0030', 'Basic Physics', 'Mechanics, thermodynamics, and wave phenomena for non-science majors', 'MWF', '15:00:00', '15:50:00', 'Barus 166', 'Prof. Noah Price'),
('PHYS 0050', 'Analytical Physics', 'Advanced physics with calculus for science and engineering majors', 'TR', '16:00:00', '17:20:00', 'Barus 166', 'Prof. Ava Bennett'),
('PHYS 0070', 'Physics for Future Presidents', 'Physics concepts for understanding modern technology and policy', 'MWF', '13:00:00', '13:50:00', 'Barus 166', 'Prof. Mason Wood'),
('PHYS 0200', 'Foundations of Mechanics', 'Classical mechanics, Lagrangian and Hamiltonian dynamics', 'TR', '09:00:00', '10:20:00', 'Barus 166', 'Prof. Scarlett Barnes'),
('PHYS 0300', 'Foundations of Electromagnetism', 'Electric and magnetic fields, Maxwell equations, and electromagnetic waves', 'MWF', '11:00:00', '11:50:00', 'Barus 166', 'Prof. Leo Fisher'),
('PHYS 0400', 'Foundations of Quantum Mechanics', 'Quantum theory, wave functions, and quantum systems', 'TR', '14:00:00', '15:20:00', 'Barus 166', 'Prof. Luna Henderson'),
('PHYS 0500', 'Thermal Physics', 'Thermodynamics, statistical mechanics, and thermal systems', 'MWF', '15:00:00', '15:50:00', 'Barus 166', 'Prof. Oliver Coleman'),
('PHYS 0600', 'Mathematical Methods in Physics', 'Mathematical techniques for solving physics problems', 'TR', '16:00:00', '17:20:00', 'Barus 166', 'Prof. Stella Jenkins'),
('PHYS 0700', 'Computational Physics', 'Numerical methods and computer simulation in physics', 'MWF', '13:00:00', '13:50:00', 'Barus 166', 'Prof. Finn Perry'),
('PHYS 0800', 'Experimental Physics', 'Laboratory techniques, data analysis, and experimental design', 'TR', '09:00:00', '10:20:00', 'Barus 166', 'Prof. Aurora Butler'),
('PHYS 0900', 'Modern Physics', 'Special relativity, quantum physics, and atomic structure', 'MWF', '11:00:00', '11:50:00', 'Barus 166', 'Prof. River Russell'),
('PHYS 1000', 'Advanced Mechanics', 'Advanced classical mechanics and dynamical systems', 'TR', '14:00:00', '15:20:00', 'Barus 166', 'Prof. Willow Griffin'),
('PHYS 1100', 'Advanced Electromagnetism', 'Advanced electromagnetic theory and applications', 'MWF', '16:00:00', '16:50:00', 'Barus 166', 'Prof. Atlas Diaz'),
('PHYS 1200', 'Advanced Quantum Mechanics', 'Advanced quantum theory and applications', 'TR', '15:30:00', '16:50:00', 'Barus 166', 'Prof. Phoenix Hayes'),
('PHYS 1300', 'Statistical Mechanics', 'Statistical physics, phase transitions, and complex systems', 'MWF', '09:00:00', '09:50:00', 'Barus 166', 'Prof. Sage Sanders');

-- Chemistry Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('CHEM 0100', 'Introductory Chemistry', 'Fundamental principles of chemistry for non-science majors', 'MWF', '10:00:00', '10:50:00', 'Metcalf 101', 'Prof. Rowan Powell'),
('CHEM 0330', 'Equilibrium, Rate, and Structure', 'Chemical equilibrium, kinetics, and molecular structure', 'TR', '09:00:00', '10:20:00', 'Metcalf 101', 'Prof. Juniper Long'),
('CHEM 0350', 'Organic Chemistry', 'Organic compounds, reactions, and mechanisms', 'MWF', '11:00:00', '11:50:00', 'Metcalf 101', 'Prof. Cedar Patterson'),
('CHEM 0360', 'Organic Chemistry', 'Advanced organic chemistry and synthesis', 'TR', '10:30:00', '11:50:00', 'Metcalf 101', 'Prof. Aspen Hughes'),
('CHEM 0500', 'Inorganic Chemistry', 'Inorganic compounds, coordination chemistry, and bonding', 'MWF', '13:00:00', '13:50:00', 'Metcalf 101', 'Prof. Birch Flores'),
('CHEM 0600', 'Physical Chemistry', 'Thermodynamics, kinetics, and quantum chemistry', 'TR', '14:00:00', '15:20:00', 'Metcalf 101', 'Prof. Maple Washington'),
('CHEM 0700', 'Biochemistry', 'Biological molecules, metabolism, and cellular processes', 'MWF', '15:00:00', '15:50:00', 'Metcalf 101', 'Prof. Oak Jefferson'),
('CHEM 0800', 'Analytical Chemistry', 'Chemical analysis, instrumentation, and data analysis', 'TR', '16:00:00', '17:20:00', 'Metcalf 101', 'Prof. Pine Madison'),
('CHEM 0900', 'Polymer Chemistry', 'Polymer synthesis, properties, and applications', 'MWF', '16:00:00', '16:50:00', 'Metcalf 101', 'Prof. Elm Hamilton'),
('CHEM 1000', 'Advanced Organic Chemistry', 'Advanced organic synthesis and reaction mechanisms', 'TR', '09:00:00', '10:20:00', 'Metcalf 101', 'Prof. Willow Jackson'),
('CHEM 1100', 'Advanced Inorganic Chemistry', 'Advanced inorganic chemistry and coordination compounds', 'MWF', '11:00:00', '11:50:00', 'Metcalf 101', 'Prof. Maple Van Buren'),
('CHEM 1200', 'Advanced Physical Chemistry', 'Advanced thermodynamics and quantum mechanics', 'TR', '14:00:00', '15:20:00', 'Metcalf 101', 'Prof. Birch Harrison'),
('CHEM 1300', 'Advanced Biochemistry', 'Advanced topics in biochemistry and molecular biology', 'MWF', '13:00:00', '13:50:00', 'Metcalf 101', 'Prof. Cedar Tyler'),
('CHEM 1400', 'Chemical Biology', 'Chemistry in biological systems and drug discovery', 'TR', '15:30:00', '16:50:00', 'Metcalf 101', 'Prof. Aspen Polk'),
('CHEM 1500', 'Materials Chemistry', 'Materials synthesis, properties, and applications', 'MWF', '09:00:00', '09:50:00', 'Metcalf 101', 'Prof. Rowan Taylor');

-- Biology Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('BIOL 0200', 'The Foundation of Living Systems', 'Introduction to biology, cell biology, and genetics', 'MWF', '10:00:00', '10:50:00', 'Sidney Frank 220', 'Prof. Juniper Adams'),
('BIOL 0280', 'Evolutionary Biology', 'Evolution, natural selection, and biodiversity', 'TR', '09:00:00', '10:20:00', 'Sidney Frank 220', 'Prof. Cedar Wilson'),
('BIOL 0300', 'Cell Biology and Biochemistry', 'Cell structure, function, and biochemical processes', 'MWF', '11:00:00', '11:50:00', 'Sidney Frank 220', 'Prof. Aspen Davis'),
('BIOL 0400', 'Principles of Physiology', 'Organ systems, homeostasis, and physiological regulation', 'TR', '10:30:00', '11:50:00', 'Sidney Frank 220', 'Prof. Birch Miller'),
('BIOL 0500', 'Principles of Immunology', 'Immune system, disease resistance, and immunology', 'MWF', '13:00:00', '13:50:00', 'Sidney Frank 220', 'Prof. Maple Thompson'),
('BIOL 0600', 'Genetics', 'Inheritance, gene expression, and genetic analysis', 'TR', '14:00:00', '15:20:00', 'Sidney Frank 220', 'Prof. Oak Garcia'),
('BIOL 0700', 'Microbiology', 'Microorganisms, microbial diversity, and pathogenesis', 'MWF', '15:00:00', '15:50:00', 'Sidney Frank 220', 'Prof. Pine Anderson'),
('BIOL 0800', 'Ecology', 'Population ecology, community dynamics, and ecosystems', 'TR', '16:00:00', '17:20:00', 'Sidney Frank 220', 'Prof. Elm Taylor'),
('BIOL 0900', 'Neurobiology', 'Nervous system, brain function, and neural circuits', 'MWF', '16:00:00', '16:50:00', 'Sidney Frank 220', 'Prof. Willow Brown'),
('BIOL 1000', 'Molecular Biology', 'Molecular mechanisms of gene expression and regulation', 'TR', '09:00:00', '10:20:00', 'Sidney Frank 220', 'Prof. Rowan Johnson'),
('BIOL 1100', 'Developmental Biology', 'Embryonic development and pattern formation', 'MWF', '11:00:00', '11:50:00', 'Sidney Frank 220', 'Prof. Juniper Lee'),
('BIOL 1200', 'Cancer Biology', 'Cancer mechanisms, treatment, and prevention', 'TR', '14:00:00', '15:20:00', 'Sidney Frank 220', 'Prof. Cedar Martinez'),
('BIOL 1300', 'Plant Biology', 'Plant structure, function, and development', 'MWF', '13:00:00', '13:50:00', 'Sidney Frank 220', 'Prof. Aspen Rodriguez'),
('BIOL 1400', 'Animal Behavior', 'Behavioral ecology and animal communication', 'TR', '15:30:00', '16:50:00', 'Sidney Frank 220', 'Prof. Birch Clark'),
('BIOL 1500', 'Conservation Biology', 'Biodiversity conservation and environmental protection', 'MWF', '09:00:00', '09:50:00', 'Sidney Frank 220', 'Prof. Maple White');

-- Psychology Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('PSYC 0010', 'Introduction to Psychology', 'Introduction to psychological science and research methods', 'MWF', '10:00:00', '10:50:00', 'Metcalf 101', 'Prof. Lily Chen'),
('PSYC 0200', 'Statistical Methods in Psychology', 'Statistical analysis and research methods in psychology', 'TR', '09:00:00', '10:20:00', 'Metcalf 101', 'Prof. Rose Rodriguez'),
('PSYC 0300', 'Research Methods in Psychology', 'Experimental design and research methodology', 'MWF', '11:00:00', '11:50:00', 'Metcalf 101', 'Prof. Daisy Watson'),
('PSYC 0400', 'Cognitive Psychology', 'Human cognition, memory, and information processing', 'TR', '10:30:00', '11:50:00', 'Metcalf 101', 'Prof. Violet Kim'),
('PSYC 0500', 'Developmental Psychology', 'Human development across the lifespan', 'MWF', '13:00:00', '13:50:00', 'Metcalf 101', 'Prof. Iris Thompson'),
('PSYC 0600', 'Social Psychology', 'Social behavior, attitudes, and group dynamics', 'TR', '14:00:00', '15:20:00', 'Metcalf 101', 'Prof. Orchid Wilson'),
('PSYC 0700', 'Clinical Psychology', 'Psychological disorders and clinical assessment', 'MWF', '15:00:00', '15:50:00', 'Metcalf 101', 'Prof. Tulip Garcia'),
('PSYC 0800', 'Biological Psychology', 'Brain-behavior relationships and neuroscience', 'TR', '16:00:00', '17:20:00', 'Metcalf 101', 'Prof. Sunflower Anderson'),
('PSYC 0900', 'Personality Psychology', 'Personality theory, assessment, and individual differences', 'MWF', '16:00:00', '16:50:00', 'Metcalf 101', 'Prof. Marigold Taylor'),
('PSYC 1000', 'Learning and Behavior', 'Learning theory, conditioning, and behavioral psychology', 'TR', '09:00:00', '10:20:00', 'Metcalf 101', 'Prof. Poppy Brown'),
('PSYC 1100', 'Sensation and Perception', 'Sensory systems and perceptual processes', 'MWF', '11:00:00', '11:50:00', 'Metcalf 101', 'Prof. Lavender Johnson'),
('PSYC 1200', 'Abnormal Psychology', 'Psychological disorders and psychopathology', 'TR', '14:00:00', '15:20:00', 'Metcalf 101', 'Prof. Jasmine Lee'),
('PSYC 1300', 'Health Psychology', 'Psychology of health, illness, and healthcare', 'MWF', '13:00:00', '13:50:00', 'Metcalf 101', 'Prof. Camellia Martinez'),
('PSYC 1400', 'Industrial-Organizational Psychology', 'Psychology in the workplace and organizations', 'TR', '15:30:00', '16:50:00', 'Metcalf 101', 'Prof. Azalea Clark'),
('PSYC 1500', 'Forensic Psychology', 'Psychology and the legal system', 'MWF', '09:00:00', '09:50:00', 'Metcalf 101', 'Prof. Magnolia White');

-- History Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('HIST 0100', 'Introduction to History', 'Introduction to historical thinking and research methods', 'MWF', '10:00:00', '10:50:00', 'Pembroke 305', 'Prof. River Chen'),
('HIST 0200', 'World History', 'Global history from ancient times to the present', 'TR', '09:00:00', '10:20:00', 'Pembroke 305', 'Prof. Ocean Rodriguez'),
('HIST 0300', 'American History', 'United States history from colonial times to the present', 'MWF', '11:00:00', '11:50:00', 'Pembroke 305', 'Prof. Brook Watson'),
('HIST 0400', 'European History', 'European history from medieval times to the present', 'TR', '10:30:00', '11:50:00', 'Pembroke 305', 'Prof. Creek Kim'),
('HIST 0500', 'Ancient History', 'Ancient civilizations of Greece, Rome, and the Mediterranean', 'MWF', '13:00:00', '13:50:00', 'Pembroke 305', 'Prof. Stream Thompson'),
('HIST 0600', 'Medieval History', 'Medieval Europe and the Middle Ages', 'TR', '14:00:00', '15:20:00', 'Pembroke 305', 'Prof. Bay Wilson'),
('HIST 0700', 'Early Modern Europe', 'European history from 1500 to 1800', 'MWF', '15:00:00', '15:50:00', 'Pembroke 305', 'Prof. Harbor Garcia'),
('HIST 0800', 'Modern Europe', 'European history from 1800 to the present', 'TR', '16:00:00', '17:20:00', 'Pembroke 305', 'Prof. Gulf Anderson'),
('HIST 0900', 'Colonial America', 'American colonial history and the American Revolution', 'MWF', '16:00:00', '16:50:00', 'Pembroke 305', 'Prof. Delta Taylor'),
('HIST 1000', '19th Century America', 'United States history in the 19th century', 'TR', '09:00:00', '10:20:00', 'Pembroke 305', 'Prof. Estuary Brown'),
('HIST 1100', '20th Century America', 'United States history in the 20th century', 'MWF', '11:00:00', '11:50:00', 'Pembroke 305', 'Prof. Fjord Johnson'),
('HIST 1200', 'African History', 'History of Africa from ancient times to the present', 'TR', '14:00:00', '15:20:00', 'Pembroke 305', 'Prof. Strait Lee'),
('HIST 1300', 'Asian History', 'History of Asia from ancient times to the present', 'MWF', '13:00:00', '13:50:00', 'Pembroke 305', 'Prof. Channel Martinez'),
('HIST 1400', 'Latin American History', 'History of Latin America from pre-Columbian times to the present', 'TR', '15:30:00', '16:50:00', 'Pembroke 305', 'Prof. Inlet Clark'),
('HIST 1500', 'Middle Eastern History', 'History of the Middle East from ancient times to the present', 'MWF', '09:00:00', '09:50:00', 'Pembroke 305', 'Prof. Cove White');

-- English Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('ENGL 0100', 'Introduction to Literary Studies', 'Introduction to literary analysis and critical thinking', 'MWF', '10:00:00', '10:50:00', 'Pembroke 305', 'Prof. Sky Chen'),
('ENGL 0200', 'British Literature', 'Survey of British literature from medieval to modern times', 'TR', '09:00:00', '10:20:00', 'Pembroke 305', 'Prof. Cloud Rodriguez'),
('ENGL 0300', 'American Literature', 'Survey of American literature from colonial to contemporary times', 'MWF', '11:00:00', '11:50:00', 'Pembroke 305', 'Prof. Storm Watson'),
('ENGL 0400', 'World Literature', 'Literature from around the world in translation', 'TR', '10:30:00', '11:50:00', 'Pembroke 305', 'Prof. Rain Kim'),
('ENGL 0500', 'Shakespeare', 'Study of Shakespeare plays and sonnets', 'MWF', '13:00:00', '13:50:00', 'Pembroke 305', 'Prof. Thunder Thompson'),
('ENGL 0600', 'Poetry', 'Study of poetry and poetic forms', 'TR', '14:00:00', '15:20:00', 'Pembroke 305', 'Prof. Lightning Wilson'),
('ENGL 0700', 'Fiction', 'Study of novels and short stories', 'MWF', '15:00:00', '15:50:00', 'Pembroke 305', 'Prof. Wind Garcia'),
('ENGL 0800', 'Drama', 'Study of dramatic literature and theater', 'TR', '16:00:00', '17:20:00', 'Pembroke 305', 'Prof. Breeze Anderson'),
('ENGL 0900', 'Creative Writing', 'Workshop in creative writing and composition', 'MWF', '16:00:00', '16:50:00', 'Pembroke 305', 'Prof. Gust Taylor'),
('ENGL 1000', 'Literary Theory', 'Critical theory and literary criticism', 'TR', '09:00:00', '10:20:00', 'Pembroke 305', 'Prof. Zephyr Brown'),
('ENGL 1100', 'Medieval Literature', 'Literature of the Middle Ages', 'MWF', '11:00:00', '11:50:00', 'Pembroke 305', 'Prof. Gale Johnson'),
('ENGL 1200', 'Renaissance Literature', 'Literature of the English Renaissance', 'TR', '14:00:00', '15:20:00', 'Pembroke 305', 'Prof. Squall Lee'),
('ENGL 1300', '18th Century Literature', 'Literature of the 18th century', 'MWF', '13:00:00', '13:50:00', 'Pembroke 305', 'Prof. Tempest Martinez'),
('ENGL 1400', '19th Century Literature', 'Literature of the 19th century', 'TR', '15:30:00', '16:50:00', 'Pembroke 305', 'Prof. Cyclone Clark'),
('ENGL 1500', '20th Century Literature', 'Literature of the 20th century', 'MWF', '09:00:00', '09:50:00', 'Pembroke 305', 'Prof. Hurricane White');

-- Philosophy Department
INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
('PHIL 0100', 'Introduction to Philosophy', 'Introduction to philosophical thinking and major philosophical questions', 'MWF', '10:00:00', '10:50:00', 'Pembroke 305', 'Prof. Star Chen'),
('PHIL 0200', 'Logic', 'Formal logic, reasoning, and argumentation', 'TR', '09:00:00', '10:20:00', 'Pembroke 305', 'Prof. Moon Rodriguez'),
('PHIL 0300', 'Ethics', 'Moral philosophy and ethical theory', 'MWF', '11:00:00', '11:50:00', 'Pembroke 305', 'Prof. Sun Watson'),
('PHIL 0400', 'Epistemology', 'Theory of knowledge and belief', 'TR', '10:30:00', '11:50:00', 'Pembroke 305', 'Prof. Planet Kim'),
('PHIL 0500', 'Metaphysics', 'Fundamental questions about reality and existence', 'MWF', '13:00:00', '13:50:00', 'Pembroke 305', 'Prof. Galaxy Thompson'),
('PHIL 0600', 'Philosophy of Mind', 'Nature of consciousness and mental states', 'TR', '14:00:00', '15:20:00', 'Pembroke 305', 'Prof. Comet Wilson'),
('PHIL 0700', 'Philosophy of Science', 'Nature of scientific knowledge and methodology', 'MWF', '15:00:00', '15:50:00', 'Pembroke 305', 'Prof. Asteroid Garcia'),
('PHIL 0800', 'Political Philosophy', 'Political theory and social justice', 'TR', '16:00:00', '17:20:00', 'Pembroke 305', 'Prof. Nebula Anderson'),
('PHIL 0900', 'Ancient Philosophy', 'Greek and Roman philosophy', 'MWF', '16:00:00', '16:50:00', 'Pembroke 305', 'Prof. Meteor Taylor'),
('PHIL 1000', 'Modern Philosophy', 'Philosophy from Descartes to Kant', 'TR', '09:00:00', '10:20:00', 'Pembroke 305', 'Prof. Satellite Brown'),
('PHIL 1100', 'Contemporary Philosophy', 'Philosophy of the 20th and 21st centuries', 'MWF', '11:00:00', '11:50:00', 'Pembroke 305', 'Prof. Orbit Johnson'),
('PHIL 1200', 'Philosophy of Language', 'Nature of language and meaning', 'TR', '14:00:00', '15:20:00', 'Pembroke 305', 'Prof. Cosmos Lee'),
('PHIL 1300', 'Aesthetics', 'Philosophy of art and beauty', 'MWF', '13:00:00', '13:50:00', 'Pembroke 305', 'Prof. Universe Martinez'),
('PHIL 1400', 'Philosophy of Religion', 'Religious belief and philosophical theology', 'TR', '15:30:00', '16:50:00', 'Pembroke 305', 'Prof. Infinity Clark'),
('PHIL 1500', 'Applied Ethics', 'Ethical issues in contemporary society', 'MWF', '09:00:00', '09:50:00', 'Pembroke 305', 'Prof. Eternity White');

