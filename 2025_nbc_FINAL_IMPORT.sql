-- ===================================================
-- 2025 NBC WORLD SERIES - FINAL IMPORT
-- ===================================================

BEGIN;

-- Insert Teams
INSERT INTO teams (name) VALUES ('Alaska Goldpanners') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('BTL Hornets') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Derby Twins') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Dodge City A''s') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('GPX TX Legends') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Hays Larks') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Hutchinson Monarchs') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Junction City Brigade') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Lonestar Kraken TX') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Lonestar TX Baseball Club') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('MVP Oklahoma') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('San Diego Stars') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Santa Barbara Foresters') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Seattle Blackfins') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Seattle Studs') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Top Prospect Academy') ON CONFLICT (name) DO NOTHING;

-- Insert Players
INSERT INTO players (first_name, last_name) VALUES ('AJ', 'Mustow') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Aidan', 'LeMasters') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Alex', 'Garcia') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Angel', 'Gutierrez') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Ashton', 'Hartwig') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Ben', 'Merriman') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Ben', 'Schnurman') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Blake', 'Bradford') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Blake', 'Coleman') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Bradley', 'Carl') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Brady', 'Kreutzer') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Brand', 'Wilson') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Brayden', 'Harpole') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Brayden', 'Larson') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Breadon', 'Requa') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Brenton', 'Clark') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Brody', 'Bluhm') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('CJ', 'Reid') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Cade', 'Martinez') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Cade', 'Sutherland') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Caden', 'Miller') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Caleb', 'Hoover') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Caleb', 'Small') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Carson', 'Miller') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Carter', 'Lockwood') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Chad', 'Pantuso') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Chandler', 'Stocking') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Chase', 'Fricke') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Chase', 'Pendley') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Chris', 'Parkin') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Christian', 'Olea') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Clayton', 'Anderson') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Colby', 'Fowler') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Cole', 'Chamberlain') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Cole', 'Clark') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Cole', 'Hoffman') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Connor', 'Cavnar') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Connor', 'Rabe') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Cooper', 'Barrow') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Cooper', 'Schwindt') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Creed', 'Muirhead') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('DJ', 'Pinkerton') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Dakota', 'Johnson') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Damian', 'Garcia') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('David', 'Fluitt') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('David', 'Shackelford') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Dawson', 'Robbins') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Dayton', 'Tockey') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Decarlo', 'Delancy') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Diego', 'Gonzalez') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Dominic', 'Roberts') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Drew', 'Bugner') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Dylan', 'Bell') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Dylan', 'LaRue') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Dyllon', 'King') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Easton', 'Moomau') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Edward', 'Gregory Jr') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Edwin', 'Silverio') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Eli', 'Hill') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Eli', 'Kellogg') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Eli', 'Sitzer') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Elias', 'Leon') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Ethan', 'Ho') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Ethan', 'Wright') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Frank', 'Giacalone') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Gabe', 'Pitts') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Gabe', 'Yonto') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Gage', 'Thompson') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Gam', 'Jones') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Gannon', 'White') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Garrett', 'Davidson') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Garryn', 'Plummer') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Gavin', 'Gamino') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Graham', 'Hylton') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Grant', 'Moore') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Grant', 'Nekuza') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Gus', 'Keller') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Harrison', 'Kaufman') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Holden', 'Groebl') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Holden', 'Lough') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Hudson', 'Hartgrove') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Hunter', 'Friedberg') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Hunter', 'Sandifer') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Hutch', 'Russell') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Ian', 'Armstrong') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Ian', 'Luce') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Isaiah', 'Velazco') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('JJ', 'Spafford') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('JT', 'Simonelli') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('JT', 'Starkus') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jack', 'Bergstrom') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jackson', 'Babcock') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jackson', 'Copeland') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jackson', 'Ellison') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jackson', 'Legg') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jackson', 'Rainey') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jackson', 'Syring') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jacob', 'Manaska') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jacobe', 'Radcliffe') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jaden', 'Gustafson') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jadin', 'Moreno') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jake', 'Gallagher') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jake', 'Gutierrez') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jake', 'Knox') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jameson', 'Lucky') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jamie', 'Mullin') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jarrett', 'Herrmann') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jax', 'Marshall') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jaxon', 'James') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jeffrey', 'Perran') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Joe', 'Anderson') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Joe', 'Sandusky') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Joel', 'Fernandez') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Joey', 'Senstock') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('John', 'Gonzales') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jonny', 'Rodriguez') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Jordan', 'Singleton') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Josh', 'Holmes') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Josh', 'Livingston') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Joshua', 'Carter') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Joshua', 'Williams') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Julio', 'Ramos') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Justin', 'Tucker') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Justin', 'Vasquez') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Kade', 'Sheldon') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Kado', 'Robardy') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Kailand', 'Halstead') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Kaleb', 'Duncan') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Kayden', 'Henson') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Kayne', 'Carlos') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Keegan', 'Agen') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Keegan', 'Demmer') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Kenner', 'Lauterbach') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Kevin', 'Hammond') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Kole', 'Dudding') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Kyle', 'Walker') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Kyler', 'Horsman') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Landen', 'Bailey') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Lane', 'Sparks') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Levi', 'Risenhoover') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Logan', 'Aguilar') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Logan', 'Myers') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Lorenzo', 'Rios') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Luke', 'Regas') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Major', 'Brignon') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Matt', 'Perez') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Matthew', 'Fletcher') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Matthew', 'Pazak') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Matthew', 'Pinal') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Maverick', 'McAllist') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Mic', 'Paul') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Micah', 'Kobuszewski') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Micah', 'Melott') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Michael', 'Singleton') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Mike', 'Clark') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Nano', 'Mendoza') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Nico', 'Ruedas') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Nico', 'Salmeri') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Noah', 'Allison') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Nolan', 'Huff') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Owen', 'Curtis') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Owen', 'Meli') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Paul', 'Smith') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Paxton', 'Bigby') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Paxton', 'Huff') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Peanut', 'Brazzle') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Peyton', 'Firgens') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Preston', 'Curtis') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Quinn', 'Groebl') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('RJ', 'Cardenas') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Raph', 'Dunne') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Raphael', 'Pelletier') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Rayner', 'Beene') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Rhenn', 'Andrewartha') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Robby', 'Lopez') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Rohan', 'Culmer') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Roman', 'Cariaga') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Rutger', 'Youch') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Ryan', 'Spero') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Ryne', 'Buckley') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Sage', 'Sanders') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Sage', 'Wimberly') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Sam', 'Stevenson') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Sawyer', 'Farr') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Taber', 'Stokes') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Tanner', 'Fallwell') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Tanner', 'Norman') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Tanner', 'Pachorek') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Teigan', 'Munce') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Terrence', 'Kiel II') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Thomas', 'Lyssy') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Tony', 'DeJesus') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Travis', 'Starkey') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Trent', 'Baker') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Tristan', 'Ringrose') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Tyler', 'Coffin') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Tyson', 'Vassart') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Vince', 'Gamberdella') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Vincent', 'Venverloh') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Wilbert', 'Espinal') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Will', 'James') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Xander', 'Covar') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Xavier', 'Esquer') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Zach', 'Hoskins') ON CONFLICT (first_name, last_name) DO NOTHING;
INSERT INTO players (first_name, last_name) VALUES ('Zane', 'Becker') ON CONFLICT (first_name, last_name) DO NOTHING;

-- Insert Batting Stats
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 7, 7, 29, 11, 16, 3, 0, 0, 10, 19, 0.655, 3, 0, 3, 1, 0.559, 2, 0, 1, 1, NULL, '27', 0.552, 1, 0.933
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jake' AND p.last_name = 'Gutierrez' AND t.name = 'Hutchinson Monarchs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 7, 7, 30, 10, 14, 2, 0, 0, 11, 16, 0.533, 3, 0, 5, 4, 0.500, 1, 0, 1, 1, NULL, '13', 0.467, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Drew' AND p.last_name = 'Bugner' AND t.name = 'Hutchinson Monarchs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 6, 6, 18, 6, 7, 2, 0, 0, 3, 9, 0.500, 3, 5, 1, 0, 0.577, 0, 0, 1, 2, NULL, '10', 0.389, 2, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Blake' AND p.last_name = 'Bradford' AND t.name = 'Hutchinson Monarchs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 7, 7, 26, 9, 10, 4, 1, 0, 8, 16, 0.615, 5, 0, 1, 0, 0.484, 0, 0, 1, 1, NULL, '14', 0.385, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jaden' AND p.last_name = 'Gustafson' AND t.name = 'Hutchinson Monarchs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 7, 7, 19, 8, 7, 2, 0, 1, 5, 12, 0.632, 4, 4, 5, 0, 0.556, 0, 0, 1, 1, NULL, '18', 0.368, 1, 0.933
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Dylan' AND p.last_name = 'Bell' AND t.name = 'Hutchinson Monarchs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 6, 6, 22, 3, 6, 2, 0, 0, 6, 8, 0.364, 2, 2, 5, 2, 0.370, 1, 0, 0, 0, NULL, '36', 0.273, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Tyson' AND p.last_name = 'Vassart' AND t.name = 'Hutchinson Monarchs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 4, 15, 3, 4, 1, 0, 0, 3, 5, 0.333, 5, 0, 5, 1, 0.450, 0, 0, 0, 0, NULL, '20', 0.267, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Keegan' AND p.last_name = 'Demmer' AND t.name = 'Hutchinson Monarchs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 6, 5, 21, 4, 4, 0, 1, 0, 5, 6, 0.286, 1, 1, 6, 0, 0.261, 0, 0, 0, 0, NULL, '35', 0.190, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'AJ' AND p.last_name = 'Mustow' AND t.name = 'Hutchinson Monarchs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 3, 10, 1, 4, 1, 0, 0, 3, 5, 0.500, 0, 1, 2, 0, 0.455, 0, 0, 0, 0, NULL, '33', 0.400, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jake' AND p.last_name = 'Knox' AND t.name = 'Hutchinson Monarchs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 4, 13, 5, 4, 0, 0, 0, 1, 4, 0.308, 3, 0, 3, 0, 0.438, 0, 1, 2, 2, NULL, '2', 0.308, 2, 0.900
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'JJ' AND p.last_name = 'Spafford' AND t.name = 'Hutchinson Monarchs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 4, 15, 3, 3, 2, 0, 0, 2, 5, 0.333, 2, 0, 8, 0, 0.294, 0, 0, 0, 0, NULL, '11', 0.200, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Joey' AND p.last_name = 'Senstock' AND t.name = 'Hutchinson Monarchs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 3, 10, 0, 0, 0, 0, 0, 0, 0, 0.000, 1, 1, 2, 0, 0.167, 0, 0, 0, 0, NULL, '21', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jackson' AND p.last_name = 'Legg' AND t.name = 'Hutchinson Monarchs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 2, 0, 0.000, 0, 0, 0, 0, NULL, '3', 0.000, 0, 0.667
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jarrett' AND p.last_name = 'Herrmann' AND t.name = 'Hutchinson Monarchs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 7, 6, 23, 6, 9, 1, 0, 0, 0, 10, 0.435, 1, 0, 4, 0, 0.417, 0, 0, 0, 0, NULL, '42', 0.391, 0, 0.889
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kenner' AND p.last_name = 'Lauterbach' AND t.name = 'Lonestar Kraken TX';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 7, 7, 18, 8, 7, 1, 0, 0, 3, 8, 0.444, 9, 0, 1, 0, 0.593, 0, 0, 2, 3, NULL, '2', 0.389, 3, 0.900
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kado' AND p.last_name = 'Robardy' AND t.name = 'Lonestar Kraken TX';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 6, 6, 24, 4, 9, 3, 0, 0, 10, 12, 0.500, 2, 1, 3, 0, 0.429, 1, 0, 3, 3, NULL, '13', 0.375, 3, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Preston' AND p.last_name = 'Curtis' AND t.name = 'Lonestar Kraken TX';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 7, 7, 27, 7, 8, 2, 0, 0, 3, 10, 0.370, 4, 3, 9, 1, 0.429, 1, 0, 1, 2, NULL, '67', 0.296, 2, 0.917
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'JT' AND p.last_name = 'Simonelli' AND t.name = 'Lonestar Kraken TX';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 6, 6, 17, 6, 5, 2, 0, 0, 5, 7, 0.412, 8, 2, 4, 1, 0.517, 2, 0, 2, 3, NULL, '1', 0.294, 3, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Chase' AND p.last_name = 'Pendley' AND t.name = 'Lonestar Kraken TX';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 6, 6, 26, 3, 7, 3, 0, 1, 4, 13, 0.500, 2, 0, 7, 2, 0.321, 0, 0, 0, 0, NULL, '20', 0.269, 0, 0.962
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Ethan' AND p.last_name = 'Ho' AND t.name = 'Lonestar Kraken TX';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 7, 7, 27, 5, 6, 1, 0, 2, 11, 13, 0.481, 6, 0, 8, 0, 0.343, 2, 0, 1, 1, NULL, '45', 0.222, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Josh' AND p.last_name = 'Livingston' AND t.name = 'Lonestar Kraken TX';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 6, 5, 21, 3, 3, 0, 0, 1, 4, 6, 0.286, 4, 1, 3, 0, 0.296, 1, 0, 0, 0, NULL, '9', 0.143, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Diego' AND p.last_name = 'Gonzalez' AND t.name = 'Lonestar Kraken TX';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 7, 6, 15, 5, 2, 0, 1, 0, 4, 4, 0.267, 4, 2, 6, 0, 0.381, 0, 3, 1, 2, NULL, '21', 0.133, 2, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Major' AND p.last_name = 'Brignon' AND t.name = 'Lonestar Kraken TX';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 6, 5, 12, 3, 3, 0, 1, 0, 1, 5, 0.417, 5, 1, 5, 0, 0.500, 0, 0, 2, 2, NULL, '56', 0.250, 2, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jax' AND p.last_name = 'Marshall' AND t.name = 'Lonestar Kraken TX';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 2, 0, 0.000, 0, 0, 0, 0, NULL, '5', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jacob' AND p.last_name = 'Manaska' AND t.name = 'Lonestar Kraken TX';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0.000, 2, 0, 1, 0, 0.500, 0, 0, 1, 1, NULL, '0', 0.000, 1, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Grant' AND p.last_name = 'Nekuza' AND t.name = 'Lonestar Kraken TX';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 1, 0, 0.000, 0, 0, 0, 0, NULL, '00', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Micah' AND p.last_name = 'Melott' AND t.name = 'Lonestar Kraken TX';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 20, 4, 7, 0, 0, 0, 5, 7, 0.350, 3, 1, 4, 0, 0.440, 1, 0, 0, 0, NULL, '15', 0.350, 0, 0.900
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Thomas' AND p.last_name = 'Lyssy' AND t.name = 'Hays Larks';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 24, 5, 8, 2, 0, 1, 6, 13, 0.542, 1, 0, 5, 0, 0.360, 0, 0, 4, 5, NULL, '6', 0.333, 5, 0.920
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Taber' AND p.last_name = 'Stokes' AND t.name = 'Hays Larks';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 14, 6, 4, 2, 0, 0, 3, 6, 0.429, 5, 2, 3, 0, 0.524, 0, 0, 10, 11, NULL, '2', 0.286, 11, 0.714
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Trent' AND p.last_name = 'Baker' AND t.name = 'Hays Larks';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 3, 13, 0, 3, 1, 0, 0, 2, 4, 0.308, 4, 0, 5, 0, 0.412, 0, 0, 0, 0, NULL, '33', 0.231, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Wilbert' AND p.last_name = 'Espinal' AND t.name = 'Hays Larks';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 19, 2, 4, 0, 0, 0, 1, 4, 0.211, 6, 0, 3, 0, 0.400, 0, 0, 3, 3, NULL, '12', 0.211, 3, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kaleb' AND p.last_name = 'Duncan' AND t.name = 'Hays Larks';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 21, 3, 4, 2, 0, 0, 4, 6, 0.286, 5, 0, 10, 0, 0.346, 0, 0, 6, 6, NULL, '8', 0.190, 6, 0.889
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Lane' AND p.last_name = 'Sparks' AND t.name = 'Hays Larks';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 3, 13, 2, 2, 1, 0, 0, 2, 3, 0.231, 1, 0, 2, 0, 0.200, 1, 0, 0, 0, NULL, '5', 0.154, 0, 0.960
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jackson' AND p.last_name = 'Babcock' AND t.name = 'Hays Larks';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 16, 3, 2, 1, 0, 0, 4, 3, 0.188, 5, 0, 5, 0, 0.333, 0, 0, 1, 2, NULL, '1', 0.125, 2, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'CJ' AND p.last_name = 'Reid' AND t.name = 'Hays Larks';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 3, 10, 4, 1, 0, 0, 0, 0, 1, 0.100, 5, 0, 4, 0, 0.400, 0, 0, 1, 1, NULL, '4', 0.100, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Brady' AND p.last_name = 'Kreutzer' AND t.name = 'Hays Larks';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 11, 3, 5, 0, 0, 0, 2, 5, 0.455, 1, 1, 2, 0, 0.538, 0, 1, 1, 1, NULL, '21', 0.455, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Lorenzo' AND p.last_name = 'Rios' AND t.name = 'Hays Larks';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 2, 11, 4, 4, 0, 1, 0, 0, 6, 0.545, 1, 0, 1, 0, 0.417, 0, 0, 1, 1, NULL, '25', 0.364, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Paul' AND p.last_name = 'Smith' AND t.name = 'Hays Larks';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 2, 10, 4, 2, 1, 0, 0, 3, 3, 0.300, 2, 0, 1, 0, 0.333, 0, 0, 0, 0, NULL, '26', 0.200, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Dylan' AND p.last_name = 'LaRue' AND t.name = 'Hays Larks';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, NULL, '24', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Julio' AND p.last_name = 'Ramos' AND t.name = 'Hays Larks';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 17, 3, 11, 3, 0, 0, 4, 14, 0.824, 2, 1, 1, 0, 0.700, 0, 0, 1, 1, NULL, '16', 0.647, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jackson' AND p.last_name = 'Copeland' AND t.name = 'Seattle Studs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 19, 4, 6, 4, 0, 0, 1, 10, 0.526, 1, 1, 6, 0, 0.381, 0, 0, 2, 2, NULL, '4', 0.316, 2, 0.929
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Bradley' AND p.last_name = 'Carl' AND t.name = 'Seattle Studs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 15, 2, 3, 0, 0, 0, 2, 3, 0.200, 0, 1, 8, 0, 0.250, 0, 0, 0, 0, NULL, '6', 0.200, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Gage' AND p.last_name = 'Thompson' AND t.name = 'Seattle Studs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 18, 1, 3, 1, 0, 0, 3, 4, 0.222, 0, 1, 7, 1, 0.200, 1, 0, 0, 0, NULL, '23', 0.167, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Ben' AND p.last_name = 'Schnurman' AND t.name = 'Seattle Studs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 13, 2, 2, 0, 0, 0, 0, 2, 0.154, 2, 1, 6, 0, 0.313, 0, 1, 1, 1, NULL, '14', 0.154, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Ryan' AND p.last_name = 'Spero' AND t.name = 'Seattle Studs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 18, 1, 2, 1, 0, 0, 2, 3, 0.167, 1, 1, 4, 0, 0.190, 1, 0, 1, 3, NULL, '27', 0.111, 3, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Chris' AND p.last_name = 'Parkin' AND t.name = 'Seattle Studs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 3, 3, 2, 0, 0, 1, 1, 5, 1.667, 1, 0, 1, 0, 0.750, 0, 0, 0, 0, NULL, '37', 0.667, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kailand' AND p.last_name = 'Halstead' AND t.name = 'Seattle Studs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 7, 1, 3, 1, 0, 0, 0, 4, 0.571, 1, 0, 2, 1, 0.500, 0, 0, 0, 0, NULL, '24', 0.429, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Joel' AND p.last_name = 'Fernandez' AND t.name = 'Seattle Studs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 10, 0, 2, 1, 0, 0, 1, 3, 0.300, 2, 0, 3, 0, 0.333, 0, 0, 0, 0, NULL, '8', 0.200, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jake' AND p.last_name = 'Gallagher' AND t.name = 'Seattle Studs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 11, 1, 2, 0, 1, 0, 1, 4, 0.364, 1, 0, 5, 0, 0.250, 0, 0, 0, 0, NULL, '3', 0.182, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Tristan' AND p.last_name = 'Ringrose' AND t.name = 'Seattle Studs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 8, 1, 1, 0, 0, 0, 0, 1, 0.125, 1, 0, 0, 0, 0.222, 0, 0, 0, 0, NULL, '7', 0.125, 0, 0.944
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Chandler' AND p.last_name = 'Stocking' AND t.name = 'Seattle Studs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 9, 0, 1, 0, 0, 0, 0, 1, 0.111, 0, 0, 0, 0, 0.111, 0, 0, 0, 0, NULL, '5', 0.111, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jack' AND p.last_name = 'Bergstrom' AND t.name = 'Seattle Studs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 0, 1, 0.000, 0, 0, 0, 0, NULL, '32', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Rutger' AND p.last_name = 'Youch' AND t.name = 'Seattle Studs';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 15, 5, 10, 2, 0, 0, 3, 12, 0.800, 0, 0, 2, 0, 0.667, 0, 0, 0, 0, NULL, '22', 0.667, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Matthew' AND p.last_name = 'Pinal' AND t.name = 'Alaska Goldpanners';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 12, 3, 6, 0, 0, 0, 0, 6, 0.500, 2, 0, 1, 0, 0.571, 0, 0, 1, 1, NULL, '27', 0.500, 1, 0.963
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Christian' AND p.last_name = 'Olea' AND t.name = 'Alaska Goldpanners';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 13, 4, 6, 3, 0, 1, 6, 12, 0.923, 1, 1, 0, 0, 0.533, 0, 0, 0, 0, NULL, '38', 0.462, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Ian' AND p.last_name = 'Armstrong' AND t.name = 'Alaska Goldpanners';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 11, 0, 4, 2, 0, 0, 2, 6, 0.545, 1, 2, 0, 0, 0.500, 0, 0, 0, 0, NULL, '16', 0.364, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Vincent' AND p.last_name = 'Venverloh' AND t.name = 'Alaska Goldpanners';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 11, 6, 4, 1, 0, 1, 4, 8, 0.727, 3, 1, 2, 0, 0.533, 0, 0, 1, 1, NULL, '25', 0.364, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Owen' AND p.last_name = 'Meli' AND t.name = 'Alaska Goldpanners';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 11, 2, 3, 1, 0, 0, 1, 4, 0.364, 2, 0, 4, 0, 0.385, 0, 0, 1, 1, NULL, '12', 0.273, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'David' AND p.last_name = 'Shackelford' AND t.name = 'Alaska Goldpanners';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 2, 10, 1, 0, 0, 0, 0, 1, 0, 0.000, 1, 0, 1, 0, 0.091, 0, 0, 0, 1, NULL, '9', 0.000, 1, 0.667
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Cole' AND p.last_name = 'Clark' AND t.name = 'Alaska Goldpanners';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 1, 1, 1, 1, 0, 0, 0, 2, 2.000, 1, 0, 0, 0, 1.000, 0, 0, 0, 0, NULL, '3', 1.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Garrett' AND p.last_name = 'Davidson' AND t.name = 'Alaska Goldpanners';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 7, 1, 2, 1, 0, 1, 3, 6, 0.857, 0, 0, 3, 1, 0.286, 0, 0, 0, 0, NULL, '35', 0.286, 0, 0.667
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jamie' AND p.last_name = 'Mullin' AND t.name = 'Alaska Goldpanners';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 1, 4, 1, 1, 0, 0, 0, 1, 1, 0.250, 4, 0, 2, 0, 0.625, 0, 0, 1, 1, NULL, '5', 0.250, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Hunter' AND p.last_name = 'Friedberg' AND t.name = 'Alaska Goldpanners';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 1, 7, 2, 1, 0, 0, 0, 3, 1, 0.143, 0, 0, 0, 1, 0.125, 1, 0, 0, 0, NULL, '11', 0.143, 0, 0.875
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Alex' AND p.last_name = 'Garcia' AND t.name = 'Alaska Goldpanners';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 2, 6, 1, 0, 0, 0, 0, 0, 0, 0.000, 2, 0, 2, 0, 0.250, 0, 0, 0, 1, NULL, '8', 0.000, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Sam' AND p.last_name = 'Stevenson' AND t.name = 'Alaska Goldpanners';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 10, 4, 6, 2, 0, 1, 2, 11, 1.100, 3, 1, 3, 0, 0.714, 0, 0, 2, 3, NULL, '5', 0.600, 3, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Sawyer' AND p.last_name = 'Farr' AND t.name = 'Santa Barbara Foresters';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 16, 1, 8, 2, 0, 0, 6, 10, 0.625, 1, 0, 0, 0, 0.529, 0, 0, 0, 0, NULL, '23', 0.500, 0, 0.923
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Easton' AND p.last_name = 'Moomau' AND t.name = 'Santa Barbara Foresters';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 9, 3, 4, 1, 0, 0, 4, 5, 0.556, 4, 0, 2, 0, 0.615, 0, 0, 5, 5, NULL, '4', 0.444, 5, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Caden' AND p.last_name = 'Miller' AND t.name = 'Santa Barbara Foresters';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 16, 5, 5, 2, 1, 1, 2, 12, 0.750, 0, 0, 4, 1, 0.313, 0, 0, 1, 1, NULL, '6', 0.313, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Brenton' AND p.last_name = 'Clark' AND t.name = 'Santa Barbara Foresters';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 10, 3, 3, 0, 0, 0, 1, 3, 0.300, 4, 0, 1, 0, 0.467, 1, 0, 2, 3, NULL, '2', 0.300, 3, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Terrence' AND p.last_name = 'Kiel II' AND t.name = 'Santa Barbara Foresters';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 11, 5, 3, 0, 0, 0, 3, 3, 0.273, 5, 1, 1, 1, 0.529, 0, 1, 3, 5, NULL, '12', 0.273, 5, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Xavier' AND p.last_name = 'Esquer' AND t.name = 'Santa Barbara Foresters';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 13, 2, 3, 2, 0, 1, 3, 8, 0.615, 2, 0, 2, 0, 0.333, 0, 0, 0, 0, NULL, '15', 0.231, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Mic' AND p.last_name = 'Paul' AND t.name = 'Santa Barbara Foresters';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 15, 2, 3, 1, 0, 0, 1, 4, 0.267, 1, 2, 4, 0, 0.333, 0, 0, 2, 2, NULL, '8', 0.200, 2, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Cole' AND p.last_name = 'Chamberlain' AND t.name = 'Santa Barbara Foresters';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 1, 2, 3, 1, 0, 0, 0, 0, 1, 0.500, 2, 0, 1, 0, 0.750, 0, 0, 0, 0, NULL, '14', 0.500, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Caleb' AND p.last_name = 'Hoover' AND t.name = 'Santa Barbara Foresters';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 2, 9, 2, 2, 0, 0, 0, 2, 2, 0.222, 0, 0, 3, 1, 0.222, 0, 0, 0, 0, NULL, '17', 0.222, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Zane' AND p.last_name = 'Becker' AND t.name = 'Santa Barbara Foresters';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, NULL, '18', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Vince' AND p.last_name = 'Gamberdella' AND t.name = 'Santa Barbara Foresters';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, NULL, '31', 0.000, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jonny' AND p.last_name = 'Rodriguez' AND t.name = 'Santa Barbara Foresters';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 19, 1, 7, 3, 0, 0, 8, 10, 0.526, 0, 0, 3, 0, 0.350, 1, 0, 2, 2, NULL, '19', 0.368, 2, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Noah' AND p.last_name = 'Allison' AND t.name = 'Derby Twins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 19, 6, 7, 2, 0, 0, 1, 9, 0.474, 3, 0, 3, 0, 0.455, 0, 0, 0, 0, NULL, '5', 0.368, 0, 0.857
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kyle' AND p.last_name = 'Walker' AND t.name = 'Derby Twins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 16, 3, 4, 0, 0, 1, 3, 7, 0.438, 2, 1, 2, 0, 0.350, 1, 0, 0, 0, NULL, '16', 0.250, 0, 0.944
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Damian' AND p.last_name = 'Garcia' AND t.name = 'Derby Twins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 12, 2, 3, 0, 0, 0, 0, 3, 0.250, 2, 1, 4, 0, 0.400, 0, 0, 0, 0, NULL, '14', 0.250, 0, 0.962
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Connor' AND p.last_name = 'Rabe' AND t.name = 'Derby Twins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 12, 0, 3, 1, 0, 0, 1, 4, 0.333, 1, 0, 2, 0, 0.286, 1, 0, 0, 0, NULL, '13', 0.250, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kole' AND p.last_name = 'Dudding' AND t.name = 'Derby Twins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 18, 3, 4, 1, 0, 0, 1, 5, 0.278, 4, 0, 4, 0, 0.364, 0, 0, 2, 3, NULL, '6', 0.222, 3, 0.929
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Peanut' AND p.last_name = 'Brazzle' AND t.name = 'Derby Twins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 15, 0, 2, 0, 0, 0, 1, 2, 0.133, 0, 0, 3, 1, 0.125, 1, 0, 0, 0, NULL, '40', 0.133, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Cade' AND p.last_name = 'Sutherland' AND t.name = 'Derby Twins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 9, 2, 4, 0, 0, 0, 0, 4, 0.444, 1, 0, 1, 0, 0.500, 0, 1, 0, 0, NULL, '7', 0.444, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kade' AND p.last_name = 'Sheldon' AND t.name = 'Derby Twins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 3, 12, 0, 3, 0, 0, 0, 0, 3, 0.250, 0, 0, 4, 1, 0.250, 0, 0, 1, 1, NULL, '26', 0.250, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Elias' AND p.last_name = 'Leon' AND t.name = 'Derby Twins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 8, 2, 2, 1, 0, 0, 0, 3, 0.375, 3, 0, 0, 0, 0.455, 0, 0, 1, 3, NULL, '9', 0.250, 3, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jackson' AND p.last_name = 'Syring' AND t.name = 'Derby Twins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 6, 0, 1, 0, 0, 0, 0, 1, 0.167, 1, 0, 2, 1, 0.286, 0, 0, 0, 0, NULL, '31', 0.167, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Teigan' AND p.last_name = 'Munce' AND t.name = 'Derby Twins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 2, 0, 0.000, 0, 0, 0, 0, NULL, '2', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jackson' AND p.last_name = 'Ellison' AND t.name = 'Derby Twins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0.000, 1, 0, 0, 1, 0.333, 0, 0, 0, 0, NULL, '20', 0.000, 0, 0.889
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Dawson' AND p.last_name = 'Robbins' AND t.name = 'Derby Twins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 15, 5, 6, 3, 1, 0, 2, 11, 0.733, 4, 4, 1, 0, 0.609, 0, 0, 0, 0, NULL, '23', 0.400, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Justin' AND p.last_name = 'Tucker' AND t.name = 'San Diego Stars';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 17, 5, 5, 0, 0, 0, 2, 5, 0.294, 5, 1, 2, 0, 0.478, 0, 0, 0, 0, NULL, '27', 0.294, 0, 0.950
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Logan' AND p.last_name = 'Aguilar' AND t.name = 'San Diego Stars';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 17, 3, 4, 0, 0, 0, 2, 4, 0.235, 2, 1, 1, 3, 0.350, 0, 1, 0, 0, NULL, '2', 0.235, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Ethan' AND p.last_name = 'Wright' AND t.name = 'San Diego Stars';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 14, 1, 3, 0, 0, 0, 2, 3, 0.214, 1, 2, 1, 0, 0.333, 1, 0, 0, 0, NULL, '34', 0.214, 0, 0.933
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Raph' AND p.last_name = 'Dunne' AND t.name = 'San Diego Stars';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 4, 17, 2, 3, 0, 0, 0, 4, 3, 0.176, 2, 1, 4, 0, 0.286, 1, 0, 0, 0, NULL, '4', 0.176, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Joe' AND p.last_name = 'Anderson' AND t.name = 'San Diego Stars';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 17, 5, 3, 0, 0, 1, 7, 6, 0.353, 2, 1, 8, 0, 0.273, 2, 0, 0, 0, NULL, '35', 0.176, 0, 0.968
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Frank' AND p.last_name = 'Giacalone' AND t.name = 'San Diego Stars';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 5, 5, 20, 3, 3, 0, 0, 0, 5, 3, 0.150, 1, 1, 3, 1, 0.227, 0, 1, 0, 0, NULL, '5', 0.150, 0, 0.971
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Landen' AND p.last_name = 'Bailey' AND t.name = 'San Diego Stars';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 4, 2, 3, 0, 0, 0, 2, 3, 0.750, 1, 0, 0, 0, 0.800, 0, 0, 0, 0, NULL, '44', 0.750, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Nico' AND p.last_name = 'Salmeri' AND t.name = 'San Diego Stars';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 9, 2, 3, 0, 0, 0, 2, 3, 0.333, 2, 0, 1, 1, 0.455, 0, 0, 0, 0, NULL, '13', 0.333, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Carter' AND p.last_name = 'Lockwood' AND t.name = 'San Diego Stars';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 3, 10, 3, 3, 0, 0, 0, 0, 3, 0.300, 2, 2, 5, 0, 0.500, 0, 0, 0, 0, NULL, '21', 0.300, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Will' AND p.last_name = 'James' AND t.name = 'San Diego Stars';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 4, 0, 1, 0, 0, 0, 0, 1, 0.250, 0, 0, 1, 0, 0.250, 0, 0, 0, 0, NULL, '30', 0.250, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kayden' AND p.last_name = 'Henson' AND t.name = 'San Diego Stars';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 3, 13, 0, 1, 1, 0, 0, 2, 2, 0.154, 0, 0, 4, 0, 0.077, 0, 0, 0, 0, NULL, '9', 0.077, 0, 0.667
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Gavin' AND p.last_name = 'Gamino' AND t.name = 'San Diego Stars';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0.000, 1, 0, 2, 0, 0.250, 0, 0, 0, 0, NULL, '19', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Mike' AND p.last_name = 'Clark' AND t.name = 'San Diego Stars';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 15, 4, 7, 1, 0, 0, 2, 8, 0.533, 3, 0, 0, 0, 0.556, 0, 0, 1, 1, NULL, '32', 0.467, 1, 0.944
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Peyton' AND p.last_name = 'Firgens' AND t.name = 'Junction City Brigade';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 19, 3, 7, 0, 0, 0, 2, 7, 0.368, 1, 1, 3, 0, 0.429, 0, 0, 1, 2, NULL, '10', 0.368, 2, 0.857
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Gannon' AND p.last_name = 'White' AND t.name = 'Junction City Brigade';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 17, 6, 5, 0, 0, 1, 3, 8, 0.471, 3, 0, 2, 0, 0.400, 0, 0, 3, 3, NULL, '7', 0.294, 3, 0.889
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Chad' AND p.last_name = 'Pantuso' AND t.name = 'Junction City Brigade';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 15, 2, 4, 1, 0, 0, 1, 5, 0.333, 2, 0, 6, 0, 0.353, 0, 0, 0, 0, NULL, '20', 0.267, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Brayden' AND p.last_name = 'Harpole' AND t.name = 'Junction City Brigade';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 17, 2, 4, 0, 0, 1, 5, 7, 0.412, 2, 0, 2, 1, 0.316, 0, 0, 2, 3, NULL, '38', 0.235, 3, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kyler' AND p.last_name = 'Horsman' AND t.name = 'Junction City Brigade';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 13, 2, 3, 2, 0, 0, 5, 5, 0.385, 3, 0, 0, 0, 0.375, 0, 0, 1, 1, NULL, '4', 0.231, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Ian' AND p.last_name = 'Luce' AND t.name = 'Junction City Brigade';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 15, 3, 2, 0, 0, 0, 1, 2, 0.133, 2, 3, 2, 0, 0.350, 0, 0, 4, 5, NULL, '3', 0.133, 5, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Gabe' AND p.last_name = 'Yonto' AND t.name = 'Junction City Brigade';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 11, 5, 1, 0, 0, 0, 1, 1, 0.091, 3, 3, 1, 1, 0.412, 0, 0, 2, 2, NULL, '40', 0.091, 2, 0.950
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Logan' AND p.last_name = 'Myers' AND t.name = 'Junction City Brigade';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 2, 8, 2, 3, 0, 0, 0, 2, 3, 0.375, 1, 1, 2, 1, 0.500, 0, 0, 0, 0, NULL, '5', 0.375, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Garryn' AND p.last_name = 'Plummer' AND t.name = 'Junction City Brigade';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 5, 0, 0, 0, 0, 0, 0, 0, 0.000, 2, 0, 0, 0, 0.286, 0, 0, 0, 0, NULL, '26', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Eli' AND p.last_name = 'Kellogg' AND t.name = 'Junction City Brigade';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, NULL, '8', 0.000, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Gus' AND p.last_name = 'Keller' AND t.name = 'Junction City Brigade';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 1, 0, 0.000, 0, 0, 1, 1, NULL, '11', 0.000, 1, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Gam' AND p.last_name = 'Jones' AND t.name = 'Junction City Brigade';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 14, 5, 8, 0, 0, 2, 4, 14, 1.000, 2, 0, 2, 0, 0.625, 0, 0, 1, 1, NULL, '22', 0.571, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Roman' AND p.last_name = 'Cariaga' AND t.name = 'Top Prospect Academy';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 14, 3, 6, 0, 0, 0, 0, 6, 0.429, 1, 1, 3, 0, 0.500, 0, 0, 2, 2, NULL, '7', 0.429, 2, 0.923
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jameson' AND p.last_name = 'Lucky' AND t.name = 'Top Prospect Academy';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 14, 1, 6, 1, 0, 0, 3, 7, 0.500, 2, 0, 2, 0, 0.471, 1, 0, 2, 3, NULL, '9', 0.429, 3, 0.909
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Aidan' AND p.last_name = 'LeMasters' AND t.name = 'Top Prospect Academy';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 15, 8, 5, 1, 0, 2, 5, 12, 0.800, 0, 3, 1, 0, 0.444, 0, 0, 0, 0, NULL, '13', 0.333, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Levi' AND p.last_name = 'Risenhoover' AND t.name = 'Top Prospect Academy';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 16, 2, 4, 1, 0, 0, 2, 5, 0.313, 1, 1, 2, 0, 0.333, 0, 0, 0, 1, NULL, '11', 0.250, 1, 0.917
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Luke' AND p.last_name = 'Regas' AND t.name = 'Top Prospect Academy';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 16, 1, 4, 1, 0, 0, 4, 5, 0.313, 1, 0, 8, 0, 0.294, 0, 0, 0, 0, NULL, '1', 0.250, 0, 0.800
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jaxon' AND p.last_name = 'James' AND t.name = 'Top Prospect Academy';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 9, 1, 2, 0, 0, 0, 0, 2, 0.222, 3, 1, 1, 2, 0.462, 0, 0, 1, 1, NULL, '14', 0.222, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Grant' AND p.last_name = 'Moore' AND t.name = 'Top Prospect Academy';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 15, 2, 3, 0, 0, 0, 2, 3, 0.200, 2, 0, 5, 0, 0.294, 0, 0, 1, 1, NULL, '16', 0.200, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Rohan' AND p.last_name = 'Culmer' AND t.name = 'Top Prospect Academy';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 0, 1, 0, 1, 1, 0, 0, 0, 2, 2.000, 0, 0, 0, 0, 1.000, 0, 0, 0, 0, NULL, '2', 1.000, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Justin' AND p.last_name = 'Vasquez' AND t.name = 'Top Prospect Academy';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 2, 8, 0, 2, 0, 0, 0, 1, 2, 0.250, 0, 0, 3, 0, 0.250, 0, 0, 1, 1, NULL, '12', 0.250, 1, 0.333
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Angel' AND p.last_name = 'Gutierrez' AND t.name = 'Top Prospect Academy';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 1, 5, 2, 1, 0, 0, 0, 0, 1, 0.200, 1, 1, 1, 1, 0.429, 0, 0, 0, 0, NULL, '23', 0.200, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Decarlo' AND p.last_name = 'Delancy' AND t.name = 'Top Prospect Academy';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 6, 0, 1, 0, 0, 0, 1, 1, 0.167, 2, 0, 4, 0, 0.375, 0, 0, 0, 0, NULL, '19', 0.167, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Hunter' AND p.last_name = 'Sandifer' AND t.name = 'Top Prospect Academy';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 12, 2, 3, 0, 0, 0, 0, 3, 0.250, 3, 0, 2, 0, 0.400, 0, 0, 1, 1, NULL, '17', 0.250, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jeffrey' AND p.last_name = 'Perran' AND t.name = 'Seattle Blackfins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 13, 1, 3, 0, 0, 0, 4, 3, 0.231, 1, 1, 0, 0, 0.313, 1, 0, 1, 1, NULL, '32', 0.231, 1, 0.964
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Paxton' AND p.last_name = 'Bigby' AND t.name = 'Seattle Blackfins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 14, 1, 3, 1, 0, 0, 1, 4, 0.286, 0, 1, 5, 0, 0.267, 0, 0, 0, 0, NULL, '24', 0.214, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'JT' AND p.last_name = 'Starkus' AND t.name = 'Seattle Blackfins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 11, 3, 2, 0, 0, 0, 0, 2, 0.182, 3, 1, 3, 0, 0.400, 0, 0, 0, 0, NULL, '18', 0.182, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Michael' AND p.last_name = 'Singleton' AND t.name = 'Seattle Blackfins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 14, 0, 2, 0, 0, 0, 0, 2, 0.143, 1, 0, 4, 0, 0.200, 0, 0, 0, 0, NULL, '7', 0.143, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Harrison' AND p.last_name = 'Kaufman' AND t.name = 'Seattle Blackfins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 2, 0, 1, 0, 0, 0, 0, 1, 0.500, 0, 0, 0, 1, 0.500, 0, 0, 0, 0, NULL, '28', 0.500, 0, 0.909
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Breadon' AND p.last_name = 'Requa' AND t.name = 'Seattle Blackfins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 5, 1, 2, 0, 0, 0, 1, 2, 0.400, 1, 0, 1, 0, 0.500, 0, 0, 0, 0, NULL, '3', 0.400, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Brayden' AND p.last_name = 'Larson' AND t.name = 'Seattle Blackfins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 3, 1, 1, 0, 0, 0, 1, 1, 0.333, 2, 0, 0, 0, 0.600, 0, 0, 1, 1, NULL, '50', 0.333, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Cole' AND p.last_name = 'Hoffman' AND t.name = 'Seattle Blackfins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 2, 8, 1, 2, 0, 1, 1, 4, 7, 0.875, 1, 0, 4, 0, 0.333, 0, 1, 1, 1, NULL, '16', 0.250, 1, 0.750
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Brody' AND p.last_name = 'Bluhm' AND t.name = 'Seattle Blackfins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 3, 8, 0, 2, 1, 0, 0, 0, 3, 0.375, 0, 2, 4, 1, 0.400, 0, 0, 0, 0, NULL, '13', 0.250, 0, 0.800
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Joshua' AND p.last_name = 'Williams' AND t.name = 'Seattle Blackfins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 5, 1, 1, 0, 0, 0, 0, 1, 0.200, 1, 2, 3, 0, 0.500, 0, 0, 1, 2, NULL, '42', 0.200, 2, 0.833
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Joshua' AND p.last_name = 'Carter' AND t.name = 'Seattle Blackfins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 8, 2, 1, 0, 0, 0, 0, 1, 0.125, 1, 0, 0, 0, 0.222, 0, 0, 0, 0, NULL, '6', 0.125, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Cooper' AND p.last_name = 'Barrow' AND t.name = 'Seattle Blackfins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 5, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 4, 0, 0.000, 0, 0, 0, 0, NULL, '5', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Keegan' AND p.last_name = 'Agen' AND t.name = 'Seattle Blackfins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 3, 0, 0.000, 0, 0, 0, 0, NULL, '34', 0.000, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jordan' AND p.last_name = 'Singleton' AND t.name = 'Seattle Blackfins';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 12, 2, 5, 0, 0, 0, 3, 5, 0.417, 3, 0, 1, 0, 0.533, 0, 0, 0, 0, NULL, '20', 0.417, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Tony' AND p.last_name = 'DeJesus' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 12, 3, 5, 1, 0, 1, 3, 9, 0.750, 2, 2, 3, 1, 0.563, 0, 0, 0, 0, NULL, '8', 0.417, 0, 0.850
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Robby' AND p.last_name = 'Lopez' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 10, 4, 4, 1, 0, 0, 1, 5, 0.500, 1, 1, 1, 1, 0.500, 0, 0, 0, 0, NULL, '44', 0.400, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'John' AND p.last_name = 'Gonzales' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 18, 2, 4, 1, 0, 1, 5, 8, 0.444, 0, 0, 4, 0, 0.222, 0, 0, 0, 0, NULL, '9', 0.222, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'DJ' AND p.last_name = 'Pinkerton' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 11, 2, 2, 0, 0, 0, 0, 2, 0.182, 4, 1, 4, 0, 0.438, 0, 0, 0, 2, NULL, '32', 0.182, 2, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Ben' AND p.last_name = 'Merriman' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 12, 3, 2, 0, 0, 0, 1, 2, 0.167, 2, 2, 3, 0, 0.375, 0, 0, 0, 0, NULL, '11', 0.167, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Sage' AND p.last_name = 'Sanders' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 10, 3, 1, 0, 0, 0, 1, 1, 0.100, 2, 1, 0, 0, 0.308, 0, 0, 0, 1, NULL, '2', 0.100, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Maverick' AND p.last_name = 'McAllist' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 4, 4, 16, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 1, 4, 0, 0.059, 0, 0, 0, 1, NULL, '29', 0.000, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Nico' AND p.last_name = 'Ruedas' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 9, 2, 6, 0, 0, 0, 5, 6, 0.667, 1, 0, 0, 0, 0.636, 1, 0, 1, 1, NULL, '5', 0.667, 1, 0.833
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Matthew' AND p.last_name = 'Fletcher' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 5, 1, 1, 0, 0, 0, 0, 1, 0.200, 0, 1, 3, 0, 0.333, 0, 0, 0, 0, NULL, '28', 0.200, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Travis' AND p.last_name = 'Starkey' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0.000, 1, 0, 2, 0, 0.333, 0, 0, 0, 0, NULL, '12', 0.000, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'David' AND p.last_name = 'Fluitt' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 0, 1, 0.000, 0, 0, 0, 0, NULL, '4', 0.000, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Owen' AND p.last_name = 'Curtis' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 9, 1, 5, 1, 0, 0, 1, 6, 0.667, 1, 1, 2, 0, 0.636, 0, 0, 0, 0, NULL, '19', 0.556, 0, 0.909
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kayne' AND p.last_name = 'Carlos' AND t.name = 'Dodge City A''s';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 11, 1, 4, 2, 0, 0, 3, 6, 0.545, 0, 0, 0, 0, 0.333, 1, 0, 0, 0, NULL, '27', 0.364, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Matt' AND p.last_name = 'Perez' AND t.name = 'Dodge City A''s';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 11, 1, 3, 2, 0, 0, 1, 5, 0.455, 0, 1, 2, 0, 0.333, 0, 0, 1, 1, NULL, '16', 0.273, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Isaiah' AND p.last_name = 'Velazco' AND t.name = 'Dodge City A''s';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 9, 3, 2, 0, 0, 0, 1, 2, 0.222, 2, 0, 0, 0, 0.364, 0, 0, 2, 2, NULL, '15', 0.222, 2, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jacobe' AND p.last_name = 'Radcliffe' AND t.name = 'Dodge City A''s';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 8, 3, 1, 0, 1, 0, 1, 3, 0.375, 4, 1, 5, 0, 0.462, 0, 0, 0, 0, NULL, '6', 0.125, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Edward' AND p.last_name = 'Gregory Jr' AND t.name = 'Dodge City A''s';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 10, 3, 1, 0, 0, 0, 2, 1, 0.100, 1, 1, 1, 0, 0.250, 0, 0, 0, 0, NULL, '24', 0.100, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Blake' AND p.last_name = 'Coleman' AND t.name = 'Dodge City A''s';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1.000, 0, 0, 0, 0, 1.000, 0, 0, 0, 0, NULL, '21', 1.000, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Nolan' AND p.last_name = 'Huff' AND t.name = 'Dodge City A''s';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 2, 2, 1, 0, 0, 1, 5, 4, 2.000, 1, 1, 0, 0, 0.750, 0, 0, 0, 0, NULL, '10', 0.500, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Ryne' AND p.last_name = 'Buckley' AND t.name = 'Dodge City A''s';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 1, 4, 1, 1, 1, 0, 0, 3, 2, 0.500, 0, 1, 0, 0, 0.400, 0, 1, 0, 0, NULL, '9', 0.250, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Zach' AND p.last_name = 'Hoskins' AND t.name = 'Dodge City A''s';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 2, 5, 2, 1, 0, 0, 0, 0, 1, 0.200, 2, 0, 1, 0, 0.429, 0, 0, 0, 0, NULL, '13', 0.200, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Paxton' AND p.last_name = 'Huff' AND t.name = 'Dodge City A''s';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 2, 6, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 1, 4, 0, 0.143, 0, 0, 0, 0, NULL, '23', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jadin' AND p.last_name = 'Moreno' AND t.name = 'Dodge City A''s';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 1, 0, 0.000, 0, 0, 0, 0, NULL, '4', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Dominic' AND p.last_name = 'Roberts' AND t.name = 'Dodge City A''s';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, NULL, '1', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Edwin' AND p.last_name = 'Silverio' AND t.name = 'Dodge City A''s';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, NULL, '34', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kevin' AND p.last_name = 'Hammond' AND t.name = 'Dodge City A''s';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 5, 1, 2, 1, 0, 0, 1, 3, 0.600, 4, 0, 1, 0, 0.667, 0, 0, 0, 1, NULL, '6', 0.400, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Holden' AND p.last_name = 'Groebl' AND t.name = 'BTL Hornets';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 8, 2, 3, 0, 0, 0, 1, 3, 0.375, 1, 0, 3, 0, 0.444, 0, 0, 2, 2, NULL, '3', 0.375, 2, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Tyler' AND p.last_name = 'Coffin' AND t.name = 'BTL Hornets';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 8, 2, 2, 0, 0, 0, 0, 2, 0.250, 1, 0, 1, 0, 0.333, 0, 0, 0, 0, NULL, '1', 0.250, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Josh' AND p.last_name = 'Holmes' AND t.name = 'BTL Hornets';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 9, 1, 2, 1, 0, 0, 3, 3, 0.333, 0, 0, 0, 0, 0.222, 0, 0, 0, 0, NULL, '2', 0.222, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Cade' AND p.last_name = 'Martinez' AND t.name = 'BTL Hornets';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 7, 2, 1, 0, 0, 0, 0, 1, 0.143, 2, 0, 0, 0, 0.333, 0, 0, 1, 1, NULL, '24', 0.143, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Micah' AND p.last_name = 'Kobuszewski' AND t.name = 'BTL Hornets';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 5, 0, 0, 0, 0, 0, 1, 0, 0.000, 3, 0, 1, 0, 0.333, 1, 0, 0, 0, NULL, '7', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Quinn' AND p.last_name = 'Groebl' AND t.name = 'BTL Hornets';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 6, 1, 2, 0, 0, 0, 0, 2, 0.333, 1, 0, 2, 0, 0.429, 0, 0, 0, 0, NULL, '21', 0.333, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Eli' AND p.last_name = 'Sitzer' AND t.name = 'BTL Hornets';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 4, 1, 1, 0, 0, 0, 0, 1, 0.250, 0, 1, 2, 0, 0.400, 0, 0, 0, 0, NULL, '4', 0.250, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Clayton' AND p.last_name = 'Anderson' AND t.name = 'BTL Hornets';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 2, 7, 0, 1, 0, 0, 0, 2, 1, 0.143, 0, 0, 2, 0, 0.143, 0, 0, 0, 0, NULL, '18', 0.143, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Cooper' AND p.last_name = 'Schwindt' AND t.name = 'BTL Hornets';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 2, 0, 0.000, 0, 0, 0, 0, NULL, '5', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Tanner' AND p.last_name = 'Pachorek' AND t.name = 'BTL Hornets';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, NULL, '27', 0.000, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Gabe' AND p.last_name = 'Pitts' AND t.name = 'BTL Hornets';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 8, 1, 4, 0, 0, 0, 1, 4, 0.500, 0, 0, 2, 0, 0.500, 0, 0, 1, 1, NULL, '10', 0.500, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Hutch' AND p.last_name = 'Russell' AND t.name = 'MVP Oklahoma';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 5, 2, 2, 1, 0, 0, 2, 3, 0.600, 0, 1, 1, 0, 0.429, 1, 0, 0, 0, NULL, '19', 0.400, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Connor' AND p.last_name = 'Cavnar' AND t.name = 'MVP Oklahoma';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 5, 2, 2, 1, 0, 0, 0, 3, 0.600, 1, 2, 1, 0, 0.625, 0, 0, 0, 0, NULL, '40', 0.400, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Carson' AND p.last_name = 'Miller' AND t.name = 'MVP Oklahoma';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 7, 1, 2, 0, 0, 0, 2, 2, 0.286, 2, 0, 1, 0, 0.444, 0, 0, 0, 0, NULL, '2', 0.286, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Tanner' AND p.last_name = 'Norman' AND t.name = 'MVP Oklahoma';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 8, 2, 2, 1, 0, 0, 1, 3, 0.375, 1, 0, 0, 0, 0.333, 0, 0, 1, 1, NULL, '6', 0.250, 1, 0.889
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Rayner' AND p.last_name = 'Beene' AND t.name = 'MVP Oklahoma';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 8, 0, 0, 0, 0, 0, 1, 0, 0.000, 0, 1, 0, 0, 0.111, 0, 0, 0, 0, NULL, '8', 0.000, 0, 0.900
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Ashton' AND p.last_name = 'Hartwig' AND t.name = 'MVP Oklahoma';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 4, 1, 1, 0, 0, 0, 0, 1, 0.250, 1, 0, 1, 0, 0.400, 0, 0, 0, 0, NULL, '11', 0.250, 0, 0.857
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Eli' AND p.last_name = 'Hill' AND t.name = 'MVP Oklahoma';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 5, 0, 1, 0, 0, 0, 1, 1, 0.200, 0, 0, 2, 0, 0.200, 0, 0, 0, 0, NULL, '29', 0.200, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Brand' AND p.last_name = 'Wilson' AND t.name = 'MVP Oklahoma';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0.000, 1, 0, 1, 0, 0.200, 0, 0, 0, 0, NULL, '13', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Graham' AND p.last_name = 'Hylton' AND t.name = 'MVP Oklahoma';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 3, 0, 0.000, 0, 0, 0, 0, NULL, '32', 0.000, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Holden' AND p.last_name = 'Lough' AND t.name = 'MVP Oklahoma';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 3, 0, 0.000, 0, 0, 0, 0, NULL, '42', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Tanner' AND p.last_name = 'Fallwell' AND t.name = 'MVP Oklahoma';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 1, 0, 0.000, 0, 0, 0, 0, NULL, '7', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Creed' AND p.last_name = 'Muirhead' AND t.name = 'MVP Oklahoma';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 12, 2, 6, 2, 0, 0, 3, 8, 0.667, 3, 0, 5, 0, 0.600, 0, 0, 0, 1, NULL, '33', 0.500, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Dayton' AND p.last_name = 'Tockey' AND t.name = 'GPX TX Legends';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 2, 7, 5, 3, 2, 0, 0, 2, 5, 0.714, 1, 1, 1, 0, 0.556, 0, 0, 0, 0, NULL, '11', 0.429, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jackson' AND p.last_name = 'Rainey' AND t.name = 'GPX TX Legends';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 12, 1, 4, 2, 0, 0, 1, 6, 0.500, 0, 0, 1, 1, 0.333, 0, 0, 0, 0, NULL, '46', 0.333, 0, 0.960
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Raphael' AND p.last_name = 'Pelletier' AND t.name = 'GPX TX Legends';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 2, 6, 2, 2, 0, 0, 0, 2, 2, 0.333, 3, 0, 2, 0, 0.556, 0, 0, 0, 0, NULL, '28', 0.333, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Rhenn' AND p.last_name = 'Andrewartha' AND t.name = 'GPX TX Legends';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 2, 8, 1, 2, 1, 0, 0, 2, 3, 0.375, 1, 0, 4, 1, 0.300, 1, 0, 1, 2, NULL, '43', 0.250, 2, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Caleb' AND p.last_name = 'Small' AND t.name = 'GPX TX Legends';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 14, 3, 3, 2, 0, 0, 2, 5, 0.357, 0, 1, 4, 0, 0.267, 0, 0, 1, 1, NULL, '1', 0.214, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Joe' AND p.last_name = 'Sandusky' AND t.name = 'GPX TX Legends';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 14, 2, 3, 1, 0, 1, 4, 7, 0.500, 1, 0, 3, 0, 0.267, 0, 0, 1, 1, NULL, '14', 0.214, 1, 0.786
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Hudson' AND p.last_name = 'Hartgrove' AND t.name = 'GPX TX Legends';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 10, 4, 2, 2, 0, 0, 0, 4, 0.400, 3, 0, 1, 0, 0.385, 0, 1, 1, 2, NULL, '2', 0.200, 2, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Colby' AND p.last_name = 'Fowler' AND t.name = 'GPX TX Legends';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 3, 7, 1, 1, 0, 0, 0, 0, 1, 0.143, 2, 1, 3, 0, 0.400, 0, 0, 0, 0, NULL, '56', 0.143, 0, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Chase' AND p.last_name = 'Fricke' AND t.name = 'GPX TX Legends';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 1, 5, 1, 2, 0, 0, 0, 2, 2, 0.400, 1, 0, 1, 0, 0.500, 0, 0, 0, 0, NULL, '36', 0.400, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Nano' AND p.last_name = 'Mendoza' AND t.name = 'GPX TX Legends';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 3, 2, 6, 1, 2, 0, 0, 0, 2, 2, 0.333, 2, 0, 0, 0, 0.500, 0, 0, 2, 2, NULL, '5', 0.333, 2, 0.941
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'RJ' AND p.last_name = 'Cardenas' AND t.name = 'GPX TX Legends';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 0, 3, 1, 1, 0, 0, 0, 0, 1, 0.333, 1, 0, 0, 0, 0.500, 0, 0, 0, 1, NULL, '55', 0.333, 1, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Dyllon' AND p.last_name = 'King' AND t.name = 'GPX TX Legends';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0.000, 1, 0, 0, 0, 0.500, 0, 0, 0, 0, NULL, '6', 0.000, 0, NULL
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Xander' AND p.last_name = 'Covar' AND t.name = 'GPX TX Legends';
INSERT INTO batting_stats (player_id, team_id, season_key, year, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, cs, jersey_num, avg, sb_att, fld)
SELECT p.id, t.id, '2025', 2025, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, 0.000, 0, 0, 0, 0, NULL, '15', 0.000, 0, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Matthew' AND p.last_name = 'Pazak' AND t.name = 'GPX TX Legends';

-- Insert Pitching Stats
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 1, 1, 0, 0, 13.0, 9, 0, 0, 1, 17, 1, 0, 0, 0, 0, 0, 0, 0, '20', 1, 0, 47, 0.191
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Keegan' AND p.last_name = 'Demmer' AND t.name = 'Hutchinson Monarchs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 0, 0, 0, 0, 7.0, 1, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, '35', 0, 0, 22, 0.045
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'AJ' AND p.last_name = 'Mustow' AND t.name = 'Hutchinson Monarchs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 1, 0, 0, 0, 12.0, 7, 0, 0, 3, 10, 1, 0, 0, 1, 2, 0, 0, 0, '21', 1, 0, 41, 0.171
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jackson' AND p.last_name = 'Legg' AND t.name = 'Hutchinson Monarchs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.71, 1, 0, 2, 1, 0, 0, 0, 0, 12.2, 13, 2, 1, 3, 7, 3, 0, 0, 1, 1, 0, 0, 0, '11', 3, 0, 47, 0.277
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Joey' AND p.last_name = 'Senstock' AND t.name = 'Hutchinson Monarchs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 1.93, 1, 0, 2, 2, 0, 0, 0, 0, 9.1, 5, 2, 2, 5, 7, 1, 0, 0, 0, 1, 0, 0, 0, '33', 1, 0, 30, 0.167
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jake' AND p.last_name = 'Knox' AND t.name = 'Hutchinson Monarchs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 2.08, 0, 0, 3, 0, 0, 0, 0, 1, 4.1, 3, 1, 1, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, '2', 0, 0, 14, 0.214
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'JJ' AND p.last_name = 'Spafford' AND t.name = 'Hutchinson Monarchs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 5.63, 0, 0, 2, 0, 0, 0, 0, 0, 8.0, 11, 5, 5, 3, 2, 2, 0, 0, 1, 3, 0, 0, 0, '10', 2, 0, 33, 0.333
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Blake' AND p.last_name = 'Bradford' AND t.name = 'Hutchinson Monarchs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 7.36, 0, 0, 2, 0, 0, 0, 0, 0, 3.2, 6, 3, 3, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, '13', 1, 0, 16, 0.375
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Drew' AND p.last_name = 'Bugner' AND t.name = 'Hutchinson Monarchs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 9.00, 0, 0, 1, 0, 0, 0, 0, 0, 1.0, 3, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, '3', 0, 0, 6, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jarrett' AND p.last_name = 'Herrmann' AND t.name = 'Hutchinson Monarchs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 10.80, 0, 0, 1, 0, 0, 0, 0, 0, 1.2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, '14', 1, 0, 7, 0.286
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jaden' AND p.last_name = 'Gustafson' AND t.name = 'Hutchinson Monarchs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 13.50, 0, 0, 1, 0, 0, 0, 0, 0, 0.2, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, '18', 1, 0, 3, 0.333
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Dylan' AND p.last_name = 'Bell' AND t.name = 'Hutchinson Monarchs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '27', 0, 0, 2, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jake' AND p.last_name = 'Gutierrez' AND t.name = 'Hutchinson Monarchs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, NULL, 0, 0, 1, 0, 0, 0, 0, 0, 0.0, 3, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '36', 0, 0, 3, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Tyson' AND p.last_name = 'Vassart' AND t.name = 'Hutchinson Monarchs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 2, 0, 0, 0, 0, 11.0, 7, 0, 0, 2, 11, 1, 1, 0, 1, 0, 0, 0, 0, '5', 1, 1, 39, 0.179
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jacob' AND p.last_name = 'Manaska' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 0, 0, 0, 0, 6.0, 5, 0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, '45', 0, 0, 20, 0.250
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Josh' AND p.last_name = 'Livingston' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 0, 0, 0, 0, 5.0, 1, 0, 0, 0, 5, 0, 1, 0, 0, 0, 0, 0, 0, '0', 0, 1, 15, 0.067
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Grant' AND p.last_name = 'Nekuza' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 1.00, 1, 0, 3, 1, 0, 0, 0, 0, 9.0, 5, 2, 1, 0, 9, 0, 1, 0, 1, 1, 0, 0, 0, '21', 0, 1, 31, 0.161
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Major' AND p.last_name = 'Brignon' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 4.91, 0, 1, 3, 1, 0, 0, 0, 0, 7.1, 10, 4, 4, 4, 10, 2, 0, 0, 0, 0, 0, 0, 0, '56', 2, 0, 30, 0.333
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jax' AND p.last_name = 'Marshall' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 5.40, 0, 0, 2, 0, 0, 0, 0, 0, 1.2, 3, 1, 1, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, '1', 1, 0, 8, 0.375
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Chase' AND p.last_name = 'Pendley' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 6.00, 0, 0, 3, 0, 0, 0, 0, 1, 3.0, 4, 2, 2, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, '2', 1, 0, 13, 0.308
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kado' AND p.last_name = 'Robardy' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 6.75, 0, 0, 2, 0, 0, 0, 0, 0, 1.1, 3, 1, 1, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, '67', 1, 0, 6, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'JT' AND p.last_name = 'Simonelli' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 9.00, 0, 0, 1, 0, 0, 0, 0, 0, 1.0, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, '00', 0, 0, 5, 0.400
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Micah' AND p.last_name = 'Melott' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 10.80, 0, 1, 1, 1, 0, 0, 0, 0, 3.1, 7, 4, 4, 0, 3, 1, 0, 1, 1, 0, 0, 0, 0, '9', 1, 0, 17, 0.412
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Diego' AND p.last_name = 'Gonzalez' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 13.50, 0, 0, 1, 0, 0, 0, 0, 0, 0.2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '42', 0, 0, 2, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kenner' AND p.last_name = 'Lauterbach' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 13.50, 0, 0, 1, 0, 0, 0, 0, 0, 0.2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, '13', 0, 0, 2, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Preston' AND p.last_name = 'Curtis' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 18.00, 0, 0, 1, 0, 0, 0, 0, 0, 1.0, 2, 2, 2, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, '20', 1, 0, 5, 0.400
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Ethan' AND p.last_name = 'Ho' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 18.00, 0, 0, 1, 0, 0, 0, 0, 0, 1.0, 4, 2, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, '19', 0, 0, 6, 0.667
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Sage' AND p.last_name = 'Wimberly' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, '10', 1, 0, 2, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Dakota' AND p.last_name = 'Johnson' AND t.name = 'Lonestar Kraken TX';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 0, 0, 0, 0, 7.0, 3, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, '25', 0, 0, 24, 0.125
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Paul' AND p.last_name = 'Smith' AND t.name = 'Hays Larks';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 0, 0, 0, 0, 6.0, 4, 0, 0, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, '26', 0, 0, 21, 0.190
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Dylan' AND p.last_name = 'LaRue' AND t.name = 'Hays Larks';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 1.50, 1, 0, 2, 1, 1, 1, 0, 0, 12.0, 9, 2, 2, 1, 4, 2, 0, 0, 0, 0, 0, 0, 0, '21', 2, 0, 42, 0.214
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Lorenzo' AND p.last_name = 'Rios' AND t.name = 'Hays Larks';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 4.50, 0, 0, 2, 0, 0, 0, 0, 0, 2.0, 2, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, '15', 1, 0, 7, 0.286
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Thomas' AND p.last_name = 'Lyssy' AND t.name = 'Hays Larks';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 5.63, 0, 1, 3, 1, 0, 0, 0, 0, 8.0, 13, 7, 5, 2, 5, 2, 0, 2, 2, 1, 0, 0, 0, '24', 2, 0, 36, 0.361
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Julio' AND p.last_name = 'Ramos' AND t.name = 'Hays Larks';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 10.80, 0, 0, 2, 0, 0, 0, 0, 0, 1.2, 5, 2, 2, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, '5', 0, 0, 8, 0.625
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jackson' AND p.last_name = 'Babcock' AND t.name = 'Hays Larks';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 13.50, 0, 0, 1, 0, 0, 0, 0, 0, 0.2, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, '1', 0, 0, 3, 0.333
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'CJ' AND p.last_name = 'Reid' AND t.name = 'Hays Larks';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 22.50, 0, 0, 1, 0, 0, 0, 0, 0, 2.0, 6, 5, 5, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, '6', 0, 0, 12, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Taber' AND p.last_name = 'Stokes' AND t.name = 'Hays Larks';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 54.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 3, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '4', 0, 0, 4, 0.750
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Brady' AND p.last_name = 'Kreutzer' AND t.name = 'Hays Larks';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 2, 0, 0, 0, 0, 11.0, 4, 0, 0, 0, 16, 1, 0, 0, 0, 0, 0, 0, 0, '16', 1, 0, 36, 0.111
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jackson' AND p.last_name = 'Copeland' AND t.name = 'Seattle Studs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 1.29, 1, 0, 2, 1, 0, 0, 0, 0, 7.0, 4, 1, 1, 0, 10, 1, 0, 0, 0, 0, 0, 0, 0, '24', 1, 0, 25, 0.160
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Joel' AND p.last_name = 'Fernandez' AND t.name = 'Seattle Studs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 3.86, 0, 0, 2, 0, 0, 0, 0, 0, 4.2, 4, 2, 2, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, '4', 0, 0, 17, 0.235
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Bradley' AND p.last_name = 'Carl' AND t.name = 'Seattle Studs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 4.50, 0, 1, 2, 1, 0, 0, 0, 0, 6.0, 9, 5, 3, 1, 7, 1, 0, 0, 0, 0, 0, 0, 0, '8', 1, 0, 27, 0.333
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jake' AND p.last_name = 'Gallagher' AND t.name = 'Seattle Studs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 5.40, 1, 0, 2, 0, 0, 0, 0, 0, 3.1, 5, 2, 2, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, '3', 0, 0, 15, 0.333
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Tristan' AND p.last_name = 'Ringrose' AND t.name = 'Seattle Studs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 8.10, 0, 0, 2, 0, 0, 0, 0, 0, 3.1, 5, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, '7', 0, 0, 14, 0.357
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Chandler' AND p.last_name = 'Stocking' AND t.name = 'Seattle Studs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 10.80, 0, 1, 1, 1, 0, 0, 0, 0, 5.0, 12, 8, 6, 0, 5, 1, 1, 1, 2, 0, 0, 0, 0, '6', 1, 1, 25, 0.480
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Gage' AND p.last_name = 'Thompson' AND t.name = 'Seattle Studs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 13.50, 0, 0, 1, 0, 0, 0, 0, 0, 0.2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '5', 0, 0, 3, 0.667
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jack' AND p.last_name = 'Bergstrom' AND t.name = 'Seattle Studs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '27', 0, 0, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Chris' AND p.last_name = 'Parkin' AND t.name = 'Seattle Studs';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 0, 0, 0, 0, 6.0, 4, 0, 0, 0, 5, 1, 0, 0, 0, 0, 0, 0, 0, '11', 1, 0, 22, 0.182
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Alex' AND p.last_name = 'Garcia' AND t.name = 'Alaska Goldpanners';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 3.00, 1, 0, 2, 1, 0, 0, 0, 0, 6.0, 5, 2, 2, 3, 6, 0, 0, 0, 0, 0, 0, 0, 0, '8', 0, 0, 24, 0.208
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Sam' AND p.last_name = 'Stevenson' AND t.name = 'Alaska Goldpanners';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 6.00, 0, 0, 2, 0, 0, 0, 0, 0, 3.0, 5, 2, 2, 0, 4, 0, 0, 1, 0, 0, 0, 0, 0, '5', 0, 0, 14, 0.357
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Hunter' AND p.last_name = 'Friedberg' AND t.name = 'Alaska Goldpanners';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 7.71, 0, 1, 2, 1, 0, 0, 0, 0, 4.2, 8, 4, 4, 1, 2, 1, 0, 0, 0, 1, 0, 0, 0, '12', 1, 0, 21, 0.381
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'David' AND p.last_name = 'Shackelford' AND t.name = 'Alaska Goldpanners';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 13.50, 0, 0, 1, 0, 0, 0, 0, 0, 0.2, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, '16', 0, 0, 3, 0.333
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Vincent' AND p.last_name = 'Venverloh' AND t.name = 'Alaska Goldpanners';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, '35', 0, 0, 2, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jamie' AND p.last_name = 'Mullin' AND t.name = 'Alaska Goldpanners';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, '9', 0, 0, 2, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Cole' AND p.last_name = 'Clark' AND t.name = 'Alaska Goldpanners';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 0, 0, 0, 0, 6.0, 4, 0, 0, 1, 8, 1, 0, 0, 0, 0, 0, 0, 0, '5', 1, 0, 21, 0.190
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Sawyer' AND p.last_name = 'Farr' AND t.name = 'Santa Barbara Foresters';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 2.25, 1, 0, 2, 1, 0, 0, 0, 0, 4.0, 5, 1, 1, 1, 4, 2, 0, 0, 0, 1, 0, 0, 0, '23', 2, 0, 16, 0.313
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Easton' AND p.last_name = 'Moomau' AND t.name = 'Santa Barbara Foresters';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 3.00, 1, 0, 2, 1, 0, 0, 0, 0, 6.0, 6, 2, 2, 1, 6, 1, 0, 0, 1, 0, 0, 0, 0, '31', 1, 0, 22, 0.273
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jonny' AND p.last_name = 'Rodriguez' AND t.name = 'Santa Barbara Foresters';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 4.50, 0, 0, 2, 0, 0, 0, 0, 0, 2.0, 2, 1, 1, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, '12', 0, 0, 7, 0.286
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Xavier' AND p.last_name = 'Esquer' AND t.name = 'Santa Barbara Foresters';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 6.75, 0, 0, 1, 0, 0, 0, 0, 0, 1.1, 3, 1, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, '6', 0, 0, 6, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Brenton' AND p.last_name = 'Clark' AND t.name = 'Santa Barbara Foresters';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 7.71, 0, 1, 2, 1, 0, 0, 0, 0, 4.2, 8, 5, 4, 1, 5, 3, 0, 0, 2, 0, 0, 0, 0, '14', 3, 0, 21, 0.381
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Caleb' AND p.last_name = 'Hoover' AND t.name = 'Santa Barbara Foresters';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 9.00, 0, 0, 1, 0, 0, 0, 0, 0, 1.0, 1, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, '2', 0, 0, 4, 0.250
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Terrence' AND p.last_name = 'Kiel II' AND t.name = 'Santa Barbara Foresters';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 10.80, 0, 0, 1, 0, 0, 0, 0, 0, 1.2, 4, 2, 2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, '4', 0, 0, 8, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Caden' AND p.last_name = 'Miller' AND t.name = 'Santa Barbara Foresters';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 10.80, 0, 0, 1, 0, 0, 0, 0, 0, 1.2, 3, 2, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, '15', 0, 0, 7, 0.429
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Mic' AND p.last_name = 'Paul' AND t.name = 'Santa Barbara Foresters';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 2, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, '8', 0, 0, 3, 0.667
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Cole' AND p.last_name = 'Chamberlain' AND t.name = 'Santa Barbara Foresters';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, NULL, 0, 0, 1, 0, 0, 0, 0, 0, 0.0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, '17', 0, 0, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Zane' AND p.last_name = 'Becker' AND t.name = 'Santa Barbara Foresters';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 2, 1, 0, 0, 0, 12.0, 9, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, '20', 0, 0, 42, 0.214
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Dawson' AND p.last_name = 'Robbins' AND t.name = 'Derby Twins';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 0, 0, 0, 0, 5.0, 3, 0, 0, 1, 7, 0, 0, 0, 0, 0, 0, 0, 0, '31', 0, 0, 17, 0.176
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Teigan' AND p.last_name = 'Munce' AND t.name = 'Derby Twins';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 4.15, 1, 1, 3, 1, 0, 0, 0, 1, 8.2, 12, 5, 4, 1, 5, 3, 0, 0, 0, 0, 0, 0, 0, '2', 3, 0, 35, 0.343
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jackson' AND p.last_name = 'Ellison' AND t.name = 'Derby Twins';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 4.50, 0, 0, 2, 0, 0, 0, 0, 0, 2.0, 2, 1, 1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, '7', 0, 0, 7, 0.286
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kade' AND p.last_name = 'Sheldon' AND t.name = 'Derby Twins';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 9.00, 0, 0, 1, 0, 0, 0, 0, 0, 1.0, 3, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, '16', 0, 0, 5, 0.600
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Damian' AND p.last_name = 'Garcia' AND t.name = 'Derby Twins';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 9.00, 0, 0, 1, 0, 0, 0, 0, 0, 1.0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, '9', 1, 0, 4, 0.250
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jackson' AND p.last_name = 'Syring' AND t.name = 'Derby Twins';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 15.43, 0, 1, 2, 1, 0, 0, 0, 0, 4.2, 11, 9, 8, 2, 2, 5, 1, 0, 1, 0, 0, 0, 0, '5', 5, 1, 22, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kyle' AND p.last_name = 'Walker' AND t.name = 'Derby Twins';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '13', 0, 0, 2, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kole' AND p.last_name = 'Dudding' AND t.name = 'Derby Twins';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 0, 0, 0, 0, 5.0, 2, 0, 0, 1, 10, 0, 0, 0, 0, 0, 0, 0, 0, '34', 0, 0, 16, 0.125
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Raph' AND p.last_name = 'Dunne' AND t.name = 'San Diego Stars';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 2.25, 1, 0, 2, 1, 0, 0, 0, 0, 4.0, 5, 1, 1, 0, 3, 2, 0, 0, 0, 1, 0, 0, 0, '13', 2, 0, 15, 0.333
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Carter' AND p.last_name = 'Lockwood' AND t.name = 'San Diego Stars';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 6.75, 0, 0, 2, 0, 0, 0, 0, 0, 2.2, 5, 2, 2, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, '21', 0, 0, 12, 0.417
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Will' AND p.last_name = 'James' AND t.name = 'San Diego Stars';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 7.71, 0, 1, 2, 1, 0, 0, 0, 0, 4.2, 9, 4, 4, 1, 6, 1, 0, 1, 0, 2, 0, 0, 0, '5', 1, 0, 21, 0.429
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Landen' AND p.last_name = 'Bailey' AND t.name = 'San Diego Stars';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 10.12, 0, 1, 3, 1, 0, 0, 0, 0, 5.1, 11, 7, 6, 2, 4, 1, 0, 1, 1, 1, 0, 0, 0, '4', 1, 0, 25, 0.440
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Joe' AND p.last_name = 'Anderson' AND t.name = 'San Diego Stars';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 10.80, 0, 0, 1, 0, 0, 0, 0, 0, 1.2, 4, 2, 2, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, '2', 1, 0, 8, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Ethan' AND p.last_name = 'Wright' AND t.name = 'San Diego Stars';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 13.50, 0, 0, 1, 0, 0, 0, 0, 0, 0.2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '9', 0, 0, 3, 0.667
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Gavin' AND p.last_name = 'Gamino' AND t.name = 'San Diego Stars';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 18.00, 0, 0, 1, 0, 0, 0, 0, 0, 1.0, 3, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '30', 0, 0, 5, 0.600
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kayden' AND p.last_name = 'Henson' AND t.name = 'San Diego Stars';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '27', 0, 0, 2, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Logan' AND p.last_name = 'Aguilar' AND t.name = 'San Diego Stars';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 0, 0, 0, 0, 6.0, 1, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, '5', 0, 0, 19, 0.053
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Garryn' AND p.last_name = 'Plummer' AND t.name = 'Junction City Brigade';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 2.45, 1, 0, 2, 1, 0, 0, 0, 0, 7.1, 5, 2, 2, 0, 11, 1, 0, 0, 0, 0, 0, 0, 0, '26', 1, 0, 26, 0.192
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Eli' AND p.last_name = 'Kellogg' AND t.name = 'Junction City Brigade';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 5.40, 0, 0, 2, 0, 0, 0, 0, 1, 3.1, 4, 2, 2, 0, 2, 0, 0, 1, 1, 0, 0, 0, 0, '8', 0, 0, 13, 0.308
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Gus' AND p.last_name = 'Keller' AND t.name = 'Junction City Brigade';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 6.75, 0, 1, 2, 1, 0, 0, 0, 0, 5.1, 8, 4, 4, 1, 5, 2, 0, 2, 0, 1, 0, 0, 0, '11', 2, 0, 22, 0.364
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Gam' AND p.last_name = 'Jones' AND t.name = 'Junction City Brigade';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 9.00, 0, 0, 1, 0, 0, 0, 0, 0, 1.0, 2, 1, 1, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, '20', 1, 0, 5, 0.400
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Brayden' AND p.last_name = 'Harpole' AND t.name = 'Junction City Brigade';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 3, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, '10', 0, 0, 4, 0.750
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Gannon' AND p.last_name = 'White' AND t.name = 'Junction City Brigade';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, '4', 0, 0, 2, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Ian' AND p.last_name = 'Luce' AND t.name = 'Junction City Brigade';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 0, 0, 0, 0, 6.0, 4, 0, 0, 0, 8, 1, 0, 0, 0, 0, 0, 0, 0, '19', 1, 0, 21, 0.190
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Hunter' AND p.last_name = 'Sandifer' AND t.name = 'Top Prospect Academy';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 1.50, 1, 0, 2, 1, 0, 0, 0, 0, 6.0, 5, 1, 1, 1, 2, 1, 0, 0, 0, 1, 0, 0, 0, '23', 1, 0, 20, 0.250
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Decarlo' AND p.last_name = 'Delancy' AND t.name = 'Top Prospect Academy';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 2.25, 1, 0, 2, 1, 0, 0, 0, 0, 4.0, 2, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, '12', 0, 0, 13, 0.154
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Angel' AND p.last_name = 'Gutierrez' AND t.name = 'Top Prospect Academy';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 6.00, 0, 1, 2, 1, 0, 0, 0, 0, 6.0, 9, 4, 4, 1, 4, 1, 0, 1, 1, 0, 0, 0, 0, '14', 1, 0, 26, 0.346
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Grant' AND p.last_name = 'Moore' AND t.name = 'Top Prospect Academy';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 9.00, 0, 0, 1, 0, 0, 0, 0, 0, 1.0, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '11', 0, 0, 4, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Luke' AND p.last_name = 'Regas' AND t.name = 'Top Prospect Academy';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '7', 0, 0, 2, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jameson' AND p.last_name = 'Lucky' AND t.name = 'Top Prospect Academy';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '9', 0, 0, 2, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Aidan' AND p.last_name = 'LeMasters' AND t.name = 'Top Prospect Academy';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 0, 0, 0, 0, 6.0, 2, 0, 0, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, '16', 0, 0, 20, 0.100
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Brody' AND p.last_name = 'Bluhm' AND t.name = 'Seattle Blackfins';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 0, 0, 0, 0, 6.0, 4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, '3', 0, 0, 21, 0.190
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Brayden' AND p.last_name = 'Larson' AND t.name = 'Seattle Blackfins';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 2.45, 0, 0, 2, 0, 0, 0, 0, 1, 3.2, 2, 1, 1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, '42', 0, 0, 13, 0.154
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Joshua' AND p.last_name = 'Carter' AND t.name = 'Seattle Blackfins';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 6.75, 0, 1, 2, 1, 0, 0, 0, 0, 5.1, 11, 5, 4, 2, 3, 2, 1, 1, 1, 0, 0, 0, 0, '13', 2, 1, 25, 0.440
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Joshua' AND p.last_name = 'Williams' AND t.name = 'Seattle Blackfins';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 10.80, 0, 0, 1, 0, 0, 0, 0, 0, 1.2, 3, 2, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, '6', 0, 1, 7, 0.429
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Cooper' AND p.last_name = 'Barrow' AND t.name = 'Seattle Blackfins';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, '50', 0, 0, 2, 0.500
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Cole' AND p.last_name = 'Hoffman' AND t.name = 'Seattle Blackfins';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 0.00, 1, 0, 2, 1, 0, 0, 0, 0, 5.0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, '28', 0, 0, 15, 0.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Travis' AND p.last_name = 'Starkey' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 4.91, 1, 0, 2, 1, 0, 0, 0, 0, 3.2, 5, 2, 2, 2, 6, 0, 0, 1, 1, 1, 0, 0, 0, '12', 0, 0, 14, 0.357
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'David' AND p.last_name = 'Fluitt' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 5.40, 0, 0, 2, 0, 0, 0, 0, 1, 3.1, 4, 2, 2, 1, 4, 1, 0, 0, 0, 0, 0, 0, 0, '5', 1, 0, 13, 0.308
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Matthew' AND p.last_name = 'Fletcher' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 7.36, 0, 1, 2, 1, 0, 0, 0, 0, 3.2, 6, 3, 3, 2, 2, 0, 0, 0, 0, 1, 0, 0, 0, '4', 0, 0, 15, 0.400
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Owen' AND p.last_name = 'Curtis' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 10.80, 0, 0, 1, 0, 0, 0, 0, 0, 1.2, 3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, '20', 0, 0, 8, 0.375
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Tony' AND p.last_name = 'DeJesus' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 13.50, 0, 0, 1, 0, 0, 0, 0, 0, 0.2, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '29', 0, 0, 4, 0.750
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Nico' AND p.last_name = 'Ruedas' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 2, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, '32', 1, 0, 3, 0.667
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Ben' AND p.last_name = 'Merriman' AND t.name = 'Lonestar TX Baseball Club';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 2.25, 1, 0, 2, 1, 0, 0, 0, 0, 4.0, 4, 1, 1, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0, '13', 1, 0, 15, 0.267
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Paxton' AND p.last_name = 'Huff' AND t.name = 'Dodge City A''s';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 6.75, 1, 0, 2, 1, 0, 0, 0, 0, 4.0, 6, 3, 3, 1, 3, 2, 0, 0, 0, 0, 0, 0, 0, '4', 2, 0, 17, 0.353
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Dominic' AND p.last_name = 'Roberts' AND t.name = 'Dodge City A''s';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 10.80, 0, 1, 2, 1, 0, 0, 0, 0, 5.0, 8, 6, 6, 2, 5, 2, 0, 0, 3, 1, 0, 0, 0, '9', 2, 0, 22, 0.364
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Zach' AND p.last_name = 'Hoskins' AND t.name = 'Dodge City A''s';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 13.50, 0, 0, 1, 0, 0, 0, 0, 0, 0.2, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '10', 0, 0, 4, 0.750
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Ryne' AND p.last_name = 'Buckley' AND t.name = 'Dodge City A''s';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 18.00, 0, 0, 1, 0, 0, 0, 0, 0, 1.0, 3, 2, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, '23', 0, 0, 5, 0.600
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Jadin' AND p.last_name = 'Moreno' AND t.name = 'Dodge City A''s';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, NULL, 0, 0, 1, 0, 0, 0, 0, 0, 0.0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '34', 0, 0, 1, 1.000
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Kevin' AND p.last_name = 'Hammond' AND t.name = 'Dodge City A''s';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 2.25, 1, 0, 2, 1, 0, 0, 0, 0, 4.0, 3, 1, 1, 3, 7, 0, 0, 0, 0, 0, 0, 0, 0, '27', 0, 0, 14, 0.214
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Gabe' AND p.last_name = 'Pitts' AND t.name = 'BTL Hornets';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 7.36, 1, 0, 2, 1, 0, 0, 0, 0, 3.2, 8, 3, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, '4', 0, 0, 18, 0.444
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Clayton' AND p.last_name = 'Anderson' AND t.name = 'BTL Hornets';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 9.00, 0, 1, 2, 1, 0, 0, 0, 0, 4.0, 6, 4, 4, 1, 5, 1, 0, 0, 0, 0, 0, 0, 0, '5', 1, 0, 17, 0.353
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Tanner' AND p.last_name = 'Pachorek' AND t.name = 'BTL Hornets';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 3, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, '21', 1, 0, 4, 0.750
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Eli' AND p.last_name = 'Sitzer' AND t.name = 'BTL Hornets';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 4.50, 1, 0, 2, 1, 0, 0, 0, 0, 4.0, 4, 2, 2, 1, 3, 2, 0, 0, 0, 0, 0, 0, 0, '42', 2, 0, 15, 0.267
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Tanner' AND p.last_name = 'Fallwell' AND t.name = 'MVP Oklahoma';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 9.00, 0, 1, 2, 1, 0, 0, 0, 0, 4.0, 7, 4, 4, 1, 4, 1, 0, 0, 0, 0, 0, 0, 0, '13', 1, 0, 18, 0.389
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Graham' AND p.last_name = 'Hylton' AND t.name = 'MVP Oklahoma';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 18.00, 0, 0, 1, 0, 0, 0, 0, 0, 1.0, 4, 2, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, '29', 1, 0, 6, 0.667
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Brand' AND p.last_name = 'Wilson' AND t.name = 'MVP Oklahoma';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 2, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, '32', 1, 0, 3, 0.667
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Holden' AND p.last_name = 'Lough' AND t.name = 'MVP Oklahoma';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 2.25, 1, 0, 2, 1, 0, 0, 0, 0, 4.0, 1, 1, 1, 3, 5, 0, 0, 0, 0, 1, 0, 0, 0, '14', 0, 0, 13, 0.077
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Hudson' AND p.last_name = 'Hartgrove' AND t.name = 'GPX TX Legends';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 4.50, 1, 0, 2, 1, 0, 0, 0, 0, 4.0, 4, 2, 2, 2, 7, 1, 0, 1, 0, 0, 0, 0, 0, '5', 1, 0, 15, 0.267
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'RJ' AND p.last_name = 'Cardenas' AND t.name = 'GPX TX Legends';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 6.00, 0, 1, 2, 1, 0, 0, 0, 0, 6.0, 9, 4, 4, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, '55', 3, 0, 27, 0.333
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Dyllon' AND p.last_name = 'King' AND t.name = 'GPX TX Legends';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 18.00, 0, 0, 1, 0, 0, 0, 0, 0, 1.0, 3, 2, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, '2', 0, 0, 5, 0.600
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Colby' AND p.last_name = 'Fowler' AND t.name = 'GPX TX Legends';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 18.00, 0, 0, 1, 0, 0, 0, 0, 0, 1.0, 3, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '6', 0, 0, 5, 0.600
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Xander' AND p.last_name = 'Covar' AND t.name = 'GPX TX Legends';
INSERT INTO pitching_stats (player_id, team_id, season_key, year, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, jersey_num, doubles, triples, ab, b_avg)
SELECT p.id, t.id, '2025', 2025, 27.00, 0, 0, 1, 0, 0, 0, 0, 0, 0.1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, '43', 0, 0, 3, 0.667
FROM players p CROSS JOIN teams t
WHERE p.first_name = 'Caleb' AND p.last_name = 'Small' AND t.name = 'GPX TX Legends';

COMMIT;

SELECT '✅ 2025 NBC World Series data imported!' AS status;
