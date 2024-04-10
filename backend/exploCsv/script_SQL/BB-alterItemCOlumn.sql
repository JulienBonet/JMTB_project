use jmdb;

ALTER TABLE director
ADD COLUMN image VARCHAR(255) DEFAULT 'http://localhost:3310/00_item_default.png',
ADD COLUMN pitch TEXT,
ADD COLUMN wikilink TEXT,
ADD COLUMN imdblink TEXT;

UPDATE director
SET image = CONCAT('http://localhost:3310/', '00_item_default.png');

ALTER TABLE casting
ADD COLUMN image VARCHAR(255) DEFAULT 'http://localhost:3310/00_item_default.png',
ADD COLUMN pitch TEXT,
ADD COLUMN wikilink TEXT,
ADD COLUMN imdblink TEXT;

UPDATE casting
SET image = CONCAT('http://localhost:3310/', '00_item_default.png');

ALTER TABLE screenwriter
ADD COLUMN image VARCHAR(255) DEFAULT 'http://localhost:3310/00_item_default.png',
ADD COLUMN pitch TEXT,
ADD COLUMN wikilink TEXT,
ADD COLUMN imdblink TEXT;

UPDATE screenwriter
SET image = CONCAT('http://localhost:3310/', '00_item_default.png');

ALTER TABLE music
ADD COLUMN image VARCHAR(255) DEFAULT 'http://localhost:3310/00_item_default.png',
ADD COLUMN pitch TEXT,
ADD COLUMN wikilink TEXT,
ADD COLUMN imdblink TEXT;

UPDATE music
SET image = CONCAT('http://localhost:3310/', '00_item_default.png');

SELECT * FROM music

ALTER TABLE studio
ADD COLUMN image VARCHAR(255) DEFAULT 'http://localhost:3310/00_jmtb_item_default.jpg',
ADD COLUMN pitch TEXT,
ADD COLUMN wikilink TEXT,
ADD COLUMN imdblink TEXT;

UPDATE studio
SET image = CONCAT('http://localhost:3310/', '00_jmtb_item_default.jpg');

SELECT * FROM studio