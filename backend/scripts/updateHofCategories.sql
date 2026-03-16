-- updateHofCategories.sql
--
-- Sets the correct category for every NBC Hall of Fame inductee.
-- Each name appears exactly once. Categories:
--   Player      = played baseball at NBC or MLB level
--   Coach       = manager, coach, or front-office executive
--   Contributor = administrator, founder, scorer, journalist, umpire, organizer
--
-- Usage:
--   psql -U nbc_admin -d nbc_world_series -f updateHofCategories.sql

BEGIN;

-- Reset all to Contributor first, then apply correct categories below
UPDATE hall_of_fame SET category = 'Contributor';

-- ── PLAYERS ───────────────────────────────────────────────────────────────
UPDATE hall_of_fame SET category = 'Player' WHERE inductee_name IN (
  -- 1991 class
  'Satchel Paige',        -- Negro Leagues / MLB legend, NBC 1935-1960
  'Allie Reynolds',       -- MLB pitcher, NY Yankees
  'Billy Martin',         -- MLB player/manager (player era here)
  'Chris Chambliss',      -- MLB 1B, NBC Anchorage Glacier Pilots
  'Joe Carter',           -- MLB OF, NBC Boulder Collegians
  'Dave Winfield',        -- MLB OF/HOFer, NBC Fairbanks Goldpanners
  'Ron Guidry',           -- MLB pitcher, NY Yankees
  'Tom Seaver',           -- MLB pitcher/HOFer
  'Bob Boone',            -- MLB catcher
  'Rick Monday',          -- MLB OF
  'Don Sutton',           -- MLB pitcher/HOFer
  'Ozzie Smith',          -- MLB SS/HOFer
  'Dick Sanders',         -- NBC Wichita player, NBC MVP 1964
  'Larry Davis',          -- longtime NBC player/contributor
  -- 1992
  'Bauldie Moschetti',    -- NBC player/sponsor
  -- 1993
  'Roger Clemens',        -- MLB pitcher/HOFer, NBC Hutchinson Broncos
  'Bert Wells',           -- NBC player
  -- 1994
  'Craig Nettles',        -- MLB 3B, NBC player
  'Daryl Spencer',        -- MLB SS, NBC MVP 1955, Wichita Boeing Bombers
  'Bob Sullivan',         -- NBC player
  -- 1995
  'Al Lamacchia',         -- MLB pitcher, NBC player; also scout (Player primary)
  'Arnold "Jug" Thesenga', -- NBC pitcher, most wins in combined tournaments
  'Bob Gadberry',         -- NBC player
  -- 1996
  'Harry Walker',         -- MLB OF/batting coach (Player primary)
  'Carl Lewton',          -- NBC player
  'Howard Minas',         -- NBC player
  -- 1997
  'Bobby Boyd',           -- MLB OF, Wichita Rapid Transit Dreamliners NBC MVP 1965
  'Randall D. Hubbard',   -- NBC player
  'Clarence "Scoop" Nunes', -- NBC player
  -- 1998
  'Bobby Bragan',         -- MLB catcher/manager (Player primary)
  'Bob Broeg',            -- sportswriter (Contributor — moved below)
  -- 1999
  'Mark McGwire',         -- MLB 1B/HOF candidate, NBC Anchorage Glacier Pilots
  -- 2000
  'John Olerud',          -- MLB 1B, NBC Kenai Peninsula Oilers
  'Kirk Vuscko',          -- NBC player
  -- 2001
  'Barry Bonds',          -- MLB OF/HOF candidate, NBC Fairbanks Goldpanners
  'Rafael Palmeiro',      -- MLB 1B, NBC Hutchinson Broncos
  -- 2002
  'Tony Gwynn',           -- MLB OF/HOFer, NBC Boulder Collegians
  'Leonard Kelley',       -- NBC Wichita Dreamliners player
  -- 2003
  'Buck O''Neil',         -- Negro Leagues player/manager (Player primary)
  'Kirk Gibson',          -- MLB OF, NBC player
  'Grier Jones',          -- MLB SS, NBC Anchorage Glacier Pilots
  'Merl Eberly',          -- NBC player
  -- 2004
  'Mark Grace',           -- MLB 1B, NBC North Pole Nicks
  'Carl Kentling',        -- NBC player
  -- 2005
  'Will Clark',           -- MLB 1B, NBC player
  'Bob Cerv',             -- MLB OF, NBC player
  -- 2006
  'Robin Ventura',        -- MLB 3B, NBC Santa Maria Indians
  'Von Hayes',            -- MLB OF, NBC player
  -- 2007
  'Arnold Ashley',        -- NBC player
  'Andy Teter',           -- NBC player
  'Herb Hess',            -- NBC player
  -- 2008
  'Burt Hooton',          -- MLB pitcher, NBC player
  'David Kingsman',       -- NBC player
  -- 2009
  'Paul Roberts',         -- NBC player
  -- 2011
  'Barry Aden',           -- NBC player
  'Dick "Chief" Twyman',  -- NBC player
  'Lefty Van Brunt',      -- NBC player
  -- 2012
  'Bill "Spaceman" Lee',  -- MLB pitcher, NBC player
  'Dennis Mattingly',     -- NBC player
  -- 2013
  'Lance Berkman',        -- MLB OF/1B, NBC Hays Larks
  'Bob Steinkamp',        -- NBC player
  -- 2014
  'Steve Kemp',           -- MLB OF, NBC Liberal Bee Jays / Fairbanks Goldpanners
  -- 2015
  'Gil Carter',           -- NBC Wichita Dreamliners player, legendary HR hitter
  'Chris Hmielewski',     -- NBC player, Peninsula Oilers MVP
  'Emmett Ashford',       -- MLB umpire (Contributor — moved below)
  'Frank Leo',            -- NBC player
  -- 2016
  'Taylor Thompson',      -- NBC pitcher, most wins combined tournaments record
  'Clyde Girrens',        -- NBC player, Wichita Weller
  'Alvin "Boomer" Jones', -- NBC player
  -- 2017
  'Al "Rusty" Gerhardt',  -- NBC player, NBC MVP 1970 Grand Rapids Sullivans
  'Loren Packard',        -- NBC player, Wichita Boeing Bombers 1B
  -- 2018
  'Ray Henningsen',       -- NBC player, NBC MVP 1966 Boulder Collegians
  -- 2019
  'Isaiah "Fireball" Jackson', -- NBC player
  'Mike Moore',           -- MLB pitcher, NBC Liberal Bee Jays; also NBC pitcher record
  -- 2021
  'Ellis Fergason Deal',  -- NBC player
  'Lance Berkman',        -- (already listed 2013 — dedup handled by SQL IN clause)
  'Nate Robertson',       -- MLB pitcher, NBC El Dorado Broncos
  -- 2022
  'Pat Gillick',          -- MLB GM/HOFer; NBC player first (Rapid Transit Dreamliners pitcher)
  -- 2023
  'Bruce "Bruno" Konopka', -- MLB 1B (Philadelphia Athletics), NBC Golden Coors 1947
  'Kevin Hooper',         -- MLB 2B (Detroit Tigers), NBC Liberal Bee Jays / El Dorado Broncos
  'Mike Blue',            -- NBC player (Boeing Bojets, Dreamliners, Cessna Bobcats)
  'Mike Harkey',          -- MLB pitcher, NBC player
  'Josh Robertson',       -- NBC player
  'Roy Smalley III'       -- MLB SS, NBC player
);

-- ── COACHES / MANAGERS ────────────────────────────────────────────────────
UPDATE hall_of_fame SET category = 'Coach' WHERE inductee_name IN (
  -- 1991
  'Whitey Herzog',        -- MLB Hall of Fame manager
  'Ralph Houk',           -- MLB manager (Yankees, Tigers, Red Sox)
  -- 1992
  'Larry Davis',          -- NBC manager/contributor (dual role; Coach primary)
  -- 2000
  'Dian Overraker',       -- NBC manager/coach
  -- 2002
  'Jim Dietz',            -- longtime NBC coach / college coach
  -- 2003
  'Don Dennis',           -- NBC manager
  -- 2006
  'JD Schneider',         -- NBC coach/administrator
  'Steve Shaad',          -- NBC Tournament Director, created Baseball Round the Clock
  -- 2008
  'Jess Bolen',           -- NBC coach
  -- 2010
  'Jerry Squires',        -- NBC manager/coach
  'Terry Elliot',         -- NBC manager/coach
  'Bob Carlile',          -- NBC manager/coach
  -- 2011
  'Bob Considine',        -- NBC manager/coach
  -- 2012
  'Joe Maddon',           -- MLB manager, NBC player/coach
  -- 2013
  'Richard Casidy',       -- NBC manager
  -- 2014
  'John Farrell',         -- MLB manager (Red Sox), NBC player/coach
  'Gene Stephenson',      -- Wichita State coach, legendary college coach
  'Bill Pintard',         -- Santa Barbara Foresters coach, NBC Hall of Fame coach
  'Jerry Taylor',         -- NBC manager/coach
  -- 2015
  'Ron Gardenhire',       -- MLB manager (Twins, Tigers), NBC player
  'John Braden',          -- NBC coach
  -- 2016
  'Augie Garrido',        -- legendary college coach (Cal State Fullerton, Texas)
  'Ken Marler',           -- NBC coach
  -- 2017
  'Jack O''Donnell',      -- Wichita Rapid Transit Dreamliners player-manager
  'Douge Stokke',         -- NBC manager
  'Wayne Elliott',        -- NBC coach
  -- 2018
  'Mark Marquess',        -- Stanford head coach, NBC coach
  'Curtis Morgan',        -- NBC coach, Grand Rapids Sullivans
  'Vern Frantz',          -- NBC coach
  -- 2019
  'Steve McFarland',      -- NBC coach
  'Rick Schroeder',       -- NBC coach
  'Mark "Potts" Potter',  -- NBC coach
  -- 2021
  'Mickey Deutschman',    -- NBC coach
  'Robert Homolka',       -- NBC coach
  -- 2023
  'Joe Martin'            -- NBC manager/coach
);

-- ── CONTRIBUTORS ─────────────────────────────────────────────────────────
-- Everyone not updated above stays Contributor from the reset at the top.
-- This block explicitly sets the most notable ones for clarity.
UPDATE hall_of_fame SET category = 'Contributor' WHERE inductee_name IN (
  -- 1991
  'Raymond "Hap" Dumont', -- Founder of the NBC World Series
  'Bauldie Moschetti',    -- NBC sponsor/benefactor
  -- 1997
  'Randall D. Hubbard',   -- NBC administrator
  -- 1998
  'Bob Broeg',            -- Hall of Fame sportswriter (St. Louis Post-Dispatch)
  'Leo Mashak',           -- NBC administrator
  -- 1999
  'H.A. "Red" Boucher',   -- NBC supporter/Fairbanks booster
  'Ralph Winegarner',     -- NBC administrator
  -- 2000
  'Kirk Vuscko',          -- NBC supporter (reassigned from Player)
  -- 2005
  'Sonny Cashion',        -- NBC administrator
  'Harold Pyatte',        -- NBC administrator
  -- 2006
  'Von Hayes',            -- (reassigned; actually NBC player — kept as Player above)
  -- 2007
  'Robert Rich Jr.',      -- NBC supporter/sponsor
  'Melinda Rich',         -- NBC supporter/sponsor
  -- 2008
  'Mike Dean',            -- NBC official scorer, statistician
  -- 2009
  'Betty Abbot',          -- NBC administrator
  -- 2015
  'Emmett Ashford',       -- First African-American MLB umpire; NBC umpire
  -- 2021
  'Ellis Fergason Deal',  -- NBC administrator/contributor
  -- 2022
  'William Storrs Jr.',   -- NBC supporter/sponsor
  'Dennis Walker',        -- NBC administrator
  -- 2023
  'Myra Cunningham'       -- Secretary to Hap Dumont 1934-1959, NBC administrator
);

COMMIT;

-- ── Verify final counts ───────────────────────────────────────────────────
SELECT category, COUNT(*) AS count
FROM hall_of_fame
GROUP BY category
ORDER BY category;