USE jmdb2;

-- Définition des colonnes AUTO_INCREMENT et PRIMARY KEY en premier
ALTER TABLE movies
CHANGE COLUMN `Numéro` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE casting
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE director
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE language
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE genre
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE music
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE screenwriter
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE studio
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE tag
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE country
CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE movies
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

-- UPDATE movies
-- SET cover = CONCAT('http://localhost:3310/', cover);

SELECT * FROM movies;

ALTER TABLE casting
CHANGE COLUMN `Distribution` name TEXT NULL DEFAULT NULL;

SELECT * FROM casting;

ALTER TABLE movie_casting
CHANGE COLUMN `id` `castingId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

SELECT * FROM movie_casting;

ALTER TABLE director
CHANGE COLUMN `Réalisateur(s)` name TEXT NULL DEFAULT NULL;

SELECT * FROM director;

ALTER TABLE movie_director
CHANGE COLUMN `id` `directorId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

SELECT * FROM movie_director;

ALTER TABLE language
CHANGE COLUMN `Langues` name TEXT NULL DEFAULT NULL;

SELECT * FROM language;

ALTER TABLE movie_language
CHANGE COLUMN `id` `languageId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

SELECT * FROM movie_language;

ALTER TABLE genre
CHANGE COLUMN `Genre(s)` name TEXT NULL DEFAULT NULL;

SELECT * FROM genre;

ALTER TABLE movie_genre
CHANGE COLUMN `id` `genreId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

SELECT * FROM movie_genre;

ALTER TABLE music
CHANGE COLUMN `Compositeur(s)` name TEXT NULL DEFAULT NULL;

SELECT * FROM music;

ALTER TABLE movie_music
CHANGE COLUMN `id` `musicId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

SELECT * FROM movie_music;

ALTER TABLE screenwriter
CHANGE COLUMN `Scénariste(s)` name TEXT NULL DEFAULT NULL;

SELECT * FROM screenwriter;

ALTER TABLE movie_screenwriter
CHANGE COLUMN `id` `screenwriterId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

SELECT * FROM movie_screenwriter;

ALTER TABLE studio
CHANGE COLUMN `Studio` name TEXT NULL DEFAULT NULL;

SELECT * FROM studio;

ALTER TABLE movie_studio
CHANGE COLUMN `id` `studioId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

SELECT * FROM movie_studio;

ALTER TABLE tag
CHANGE COLUMN `Etiquettes` name TEXT NULL DEFAULT NULL;

SELECT * FROM tag;

ALTER TABLE movie_tag
CHANGE COLUMN `id` `tagId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

SELECT * FROM movie_tag;

ALTER TABLE country
CHANGE COLUMN `Pays` name TEXT NULL DEFAULT NULL;

SELECT * FROM country;

ALTER TABLE movie_country
CHANGE COLUMN `id` `countryId` INT,
CHANGE COLUMN `Numéro` `movieId` INT;

SELECT * FROM movie_country;
