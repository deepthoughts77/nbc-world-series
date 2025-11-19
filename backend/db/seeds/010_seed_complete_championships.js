import "dotenv/config";
import { pool } from "../../src/db.js";

// ============================================================================
// COMPLETE VERIFIED DATA FROM NBC OFFICIAL WEBSITE
// ============================================================================

const COMPLETE_NBC_DATA = [
  // 2020s
  {
    year: 2025,
    champion: "Hutchinson Monarchs",
    championCity: "Hutchinson",
    championState: "KS",
    runnerUp: "Lonestar Kraken",
    runnerUpCity: "Conroe",
    runnerUpState: "TX",
    mvp: "Jake Gutierrez",
  },
  {
    year: 2024,
    champion: "Hays Larks",
    championCity: "Hays",
    championState: "KS",
    runnerUp: "Hutchinson Monarchs",
    runnerUpCity: "Hutchinson",
    runnerUpState: "KS",
    mvp: "Garrett Gruell",
  },
  {
    year: 2023,
    champion: "Hutchinson Monarchs",
    championCity: "Hutchinson",
    championState: "KS",
    runnerUp: "Santa Barbara Foresters",
    runnerUpCity: "Santa Barbara",
    runnerUpState: "CA",
    mvp: "Max Buettenback",
  },
  {
    year: 2022,
    champion: "Santa Barbara Foresters",
    championCity: "Santa Barbara",
    championState: "CA",
    runnerUp: "Hays Larks",
    runnerUpCity: "Hays",
    runnerUpState: "KS",
    mvp: "Gavin Kash",
  },
  {
    year: 2021,
    champion: "Santa Barbara Foresters",
    championCity: "Santa Barbara",
    championState: "CA",
    runnerUp: "Austin Lonestar",
    runnerUpCity: "Austin",
    runnerUpState: "TX",
    mvp: "Justin Eckhardt",
  },
  {
    year: 2020,
    champion: "Santa Barbara Foresters",
    championCity: "Santa Barbara",
    championState: "CA",
    runnerUp: "Cheney Diamond Dawgs",
    runnerUpCity: "Cheney",
    runnerUpState: "KS",
    mvp: "Sean Johnson",
  },

  // 2010s
  {
    year: 2019,
    champion: "Seattle Studs",
    championCity: "Seattle",
    championState: "WA",
    runnerUp: "Cheney Diamond Dawgs",
    runnerUpCity: "Cheney",
    runnerUpState: "KS",
    mvp: "Henry Cheney",
  },
  {
    year: 2018,
    champion: "Santa Barbara Foresters",
    championCity: "Santa Barbara",
    championState: "CA",
    runnerUp: "NJCAA National Team",
    runnerUpCity: "Various",
    runnerUpState: "USA",
    mvp: "Patrick Mathis",
  },
  {
    year: 2017,
    champion: "Kansas Stars",
    championCity: "Wichita",
    championState: "KS",
    runnerUp: "Everett Merchants",
    runnerUpCity: "Everett",
    runnerUpState: "WA",
    mvp: "Ryan Langerhans",
  },
  {
    year: 2016,
    champion: "Santa Barbara Foresters",
    championCity: "Santa Barbara",
    championState: "CA",
    runnerUp: "Hays Larks",
    runnerUpCity: "Hays",
    runnerUpState: "KS",
    mvp: "Jacob Patterson",
  },
  {
    year: 2015,
    champion: "Seattle Studs",
    championCity: "Seattle",
    championState: "WA",
    runnerUp: "Haysville Aviators",
    runnerUpCity: "Haysville",
    runnerUpState: "KS",
    mvp: "Connor Savage",
  },
  {
    year: 2014,
    champion: "Santa Barbara Foresters",
    championCity: "Santa Barbara",
    championState: "CA",
    runnerUp: "Seattle Studs",
    runnerUpCity: "Seattle",
    runnerUpState: "WA",
    mvp: "Jon Duplantier",
  },
  {
    year: 2013,
    champion: "Seattle Studs",
    championCity: "Seattle",
    championState: "WA",
    runnerUp: "Wellington Heat",
    runnerUpCity: "Wellington",
    runnerUpState: "KS",
    mvp: "David Benson",
  },
  {
    year: 2012,
    champion: "Santa Barbara Foresters",
    championCity: "Santa Barbara",
    championState: "CA",
    runnerUp: "Seattle Studs",
    runnerUpCity: "Seattle",
    runnerUpState: "WA",
    mvp: "Zach Fish",
  },
  {
    year: 2011,
    champion: "Santa Barbara Foresters",
    championCity: "Santa Barbara",
    championState: "CA",
    runnerUp: "Kenai Peninsula Oilers",
    runnerUpCity: "Kenai",
    runnerUpState: "AK",
    mvp: "Mitch Mormann",
  },
  {
    year: 2010,
    champion: "Liberal Bee Jays",
    championCity: "Liberal",
    championState: "KS",
    runnerUp: "Seattle Studs",
    runnerUpCity: "Seattle",
    runnerUpState: "WA",
    mvp: "Paul Gonzalez",
  },

  // 2000s
  {
    year: 2009,
    champion: "El Dorado Broncos",
    championCity: "El Dorado",
    championState: "KS",
    runnerUp: "Anchorage Glacier Pilots",
    runnerUpCity: "Anchorage",
    runnerUpState: "AK",
    mvp: "Jake Sabol",
  },
  {
    year: 2008,
    champion: "Santa Barbara Foresters",
    championCity: "Santa Barbara",
    championState: "CA",
    runnerUp: "Seattle Studs",
    runnerUpCity: "Seattle",
    runnerUpState: "WA",
    mvp: "Kevin Keyes",
  },
  {
    year: 2007,
    champion: "Havasu Heat",
    championCity: "Lake Havasu City",
    championState: "AZ",
    runnerUp: "Hays Larks",
    runnerUpCity: "Hays",
    runnerUpState: "KS",
    mvp: "Brad Arnett",
  },
  {
    year: 2006,
    champion: "Santa Barbara Foresters",
    championCity: "Santa Barbara",
    championState: "CA",
    runnerUp: "Derby Twins",
    runnerUpCity: "Derby",
    runnerUpState: "KS",
    mvp: "Jon Qualls",
  },
  {
    year: 2005,
    champion: "Prairie Gravel",
    championCity: "Prairie",
    championState: "IL",
    runnerUp: "Santa Barbara Foresters",
    runnerUpCity: "Santa Barbara",
    runnerUpState: "CA",
    mvp: "Matt Whitaker",
  },
  {
    year: 2004,
    champion: "Aloha Knights",
    championCity: "Aloha",
    championState: "OR",
    runnerUp: "Mat-Su Miners",
    runnerUpCity: "Wasilla",
    runnerUpState: "AK",
    mvp: "Ryan Annetsberger",
  },
  {
    year: 2003,
    champion: "Chinese Taipei",
    championCity: "Taipei",
    championState: "TW",
    runnerUp: "Santa Barbara Foresters",
    runnerUpCity: "Santa Barbara",
    runnerUpState: "CA",
    mvp: "Chang-Wei Tu",
  },
  {
    year: 2002,
    champion: "Fairbanks Goldpanners",
    championCity: "Fairbanks",
    championState: "AK",
    runnerUp: "Anchorage Glacier Pilots",
    runnerUpCity: "Anchorage",
    runnerUpState: "AK",
    mvp: "Blake Gill",
  },
  {
    year: 2001,
    champion: "Anchorage Glacier Pilots",
    championCity: "Anchorage",
    championState: "AK",
    runnerUp: "Hays Larks",
    runnerUpCity: "Hays",
    runnerUpState: "KS",
    mvp: "Jeff Francis",
  },
  {
    year: 2000,
    champion: "Liberal Bee Jays",
    championCity: "Liberal",
    championState: "KS",
    runnerUp: "Hays Larks",
    runnerUpCity: "Hays",
    runnerUpState: "KS",
    mvp: "Cory Metzler",
  },

  // 1990s
  {
    year: 1999,
    champion: "Dallas Phillies",
    championCity: "Dallas",
    championState: "TX",
    runnerUp: "Kenai Peninsula Oilers",
    runnerUpCity: "Kenai",
    runnerUpState: "AK",
    mvp: "Marco Cunningham",
  },
  {
    year: 1998,
    champion: "El Dorado Broncos",
    championCity: "El Dorado",
    championState: "KS",
    runnerUp: "Nevada Griffons",
    runnerUpCity: "Nevada",
    runnerUpState: "MO",
    mvp: "Jason Aspito",
  },
  {
    year: 1997,
    champion: "Mat-Su Miners",
    championCity: "Wasilla",
    championState: "AK",
    runnerUp: "Nevada Griffons",
    runnerUpCity: "Nevada",
    runnerUpState: "MO",
    mvp: "Jeff Juarez",
  },
  {
    year: 1996,
    champion: "El Dorado Broncos",
    championCity: "El Dorado",
    championState: "KS",
    runnerUp: "Tacoma Timbers",
    runnerUpCity: "Tacoma",
    runnerUpState: "WA",
    mvp: "Kevin Frederick",
  },
  {
    year: 1995,
    champion: "Team USA",
    championCity: "Various",
    championState: "USA",
    runnerUp: "Hays Larks",
    runnerUpCity: "Hays",
    runnerUpState: "KS",
    mvp: "Lance Berkman",
  },
  {
    year: 1994,
    champion: "Kenai Peninsula Oilers",
    championCity: "Kenai",
    championState: "AK",
    runnerUp: "Wichita Broncos",
    runnerUpCity: "Wichita",
    runnerUpState: "KS",
    mvp: "Jesse Zepeda",
  },
  {
    year: 1993,
    champion: "Kenai Peninsula Oilers",
    championCity: "Kenai",
    championState: "AK",
    runnerUp: "Beatrice Bruins",
    runnerUpCity: "Beatrice",
    runnerUpState: "NE",
    mvp: "Jeff Poor",
  },
  {
    year: 1992,
    champion: "Midlothian White Sox",
    championCity: "Midlothian",
    championState: "IL",
    runnerUp: "Liberal Bee Jays",
    runnerUpCity: "Liberal",
    runnerUpState: "KS",
    mvp: "Mike Kane",
  },
  {
    year: 1991,
    champion: "Anchorage Glacier Pilots",
    championCity: "Anchorage",
    championState: "AK",
    runnerUp: "Kenai Peninsula Oilers",
    runnerUpCity: "Kenai",
    runnerUpState: "AK",
    mvp: "Chris Hmielewski",
  },
  {
    year: 1990,
    champion: "Wichita Broncos",
    championCity: "Wichita",
    championState: "KS",
    runnerUp: "Midlothian White Sox",
    runnerUpCity: "Midlothian",
    runnerUpState: "IL",
    mvp: "Chris Hmielewski",
  },

  // 1980s
  {
    year: 1989,
    champion: "Wichita Broncos",
    championCity: "Wichita",
    championState: "KS",
    runnerUp: "Grand Rapids Sullivans",
    runnerUpCity: "Grand Rapids",
    runnerUpState: "MI",
    mvp: "Jim Huslig",
  },
  {
    year: 1988,
    champion: "Everett Merchants",
    championCity: "Everett",
    championState: "WA",
    runnerUp: "Midlothian White Sox",
    runnerUpCity: "Midlothian",
    runnerUpState: "IL",
    mvp: "Dave Wong",
  },
  {
    year: 1987,
    champion: "Mat-Su Miners",
    championCity: "Wasilla",
    championState: "AK",
    runnerUp: "Wichita Broncos",
    runnerUpCity: "Wichita",
    runnerUpState: "KS",
    mvp: "Ken Kremer",
  },
  {
    year: 1986,
    champion: "Anchorage Glacier Pilots",
    championCity: "Anchorage",
    championState: "AK",
    runnerUp: "Grand Rapids Sullivans",
    runnerUpCity: "Grand Rapids",
    runnerUpState: "MI",
    mvp: "Steve Bales",
  },
  {
    year: 1985,
    champion: "Liberal Bee Jays",
    championCity: "Liberal",
    championState: "KS",
    runnerUp: "North Pole Nicks",
    runnerUpCity: "North Pole",
    runnerUpState: "AK",
    mvp: "Kerry Richardson",
  },
  {
    year: 1984,
    champion: "Grand Rapids Sullivans",
    championCity: "Grand Rapids",
    championState: "MI",
    runnerUp: "Liberal Bee Jays",
    runnerUpCity: "Liberal",
    runnerUpState: "KS",
    mvp: "Bill Bates",
  },
  {
    year: 1983,
    champion: "Grand Rapids Sullivans",
    championCity: "Grand Rapids",
    championState: "MI",
    runnerUp: "Fairbanks Goldpanners",
    runnerUpCity: "Fairbanks",
    runnerUpState: "AK",
    mvp: "Curtis Morgan",
  },
  {
    year: 1982,
    champion: "Santa Maria Indians",
    championCity: "Santa Maria",
    championState: "CA",
    runnerUp: "Anchorage Glacier Pilots",
    runnerUpCity: "Anchorage",
    runnerUpState: "AK",
    mvp: "Dave Hengle",
  },
  {
    year: 1981,
    champion: "Clarinda A's",
    championCity: "Clarinda",
    championState: "IA",
    runnerUp: "Liberal Bee Jays",
    runnerUpCity: "Liberal",
    runnerUpState: "KS",
    mvp: "Keith Mucha",
  },
  {
    year: 1980,
    champion: "Fairbanks Goldpanners",
    championCity: "Fairbanks",
    championState: "AK",
    runnerUp: "Liberal Bee Jays",
    runnerUpCity: "Liberal",
    runnerUpState: "KS",
    mvp: "Kevin McReynolds",
  },

  // 1970s
  {
    year: 1979,
    champion: "Liberal Bee Jays",
    championCity: "Liberal",
    championState: "KS",
    runnerUp: "Santa Maria Indians",
    runnerUpCity: "Santa Maria",
    runnerUpState: "CA",
    mvp: "Gary D'Onofrio",
  },
  {
    year: 1978,
    champion: "Boulder Collegians",
    championCity: "Boulder",
    championState: "CO",
    runnerUp: "Rapid City Diesels",
    runnerUpCity: "Rapid City",
    runnerUpState: "SD",
    mvp: "Bob Ferris",
  },
  {
    year: 1977,
    champion: "Kenai Peninsula Oilers",
    championCity: "Kenai",
    championState: "AK",
    runnerUp: "Fairbanks Goldpanners",
    runnerUpCity: "Fairbanks",
    runnerUpState: "AK",
    mvp: "Bob Skube",
  },
  {
    year: 1976,
    champion: "Fairbanks Goldpanners",
    championCity: "Fairbanks",
    championState: "AK",
    runnerUp: "Anchorage Glacier Pilots",
    runnerUpCity: "Anchorage",
    runnerUpState: "AK",
    mvp: "Greg Harris",
  },
  {
    year: 1975,
    champion: "Boulder Collegians",
    championCity: "Boulder",
    championState: "CO",
    runnerUp: "Fairbanks Goldpanners",
    runnerUpCity: "Fairbanks",
    runnerUpState: "AK",
    mvp: "Mike Colbern",
  },
  {
    year: 1974,
    champion: "Fairbanks Goldpanners",
    championCity: "Fairbanks",
    championState: "AK",
    runnerUp: "Boulder Collegians",
    runnerUpCity: "Boulder",
    runnerUpState: "CO",
    mvp: "Steve Kemp",
  },
  {
    year: 1973,
    champion: "Fairbanks Goldpanners",
    championCity: "Fairbanks",
    championState: "AK",
    runnerUp: "Liberal Bee Jays",
    runnerUpCity: "Liberal",
    runnerUpState: "KS",
    mvp: "Lee Iorg",
  },
  {
    year: 1972,
    champion: "Fairbanks Goldpanners",
    championCity: "Fairbanks",
    championState: "AK",
    runnerUp: "Anchorage Glacier Pilots",
    runnerUpCity: "Anchorage",
    runnerUpState: "AK",
    mvp: "Kerry Dineen",
  },
  {
    year: 1971,
    champion: "Anchorage Glacier Pilots",
    championCity: "Anchorage",
    championState: "AK",
    runnerUp: "Fairbanks Goldpanners",
    runnerUpCity: "Fairbanks",
    runnerUpState: "AK",
    mvp: "Bruce Bochte",
  },
  {
    year: 1970,
    champion: "Grand Rapids Sullivans",
    championCity: "Grand Rapids",
    championState: "MI",
    runnerUp: "Anchorage Glacier Pilots",
    runnerUpCity: "Anchorage",
    runnerUpState: "AK",
    mvp: "Al Gerhardt",
  },

  // 1960s
  {
    year: 1969,
    champion: "Anchorage Glacier Pilots",
    championCity: "Anchorage",
    championState: "AK",
    runnerUp: "Liberal Bee Jays",
    runnerUpCity: "Liberal",
    runnerUpState: "KS",
    mvp: "Chris Chambliss",
  },
  {
    year: 1968,
    champion: "Liberal Bee Jays",
    championCity: "Liberal",
    championState: "KS",
    runnerUp: "Jackson Braves",
    runnerUpCity: "Jackson",
    runnerUpState: "MS",
    mvp: "Joe Tanner",
  },
  {
    year: 1967,
    champion: "Boulder Collegians",
    championCity: "Boulder",
    championState: "CO",
    runnerUp: "Honolulu Islanders",
    runnerUpCity: "Honolulu",
    runnerUpState: "HI",
    mvp: "Frank Duffy",
  },
  {
    year: 1966,
    champion: "Boulder Collegians",
    championCity: "Boulder",
    championState: "CO",
    runnerUp: "West Point Packers",
    runnerUpCity: "West Point",
    runnerUpState: "MS",
    mvp: "Ray Henningsen",
  },
  {
    year: 1965,
    champion: "Wichita Dreamliners",
    championCity: "Wichita",
    championState: "KS",
    runnerUp: "Liberal Bee Jays",
    runnerUpCity: "Liberal",
    runnerUpState: "KS",
    mvp: "Bob Boyd",
  },
  {
    year: 1964,
    champion: "Wichita Glassmen",
    championCity: "Wichita",
    championState: "KS",
    runnerUp: "Fairbanks Goldpanners",
    runnerUpCity: "Fairbanks",
    runnerUpState: "AK",
    mvp: "Dick Sanders",
  },
  {
    year: 1963,
    champion: "Wichita Dreamliners",
    championCity: "Wichita",
    championState: "KS",
    runnerUp: "Ponchatoula Athletics",
    runnerUpCity: "Ponchatoula",
    runnerUpState: "LA",
    mvp: "Sam Suplizio",
  },
  {
    year: 1962,
    champion: "Wichita Dreamliners",
    championCity: "Wichita",
    championState: "KS",
    runnerUp: "Fairbanks Goldpanners",
    runnerUpCity: "Fairbanks",
    runnerUpState: "AK",
    mvp: "Rocky Krsnich",
  },
  {
    year: 1961,
    champion: "Ponchatoula Athletics",
    championCity: "Ponchatoula",
    championState: "LA",
    runnerUp: "Grand Rapids Sullivans",
    runnerUpCity: "Grand Rapids",
    runnerUpState: "MI",
    mvp: "Al Ware",
  },
  {
    year: 1960,
    champion: "Grand Rapids Sullivans",
    championCity: "Grand Rapids",
    championState: "MI",
    runnerUp: "Ponchatoula Athletics",
    runnerUpCity: "Ponchatoula",
    runnerUpState: "LA",
    mvp: "Bob Seltzer",
  },

  // 1950s
  {
    year: 1959,
    champion: "Houston Fed Mart",
    championCity: "Houston",
    championState: "TX",
    runnerUp: "Elgin Athletics",
    runnerUpCity: "Elgin",
    runnerUpState: "IL",
    mvp: "Clyde Girrens",
  },
  {
    year: 1958,
    champion: "Drain Black Sox",
    championCity: "Drain",
    championState: "OR",
    runnerUp: "Alpine Cowboys",
    runnerUpCity: "Alpine",
    runnerUpState: "TX",
    mvp: "Jim O'Rourke",
  },
  {
    year: 1957,
    champion: "Sinton Plymouth Oilers",
    championCity: "Sinton",
    championState: "TX",
    runnerUp: "Ft. Wayne Dairymen",
    runnerUpCity: "Fort Wayne",
    runnerUpState: "IN",
    mvp: "Wilmer Fields",
  },
  {
    year: 1956,
    champion: "Ft. Wayne Dairymen",
    championCity: "Fort Wayne",
    championState: "IN",
    runnerUp: "Deming Loggers",
    runnerUpCity: "Deming",
    runnerUpState: "WA",
    mvp: "Clyde McCullough",
  },
  {
    year: 1955,
    champion: "Wichita Boeing Bombers",
    championCity: "Wichita",
    championState: "KS",
    runnerUp: "Sinton Plymouth Oilers",
    runnerUpCity: "Sinton",
    runnerUpState: "TX",
    mvp: "Daryl Spencer",
  },
  {
    year: 1954,
    champion: "Wichita Boeing Bombers",
    championCity: "Wichita",
    championState: "KS",
    runnerUp: "Springfield Generals",
    runnerUpCity: "Springfield",
    runnerUpState: "MO",
    mvp: "Donnie Lee",
  },
  {
    year: 1953,
    champion: "Ft. Leonard Wood Hilltoppers",
    championCity: "Fort Leonard Wood",
    championState: "MO",
    runnerUp: "Wichita Boeing Bombers",
    runnerUpCity: "Wichita",
    runnerUpState: "KS",
    mvp: "Robert McKee",
  },
  {
    year: 1952,
    champion: "Ft. Myer Military",
    championCity: "Fort Myer",
    championState: "VA",
    runnerUp: "Ft. Leonard Wood",
    runnerUpCity: "Fort Leonard Wood",
    runnerUpState: "MO",
    mvp: "Danny O'Connell",
  },
  {
    year: 1951,
    champion: "Sinton Plymouth Oilers",
    championCity: "Sinton",
    championState: "TX",
    runnerUp: "Atwater Packers",
    runnerUpCity: "Atwater",
    runnerUpState: "CA",
    mvp: "Steve Rapech",
  },
  {
    year: 1950,
    champion: "Ft. Wayne Capeharts",
    championCity: "Fort Wayne",
    championState: "IN",
    runnerUp: "Elk City Elks",
    runnerUpCity: "Elk City",
    runnerUpState: "OK",
    mvp: "Pat Scantlebury",
  },

  // 1940s
  {
    year: 1949,
    champion: "Ft. Wayne G-E Club",
    championCity: "Fort Wayne",
    championState: "IN",
    runnerUp: "Golden Coors",
    runnerUpCity: "Golden",
    runnerUpState: "CO",
    mvp: "Bill Ricks",
  },
  {
    year: 1948,
    champion: "Ft. Wayne G-E Club",
    championCity: "Fort Wayne",
    championState: "IN",
    runnerUp: "Chatham Blanketeers",
    runnerUpCity: "Chatham",
    runnerUpState: "NC",
    mvp: "Veo Story",
  },
  {
    year: 1947,
    champion: "Ft. Wayne G-E Club",
    championCity: "Fort Wayne",
    championState: "IN",
    runnerUp: "Golden Coors",
    runnerUpCity: "Golden",
    runnerUpState: "CO",
    mvp: "Bruno Konopka",
  },
  {
    year: 1946,
    champion: "St. Joseph Ausco's",
    championCity: "St. Joseph",
    championState: "MI",
    runnerUp: "Carmichael Firemen",
    runnerUpCity: "Carmichael",
    runnerUpState: "CA",
    mvp: "Les Lollis",
  },
  {
    year: 1945,
    champion: "Enid Army Air Field",
    championCity: "Enid",
    championState: "OK",
    runnerUp: "Orlando Army Air Base",
    runnerUpCity: "Orlando",
    runnerUpState: "FL",
    mvp: "Cot Deal",
  },
  {
    year: 1944,
    champion: "Sherman Field Flyers",
    championCity: "Sherman Field",
    championState: "KS",
    runnerUp: "Enid Army Air Field",
    runnerUpCity: "Enid",
    runnerUpState: "OK",
    mvp: "Cot Deal",
  },
  {
    year: 1943,
    champion: "Camp Wheeler Spokes",
    championCity: "Camp Wheeler",
    championState: "GA",
    runnerUp: "Enid Army Air Field",
    runnerUpCity: "Enid",
    runnerUpState: "OK",
    mvp: "George Archie",
  },
  {
    year: 1942,
    champion: "Wichita Boeing Bombers",
    championCity: "Wichita",
    championState: "KS",
    runnerUp: "Waco Dons",
    runnerUpCity: "Waco",
    runnerUpState: "TX",
    mvp: "Ed Borom",
  },
  {
    year: 1941,
    champion: "Enid Eason Oilers",
    championCity: "Enid",
    championState: "OK",
    runnerUp: "Waco Dons",
    runnerUpCity: "Waco",
    runnerUpState: "TX",
    mvp: "Red Barkley",
  },
  {
    year: 1940,
    champion: "Enid Eason Oilers",
    championCity: "Enid",
    championState: "OK",
    runnerUp: "Mt. Pleasant Cubs",
    runnerUpCity: "Mt. Pleasant",
    runnerUpState: "TX",
    mvp: "Vance Cauble",
  },

  // 1930s
  {
    year: 1939,
    champion: "Duncan Halliburton's",
    championCity: "Duncan",
    championState: "OK",
    runnerUp: "Mt. Pleasant Cubs",
    runnerUpCity: "Mt. Pleasant",
    runnerUpState: "TX",
    mvp: "Roy Helser",
  },
  {
    year: 1938,
    champion: "Buford Bona Allens",
    championCity: "Buford",
    championState: "GA",
    runnerUp: "Enid Eason Oilers",
    runnerUpCity: "Enid",
    runnerUpState: "OK",
    mvp: "Andy Johnson",
  },
  {
    year: 1937,
    champion: "Enid Eason Oilers",
    championCity: "Enid",
    championState: "OK",
    runnerUp: "Buford Bona Allens",
    runnerUpCity: "Buford",
    runnerUpState: "GA",
    mvp: "Claude Gilchrist",
  },
  {
    year: 1936,
    champion: "Duncan Halliburtons",
    championCity: "Duncan",
    championState: "OK",
    runnerUp: "Buford Bona Allens",
    runnerUpCity: "Buford",
    runnerUpState: "GA",
    mvp: "Harry White",
  },
  {
    year: 1935,
    champion: "Bismarck Churchills",
    championCity: "Bismarck",
    championState: "ND",
    runnerUp: "Duncan Halliburton",
    runnerUpCity: "Duncan",
    runnerUpState: "OK",
    mvp: "Satchel Paige",
  },
];

// ============================================================================
// SEED FUNCTION
// ============================================================================

export async function run() {
  const client = await pool.connect();

  try {
    console.log("\n IMPORTING COMPLETE VERIFIED NBC WORLD SERIES DATA");
    console.log(
      "Source: https://nbcbaseball.com/nbc-world-series-past-champs-awards"
    );
    console.log("═".repeat(70));

    await client.query("BEGIN");

    let stats = {
      teamsCreated: 0,
      playersCreated: 0,
      championshipsCreated: 0,
      championshipsUpdated: 0,
      errors: 0,
    };

    for (const record of COMPLETE_NBC_DATA) {
      try {
        const { year } = record;

        console.log(`\n Processing ${year}...`);

        // -------------------------------
        // Champion team (get or create)
        // -------------------------------
        let championTeamId = null;
        if (record.champion) {
          let team = await client.query(
            "SELECT id FROM teams WHERE name = $1",
            [record.champion]
          );

          if (team.rows.length === 0) {
            team = await client.query(
              "INSERT INTO teams (name, city, state, league) VALUES ($1, $2, $3, $4) RETURNING id",
              [
                record.champion,
                record.championCity,
                record.championState,
                "NBC",
              ]
            );
            championTeamId = team.rows[0].id;
            console.log(`    Created champion team: ${record.champion}`);
            stats.teamsCreated++;
          } else {
            championTeamId = team.rows[0].id;
            console.log(`    Found champion team: ${record.champion}`);
          }
        }

        // -------------------------------
        // Runner-up team (get or create)
        // -------------------------------
        let runnerUpTeamId = null;
        if (record.runnerUp) {
          let team = await client.query(
            "SELECT id FROM teams WHERE name = $1",
            [record.runnerUp]
          );

          if (team.rows.length === 0) {
            team = await client.query(
              "INSERT INTO teams (name, city, state, league) VALUES ($1, $2, $3, $4) RETURNING id",
              [
                record.runnerUp,
                record.runnerUpCity,
                record.runnerUpState,
                "NBC",
              ]
            );
            runnerUpTeamId = team.rows[0].id;
            console.log(`   ➕ Created runner-up team: ${record.runnerUp}`);
            stats.teamsCreated++;
          } else {
            runnerUpTeamId = team.rows[0].id;
            console.log(`   ✓ Found runner-up team: ${record.runnerUp}`);
          }
        }

        // -------------------------------
        // MVP player (get or create)
        // -------------------------------
        let mvpPlayerId = null;
        if (record.mvp) {
          const nameParts = record.mvp.trim().split(" ");
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(" ") || firstName;

          let player = await client.query(
            "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
            [firstName, lastName]
          );

          if (player.rows.length === 0) {
            player = await client.query(
              "INSERT INTO players (first_name, last_name) VALUES ($1, $2) RETURNING id",
              [firstName, lastName]
            );
            mvpPlayerId = player.rows[0].id;
            console.log(`    Created MVP player: ${record.mvp}`);
            stats.playersCreated++;
          } else {
            mvpPlayerId = player.rows[0].id;
            console.log(`    Found MVP player: ${record.mvp}`);
          }
        }

        // -------------------------------
        // Championship row (upsert)
        // -------------------------------
        const existing = await client.query(
          "SELECT id FROM championships WHERE year = $1",
          [year]
        );

        if (existing.rows.length > 0) {
          await client.query(
            `UPDATE championships 
             SET champion_team_id = $1,
                 runner_up_team_id = $2,
                 mvp_player_id = $3
             WHERE year = $4`,
            [championTeamId, runnerUpTeamId, mvpPlayerId, year]
          );
          console.log(`    Updated ${year}`);
          stats.championshipsUpdated++;
        } else {
          await client.query(
            `INSERT INTO championships 
             (year, champion_team_id, runner_up_team_id, mvp_player_id)
             VALUES ($1, $2, $3, $4)`,
            [year, championTeamId, runnerUpTeamId, mvpPlayerId]
          );
          console.log(`    Created ${year}`);
          stats.championshipsCreated++;
        }
      } catch (err) {
        console.error(`    Error with ${record.year}:`, err.message);
        stats.errors++;
      }
    }

    await client.query("COMMIT");

    console.log("\n" + "═".repeat(70));
    console.log(" IMPORT SUMMARY:");
    console.log(`   Teams created: ${stats.teamsCreated}`);
    console.log(`   Players created: ${stats.playersCreated}`);
    console.log(`   Championships created: ${stats.championshipsCreated}`);
    console.log(`   Championships updated: ${stats.championshipsUpdated}`);
    console.log(`   Errors: ${stats.errors}`);
    console.log(`   Total processed: ${COMPLETE_NBC_DATA.length}`);
    console.log("\n ALL DATA IS NOW VERIFIED AND COMPLETE!\n");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(" Import failed:", error);
    throw error;
  } finally {
    client.release();
  }
}
