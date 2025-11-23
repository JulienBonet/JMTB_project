use jmdb2;

-- LES OSCARS
DELETE FROM movie_focus
WHERE focusId = 22;

INSERT IGNORE INTO movie_focus (movieId, focusId)
SELECT m.id, 22
FROM movies m
JOIN (
    SELECT 'Wings' AS original, 'Les Ailes' AS french, 1927 AS release_year UNION ALL
    SELECT 'The Broadway Melody', 'La Mélodie du bonheur', 1929 UNION ALL
    SELECT 'All Quiet on the Western Front', 'À l’Ouest, rien de nouveau', 1930 UNION ALL
    SELECT 'Cimarron', 'Cimarron', 1931 UNION ALL
    SELECT 'Grand Hotel', 'Grand Hôtel', 1932 UNION ALL
    SELECT 'Cavalcade', 'Cavalcade', 1933 UNION ALL
    SELECT 'It Happened One Night', 'New York – Miami', 1934 UNION ALL
    SELECT 'Mutiny on the Bounty', 'Les Révoltés du Bounty', 1935 UNION ALL
    SELECT 'The Great Ziegfeld', 'Le Grand Ziegfeld', 1936 UNION ALL
    SELECT 'The Life of Emile Zola', 'La Vie d’Émile Zola', 1937 UNION ALL
    SELECT 'You Can’t Take It with You', 'Vous ne l’emporterez pas avec vous', 1938 UNION ALL
    SELECT 'Gone with the Wind', 'Autant en emporte le vent', 1939 UNION ALL
    SELECT 'Rebecca', 'Rebecca', 1940 UNION ALL
    SELECT 'How Green Was My Valley', 'Le Pays du bout du monde', 1941 UNION ALL
    SELECT 'Mrs. Miniver', 'Mrs. Miniver', 1942 UNION ALL
    SELECT 'Casablanca', 'Casablanca', 1943 UNION ALL
    SELECT 'Going My Way', 'La Route du bonheur', 1944 UNION ALL
    SELECT 'The Lost Weekend', 'Mon Frère bien-aimé', 1945 UNION ALL
    SELECT 'The Best Years of Our Lives', 'Les Meilleures Années de notre vie', 1946 UNION ALL
    SELECT 'Gentleman’s Agreement', 'La Firme du silence', 1947 UNION ALL
    SELECT 'Hamlet', 'Hamlet', 1948 UNION ALL
    SELECT 'All the King’s Men', 'Tous les hommes du roi', 1949 UNION ALL
    SELECT 'All About Eve', 'All About Eve', 1950 UNION ALL
    SELECT 'An American in Paris', 'Un Américain à Paris', 1951 UNION ALL
    SELECT 'The Greatest Show on Earth', 'Le Plus Grand Spectacle du monde', 1952 UNION ALL
    SELECT 'From Here to Eternity', 'Tant qu’il y aura des hommes', 1953 UNION ALL
    SELECT 'On the Waterfront', 'Sur les quais', 1954 UNION ALL
    SELECT 'Marty', 'Marty', 1955 UNION ALL
    SELECT 'Around the World in 80 Days', 'Le Tour du monde en 80 jours', 1956 UNION ALL
    SELECT 'The Bridge on the River Kwai', 'Le Pont de la rivière Kwaï', 1957 UNION ALL
    SELECT 'Gigi', 'Gigi', 1958 UNION ALL
    SELECT 'Ben‑Hur', 'Ben‑Hur', 1959 UNION ALL
    SELECT 'The Apartment', 'La Garçonnière', 1960 UNION ALL
    SELECT 'West Side Story', 'West Side Story', 1961 UNION ALL
    SELECT 'Lawrence of Arabia', 'Lawrence d’Arabie', 1962 UNION ALL
    SELECT 'Tom Jones', 'Tom Jones', 1963 UNION ALL
    SELECT 'My Fair Lady', 'My Fair Lady', 1964 UNION ALL
    SELECT 'The Sound of Music', 'La Mélodie du bonheur', 1965 UNION ALL
    SELECT 'A Man for All Seasons', 'Un homme pour l’éternité', 1966 UNION ALL
    SELECT 'In the Heat of the Night', 'Dans la chaleur de la nuit', 1967 UNION ALL
    SELECT 'Oliver!', 'Oliver !', 1968 UNION ALL
    SELECT 'Midnight Cowboy', 'Macadam Cowboy', 1969 UNION ALL
    SELECT 'Patton', 'Patton', 1970 UNION ALL
    SELECT 'The French Connection', 'French Connection', 1971 UNION ALL
    SELECT 'The Godfather', 'Le Parrain', 1972 UNION ALL
    SELECT 'The Sting', 'L’Arnaque', 1973 UNION ALL
    SELECT 'The Godfather Part II', 'Le Parrain 2', 1974 UNION ALL
    SELECT 'One Flew Over the Cuckoo’s Nest', 'Vol au-dessus d’un nid de coucou', 1975 UNION ALL
    SELECT 'Rocky', 'Rocky', 1976 UNION ALL
    SELECT 'Annie Hall', 'Annie Hall', 1977 UNION ALL
    SELECT 'The Deer Hunter', 'Voyage au bout de l’enfer', 1978 UNION ALL
    SELECT 'Kramer vs. Kramer', 'Kramer contre Kramer', 1979 UNION ALL
    SELECT 'Ordinary People', 'Des gens comme les autres', 1980 UNION ALL
    SELECT 'Chariots of Fire', 'Les Chariots de feu', 1981 UNION ALL
    SELECT 'Gandhi', 'Gandhi', 1982 UNION ALL
    SELECT 'Terms of Endearment', 'Tendres Passions', 1983 UNION ALL
    SELECT 'Amadeus', 'Amadeus', 1984 UNION ALL
    SELECT 'Out of Africa', 'Souvenirs d’Afrique', 1985 UNION ALL
    SELECT 'Platoon', 'Platoon', 1986 UNION ALL
    SELECT 'The Last Emperor', 'Le Dernier Empereur', 1987 UNION ALL
    SELECT 'Rain Man', 'Rain Man', 1988 UNION ALL
    SELECT 'Driving Miss Daisy', 'Miss Daisy et le conducteur', 1989 UNION ALL
    SELECT 'Dances with Wolves', 'Danse avec les loups', 1990 UNION ALL
    SELECT 'The Silence of the Lambs', 'Le Silence des agneaux', 1991 UNION ALL
    SELECT 'Unforgiven', 'Impitoyable', 1992 UNION ALL
    SELECT 'Schindler’s List', 'La Liste de Schindler', 1993 UNION ALL
    SELECT 'Forrest Gump', 'Forrest Gump', 1994 UNION ALL
    SELECT 'Braveheart', 'Braveheart', 1995 UNION ALL
    SELECT 'The English Patient', 'Le Patient anglais', 1996 UNION ALL
    SELECT 'Titanic', 'Titanic', 1997 UNION ALL
    SELECT 'Shakespeare in Love', 'Shakespeare in Love', 1998 UNION ALL
    SELECT 'American Beauty', 'American Beauty', 1999 UNION ALL
    SELECT 'Gladiator', 'Gladiator', 2000 UNION ALL
    SELECT 'A Beautiful Mind', 'Un homme d’exception', 2001 UNION ALL
    SELECT 'Chicago', 'Chicago', 2002 UNION ALL
    SELECT 'The Lord of the Rings: The Return of the King', 'Le Seigneur des anneaux : Le Retour du roi', 2003 UNION ALL
    SELECT 'Million Dollar Baby', 'Million Dollar Baby', 2004 UNION ALL
    SELECT 'Crash', 'Collision', 2005 UNION ALL
    SELECT 'The Departed', 'Les Infiltrés', 2006 UNION ALL
    SELECT 'No Country for Old Men', 'No Country for Old Men', 2007 UNION ALL
    SELECT 'Slumdog Millionaire', 'Slumdog Millionaire', 2008 UNION ALL
    SELECT 'The Hurt Locker', 'Démineurs', 2009 UNION ALL
    SELECT 'The King’s Speech', 'Le Discours d’un roi', 2010 UNION ALL
    SELECT 'The Artist', 'The Artist', 2011 UNION ALL
    SELECT 'Argo', 'Argo', 2012 UNION ALL
    SELECT '12 Years a Slave', '12 Years a Slave', 2013 UNION ALL
    SELECT 'Birdman or (The Unexpected Virtue of Ignorance)', 'Birdman', 2014 UNION ALL
    SELECT 'Spotlight', 'Spotlight', 2015 UNION ALL
    SELECT 'Moonlight', 'Moonlight', 2016 UNION ALL
    SELECT 'The Shape of Water', 'La Forme de l’eau', 2017 UNION ALL
    SELECT 'Green Book', 'Green Book : Sur les routes du Sud', 2018 UNION ALL
    SELECT 'Parasite', 'Parasite', 2019 UNION ALL
    SELECT 'Nomadland', 'Nomadland', 2020 UNION ALL
    SELECT 'CODA', 'CODA', 2021 UNION ALL
    SELECT 'Everything Everywhere All at Once', 'Everything Everywhere All at Once', 2022 UNION ALL
    SELECT 'Oppenheimer', 'Oppenheimer', 2023
) AS o
ON ( m.title LIKE CONCAT('%', o.french, '%') OR m.altTitle LIKE CONCAT('%', o.original, '%') )
   AND m.year BETWEEN o.release_year - 1 AND o.release_year + 1
WHERE NOT EXISTS (
    SELECT 1
    FROM movie_focus mf
    WHERE mf.movieId = m.id
      AND mf.focusId = 22
);

-- CANNES
DELETE FROM movie_focus
WHERE focusId = 4;

-- 3. -- Insère palme avec titre + “release_year” pour un gap de ±4 ans
INSERT IGNORE INTO movie_focus (movieId, focusId)
SELECT m.id, 4
FROM movies m
JOIN (
    SELECT 'Marty' AS original, 'Marty' AS french, 1955 AS release_year UNION ALL
    SELECT 'Le Monde du silence', 'The Silent World', 1956 UNION ALL
    SELECT 'La Loi du Seigneur', 'Friendly Persuasion', 1956 UNION ALL
    SELECT 'Quand passent les cigognes', 'Letyat zhuravli', 1957 UNION ALL
    SELECT 'Orfeu Negro', 'Black Orpheus', 1959 UNION ALL
    SELECT 'La dolce vita', 'La Dolce Vita', 1960 UNION ALL
    SELECT 'Une aussi longue absence', 'A Long Absence', 1961 UNION ALL
    SELECT 'Viridiana', 'Viridiana', 1961 UNION ALL
    SELECT 'Le Payeur de promesses', 'O Pagador de Promessas', 1962 UNION ALL
    SELECT 'Le Guépard', 'Il Gattopardo', 1963 UNION ALL
    SELECT 'Les Parapluies de Cherbourg', 'The Umbrellas of Cherbourg', 1964 UNION ALL
    SELECT 'The Knack… and How to Get It', 'Le Coup du siècle', 1965 UNION ALL
    SELECT 'Un homme et une femme', 'A Man and a Woman', 1966 UNION ALL
    SELECT 'Blow-Up', 'Blow-Up', 1967 UNION ALL
    SELECT 'If….', 'If….', 1969 UNION ALL
    SELECT 'M*A*S*H', 'M*A*S*H', 1970 UNION ALL
    SELECT 'The Go-Between', 'The Go-Between', 1971 UNION ALL
    SELECT 'The Working Class Goes to Heaven', 'La Classe ouvrière va au paradis', 1972 UNION ALL
    SELECT 'Scarecrow', 'Scarecrow', 1973 UNION ALL
    SELECT 'The Conversation', 'Conversation Secrète', 1974 UNION ALL
    SELECT 'Chronique des années de braise', 'Chronicle of the Years of Fire', 1975 UNION ALL
    SELECT 'Taxi Driver', 'Taxi Driver', 1976 UNION ALL
    SELECT 'Padre Padrone', 'Padre Padrone', 1977 UNION ALL
    SELECT 'The Tree of Wooden Clogs', 'L’Arbre aux sabots', 1978 UNION ALL
    SELECT 'Apocalypse Now', 'Apocalypse Now', 1979 UNION ALL
    SELECT 'All That Jazz', 'All That Jazz', 1980 UNION ALL
    SELECT 'Man of Iron', 'Man of Iron', 1981 UNION ALL
    SELECT 'Missing', 'Missing', 1982 UNION ALL
    SELECT 'Fitzcarraldo', 'Fitzcarraldo', 1982 UNION ALL
    SELECT 'Paris, Texas', 'Paris, Texas', 1984 UNION ALL
    SELECT 'When Father Was Away on Business', 'When Father Was Away on Business', 1985 UNION ALL
    SELECT 'The Mission', 'The Mission', 1986 UNION ALL
    SELECT 'Under the Sun of Satan', 'Sous le soleil de Satan', 1987 UNION ALL
    SELECT 'Pelle le Conquérant', 'Pelle le Conquérant', 1988 UNION ALL
    SELECT 'Sex, Lies, and Videotape', 'Sexe, Mensonges et Vidéo', 1989 UNION ALL
    SELECT 'Wild at Heart', 'Wild at Heart', 1990 UNION ALL
    SELECT 'Barton Fink', 'Barton Fink', 1991 UNION ALL
    SELECT 'The Best Intentions', 'Les Meilleures Intentions', 1992 UNION ALL
    SELECT 'Farewell My Concubine', 'Adieu ma concubine', 1993 UNION ALL
    SELECT 'Pulp Fiction', 'Pulp Fiction', 1994 UNION ALL
    SELECT 'Underground', 'Underground', 1995 UNION ALL
    SELECT 'Secrets & Lies', 'Secrets & Mensonges', 1996 UNION ALL
    SELECT 'Taste of Cherry', 'Goût de la cerise', 1997 UNION ALL
    SELECT 'Eternity and a Day', 'L’Éternité et un jour', 1998 UNION ALL
    SELECT 'Rosetta', 'Rosetta', 1999 UNION ALL
    SELECT 'Dancer in the Dark', 'Dancer dans le noir', 2000 UNION ALL
    SELECT 'The Son’s Room', 'La Chambre du fils', 2001 UNION ALL
    SELECT 'The Pianist', 'Le Pianiste', 2002 UNION ALL
    SELECT 'Elephant', 'Elephant', 2003 UNION ALL
    SELECT 'Fahrenheit 9/11', 'Fahrenheit 9/11', 2004 UNION ALL
    SELECT 'Lemming', 'Lemming', 2005 UNION ALL
    SELECT 'The Wind That Shakes the Barley', 'Le Vent se lève', 2006 UNION ALL
    SELECT '4 Months, 3 Weeks and 2 Days', '4 mois, 3 semaines et 2 jours', 2007 UNION ALL
    SELECT 'The Class', 'Entre les murs', 2008 UNION ALL
    SELECT 'The White Ribbon', 'Le Ruban blanc', 2009 UNION ALL
    SELECT 'Uncle Boonmee Who Can Recall His Past Lives', 'Oncle Boonmee', 2010 UNION ALL
    SELECT 'The Tree of Life', 'The Tree of Life', 2011 UNION ALL
    SELECT 'Amour', 'Amour', 2012 UNION ALL
    SELECT 'Blue Is the Warmest Colour', 'La Vie d’Adèle', 2013 UNION ALL
    SELECT 'Winter Sleep', 'Le Sommeil de l’hiver', 2014 UNION ALL
    SELECT 'Dheepan', 'Dheepan', 2015 UNION ALL
    SELECT 'I, Daniel Blake', 'Moi, Daniel Blake', 2016 UNION ALL
    SELECT 'The Square', 'La Place', 2017 UNION ALL
    SELECT 'Shoplifters', 'Une Affaire de famille', 2018 UNION ALL
    SELECT 'Parasite', 'Parasite', 2019 UNION ALL
    SELECT 'Titane', 'Titane', 2021 UNION ALL
    SELECT 'Triangle of Sadness', 'Triangle de la tristesse', 2022 UNION ALL
    SELECT 'Anatomy of a Fall', 'Anatomie d’une chute', 2023
) AS o
ON (
     m.title LIKE CONCAT('%', o.french, '%')
  OR m.altTitle LIKE CONCAT('%', o.original, '%')
)
AND m.year BETWEEN o.release_year - 2 AND o.release_year + 2
WHERE NOT EXISTS (
    SELECT 1
    FROM movie_focus mf
    WHERE mf.movieId = m.id
      AND mf.focusId = 4
);

-- les cesars

DELETE FROM movie_focus
WHERE focusId = 6;

INSERT IGNORE INTO movie_focus (movieId, focusId)
SELECT m.id, 6
FROM movies m
JOIN (
    SELECT 'The Old Gun' AS original, 'Le Vieux Fusil' AS french, 1975 AS release_year UNION ALL
    SELECT 'Mr. Klein', 'Monsieur Klein', 1976 UNION ALL
    SELECT 'Providence', 'Providence', 1977 UNION ALL
    SELECT 'Other People’s Money', 'L’Argent des autres', 1978 UNION ALL
    SELECT 'Tess', 'Tess', 1979 UNION ALL
    SELECT 'The Last Metro', 'Le Dernier Métro', 1980 UNION ALL
    SELECT 'Quest for Fire', 'La Guerre du feu', 1981 UNION ALL
    SELECT 'The Balance', 'La Balance', 1982 UNION ALL
    SELECT 'À nos amours', 'À nos amours', 1983 UNION ALL
    SELECT 'Le Bal', 'Le Bal', 1983 UNION ALL
    SELECT 'Les Ripoux', 'Les Ripoux', 1984 UNION ALL
    SELECT 'Three Men and a Cradle', 'Trois hommes et un couffin', 1985 UNION ALL
    SELECT 'Thérèse', 'Thérèse', 1986 UNION ALL
    SELECT 'Au revoir les enfants', 'Au revoir les enfants', 1987 UNION ALL
    SELECT 'Camille Claudel', 'Camille Claudel', 1988 UNION ALL
    SELECT 'Too Beautiful for You', 'Trop belle pour toi', 1989 UNION ALL
    SELECT 'Cyrano de Bergerac', 'Cyrano de Bergerac', 1990 UNION ALL
    SELECT 'Tous les matins du monde', 'Tous les matins du monde', 1991 UNION ALL
    SELECT 'Smoking/No Smoking', 'Smoking/No Smoking', 1993 UNION ALL
    SELECT 'Trois Couleurs: Bleu', 'Trois Couleurs: Bleu', 1993 UNION ALL
    SELECT 'Les Visiteurs', 'Les Visiteurs', 1993 UNION ALL
    SELECT 'La Reine Margot', 'La Reine Margot', 1994 UNION ALL
    SELECT 'La Haine', 'La Haine', 1995 UNION ALL
    SELECT 'Le Patient anglais', 'Le Patient anglais', 1996 UNION ALL
    SELECT 'Le Hussard sur le toit', 'Le Hussard sur le toit', 1995 UNION ALL
    SELECT 'On connaît la chanson', 'On connaît la chanson', 1997 UNION ALL
    SELECT 'Le Fabuleux Destin d’Amélie Poulain', 'Le Fabuleux Destin d’Amélie Poulain', 2001 UNION ALL
    SELECT 'The Pianist', 'Le Pianiste', 2002 UNION ALL
    SELECT 'The Chorus', 'Les Choristes', 2004 UNION ALL
    SELECT 'The Beat That My Heart Skipped', 'De battre mon cœur s’est arrêté', 2005 UNION ALL
    SELECT 'The Class', 'Entre les murs', 2008 UNION ALL
    SELECT 'The Ghost Writer', 'The Ghost Writer', 2010 UNION ALL
    SELECT 'The Artist', 'The Artist', 2011 UNION ALL
    SELECT 'Amour', 'Amour', 2012 UNION ALL
    SELECT 'Blue Is the Warmest Colour', 'La Vie d’Adèle', 2013 UNION ALL
    SELECT 'Timbuktu', 'Timbuktu', 2014 UNION ALL
    SELECT 'Fatima', 'Fatima', 2015 UNION ALL
    SELECT 'Elle', 'Elle', 2016 UNION ALL
    SELECT '120 battements par minute', '120 battements par minute', 2017 UNION ALL
    SELECT 'Faces Places', 'Visages Villages', 2018 UNION ALL
    SELECT 'Les Misérables', 'Les Misérables', 2019 UNION ALL
    SELECT 'Adieu les cons', 'Adieu les cons', 2020 UNION ALL
    SELECT 'Titane', 'Titane', 2021 UNION ALL
    SELECT 'The Night of the 12th', 'La Nuit du 12', 2022 UNION ALL
    SELECT 'The Six Cardinals', 'Les Six Cardinals', 2023 UNION ALL
    SELECT 'Emilia Pérez', 'Emilia Pérez', 2024
) AS o
ON (
     m.title LIKE CONCAT('%', o.french, '%')
  OR m.altTitle LIKE CONCAT('%', o.original, '%')
)
AND m.year BETWEEN o.release_year - 1 AND o.release_year + 1
WHERE NOT EXISTS (
    SELECT 1
    FROM movie_focus mf
    WHERE mf.movieId = m.id
      AND mf.focusId = 6
);

-- Avoriaz
DELETE FROM movie_focus
WHERE focusId = 24;

INSERT IGNORE INTO movie_focus (movieId, focusId)
SELECT m.id, 24
FROM movies m
JOIN (
    -- Avoriaz
    SELECT 'Duel' AS original, 'Duel' AS french, 1973 AS release_year UNION ALL
    SELECT 'Soylent Green', 'Soleil vert', 1974 UNION ALL
    SELECT 'Phantom of the Paradise', 'Phantom of the Paradise', 1975 UNION ALL
    SELECT 'Carrie', 'Carrie', 1977 UNION ALL
    SELECT 'Full Circle', 'Full Circle', 1978 UNION ALL
    SELECT 'Patrick', 'Patrick', 1979 UNION ALL
    SELECT 'Time After Time', 'C’était demain', 1980 UNION ALL
    SELECT 'The Elephant Man', 'The Elephant Man', 1981 UNION ALL
    SELECT 'Mad Max 2', 'Mad Max 2', 1982 UNION ALL
    SELECT 'The Dark Crystal', 'The Dark Crystal', 1983 UNION ALL
    SELECT 'De Lift', 'De Lift', 1984 UNION ALL
    SELECT 'The Terminator', 'The Terminator', 1985 UNION ALL
    SELECT 'Dream Lover', 'Dream Lover', 1986 UNION ALL
    SELECT 'Blue Velvet', 'Blue Velvet', 1987 UNION ALL
    SELECT 'Hidden', 'Hidden', 1988 UNION ALL
    SELECT 'Dead Ringers', 'Dead Ringers', 1989 UNION ALL
    SELECT 'I, Madman', 'I, Madman', 1990 UNION ALL
    SELECT 'Tales from the Darkside: The Movie', 'Tales from the Darkside: The Movie', 1991 UNION ALL
    SELECT 'Ucieczka z kina “Wolnosc”', 'Ucieczka z kina “Wolnosc”', 1992 UNION ALL
    SELECT 'Braindead', 'Braindead', 1993 UNION ALL

    -- Gérardmer
    SELECT 'La Mariée aux cheveux blancs', 'La Mariée aux cheveux blancs', 1994 UNION ALL
    SELECT 'Heavenly Creatures', 'Créatures célestes', 1995 UNION ALL
    SELECT 'El Día de la Bestia', 'Le Jour de la bête', 1996 UNION ALL
    SELECT 'Scream', 'Scream', 1997 UNION ALL
    SELECT 'An American Werewolf in Paris', 'Le Loup-garou de Paris', 1998 UNION ALL
    SELECT 'Cube', 'Cube', 1999 UNION ALL
    SELECT 'Stir of Echoes', 'Hypnose', 2000 UNION ALL
    SELECT 'Thomas est amoureux', 'Thomas est amoureux', 2001 UNION ALL
    SELECT 'Fausto 5.0', 'Fausto 5.0', 2002 UNION ALL
    SELECT 'Dark Water', 'Dark Water', 2003 UNION ALL
    SELECT 'Deux sœurs', 'Deux sœurs', 2004 UNION ALL
    SELECT 'Trouble', 'Trouble', 2005 UNION ALL
    SELECT 'Isolation', 'Isolation', 2006 UNION ALL
    SELECT 'Den brysomme mannen', 'Den brysomme mannen', 2007 UNION ALL
    SELECT 'Egō', 'Egō', 2022 UNION ALL
    SELECT 'La Pietà', 'La Pietà', 2023 UNION ALL
    SELECT 'Sleep', 'Sleep', 2024 UNION ALL
    SELECT 'In a Violent Nature', 'In a Violent Nature', 2025
) AS o
ON (
     m.title LIKE CONCAT('%', o.french, '%')
  OR m.altTitle LIKE CONCAT('%', o.original, '%')
)
AND m.year BETWEEN o.release_year - 1 AND o.release_year + 1
WHERE NOT EXISTS (
    SELECT 1
    FROM movie_focus mf
    WHERE mf.movieId = m.id
      AND mf.focusId = 24
);

-- bafta
DELETE FROM movie_focus
WHERE focusId = 23;

INSERT IGNORE INTO movie_focus (movieId, focusId)
SELECT m.id, 23
FROM movies m
JOIN (
    -- BAFTA Best Film
    SELECT 'The Best Years of Our Lives' AS original, 'The Best Years of Our Lives' AS french, 1947 AS release_year UNION ALL
    SELECT 'Hamlet', 'Hamlet', 1948 UNION ALL
    SELECT 'Bicycle Thieves', 'Ladri di biciclette', 1949 UNION ALL
    SELECT 'All About Eve', 'All About Eve', 1950 UNION ALL
    SELECT 'La Ronde', 'La Ronde', 1951 UNION ALL
    SELECT 'The Sound Barrier', 'The Sound Barrier', 1952 UNION ALL
    SELECT 'Forbidden Games', 'Jeux interdits', 1953 UNION ALL
    SELECT 'The Wages of Fear', 'Le Salaire de la peur', 1954 UNION ALL
    SELECT 'Richard III', 'Richard III', 1955 UNION ALL
    SELECT 'Gervaise', 'Gervaise', 1956 UNION ALL
    SELECT 'The Bridge on the River Kwai', 'The Bridge on the River Kwai', 1957 UNION ALL
    SELECT 'Room at the Top', 'Room at the Top', 1958 UNION ALL
    SELECT 'Ben‑Hur', 'Ben‑Hur', 1959 UNION ALL
    SELECT 'The Apartment', 'The Apartment', 1960 UNION ALL
    SELECT 'Ballad of a Soldier', 'Ballad of a Soldier', 1961 UNION ALL
    SELECT 'The Hustler', 'The Hustler', 1961 UNION ALL
    SELECT 'Lawrence of Arabia', 'Lawrence of Arabia', 1962 UNION ALL
    SELECT 'Tom Jones', 'Tom Jones', 1963 UNION ALL
    SELECT 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', 'Dr. Strangelove', 1964 UNION ALL
    SELECT 'My Fair Lady', 'My Fair Lady', 1965 UNION ALL
    SELECT 'Who’s Afraid of Virginia Woolf?', 'Who’s Afraid of Virginia Woolf?', 1966 UNION ALL
    SELECT 'A Man for All Seasons', 'A Man for All Seasons', 1967 UNION ALL
    SELECT 'The Graduate', 'The Graduate', 1968 UNION ALL
    SELECT 'Midnight Cowboy', 'Midnight Cowboy', 1969 UNION ALL
    SELECT 'Butch Cassidy and the Sundance Kid', 'Butch Cassidy and the Sundance Kid', 1970 UNION ALL
    SELECT 'Sunday Bloody Sunday', 'Sunday Bloody Sunday', 1971 UNION ALL
    SELECT 'Cabaret', 'Cabaret', 1972 UNION ALL
    SELECT 'Day for Night', 'La Nuit américaine', 1973 UNION ALL
    SELECT 'Lacombe, Lucien', 'Lacombe, Lucien', 1974 UNION ALL
    SELECT 'Alice Doesn’t Live Here Anymore', 'Alice Doesn’t Live Here Anymore', 1975 UNION ALL
    SELECT 'One Flew Over the Cuckoo’s Nest', 'One Flew Over the Cuckoo’s Nest', 1976 UNION ALL
    SELECT 'Annie Hall', 'Annie Hall', 1977 UNION ALL
    SELECT 'Julia', 'Julia', 1978 UNION ALL
    SELECT 'Manhattan', 'Manhattan', 1979 UNION ALL
    SELECT 'The Elephant Man', 'The Elephant Man', 1980 UNION ALL
    SELECT 'Chariots of Fire', 'Chariots of Fire', 1981 UNION ALL
    SELECT 'Gandhi', 'Gandhi', 1982 UNION ALL
    SELECT 'Educating Rita', 'Educating Rita', 1983 UNION ALL
    SELECT 'The Killing Fields', 'The Killing Fields', 1984 UNION ALL
    SELECT 'The Purple Rose of Cairo', 'The Purple Rose of Cairo', 1985 UNION ALL
    SELECT 'A Room with a View', 'A Room with a View', 1986 UNION ALL
    SELECT 'Jean de Florette', 'Jean de Florette', 1987 UNION ALL
    SELECT 'The Last Emperor', 'The Last Emperor', 1988 UNION ALL
    SELECT 'Dead Poets Society', 'Dead Poets Society', 1989 UNION ALL
    SELECT 'Goodfellas', 'Goodfellas', 1990 UNION ALL
    SELECT 'The Commitments', 'The Commitments', 1991 UNION ALL
    SELECT 'Howards End', 'Howards End', 1992 UNION ALL
    SELECT 'Schindler’s List', 'Schindler’s List', 1993 UNION ALL
    SELECT 'Four Weddings and a Funeral', 'Four Weddings and a Funeral', 1994 UNION ALL
    SELECT 'Sense and Sensibility', 'Sense and Sensibility', 1995 UNION ALL
    SELECT 'The English Patient', 'The English Patient', 1996 UNION ALL
    SELECT 'The Full Monty', 'The Full Monty', 1997 UNION ALL
    SELECT 'Shakespeare in Love', 'Shakespeare in Love', 1998 UNION ALL
    SELECT 'American Beauty', 'American Beauty', 1999 UNION ALL
    SELECT 'Gladiator', 'Gladiator', 2000 UNION ALL
    SELECT 'The Lord of the Rings: The Fellowship of the Ring', 'The Lord of the Rings: The Fellowship of the Ring', 2001 UNION ALL
    SELECT 'The Pianist', 'The Pianist', 2002 UNION ALL
    SELECT 'The Lord of the Rings: The Return of the King', 'The Lord of the Rings: The Return of the King', 2003 UNION ALL
    SELECT 'The Aviator', 'The Aviator', 2004 UNION ALL
    SELECT 'Brokeback Mountain', 'Brokeback Mountain', 2005 UNION ALL
    SELECT 'The Queen', 'The Queen', 2006 UNION ALL
    SELECT 'Atonement', 'Atonement', 2007 UNION ALL
    SELECT 'Slumdog Millionaire', 'Slumdog Millionaire', 2008 UNION ALL
    SELECT 'The Hurt Locker', 'The Hurt Locker', 2009 UNION ALL
    SELECT 'The King’s Speech', 'The King’s Speech', 2010 UNION ALL
    SELECT 'The Artist', 'The Artist', 2011 UNION ALL
    SELECT 'Argo', 'Argo', 2012 UNION ALL
    SELECT '12 Years a Slave', '12 Years a Slave', 2013 UNION ALL
    SELECT 'Boyhood', 'Boyhood', 2014 UNION ALL
    SELECT 'The Revenant', 'The Revenant', 2015 UNION ALL
    SELECT 'La La Land', 'La La Land', 2016 UNION ALL
    SELECT 'Three Billboards Outside Ebbing, Missouri', 'Three Billboards Outside Ebbing, Missouri', 2017 UNION ALL
    SELECT 'Roma', 'Roma', 2018 UNION ALL
    SELECT '1917', '1917', 2019 UNION ALL
    SELECT 'Nomadland', 'Nomadland', 2020 UNION ALL
    SELECT 'The Power of the Dog', 'The Power of the Dog', 2021 UNION ALL
    SELECT 'All Quiet on the Western Front', 'All Quiet on the Western Front', 2022 UNION ALL
    SELECT 'Oppenheimer', 'Oppenheimer', 2023 UNION ALL
    SELECT 'Conclave', 'Conclave', 2024
) AS o
ON (
     m.title LIKE CONCAT('%', o.french, '%')
  OR m.altTitle LIKE CONCAT('%', o.original, '%')
)
AND m.year BETWEEN o.release_year - 1 AND o.release_year + 1
WHERE NOT EXISTS (
    SELECT 1
    FROM movie_focus mf
    WHERE mf.movieId = m.id
      AND mf.focusId = 23
);

-- MOSTRA DE VENISE
DELETE FROM movie_focus
WHERE focusId = 25;

INSERT IGNORE INTO movie_focus (movieId, focusId)
SELECT m.id, 25
FROM movies m
JOIN (
    -- Venice Golden Lion
    SELECT 'Manon' AS original, 'Manon' AS french, 1949 AS release_year UNION ALL
    SELECT 'Justice est faite', 'Justice est faite', 1950 UNION ALL
    SELECT 'Rashōmon', 'Rashōmon', 1951 UNION ALL
    SELECT 'Jeux interdits', 'Jeux interdits', 1952 UNION ALL
    -- 1953 non décerné
    SELECT 'Romeo and Juliet', 'Roméo et Juliette', 1954 UNION ALL
    SELECT 'Ordet', 'La Parole', 1955 UNION ALL
    -- 1956 pas de récompense
    SELECT 'Aparajito', 'L\'Invaincu', 1957 UNION ALL
    SELECT 'Muhomatsu no issho', 'L\'Homme au pousse-pousse', 1958 UNION ALL
    SELECT 'Il generale Della Rovere', 'Le Général Della Rovere', 1959 UNION ALL
    SELECT 'La Grande Guerra', 'La Grande Guerre', 1959 UNION ALL
    SELECT 'Le Passage du Rhin', 'Le Passage du Rhin', 1960 UNION ALL
    SELECT 'L\'Année dernière à Marienbad', 'L\'Année dernière à Marienbad', 1961 UNION ALL
    SELECT 'Cronaca familiare', 'Journal intime', 1962 UNION ALL
    SELECT 'Иваново детство', 'L\'Enfance d\'Ivan', 1962 UNION ALL
    SELECT 'Le mani sulla città', 'Main basse sur la ville', 1963 UNION ALL
    SELECT 'Il deserto rosso', 'Le Désert rouge', 1964 UNION ALL
    SELECT 'Vaghe stelle dell\'Orsa', 'Sandra', 1965 UNION ALL
    SELECT 'La Battaglia di Algeri', 'La Bataille d\'Alger', 1966 UNION ALL
    SELECT 'Belle de jour', 'Belle de jour', 1967 UNION ALL
    SELECT 'Die Artisten in der Zirkuskuppel: Ratlos', 'Les Artistes sous les chapiteaux : Perplexes', 1968 UNION ALL
    SELECT 'Gloria', 'Gloria', 1980 UNION ALL
    SELECT 'Atlantic City', 'Atlantic City', 1980 UNION ALL
    SELECT 'Die Bleierne Zeit', 'Les Années de plomb', 1981 UNION ALL
    SELECT 'Der Stand der Dinge', 'L\'État des choses', 1982 UNION ALL
    SELECT 'Prénom Carmen', 'Prénom Carmen', 1983 UNION ALL
    SELECT 'Rok spokojnego słońca', 'L\'Année du soleil calme', 1984 UNION ALL
    SELECT 'Sans toit ni loi', 'Sans toit ni loi', 1985 UNION ALL
    SELECT 'Le Rayon vert', 'Le Rayon vert', 1986 UNION ALL
    SELECT 'Au revoir les enfants', 'Au revoir les enfants', 1987 UNION ALL
    SELECT 'La Leggenda del santo bevitore', 'La Légende du saint buveur', 1988 UNION ALL
    SELECT '悲情城市', 'La Cité des douleurs', 1989 UNION ALL
    SELECT 'Rosencrantz & Guildenstern Are Dead', 'Rosencrantz et Guildenstern sont morts', 1990 UNION ALL
    SELECT 'Урга — территория любви', 'Urga', 1991 UNION ALL
    SELECT '秋菊打官司', 'Qiu Ju, une femme chinoise', 1992 UNION ALL
    SELECT 'Short Cuts', 'Short Cuts', 1993 UNION ALL
    SELECT 'Trois Couleurs : Bleu', 'Trois Couleurs : Bleu', 1993 UNION ALL
    SELECT 'Pred doždot', 'Before the Rain', 1994 UNION ALL
    SELECT '愛情萬歲', 'Vive l\'amour', 1994 UNION ALL
    SELECT 'Xích Lô', 'Cyclo', 1995 UNION ALL
    SELECT 'Michael Collins', 'Michael Collins', 1996 UNION ALL
    SELECT 'はなび', 'Hana-bi', 1997 UNION ALL
    SELECT 'Così ridevano', 'Mon frère', 1998 UNION ALL
    SELECT '一个都不能少', 'Pas un de moins', 1999 UNION ALL
    SELECT 'دایره', 'Le Cercle', 2000 UNION ALL
    SELECT 'Monsoon Wedding', 'Le Mariage des moussons', 2001 UNION ALL
    SELECT 'The Magdalene Sisters', 'The Magdalene Sisters', 2002 UNION ALL
    SELECT 'Возвращение', 'Le Retour', 2003 UNION ALL
    SELECT 'Vera Drake', 'Vera Drake', 2004 UNION ALL
    SELECT 'Brokeback Mountain', 'Le Secret de Brokeback Mountain', 2005 UNION ALL
    SELECT '三峡好人', 'Still Life', 2006 UNION ALL
    SELECT '色、戒', 'Lust, Caution', 2007 UNION ALL
    SELECT 'The Wrestler', 'The Wrestler', 2008 UNION ALL
    SELECT 'Lebanon', 'Lebanon', 2009 UNION ALL
    SELECT 'Somewhere', 'Somewhere', 2010 UNION ALL
    SELECT 'Faust', 'Faust', 2011 UNION ALL
    SELECT '피에타', 'Pieta', 2012 UNION ALL
    SELECT 'Sacro GRA', 'Sacro GRA', 2013 UNION ALL
    SELECT 'En Duva Satt På en Gren och Funderade På Tillvaron', 'Un pigeon perché sur une branche philosophait sur l\'existence', 2014 UNION ALL
    SELECT 'Desde allá', 'Les Amants de Caracas', 2015 UNION ALL
    SELECT 'Ang babaeng humayo', 'La Femme qui est partie', 2016 UNION ALL
    SELECT 'The Shape of Water', 'La Forme de l\'eau', 2017 UNION ALL
    SELECT 'Roma', 'Roma', 2018 UNION ALL
    SELECT 'Joker', 'Joker', 2019 UNION ALL
    SELECT 'Nomadland', 'Nomadland', 2020 UNION ALL
    SELECT 'L\'Événement', 'L\'Événement', 2021 UNION ALL
    SELECT 'All the Beauty and the Bloodshed', 'Toute la beauté et le sang versé', 2022 UNION ALL
    SELECT 'Poor Things', 'Pauvres Créatures', 2023 UNION ALL
    SELECT 'La habitación de al lado', 'La Chambre d\'à côté', 2024 UNION ALL
    SELECT 'Father Mother Sister Brother', 'Father Mother Sister Brother', 2025
) AS o
ON (
     m.title LIKE CONCAT('%', o.french, '%')
  OR m.altTitle LIKE CONCAT('%', o.original, '%')
)
AND m.year BETWEEN o.release_year - 1 AND o.release_year + 1
WHERE NOT EXISTS (
    SELECT 1
    FROM movie_focus mf
    WHERE mf.movieId = m.id
      AND mf.focusId = 25
);

-- BERLINALE
DELETE FROM movie_focus
WHERE focusId = 26;

INSERT IGNORE INTO movie_focus (movieId, focusId)
SELECT m.id, 26
FROM movies m
JOIN (
    -- Berlin Golden Bear Winners
    SELECT 'Quatre dans une jeep' AS french, 'Die Vier im Jeep' AS original, 1951 AS release_year UNION ALL
    SELECT 'Justice est faite', '', 1951 UNION ALL
    SELECT 'La Vallée des castors', 'In Beaver Valley', 1951 UNION ALL
    SELECT 'Sans laisser d\'adresse', '', 1951 UNION ALL
    SELECT 'Cendrillon', 'Cinderella', 1951 UNION ALL
    SELECT 'Elle n\'a dansé qu\'un seul été', 'Hon dansade en sommer', 1952 UNION ALL
    SELECT 'Le Salaire de la peur', '', 1953 UNION ALL
    SELECT 'Chaussure à son pied', 'Hobson\'s Choice', 1954 UNION ALL
    SELECT 'Les Rats', 'Die Ratten', 1955 UNION ALL
    SELECT 'Invitation à la danse', 'Invitation to the dance', 1956 UNION ALL
    SELECT 'Douze Hommes en colère', 'Twelve Angry Men', 1957 UNION ALL
    SELECT 'Les Fraises sauvages', 'Smultronstället', 1958 UNION ALL
    SELECT 'Les Cousins', '', 1959 UNION ALL
    SELECT 'El Lazarillo de Tormes', 'El Lazarillo de Tormes', 1960 UNION ALL
    SELECT 'La Nuit', 'La Notte', 1961 UNION ALL
    SELECT 'Un amour pas comme les autres', 'A Kind of Loving', 1962 UNION ALL
    SELECT 'Contes cruels du Bushido', 'Bushido zanzoku monogatari', 1963 UNION ALL
    SELECT 'L\'Amour à la suédoise', 'Il Diavolo', 1963 UNION ALL
    SELECT 'Un été sans eau', 'Susuz yaz', 1964 UNION ALL
    SELECT 'Alphaville', '', 1965 UNION ALL
    SELECT 'Cul-de-sac', '', 1966 UNION ALL
    SELECT 'Le Départ', '', 1967 UNION ALL
    SELECT 'Am-stram-gram', 'Ole dole doff', 1968 UNION ALL
    SELECT 'Travaux précoces', 'Rani Radovi', 1969 UNION ALL
    SELECT 'Le Jardin des Finzi-Contini', 'Il giardino dei Finzi Contini', 1971 UNION ALL
    SELECT 'Les Contes de Canterbury', 'I racconti di Canterbury', 1972 UNION ALL
    SELECT 'Tonnerres lointains', 'Ashani sanket', 1973 UNION ALL
    SELECT 'L\'Apprentissage de Duddy Kravitz', 'The Apprenticeship of Duddy Kravitz', 1974 UNION ALL
    SELECT 'Adoption', 'Örökbefogadás', 1975 UNION ALL
    SELECT 'Buffalo Bill et les Indiens', 'Buffalo Bill and the Indians', 1976 UNION ALL
    SELECT 'L\'Ascension', 'Voskhojdenie', 1977 UNION ALL
    SELECT 'Las truchas', '', 1978 UNION ALL
    SELECT 'Ascensor', '', 1978 UNION ALL
    SELECT 'Las palabras de Max', '', 1978 UNION ALL
    SELECT 'David', '', 1979 UNION ALL
    SELECT 'Heartland', '', 1980 UNION ALL
    SELECT 'Palermo', 'Palermo oder Wolfsburg', 1980 UNION ALL
    SELECT 'Vivre vite !', 'Deprisa deprisa', 1981 UNION ALL
    SELECT 'Le Secret de Veronika Voss', 'Die Sehnsucht der Veronika Voss', 1982 UNION ALL
    SELECT 'Ascendancy', '', 1983 UNION ALL
    SELECT 'La Ruche', 'La colmena', 1983 UNION ALL
    SELECT 'Love Streams', '', 1984 UNION ALL
    SELECT 'La Femme et l\'Étranger', 'Die Frau und der Fremde', 1985 UNION ALL
    SELECT 'Wetherby', '', 1985 UNION ALL
    SELECT 'Stammheim', '', 1986 UNION ALL
    SELECT 'Le Thème', 'Tema', 1987 UNION ALL
    SELECT 'Le Sorgho rouge', 'Hóng Gāoliáng', 1988 UNION ALL
    SELECT 'Rain Man', '', 1989 UNION ALL
    SELECT 'Music Box', '', 1990 UNION ALL
    SELECT 'Alouettes, le fil à la patte', 'Skrivánci na niti', 1990 UNION ALL
    SELECT 'La Maison du sourire', 'La Casa del sorriso', 1991 UNION ALL
    SELECT 'Grand Canyon', '', 1992 UNION ALL
    SELECT 'Les Femmes du lac des âmes parfumées', 'Xiang Hunnü', 1993 UNION ALL
    SELECT 'Garçon d\'honneur', 'Hsi Yen', 1993 UNION ALL
    SELECT 'Au nom du père', 'In the Name of the Father', 1994 UNION ALL
    SELECT 'L\'Appât', '', 1995 UNION ALL
    SELECT 'Raison et Sentiments', 'Sense and Sensibility', 1996 UNION ALL
    SELECT 'Larry Flynt', 'The People vs. Larry Flynt', 1997 UNION ALL
    SELECT 'Central do Brasil', '', 1998 UNION ALL
    SELECT 'La Ligne rouge', 'The Thin Red Line', 1999 UNION ALL
    SELECT 'Magnolia', '', 2000 UNION ALL
    SELECT 'Intimité', 'Intimacy', 2001 UNION ALL
    SELECT 'Le Voyage de Chihiro', 'Sen to Chihiro no kamikakushi', 2002 UNION ALL
    SELECT 'Bloody Sunday', '', 2002 UNION ALL
    SELECT 'In This World', '', 2003 UNION ALL
    SELECT 'Head-On', 'Gegen die Wand', 2004 UNION ALL
    SELECT 'Carmen de Khayelitsha', 'U-Carmen e-Khayelitsha', 2005 UNION ALL
    SELECT 'Sarajevo, mon amour', 'Grbavica', 2006 UNION ALL
    SELECT 'Le Mariage de Tuya', 'Tuya de hunshi', 2007 UNION ALL
    SELECT 'Troupe d\'élite', 'Tropa de elite', 2008 UNION ALL
    SELECT 'Fausta', 'La teta asustada', 2009 UNION ALL
    SELECT 'Miel', 'Bal', 2010 UNION ALL
    SELECT 'Une séparation', 'Jodaeiye Nader az Simin', 2011 UNION ALL
    SELECT 'César doit mourir', 'Cesare deve morire', 2012 UNION ALL
    SELECT 'Mère et Fils', 'Poziţia copilului', 2013 UNION ALL
    SELECT 'Black Coal', 'Bai Ri Yan Huo', 2014 UNION ALL
    SELECT 'Taxi Téhéran', 'Taxi', 2015 UNION ALL
    SELECT 'Fuocoammare', '', 2016 UNION ALL
    SELECT 'Corps et Âme', 'Testről és lélekről', 2017 UNION ALL
    SELECT 'Touch Me Not', 'Nu mă atinge-mă', 2018 UNION ALL
    SELECT 'Synonymes', '', 2019 UNION ALL
    SELECT 'Le diable n\'existe pas', 'Sheytân vodjoud nadârad', 2020 UNION ALL
    SELECT 'Bad Luck Banging or Loony Porn', 'Babardeală cu buclucsau porno balamuc', 2021 UNION ALL
    SELECT 'Nos soleils', 'Alcarràs', 2022 UNION ALL
    SELECT 'Sur l\'Adamant', '', 2023 UNION ALL
    SELECT 'Dahomey', '', 2024 UNION ALL
    SELECT 'Dreams', 'Drømmer', 2025
) AS o
ON (
     m.title LIKE CONCAT('%', o.french, '%')
  OR m.altTitle LIKE CONCAT('%', o.original, '%')
)
AND m.year BETWEEN o.release_year - 1 AND o.release_year + 1
WHERE NOT EXISTS (
    SELECT 1
    FROM movie_focus mf
    WHERE mf.movieId = m.id
      AND mf.focusId = 26
);

-- COGNAC 
DELETE FROM movie_focus
WHERE focusId = 27;

INSERT IGNORE INTO movie_focus (movieId, focusId)
SELECT m.id, 27
FROM movies m
JOIN (
    -- Cognac Film Festival Winners (Grand Prix + Jury)
    SELECT 'Beyond Reasonable Doubt' AS french, '', 1982 AS release_year UNION ALL
    SELECT '48 Hrs.' , '', 1983 UNION ALL
    SELECT 'L’Addition', '', 1984 UNION ALL
    SELECT 'Funny Dirty Little War', '', 1985 UNION ALL
    SELECT 'The Hitcher', '', 1986 UNION ALL
    SELECT 'The Big Easy', '', 1987 UNION ALL
    SELECT 'The Cat', '', 1988 UNION ALL
    SELECT 'True Believer', '', 1989 UNION ALL
    SELECT 'Kill Me Again', '', 1990 UNION ALL
    SELECT 'The Hand That Rocks the Cradle', '', 1992 UNION ALL
    SELECT 'One False Move', '', 1993 UNION ALL
    SELECT 'The Escort', '', 1994 UNION ALL
    SELECT 'Shallow Grave', '', 1995 UNION ALL
    SELECT 'The Last Supper', '', 1996 UNION ALL
    SELECT 'Freeway', '', 1997 UNION ALL
    SELECT 'Face', '', 1998 UNION ALL
    SELECT 'Another Day in Paradise', '', 1999 UNION ALL
    SELECT 'Une affaire de goût', '', 2000 UNION ALL
    SELECT 'Chopper', '', 2001 UNION ALL
    SELECT 'Nueve reinas', '', 2002 UNION ALL
    SELECT 'La caja 507', '', 2003 UNION ALL
    SELECT 'Salinui chueok', '', 2004 UNION ALL
    SELECT 'Crimen ferpecto', '', 2005 UNION ALL
    SELECT 'Silentium', '', 2006 UNION ALL
    SELECT 'A Very British Gangster', '', 2007 UNION ALL

    -- Prix du Jury
    SELECT 'Set If Off', '', 1997 UNION ALL
    SELECT 'Le suspect idéal', '', 1998 UNION ALL
    SELECT 'C’est pas mon jour !', '', 1999 UNION ALL
    SELECT 'Un plan simple', '', 1999 UNION ALL
    SELECT 'Jindabyne', '', 2007 UNION ALL
    SELECT 'Mise à prix', '', 2007

) AS o
ON (
     m.title LIKE CONCAT('%', o.french, '%')
  OR m.altTitle LIKE CONCAT('%', o.french, '%')
)
AND m.year BETWEEN o.release_year - 1 AND o.release_year + 1
WHERE NOT EXISTS (
    SELECT 1
    FROM movie_focus mf
    WHERE mf.movieId = m.id
      AND mf.focusId = 27
);
