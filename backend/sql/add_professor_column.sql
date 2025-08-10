-- Migration script to add professor column to courses table
-- Run this after the courses table has been created

-- Add professor column if it doesn't exist
ALTER TABLE courses ADD COLUMN IF NOT EXISTS professor VARCHAR(100);

-- Update existing courses with placeholder professor names
-- Computer Science Department
UPDATE courses SET professor = 'Prof. Sarah Chen' WHERE code = 'CSCI 0150';
UPDATE courses SET professor = 'Prof. Michael Rodriguez' WHERE code = 'CSCI 0160';
UPDATE courses SET professor = 'Prof. Emily Watson' WHERE code = 'CSCI 0180';
UPDATE courses SET professor = 'Prof. David Kim' WHERE code = 'CSCI 0200';
UPDATE courses SET professor = 'Prof. Lisa Thompson' WHERE code = 'CSCI 0300';
UPDATE courses SET professor = 'Prof. James Wilson' WHERE code = 'CSCI 0330';
UPDATE courses SET professor = 'Prof. Amanda Foster' WHERE code = 'CSCI 1010';
UPDATE courses SET professor = 'Prof. Robert Garcia' WHERE code = 'CSCI 1230';
UPDATE courses SET professor = 'Prof. Jennifer Lee' WHERE code = 'CSCI 1270';
UPDATE courses SET professor = 'Prof. Christopher Brown' WHERE code = 'CSCI 1380';
UPDATE courses SET professor = 'Prof. Maria Martinez' WHERE code = 'CSCI 1430';
UPDATE courses SET professor = 'Prof. Daniel Johnson' WHERE code = 'CSCI 1470';
UPDATE courses SET professor = 'Prof. Rachel Davis' WHERE code = 'CSCI 1480';
UPDATE courses SET professor = 'Prof. Thomas Anderson' WHERE code = 'CSCI 1490';
UPDATE courses SET professor = 'Prof. Nicole Taylor' WHERE code = 'CSCI 1500';

-- Mathematics Department
UPDATE courses SET professor = 'Prof. William Clark' WHERE code = 'MATH 0100';
UPDATE courses SET professor = 'Prof. Patricia White' WHERE code = 'MATH 0180';
UPDATE courses SET professor = 'Prof. Steven Lewis' WHERE code = 'MATH 0200';
UPDATE courses SET professor = 'Prof. Rebecca Hall' WHERE code = 'MATH 0520';
UPDATE courses SET professor = 'Prof. Kevin Scott' WHERE code = 'MATH 1010';
UPDATE courses SET professor = 'Prof. Michelle Adams' WHERE code = 'MATH 1130';
UPDATE courses SET professor = 'Prof. Andrew Green' WHERE code = 'MATH 1140';
UPDATE courses SET professor = 'Prof. Stephanie Baker' WHERE code = 'MATH 1260';
UPDATE courses SET professor = 'Prof. Jonathan Carter' WHERE code = 'MATH 1530';
UPDATE courses SET professor = 'Prof. Samantha Evans' WHERE code = 'MATH 1540';
UPDATE courses SET professor = 'Prof. Matthew Turner' WHERE code = 'MATH 1610';
UPDATE courses SET professor = 'Prof. Lauren Phillips' WHERE code = 'MATH 1620';
UPDATE courses SET professor = 'Prof. Ryan Campbell' WHERE code = 'MATH 1630';
UPDATE courses SET professor = 'Prof. Danielle Parker' WHERE code = 'MATH 1640';
UPDATE courses SET professor = 'Prof. Brandon Edwards' WHERE code = 'MATH 1650';

-- Economics Department
UPDATE courses SET professor = 'Prof. Ashley Collins' WHERE code = 'ECON 0110';
UPDATE courses SET professor = 'Prof. Joshua Stewart' WHERE code = 'ECON 1110';
UPDATE courses SET professor = 'Prof. Megan Morris' WHERE code = 'ECON 1210';
UPDATE courses SET professor = 'Prof. Nathan Rogers' WHERE code = 'ECON 1130';
UPDATE courses SET professor = 'Prof. Victoria Reed' WHERE code = 'ECON 1150';
UPDATE courses SET professor = 'Prof. Tyler Cook' WHERE code = 'ECON 1220';
UPDATE courses SET professor = 'Prof. Hannah Bailey' WHERE code = 'ECON 1230';
UPDATE courses SET professor = 'Prof. Zachary Cooper' WHERE code = 'ECON 1240';
UPDATE courses SET professor = 'Prof. Grace Richardson' WHERE code = 'ECON 1250';
UPDATE courses SET professor = 'Prof. Caleb Cox' WHERE code = 'ECON 1260';
UPDATE courses SET professor = 'Prof. Sophia Ward' WHERE code = 'ECON 1270';
UPDATE courses SET professor = 'Prof. Isaac Torres' WHERE code = 'ECON 1280';
UPDATE courses SET professor = 'Prof. Chloe Peterson' WHERE code = 'ECON 1290';
UPDATE courses SET professor = 'Prof. Ethan Gray' WHERE code = 'ECON 1300';
UPDATE courses SET professor = 'Prof. Isabella Hughes' WHERE code = 'ECON 1310';

-- Physics Department
UPDATE courses SET professor = 'Prof. Noah Price' WHERE code = 'PHYS 0030';
UPDATE courses SET professor = 'Prof. Ava Bennett' WHERE code = 'PHYS 0050';
UPDATE courses SET professor = 'Prof. Mason Wood' WHERE code = 'PHYS 0070';
UPDATE courses SET professor = 'Prof. Scarlett Barnes' WHERE code = 'PHYS 0200';
UPDATE courses SET professor = 'Prof. Leo Fisher' WHERE code = 'PHYS 0300';
UPDATE courses SET professor = 'Prof. Luna Henderson' WHERE code = 'PHYS 0400';
UPDATE courses SET professor = 'Prof. Oliver Coleman' WHERE code = 'PHYS 0500';
UPDATE courses SET professor = 'Prof. Stella Jenkins' WHERE code = 'PHYS 0600';
UPDATE courses SET professor = 'Prof. Finn Perry' WHERE code = 'PHYS 0700';
UPDATE courses SET professor = 'Prof. Aurora Butler' WHERE code = 'PHYS 0800';
UPDATE courses SET professor = 'Prof. River Russell' WHERE code = 'PHYS 0900';
UPDATE courses SET professor = 'Prof. Willow Griffin' WHERE code = 'PHYS 1000';
UPDATE courses SET professor = 'Prof. Atlas Diaz' WHERE code = 'PHYS 1100';
UPDATE courses SET professor = 'Prof. Phoenix Hayes' WHERE code = 'PHYS 1200';
UPDATE courses SET professor = 'Prof. Sage Sanders' WHERE code = 'PHYS 1300';

-- Chemistry Department
UPDATE courses SET professor = 'Prof. Rowan Powell' WHERE code = 'CHEM 0100';
UPDATE courses SET professor = 'Prof. Juniper Long' WHERE code = 'CHEM 0330';
UPDATE courses SET professor = 'Prof. Cedar Patterson' WHERE code = 'CHEM 0350';
UPDATE courses SET professor = 'Prof. Aspen Hughes' WHERE code = 'CHEM 0360';
UPDATE courses SET professor = 'Prof. Birch Flores' WHERE code = 'CHEM 0500';
UPDATE courses SET professor = 'Prof. Maple Washington' WHERE code = 'CHEM 0600';
UPDATE courses SET professor = 'Prof. Oak Jefferson' WHERE code = 'CHEM 0700';
UPDATE courses SET professor = 'Prof. Pine Madison' WHERE code = 'CHEM 0800';
UPDATE courses SET professor = 'Prof. Elm Hamilton' WHERE code = 'CHEM 0900';
UPDATE courses SET professor = 'Prof. Willow Jackson' WHERE code = 'CHEM 1000';
UPDATE courses SET professor = 'Prof. Maple Van Buren' WHERE code = 'CHEM 1100';
UPDATE courses SET professor = 'Prof. Birch Harrison' WHERE code = 'CHEM 1200';
UPDATE courses SET professor = 'Prof. Cedar Tyler' WHERE code = 'CHEM 1300';
UPDATE courses SET professor = 'Prof. Aspen Polk' WHERE code = 'CHEM 1400';
UPDATE courses SET professor = 'Prof. Rowan Taylor' WHERE code = 'CHEM 1500';

-- Biology Department (partial - add more as needed)
UPDATE courses SET professor = 'Prof. Juniper Adams' WHERE code = 'BIOL 0200'; 