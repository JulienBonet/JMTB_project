use jmdb;

UPDATE movies
SET cover = '00_cover_default.jpg'
WHERE id = 3614;

UPDATE movies
SET cover = '00_cover_default.jpg'
WHERE id = 3521;

SELECT * FROM movies;