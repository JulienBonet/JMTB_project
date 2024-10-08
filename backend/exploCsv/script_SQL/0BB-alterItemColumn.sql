use jmdb2;

ALTER TABLE movies
MODIFY COLUMN cover VARCHAR(255) NOT NULL DEFAULT '00_cover_default.jpg',
CHANGE COLUMN `idIMDb` `idIMDb` BIGINT NULL DEFAULT NULL;

ALTER TABLE director
-- ADD COLUMN image VARCHAR(255) DEFAULT 'http://localhost:3310/00_item_default.png',
ADD COLUMN image VARCHAR(255) DEFAULT '00_item_default.png',
ADD COLUMN pitch TEXT,
ADD COLUMN wikilink TEXT,
ADD COLUMN imdblink TEXT;

-- UPDATE director
-- SET image = CONCAT('http://localhost:3310/', '00_item_default.png');

SELECT * FROM director;

ALTER TABLE casting
-- ADD COLUMN image VARCHAR(255) DEFAULT 'http://localhost:3310/00_item_default.png',
ADD COLUMN image VARCHAR(255) DEFAULT '00_item_default.png',
ADD COLUMN pitch TEXT,
ADD COLUMN wikilink TEXT,
ADD COLUMN imdblink TEXT;

-- UPDATE casting
-- SET image = CONCAT('http://localhost:3310/', '00_item_default.png');

SELECT * FROM casting;

ALTER TABLE screenwriter
ADD COLUMN image VARCHAR(255) DEFAULT '00_item_default.png',
ADD COLUMN pitch TEXT,
ADD COLUMN wikilink TEXT,
ADD COLUMN imdblink TEXT;

-- UPDATE screenwriter
-- SET image = CONCAT('http://localhost:3310/', '00_item_default.png');

SELECT * FROM screenwriter;

ALTER TABLE music
ADD COLUMN image VARCHAR(255) DEFAULT '00_item_default.png',
ADD COLUMN pitch TEXT,
ADD COLUMN wikilink TEXT,
ADD COLUMN imdblink TEXT;

-- UPDATE music
-- SET image = CONCAT('http://localhost:3310/', '00_item_default.png');

SELECT * FROM music;

ALTER TABLE studio
ADD COLUMN image VARCHAR(255) DEFAULT '00_jmtb_item_default.jpg',
ADD COLUMN pitch TEXT,
ADD COLUMN wikilink TEXT,
ADD COLUMN imdblink TEXT;

-- UPDATE studio
-- SET image = CONCAT('http://localhost:3310/', '00_jmtb_item_default.jpg');

SELECT * FROM studio;

ALTER TABLE country
ADD COLUMN image VARCHAR(255) DEFAULT '00_jmtb_flag_item_default.jpg';

-- UPDATE country
-- SET image = CONCAT('http://localhost:3310/', '00_jmtb_flag_item_default.jpg');

SELECT * FROM country;

CREATE TABLE thema (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NULL DEFAULT NULL,
  pitch TEXT NULL DEFAULT NULL,
  image VARCHAR(255) DEFAULT '00_jmtb_item_default.jpg'
);

CREATE TABLE movie_thema (
  thema_id INT,
  movie_id INT,
  PRIMARY KEY (thema_id, movie_id),
  FOREIGN KEY (thema_id) REFERENCES thema(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);

SELECT * FROM thema;

ALTER TABLE tag MODIFY name VARCHAR(255);
ALTER TABLE tag ADD UNIQUE (name);
SELECT * FROM tag;