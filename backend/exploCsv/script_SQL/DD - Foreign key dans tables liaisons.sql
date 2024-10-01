
DELETE FROM `jmdb`.`movie_casting`
WHERE `castingId` NOT IN (SELECT `id` FROM `jmdb`.`casting`);

ALTER TABLE `jmdb`.`movie_casting`
ADD CONSTRAINT `fk_movie_casting_casting`
  FOREIGN KEY (`castingId`)
  REFERENCES `jmdb`.`casting` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_movie_casting_movie`
  FOREIGN KEY (`movieId`)
  REFERENCES `jmdb`.`movies` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

DELETE FROM `jmdb`.`movie_country`
WHERE `countryId` NOT IN (SELECT `id` FROM `jmdb`.`country`);

ALTER TABLE `jmdb`.`movie_country`
ADD CONSTRAINT `fk_movie_country_country`
  FOREIGN KEY (`countryId`)
  REFERENCES `jmdb`.`country` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_movie_country_movie`
  FOREIGN KEY (`movieId`)
  REFERENCES `jmdb`.`movies` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

DELETE FROM `jmdb`.`movie_director`
WHERE `directorId` NOT IN (SELECT `id` FROM `jmdb`.`director`);

ALTER TABLE `jmdb`.`movie_director`
ADD CONSTRAINT `fk_movie_director_director`
  FOREIGN KEY (`directorId`)
  REFERENCES `jmdb`.`director` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_movie_director_movie`
  FOREIGN KEY (`movieId`)
  REFERENCES `jmdb`.`movies` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

DELETE FROM `jmdb`.`movie_genre`
WHERE `genreId` NOT IN (SELECT `id` FROM `jmdb`.`genre`);

ALTER TABLE `jmdb`.`movie_genre`
ADD CONSTRAINT `fk_movie_genre_genre`
  FOREIGN KEY (`genreId`)
  REFERENCES `jmdb`.`genre` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_movie_genre_movie`
  FOREIGN KEY (`movieId`)
  REFERENCES `jmdb`.`movies` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

DELETE FROM `jmdb`.`movie_language`
WHERE `languageId` NOT IN (SELECT `id` FROM `jmdb`.`language`);

ALTER TABLE `jmdb`.`movie_language`
ADD CONSTRAINT `fk_movie_language_language`
  FOREIGN KEY (`languageId`)
  REFERENCES `jmdb`.`language` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_movie_language_movie`
  FOREIGN KEY (`movieId`)
  REFERENCES `jmdb`.`movies` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

DELETE FROM `jmdb`.`movie_music`
WHERE `musicId` NOT IN (SELECT `id` FROM `jmdb`.`music`);

ALTER TABLE `jmdb`.`movie_music`
ADD CONSTRAINT `fk_movie_music_music`
  FOREIGN KEY (`musicId`)
  REFERENCES `jmdb`.`music` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_movie_music_movie`
  FOREIGN KEY (`movieId`)
  REFERENCES `jmdb`.`movies` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

DELETE FROM `jmdb`.`movie_screenwriter`
WHERE `screenwriterId` NOT IN (SELECT `id` FROM `jmdb`.`screenwriter`);

ALTER TABLE `jmdb`.`movie_screenwriter`
ADD CONSTRAINT `fk_movie_screenwriter_screenwriter`
  FOREIGN KEY (`screenwriterId`)
  REFERENCES `jmdb`.`screenwriter` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_movie_screenwriter_movie`
  FOREIGN KEY (`movieId`)
  REFERENCES `jmdb`.`movies` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

DELETE FROM `jmdb`.`movie_studio`
WHERE `studioId` NOT IN (SELECT `id` FROM `jmdb`.`studio`);

ALTER TABLE `jmdb`.`movie_studio`
ADD CONSTRAINT `fk_movie_studio_studio`
  FOREIGN KEY (`studioId`)
  REFERENCES `jmdb`.`studio` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_movie_studio_movie`
  FOREIGN KEY (`movieId`)
  REFERENCES `jmdb`.`movies` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

DELETE FROM `jmdb`.`movie_tag`
WHERE `tagId` NOT IN (SELECT `id` FROM `jmdb`.`tag`);

ALTER TABLE `jmdb`.`movie_tag`
ADD CONSTRAINT `fk_movie_tag_tag`
  FOREIGN KEY (`tagId`)
  REFERENCES `jmdb`.`tag` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_movie_tag_movie`
  FOREIGN KEY (`movieId`)
  REFERENCES `jmdb`.`movies` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
