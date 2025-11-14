use jmdb2;

-- ========================================
-- TABLE focusCategory
-- (catégories de sélections)
-- ========================================

CREATE TABLE focusCategory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

-- Pré-remplissage conseillé
INSERT INTO focusCategory (name)
VALUES ('Thema'), ('Festival');


-- ========================================
-- TABLE focus
-- (sélections : vampires, palme d’or, Kubrick…)
-- ========================================

CREATE TABLE focus (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  pitch TEXT,
  image VARCHAR(255) DEFAULT '00_jmtb_item_default.jpg',
  categoryId INT,
  PRIMARY KEY (id),
  FOREIGN KEY (categoryId) REFERENCES focusCategory(id)
);


-- ========================================
-- TABLE movie_focus
-- (liaison MANY-TO-MANY entre films et sélections)
-- ========================================

CREATE TABLE movie_focus (
  movieId INT NOT NULL,
  focusId INT NOT NULL,
  PRIMARY KEY (movieId, focusId),
  FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (focusId) REFERENCES focus(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ========================================
-- TABLE director
-- (nouvelles colonnes pour focus)
-- ========================================
ALTER TABLE director
  ADD COLUMN isFocus TINYINT(1) DEFAULT 0 AFTER imdblink,
  ADD COLUMN birthDate DATE NULL AFTER isFocus,
  ADD COLUMN deathDate DATE NULL AFTER birthDate;
  
  -- ========================================
-- TABLE casting
-- (nouvelles colonnes pour focus)
-- ========================================
  ALTER TABLE casting
  ADD COLUMN isFocus TINYINT(1) DEFAULT 0 AFTER imdblink,
  ADD COLUMN birthDate DATE NULL AFTER isFocus,
  ADD COLUMN deathDate DATE NULL AFTER birthDate;
  
  SELECT * FROM focusCategory; 
  SELECT * FROM focus;
  SELECT * FROM director; 
  SELECT * FROM casting; 
