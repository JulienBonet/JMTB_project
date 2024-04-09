use jmdb;

ALTER TABLE director
ADD COLUMN image VARCHAR(255) DEFAULT 'http://localhost:3310/00_item_default.png',
ADD COLUMN pitch TEXT,
ADD COLUMN wikilink TEXT,
ADD COLUMN imdblink TEXT;

UPDATE director
SET image = CONCAT('http://localhost:3310/', '00_item_default.png');