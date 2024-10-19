Use jmdb;

UPDATE studio
SET name = REPLACE(REPLACE(name, '/', '-'), '\\', '-')
WHERE name LIKE '%/%' 
   OR name LIKE '%\\%';

UPDATE tag
SET name = REPLACE(REPLACE(name, '/', '-'), '\\', '-')
WHERE name LIKE '%/%' 
   OR name LIKE '%\\%';