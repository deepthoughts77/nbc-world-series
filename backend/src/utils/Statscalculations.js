// utils/statsCalculations.js

/**
 * NBC World Series Statistics Utilities
 * Helper functions for calculating and formatting baseball statistics
 */

// ============================================================
// BATTING STATISTICS
// ============================================================

/**
 * Calculate On-Base Plus Slugging (OPS)
 * @param {number} obp - On-base percentage
 * @param {number} slg - Slugging percentage
 * @returns {number|null} OPS value
 */
export const calculateOPS = (obp, slg) => {
  if (obp == null || slg == null) return null;
  return parseFloat(obp) + parseFloat(slg);
};

/**
 * Calculate Batting Average (AVG)
 * @param {number} hits - Total hits
 * @param {number} atBats - At bats
 * @returns {number|null} Batting average
 */
export const calculateAVG = (hits, atBats) => {
  if (atBats == null || atBats === 0) return null;
  return hits / atBats;
};

/**
 * Calculate On-Base Percentage (OBP)
 * @param {number} h - Hits
 * @param {number} bb - Walks
 * @param {number} hbp - Hit by pitch
 * @param {number} ab - At bats
 * @param {number} sf - Sacrifice flies
 * @returns {number|null} On-base percentage
 */
export const calculateOBP = (h, bb, hbp, ab, sf) => {
  const denominator = ab + bb + hbp + (sf || 0);
  if (denominator === 0) return null;
  return (h + bb + hbp) / denominator;
};

/**
 * Calculate Slugging Percentage (SLG)
 * @param {number} tb - Total bases
 * @param {number} ab - At bats
 * @returns {number|null} Slugging percentage
 */
export const calculateSLG = (tb, ab) => {
  if (ab == null || ab === 0) return null;
  return tb / ab;
};

/**
 * Calculate Total Bases (TB)
 * @param {number} singles - Singles
 * @param {number} doubles - Doubles
 * @param {number} triples - Triples
 * @param {number} hr - Home runs
 * @returns {number} Total bases
 */
export const calculateTB = (singles, doubles, triples, hr) => {
  return (
    (singles || 0) + (doubles || 0) * 2 + (triples || 0) * 3 + (hr || 0) * 4
  );
};

/**
 * Calculate Isolated Power (ISO)
 * Measures raw power by subtracting AVG from SLG
 * @param {number} slg - Slugging percentage
 * @param {number} avg - Batting average
 * @returns {number|null} Isolated power
 */
export const calculateISO = (slg, avg) => {
  if (slg == null || avg == null) return null;
  return slg - avg;
};

// ============================================================
// PITCHING STATISTICS
// ============================================================

/**
 * Calculate Earned Run Average (ERA)
 * @param {number} er - Earned runs
 * @param {number} ip - Innings pitched
 * @returns {number|null} ERA
 */
export const calculateERA = (er, ip) => {
  if (ip == null || ip === 0) return null;
  return (er * 9) / ip;
};

/**
 * Calculate Walks plus Hits per Inning Pitched (WHIP)
 * @param {number} bb - Walks
 * @param {number} h - Hits allowed
 * @param {number} ip - Innings pitched
 * @returns {number|null} WHIP
 */
export const calculateWHIP = (bb, h, ip) => {
  if (ip == null || ip === 0) return null;
  return ((bb || 0) + (h || 0)) / ip;
};

/**
 * Calculate Strikeouts per 9 Innings (K/9)
 * @param {number} so - Strikeouts
 * @param {number} ip - Innings pitched
 * @returns {number|null} K/9
 */
export const calculateKPer9 = (so, ip) => {
  if (ip == null || ip === 0) return null;
  return (so * 9) / ip;
};

/**
 * Calculate Walks per 9 Innings (BB/9)
 * @param {number} bb - Walks
 * @param {number} ip - Innings pitched
 * @returns {number|null} BB/9
 */
export const calculateBBPer9 = (bb, ip) => {
  if (ip == null || ip === 0) return null;
  return (bb * 9) / ip;
};

/**
 * Calculate Strikeout-to-Walk Ratio (K/BB)
 * @param {number} so - Strikeouts
 * @param {number} bb - Walks
 * @returns {number|null} K/BB ratio
 */
export const calculateKBBRatio = (so, bb) => {
  if (bb == null || bb === 0) return null;
  return so / bb;
};

/**
 * Calculate Batting Average Against (BAA)
 * @param {number} h - Hits allowed
 * @param {number} ab - At bats against
 * @returns {number|null} BAA
 */
export const calculateBAA = (h, ab) => {
  if (ab == null || ab === 0) return null;
  return h / ab;
};

// ============================================================
// FORMATTING FUNCTIONS
// ============================================================

/**
 * Format batting average (remove leading zero)
 * @param {number} value - Numeric value
 * @returns {string} Formatted string (e.g., ".333")
 */
export const formatBattingAverage = (value) => {
  if (value == null) return "--";
  return value.toFixed(3).substring(1);
};

/**
 * Format percentage stat (OBP, SLG, etc.)
 * @param {number} value - Numeric value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted string
 */
export const formatPercentage = (value, decimals = 3) => {
  if (value == null) return "--";
  if (decimals === 3) {
    return value.toFixed(3).substring(1); // Remove leading zero
  }
  return value.toFixed(decimals);
};

/**
 * Format ERA or other rate stats
 * @param {number} value - Numeric value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted string
 */
export const formatRateStat = (value, decimals = 2) => {
  if (value == null) return "--";
  if (value === Infinity) return "∞";
  return value.toFixed(decimals);
};

/**
 * Format innings pitched (handle .1 and .2 for outs)
 * @param {number} ip - Innings pitched
 * @returns {string} Formatted string (e.g., "6.1" or "6⅓")
 */
export const formatInningsPitched = (ip, useFraction = false) => {
  if (ip == null) return "--";

  const whole = Math.floor(ip);
  const decimal = ip - whole;

  if (useFraction) {
    if (decimal === 0.1 || decimal === 0.1) return `${whole}⅓`;
    if (decimal === 0.2 || decimal === 0.2) return `${whole}⅔`;
    return ip.toFixed(1);
  }

  return ip.toFixed(1);
};

/**
 * Format integer stat (handle null/undefined)
 * @param {number} value - Integer value
 * @returns {string} Formatted string
 */
export const formatIntStat = (value) => {
  if (value == null) return "--";
  return value.toString();
};

/**
 * Format player name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {string} jerseyNum - Jersey number (optional)
 * @returns {string} Formatted name
 */
export const formatPlayerName = (firstName, lastName, jerseyNum = null) => {
  const name = `${firstName} ${lastName}`;
  if (jerseyNum) {
    return `${name} #${jerseyNum}`;
  }
  return name;
};

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

/**
 * Check if player qualifies for batting title
 * Typically 3.1 PA per team game (in MLB)
 * For NBC, we can use a simpler at-bat minimum
 * @param {number} ab - At bats
 * @param {number} minAB - Minimum at bats (default 10)
 * @returns {boolean} Whether player qualifies
 */
export const qualifiesForBattingTitle = (ab, minAB = 10) => {
  return ab >= minAB;
};

/**
 * Check if pitcher qualifies for ERA title
 * @param {number} ip - Innings pitched
 * @param {number} minIP - Minimum innings pitched (default 3)
 * @returns {boolean} Whether pitcher qualifies
 */
export const qualifiesForERATitle = (ip, minIP = 3) => {
  return ip >= minIP;
};

// ============================================================
// COMPARISON FUNCTIONS
// ============================================================

/**
 * Compare two stats for sorting (handles null values)
 * @param {number} a - First value
 * @param {number} b - Second value
 * @param {boolean} ascending - Sort direction
 * @returns {number} Comparison result
 */
export const compareStats = (a, b, ascending = false) => {
  // Handle null values (put them at the end)
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (ascending) {
    return a - b;
  }
  return b - a;
};

/**
 * Get stat color coding based on value
 * @param {number} value - Stat value
 * @param {string} statType - Type of stat
 * @returns {string} CSS class name
 */
export const getStatColorClass = (value, statType) => {
  if (value == null) return "stat-normal";

  switch (statType) {
    case "avg":
      if (value >= 0.4) return "stat-excellent";
      if (value >= 0.3) return "stat-good";
      if (value >= 0.25) return "stat-average";
      return "stat-poor";

    case "obp":
      if (value >= 0.45) return "stat-excellent";
      if (value >= 0.35) return "stat-good";
      if (value >= 0.3) return "stat-average";
      return "stat-poor";

    case "slg":
      if (value >= 0.55) return "stat-excellent";
      if (value >= 0.45) return "stat-good";
      if (value >= 0.35) return "stat-average";
      return "stat-poor";

    case "ops":
      if (value >= 0.9) return "stat-excellent";
      if (value >= 0.75) return "stat-good";
      if (value >= 0.65) return "stat-average";
      return "stat-poor";

    case "era":
      if (value <= 2.0) return "stat-excellent";
      if (value <= 3.5) return "stat-good";
      if (value <= 5.0) return "stat-average";
      return "stat-poor";

    case "whip":
      if (value <= 1.0) return "stat-excellent";
      if (value <= 1.3) return "stat-good";
      if (value <= 1.5) return "stat-average";
      return "stat-poor";

    default:
      return "stat-normal";
  }
};

// ============================================================
// EXPORT ALL
// ============================================================

export default {
  // Calculations - Batting
  calculateOPS,
  calculateAVG,
  calculateOBP,
  calculateSLG,
  calculateTB,
  calculateISO,

  // Calculations - Pitching
  calculateERA,
  calculateWHIP,
  calculateKPer9,
  calculateBBPer9,
  calculateKBBRatio,
  calculateBAA,

  // Formatting
  formatBattingAverage,
  formatPercentage,
  formatRateStat,
  formatInningsPitched,
  formatIntStat,
  formatPlayerName,

  // Validation
  qualifiesForBattingTitle,
  qualifiesForERATitle,

  // Comparison
  compareStats,
  getStatColorClass,
};
