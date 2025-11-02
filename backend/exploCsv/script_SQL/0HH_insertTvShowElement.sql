use jmdb2;

ALTER TABLE movies
ADD COLUMN isTvShow BOOLEAN DEFAULT FALSE AFTER cover,
ADD COLUMN tvSeasons VARCHAR(20) DEFAULT NULL AFTER isTvShow,
ADD COLUMN nbTvEpisodes INT DEFAULT NULL AFTER nbTvSeasons,
ADD COLUMN episodeDuration INT DEFAULT NULL AFTER nbTvEpisodes;

UPDATE movies
SET isTvShow = 1
WHERE idTheMovieDb LIKE '%tv%';

select * from movies;