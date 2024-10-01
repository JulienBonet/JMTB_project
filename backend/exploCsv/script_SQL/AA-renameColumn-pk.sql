-- Définition des colonnes AUTO_INCREMENT et PRIMARY KEY en premier
ALTER TABLE jmdb.movies
CHANGE COLUMN `Numéro` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE jmdb.casting
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE jmdb.director
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE jmdb.language
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE jmdb.genre
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE jmdb.music
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE jmdb.screenwriter
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE jmdb.studio
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE jmdb.tag
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE jmdb.country
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;


ALTER TABLE jmdb.movies
CHANGE COLUMN `Titre` title TEXT NOT NULL,
CHANGE COLUMN `Titre alternatif` altTitle TEXT NULL DEFAULT NULL,
CHANGE COLUMN `Année` year TEXT NULL DEFAULT NULL,
CHANGE COLUMN `Durée` duration INT NULL DEFAULT NULL,
CHANGE COLUMN `Chemin de l'affiche` cover TEXT NULL DEFAULT NULL,
CHANGE COLUMN `Bande-annonce` trailer TEXT NULL DEFAULT NULL,
CHANGE COLUMN `Synopsis` pitch TEXT NULL DEFAULT NULL,
CHANGE COLUMN `Scénario` story TEXT NULL DEFAULT NULL,
CHANGE COLUMN `Emplacement` location TEXT NULL DEFAULT NULL,
CHANGE COLUMN `Conteneur` videoFormat TEXT NULL DEFAULT NULL,
CHANGE COLUMN `Commentaires` comment TEXT NULL DEFAULT NULL,
CHANGE COLUMN `Support` videoSupport TEXT NULL DEFAULT NULL,
CHANGE COLUMN `Taille du fichier` fileSize TEXT NULL DEFAULT NULL,
CHANGE COLUMN `ID TheMovieDb` idTheMovieDb TEXT NULL DEFAULT NULL,
CHANGE COLUMN `ID IMDb` idIMDb DOUBLE NULL DEFAULT NULL;
-- UPDATE jmdb.movies
-- SET cover = CONCAT('http://localhost:3310/', cover);

SELECT * FROM jmdb.movies;

ALTER TABLE jmdb.casting
CHANGE COLUMN `Distribution` name TEXT NULL DEFAULT NULL;

SELECT * FROM jmdb.casting;

ALTER TABLE jmdb.movie_casting
CHANGE COLUMN `id` `castingId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

SELECT * FROM jmdb.movie_casting;

ALTER TABLE jmdb.director
CHANGE COLUMN `Réalisateur(s)` name TEXT NULL DEFAULT NULL;

SELECT * FROM jmdb.director;

ALTER TABLE jmdb.movie_director
CHANGE COLUMN `id` `directorId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

SELECT * FROM jmdb.movie_director;


ALTER TABLE jmdb.language
CHANGE COLUMN `Langues` name TEXT NULL DEFAULT NULL;

SELECT * FROM jmdb.language;

ALTER TABLE jmdb.movie_language
CHANGE COLUMN `id` `languageId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

SELECT * FROM jmdb.movie_language;


ALTER TABLE jmdb.genre
CHANGE COLUMN `Genre(s)` name TEXT NULL DEFAULT NULL;

select * from jmdb.genre;

ALTER TABLE jmdb.movie_genre
CHANGE COLUMN `id` `genreId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

select * from jmdb.movie_genre;


ALTER TABLE jmdb.music
CHANGE COLUMN `Compositeur(s)` name TEXT NULL DEFAULT NULL;

select * from jmdb.music;

ALTER TABLE jmdb.movie_music
CHANGE COLUMN `id` `musicId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

select * from jmdb.movie_music;


ALTER TABLE jmdb.screenwriter
CHANGE COLUMN `Scénariste(s)` name TEXT NULL DEFAULT NULL;

select * from jmdb.screenwriter;

ALTER TABLE jmdb.movie_screenwriter
CHANGE COLUMN `id` `screenwriterId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

select * from jmdb.movie_screenwriter;

ALTER TABLE jmdb.studio
CHANGE COLUMN `Studio` name TEXT NULL DEFAULT NULL;

select * from jmdb.studio;

ALTER TABLE jmdb.movie_studio
CHANGE COLUMN `id` `studioId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

select * from jmdb.movie_studio;


ALTER TABLE jmdb.tag
CHANGE COLUMN `Etiquettes` name TEXT NULL DEFAULT NULL;

select * from jmdb.tag;

ALTER TABLE jmdb.movie_tag
CHANGE COLUMN `id` `tagId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

select * from jmdb.movie_tag;


ALTER TABLE jmdb.country
CHANGE COLUMN `Pays` name TEXT NULL DEFAULT NULL;

select * from jmdb.country;

ALTER TABLE jmdb.movie_country
CHANGE COLUMN `id` `countryId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

select * from jmdb.movie_country;