USE jmdb2;

-- movie_casting TABLE
DELETE FROM movie_casting
WHERE castingId NOT IN (SELECT id FROM casting);

ALTER TABLE movie_casting
ADD CONSTRAINT fk_movie_casting_casting
  FOREIGN KEY (castingId)
  REFERENCES casting (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT fk_movie_casting_movie
  FOREIGN KEY (movieId)
  REFERENCES movies (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- movie_country TABLE
DELETE FROM movie_country
WHERE countryId NOT IN (SELECT id FROM country);

ALTER TABLE movie_country
ADD CONSTRAINT fk_movie_country_country
  FOREIGN KEY (countryId)
  REFERENCES country (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT fk_movie_country_movie
  FOREIGN KEY (movieId)
  REFERENCES movies (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- movie_director TABLE
DELETE FROM movie_director
WHERE directorId NOT IN (SELECT id FROM director);

ALTER TABLE movie_director
ADD CONSTRAINT fk_movie_director_director
  FOREIGN KEY (directorId)
  REFERENCES director (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT fk_movie_director_movie
  FOREIGN KEY (movieId)
  REFERENCES movies (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- movie_genre TABLE
DELETE FROM movie_genre
WHERE genreId NOT IN (SELECT id FROM genre);

ALTER TABLE movie_genre
ADD CONSTRAINT fk_movie_genre_genre
  FOREIGN KEY (genreId)
  REFERENCES genre (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT fk_movie_genre_movie
  FOREIGN KEY (movieId)
  REFERENCES movies (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- movie_language TABLE
DELETE FROM movie_language
WHERE languageId NOT IN (SELECT id FROM language);

ALTER TABLE movie_language
ADD CONSTRAINT fk_movie_language_language
  FOREIGN KEY (languageId)
  REFERENCES language (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT fk_movie_language_movie
  FOREIGN KEY (movieId)
  REFERENCES movies (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- movie_music TABLE
DELETE FROM movie_music
WHERE musicId NOT IN (SELECT id FROM music);

ALTER TABLE movie_music
ADD CONSTRAINT fk_movie_music_music
  FOREIGN KEY (musicId)
  REFERENCES music (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT fk_movie_music_movie
  FOREIGN KEY (movieId)
  REFERENCES movies (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- movie_screenwriter TABLE
DELETE FROM movie_screenwriter
WHERE screenwriterId NOT IN (SELECT id FROM screenwriter);

ALTER TABLE movie_screenwriter
ADD CONSTRAINT fk_movie_screenwriter_screenwriter
  FOREIGN KEY (screenwriterId)
  REFERENCES screenwriter (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT fk_movie_screenwriter_movie
  FOREIGN KEY (movieId)
  REFERENCES movies (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- movie_studio TABLE
DELETE FROM movie_studio
WHERE studioId NOT IN (SELECT id FROM studio);

ALTER TABLE movie_studio
ADD CONSTRAINT fk_movie_studio_studio
  FOREIGN KEY (studioId)
  REFERENCES studio (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT fk_movie_studio_movie
  FOREIGN KEY (movieId)
  REFERENCES movies (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- movie_tag TABLE
DELETE FROM movie_tag
WHERE tagId NOT IN (SELECT id FROM tag);

ALTER TABLE movie_tag
ADD CONSTRAINT fk_movie_tag_tag
  FOREIGN KEY (tagId)
  REFERENCES tag (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT fk_movie_tag_movie
  FOREIGN KEY (movieId)
  REFERENCES movies (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
