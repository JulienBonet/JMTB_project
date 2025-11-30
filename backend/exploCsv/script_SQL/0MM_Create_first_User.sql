USE jmdb;

-- INSERT INTO user (name, password_hash, isAdmin)
-- VALUES ('Julius', '$2b$10$ANEf22J8mvHHncWZMJuuR.g3FTxwSmtor/SXoGc./0P4bHWpw0A9W', 1);

-- INSERT INTO user (name, password_hash, isAdmin)
-- VALUES ('Visitor', '$2b$10$ANEf22J8mvHHncWZMJuuR.g3FTxwSmtor/SXoGc./0P4bHWpw0A9W', 0);

UPDATE user
SET isAdmin = 0
WHERE name = 'Visitor';

SELECT * FROM user;