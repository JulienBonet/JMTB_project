use jmdb;

ALTER TABLE movies
ADD COLUMN isTvShow BOOLEAN DEFAULT FALSE AFTER cover,
ADD COLUMN tvSeasons VARCHAR(20) DEFAULT NULL AFTER isTvShow,
ADD COLUMN nbTvEpisodes INT DEFAULT NULL AFTER tvSeasons,
ADD COLUMN episodeDuration INT DEFAULT NULL AFTER nbTvEpisodes;

UPDATE movies
SET isTvShow = 1
WHERE idTheMovieDb LIKE '%tv%';

-- select * from movies;