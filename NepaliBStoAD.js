/**
 * NepaliDate - Nepali (Bikram Sambat) Date Conversion Library
 * Converts dates between BS (Bikram Sambat) and AD (Anno Domini)
 * 
 * @version 2.1.0
 * @license MIT
 * 
 * Usage:
 * - Google Sheets: Use BS_TO_AD() and AD_TO_BS() as custom functions
 * - Tampermonkey: @require this file, access via NepaliDate global
 * - Node.js: const NepaliDate = require('nepali-date-converter')
 * - Browser: <script src="..."></script>, access via window.NepaliDate
 */
(function (root, factory) {
  'use strict';
  
  // UMD (Universal Module Definition) pattern
  if (typeof module !== 'undefined' && module.exports) {
    // Node.js / CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD (RequireJS)
    define(factory);
  } else {
    // Browser global / Google Apps Script / Tampermonkey
    var lib = factory();
    
    // Export as NepaliDate namespace
    root.NepaliDate = lib;
    
    // Also expose individual functions globally for Google Sheets compatibility
    root.DateBS = lib.DateBS;
    root.BSMonths = lib.BSMonths;
    root.BS_TO_AD = lib.BS_TO_AD;
    root.AD_TO_BS = lib.AD_TO_BS;
  }
}(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  /**
   * Converts a date from Bikram Sambat (BS) to Anno Domini (AD).
   *
   * @param {string|Date|number} bsDate The date in BS format (YYYY-MM-DD).
   * @return {string} The date in AD format (YYYY-MM-DD).
   * @customfunction
   */
  function BS_TO_AD(bsDate) {
    if (!bsDate) {
      return null;
    }
    // Handle Google Sheets error values gracefully
    var errorValues = ['#REF!', '#VALUE!', '#N/A', '#DIV/0!', '#NAME?', '#NULL!'];
    if (typeof bsDate === 'string' && errorValues.indexOf(bsDate.trim().toUpperCase()) !== -1) {
      return '';
    }
    try {
      var bs = DateBS.fromString(bsDate);
      var ad = bs.toAD();
      var adYear = ad.getFullYear();
      var adMonth = ad.getMonth() + 1;
      var adDay = ad.getDate();
      return adYear + '-' + String(adMonth).padStart(2, '0') + '-' + String(adDay).padStart(2, '0');
    } catch (e) {
      return e.message || 'Invalid BS date format. Use YYYY-MM-DD or "YYYY MonthName DD".';
    }
  }

  /**
   * Converts a date from Anno Domini (AD) to Bikram Sambat (BS).
   *
   * @param {string|Date|number} adDate The date in AD format (YYYY-MM-DD) or Date object.
   * @param {boolean} [asObject=false] If true, returns DateBS object instead of string.
   * @return {string|DateBS} The date in BS format (YYYY-MM-DD) or DateBS object.
   * @customfunction
   */
  function AD_TO_BS(adDate, asObject) {
    if (!adDate) {
      // Return today's date in BS if no argument provided
      var bs = DateBS.fromAD(new Date());
      return asObject ? bs : bs.toString();
    }
    // Handle Google Sheets error values gracefully
    var errorValues = ['#REF!', '#VALUE!', '#N/A', '#DIV/0!', '#NAME?', '#NULL!'];
    if (typeof adDate === 'string' && errorValues.indexOf(adDate.trim().toUpperCase()) !== -1) {
      return '';
    }
    try {
      var date;
      if (adDate instanceof Date) {
        date = adDate;
      } else if (typeof adDate === 'number') {
        // Handle Google Sheets serial date number
        // Google Sheets epoch is December 30, 1899
        var sheetsEpoch = new Date(1899, 11, 30);
        date = new Date(sheetsEpoch.getTime() + adDate * 24 * 60 * 60 * 1000);
      } else if (typeof adDate === 'string') {
        // Parse string date
        var parsed = adDate.match(/(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
        if (parsed) {
          date = new Date(parseInt(parsed[1]), parseInt(parsed[2]) - 1, parseInt(parsed[3]));
        } else {
          date = new Date(adDate);
        }
      } else {
        date = new Date(adDate);
      }
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid AD date format. Use YYYY-MM-DD or Date object.');
      }
      
      var bs = DateBS.fromAD(date);
      return asObject ? bs : bs.toString();
    } catch (e) {
      return e.message || 'Invalid AD date format. Use YYYY-MM-DD or Date object.';
    }
  }

  /**
   * Get today's date in Bikram Sambat (BS).
   *
   * @param {boolean} [asObject=false] If true, returns DateBS object instead of string.
   * @return {string|DateBS} Today's date in BS format (YYYY-MM-DD) or DateBS object.
   */
  function todayBS(asObject) {
    var bs = DateBS.fromAD(new Date());
    return asObject ? bs : bs.toString();
  }

  /**
   * Validates a BS date without throwing an error.
   *
   * @param {string|number} bsDate The date in BS format (YYYY-MM-DD).
   * @return {boolean} True if the date is valid, false otherwise.
   */
  function isValidBS(bsDate) {
    try {
      DateBS.fromString(bsDate);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Validates an AD date for conversion to BS.
   *
   * @param {string|Date|number} adDate The date in AD format.
   * @return {boolean} True if the date can be converted to BS, false otherwise.
   */
  function isValidAD(adDate) {
    try {
      var result = AD_TO_BS(adDate);
      return result && !result.includes('Invalid') && !result.includes('Error');
    } catch (e) {
      return false;
    }
  }

  /**
   * no of days in months from year 2000 to 2100 BS
   * @constant
   **/
  var BSMonths = [
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2000
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2001
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2002
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2003
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2004
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2005
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2006
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2007
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2008
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2009
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2010
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2011
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2012
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2013
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2014
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2015
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2016
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2017
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2018
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2019
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2020
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2021
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2022
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2023
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2024
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2025
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2026
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2027
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2028
    [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30], // 2029
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2030
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2031
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2032
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2033
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2034
    [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31], // 2035
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2036
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2037
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2038
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2039
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2040
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2041
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2042
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2043
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2044
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2045
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2046
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2047
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2048
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2049
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2050
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2051
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2052
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2053
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2054
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2055
    [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30], // 2056
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2057
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2058
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2059
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2060
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2061
    [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31], // 2062
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2063
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2064
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2065
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31], // 2066
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2067
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2068
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2069
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2070
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2071
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2072
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2073
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2074
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2075
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2076
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2077
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2078
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2079
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2080
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2081
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2082
    [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30], // 2083
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2084
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 30, 29, 31], // 2085
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2086
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2087
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2088
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2089
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2090
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2091
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2092
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2093
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2094
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2095
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2096
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2097
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2098
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2099
  ];

  /**
   * Month names in English
   * @constant
   */
  var MONTH_NAMES_EN = ['Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];

  /**
   * Month names in Nepali
   * @constant
   */
  var MONTH_NAMES_NE = ['वैशाख', 'ज्येष्ठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कात्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'];

  /**
   * Weekday names in English
   * @constant
   */
  var WEEKDAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /**
   * Weekday names in Nepali
   * @constant
   */
  var WEEKDAY_NAMES_NE = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];

  /**
   * class that facilates in conversion of date from BS to AD and vice versa
   * @class DateBS
   **/
  function DateBS(year, month, day) {
    this.year = year;
    this.month = month;
    this.day = day;
    return this;
  }

  /**
   * create BS Date using string format %Y-%m-%d
   * @param {string} datestring: BS date in string format %Y-%m-%d
   * @static
   **/
  DateBS.fromString = function (datestring) {
    // Handle Google Sheets native Date object (which is AD, but user may enter BS date as date-formatted cell)
    if (Object.prototype.toString.call(datestring) === '[object Date]' && !isNaN(datestring)) {
      // Extract year, month, day as if the user entered a BS date in a date cell
      var year = datestring.getFullYear();
      var month = datestring.getMonth() + 1;
      var day = datestring.getDate();
      // Try to construct as BS date
      return new DateBS(year, month, day);
    }
    // Handle Google Sheets serial number (if user enters BS date as a number-formatted cell)
    if (typeof datestring === 'number') {
      // Google Sheets serial dates: 1 = 1899-12-31, but user may enter BS date as number (e.g., 20780101)
      // If it's 8 digits, treat as YYYYMMDD
      var numStr = String(datestring);
      if (/^\d{8}$/.test(numStr)) {
        var year = parseInt(numStr.slice(0, 4));
        var month = parseInt(numStr.slice(4, 6));
        var day = parseInt(numStr.slice(6, 8));
        return new DateBS(year, month, day);
      }
      // Otherwise, treat as string
      datestring = String(datestring);
    }
    // Convert to string to handle cases where input might be a date object or number
    var dateStr = String(datestring).trim();
    
    // Define month name mappings (both English and Nepali)
    var monthNames = {
      'baishakh': 1, 'बैशाख': 1, 'वैशाख': 1,
      'jestha': 2, 'jyestha': 2, 'ज्येष्ठ': 2,
      'ashadh': 3, 'asar': 3, 'असार': 3, 'आषाढ': 3,
      'shrawan': 4, 'saun': 4, 'साउन': 4, 'श्रावण': 4,
      'bhadra': 5, 'bhadau': 5, 'भदौ': 5, 'भाद्र': 5,
      'ashwin': 6, 'asoj': 6, 'असोज': 6, 'आश्विन': 6,
      'kartik': 7, 'कात्तिक': 7, 'कार्तिक': 7,
      'mangsir': 8, 'mangshir': 8, 'मंसिर': 8, 'मार्गशीर्ष': 8,
      'poush': 9, 'paush': 9, 'पुष': 9, 'पौष': 9,
      'magh': 10, 'माघ': 10,
      'falgun': 11, 'phalgun': 11, 'फागुन': 11, 'फाल्गुन': 11,
      'chaitra': 12, 'चैत': 12, 'चैत्र': 12
    };
    
    var year, month, day, info;
    
    // Try YYYY-MM-DD format first
    info = dateStr.match(/(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
    if (info) {
      year = parseInt(info[1]);
      month = parseInt(info[2]);
      day = parseInt(info[3]);
    } else {
      // Try "YYYY MonthName DD" format (e.g., "2048 Poush 12")
      info = dateStr.match(/(\d{4})\s+([a-zA-Zा-ौ]+)\s+(\d{1,2})/);
      if (info) {
        year = parseInt(info[1]);
        var monthStr = info[2].toLowerCase().trim();
        day = parseInt(info[3]);
        
        // Look up month number from month name
        month = monthNames[monthStr];
        if (!month) {
          throw new Error("Unknown month name: '" + info[2] + "'. Supported formats: YYYY-MM-DD or 'YYYY MonthName DD'");
        }
      } else {
        throw new Error("Invalid BS date format. Expected YYYY-MM-DD or 'YYYY MonthName DD' but got: '" + dateStr + "'");
      }
    }
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error('Invalid numbers in date: ' + dateStr);
    }
    if (year < 2000 || year > 2099) throw new Error('Year out of supported range (2000-2099 BS). Got: ' + year);
    if (month < 1 || month > 12) throw new Error('Month out of range (1-12). Got: ' + month);
    var yearIndex = year - 2000;
    if (yearIndex < 0 || yearIndex >= BSMonths.length) throw new Error('Year data not available for: ' + year);
    var maxDay = BSMonths[yearIndex][month - 1];
    if (day < 1 || day > maxDay) throw new Error('Day out of range for year ' + year + ' month ' + month + '. Max day is ' + maxDay + ' but got: ' + day);
    return new DateBS(year, month, day);
  };

  /**
   * converts BS Date to string with zero-padded month and day
   * @return {string} Date in YYYY-MM-DD format
   **/
  DateBS.prototype.toString = function () {
    return this.year + '-' + String(this.month).padStart(2, '0') + '-' + String(this.day).padStart(2, '0');
  };

  /**
   * Format the date using a pattern string
   * @param {string} pattern - Format pattern (YYYY=year, MM=month padded, M=month, DD=day padded, D=day, MMMM=month name, MMM=month name short, mmmm=nepali month)
   * @return {string} Formatted date string
   */
  DateBS.prototype.format = function (pattern) {
    if (!pattern) pattern = 'YYYY-MM-DD';
    
    var result = pattern;
    result = result.replace(/YYYY/g, this.year);
    result = result.replace(/YY/g, String(this.year).slice(-2));
    result = result.replace(/MMMM/g, MONTH_NAMES_EN[this.month - 1]);
    result = result.replace(/mmmm/g, MONTH_NAMES_NE[this.month - 1]);
    result = result.replace(/MMM/g, MONTH_NAMES_EN[this.month - 1].slice(0, 3));
    result = result.replace(/MM/g, String(this.month).padStart(2, '0'));
    result = result.replace(/M(?![a-zA-Z])/g, this.month);
    result = result.replace(/DD/g, String(this.day).padStart(2, '0'));
    result = result.replace(/D(?![a-zA-Z])/g, this.day);
    
    // Weekday (requires conversion to AD first)
    if (pattern.indexOf('dddd') !== -1 || pattern.indexOf('ddd') !== -1) {
      var adDate = this.toAD();
      var weekday = adDate.getDay();
      result = result.replace(/dddd/g, WEEKDAY_NAMES_EN[weekday]);
      result = result.replace(/ddd/g, WEEKDAY_NAMES_EN[weekday].slice(0, 3));
    }
    
    return result;
  };

  /**
   * get the day of the year
   **/
  DateBS.prototype.dayOfYear = function () {
    var months = this.monthsInYear();
    var sum = 0;
    for (var i = 0; i < this.month - 1; i++) {
      sum += months[i];
    }
    return sum + this.day;
  };

  /**
   * get the day in year
   * @class DateBS
   **/
  DateBS.prototype.daysInYear = function () {
    return DateBS.daysInYear(this.year);
  };

  /**
   * get the no of days in a year
   * @param {number} year: number in year
   * @static
   **/
  DateBS.daysInYear = function (year) {
    var months = DateBS.monthsInYear(year);
    var sum = 0;
    for (var i = 0; i < months.length; i++) {
      sum += months[i];
    }
    return sum;
  };

  /**
   * get number of days since specific day in BSMonths
   * @param {DateBS} date: date in DateBS format which is by default 2000-9-17
   **/
  DateBS.prototype.daysSince = function (date) {
    if (!date) date = new DateBS(2000, 9, 17);
    var days = 0;
    for (var year = date.year; year < this.year; year++) {
      days += DateBS.daysInYear(year);
    }
    days = days + this.dayOfYear() - date.dayOfYear();
    return days;
  };

  /**
   * get the date in BS greater than specific day, month and year
   * @param {number} day: no of days to add
   * @param {number} month: no of months to add
   * @param {number} year: no of years to add
   **/
  DateBS.prototype.add = function (day, month, year) {
    if (!month) month = 0;
    if (!year) year = 0;
    this.month += month;
    this.year += year + Math.floor(this.month / 12);
    this.month = this.month % 12;
    var diff = day;
    while (diff > 0) {
      var daysInMonth = this.daysInMonth();
      var daysLeft = daysInMonth - this.day + 1;
      if (diff >= daysLeft) {
        if (this.month === 12) {
          this.year += 1;
          this.month = 1;
          this.day = 1;
        } else {
          this.month += 1;
          this.day = 1;
        }
        diff -= daysLeft;
      } else {
        this.day += diff;
        diff -= diff;
      }
    }
    return this;
  };

  /**
   * converts the date in BS to date in AD
   * @return {Date} JavaScript Date object in AD
   **/
  DateBS.prototype.toAD = function () {
    // Use local time constructor to avoid timezone issues
    var startingDateAD = new Date(1944, 0, 1); // January 1, 1944 local time
    startingDateAD.setDate(1 + this.daysSince(new DateBS(2000, 9, 17)));
    return startingDateAD;
  };

  /**
   * converts the date in AD to date in BS
   * @param {Date} [date] - JavaScript Date object (defaults to today)
   * @return {DateBS} DateBS object
   * @static
   **/
  DateBS.fromAD = function (date) {
    if (!date) date = new Date();
    // Normalize to local midnight to avoid timezone issues
    var normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var startingDateAD = new Date(1944, 0, 1); // January 1, 1944 local time
    var diff = DateBS.daysDiff(normalizedDate, startingDateAD);
    var startingDateBS = new DateBS(2000, 9, 17);
    startingDateBS.add(diff);
    return startingDateBS;
  };

  /**
   * get the number of days in between two days
   * @param {Date} a: first date
   * @param {Date} b: second date
   * @static
   **/
  DateBS.daysDiff = function (a, b) {
    var msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((a - b) / msPerDay);
  };

  /**
   * get tge number of days in months of the year
   * @class DateBS
   */
  DateBS.prototype.monthsInYear = function () {
    return DateBS.monthsInYear(this.year);
  };

  /**
   * get the list of days in months of the year
   * @param {number} year: year in BS
   * @static
   **/
  DateBS.monthsInYear = function (year) {
    var yearIndex = year - 2000;
    if (yearIndex >= 0) {
      return BSMonths[yearIndex];
    }
  };

  /**
   * get the list of days in month of the year
   **/
  DateBS.prototype.daysInMonth = function () {
    return DateBS.daysInMonth(this.year, this.month);
  };

  /**
   * get the day in the specific month
   * @param {number} year: year in BS
   * @param {number} month: month in BS
   * @static
   **/
  DateBS.daysInMonth = function (year, month) {
    return DateBS.monthsInYear(year)[month - 1];
  };

  /**
   * converts the month to string
   * @return {string} English month name
   **/
  DateBS.prototype.monthInString = function () {
    return MONTH_NAMES_EN[this.month - 1];
  };

  /**
   * converts the month to nepali string
   * @return {string} Nepali month name
   **/
  DateBS.prototype.monthInStringNepali = function () {
    return MONTH_NAMES_NE[this.month - 1];
  };

  /**
   * get the financial year
   * @return {string} Financial year in format YYYY/YY
   **/
  DateBS.prototype.financialYear = function () {
    if (this.month > 3) {
      return this.year + '/' + ((this.year % 100) + 1);
    } else {
      return this.year - 1 + '/' + (this.year % 100);
    }
  };

  /**
   * Get the weekday name for this BS date
   * @param {boolean} [nepali=false] - If true, returns Nepali weekday name
   * @return {string} Weekday name
   */
  DateBS.prototype.getWeekday = function (nepali) {
    var adDate = this.toAD();
    var weekday = adDate.getDay();
    return nepali ? WEEKDAY_NAMES_NE[weekday] : WEEKDAY_NAMES_EN[weekday];
  };

  /**
   * Clone this DateBS object
   * @return {DateBS} New DateBS object with same values
   */
  DateBS.prototype.clone = function () {
    return new DateBS(this.year, this.month, this.day);
  };

  /**
   * Compare two DateBS objects
   * @param {DateBS} other - DateBS object to compare with
   * @return {number} -1 if this < other, 0 if equal, 1 if this > other
   */
  DateBS.prototype.compare = function (other) {
    if (this.year !== other.year) return this.year < other.year ? -1 : 1;
    if (this.month !== other.month) return this.month < other.month ? -1 : 1;
    if (this.day !== other.day) return this.day < other.day ? -1 : 1;
    return 0;
  };

  /**
   * Check if this date equals another DateBS
   * @param {DateBS} other - DateBS object to compare with
   * @return {boolean} True if dates are equal
   */
  DateBS.prototype.equals = function (other) {
    return this.compare(other) === 0;
  };

  // ========================================
  // NEPALI HOLIDAYS DATABASE & FUNCTIONS
  // ========================================

  /**
   * Comprehensive list of Nepali holidays and observances
   * Format: { bsDate: 'YYYY-MM-DD', adDate: 'YYYY-MM-DD', nameEng: 'Holiday Name (English)', nameNep: 'Holiday Name (Nepali)', type: 'national|religious|observance' }
   */
  var HOLIDAYS_DB = [
    // 2082 BS Holidays (2025-2026 AD)
    { bsDate: '2082-01-01', adDate: '2025-04-14', nameEng: 'Nepali New Year (Navabarsha)', nameNep: 'नव वर्ष २०८२', type: 'national' },
    { bsDate: '2082-01-18', adDate: '2025-05-01', nameEng: 'Labour Day', nameNep: 'श्रमिक दिवस', type: 'national' },
    { bsDate: '2082-01-29', adDate: '2025-05-12', nameEng: 'Buddha Jayanti', nameNep: 'बुद्ध जयन्ती', type: 'national' },
    { bsDate: '2082-01-29', adDate: '2025-05-12', nameEng: 'Ubhauli Festival', nameNep: 'उभौली पर्व', type: 'religious' },
    { bsDate: '2082-02-15', adDate: '2025-05-29', nameEng: 'Republic Day', nameNep: 'राष्ट्रिय गणतन्त्र दिवस', type: 'national' },
    { bsDate: '2082-02-18', adDate: '2025-06-01', nameEng: 'Bhoto Jatra (Kathmandu Valley only)', nameNep: 'भोटो जात्रा (काठमाडौं उपत्यका मात्र)', type: 'religious' },
    { bsDate: '2082-02-24', adDate: '2025-06-07', nameEng: 'Eid ul-Adha', nameNep: 'ईद अल-अधा', type: 'religious' },
    { bsDate: '2082-04-24', adDate: '2025-08-09', nameEng: 'Rakshya Bandhan', nameNep: 'रक्षाबन्धन', type: 'religious' },
    { bsDate: '2082-04-31', adDate: '2025-08-16', nameEng: 'Shri Krishna Janmashtami', nameNep: 'श्रीकृष्ण जन्माष्टमी व्रत', type: 'religious' },
    { bsDate: '2082-05-10', adDate: '2025-08-26', nameEng: 'Hartalika Teej (Women only)', nameNep: 'हरितालिका (तीज) व्रत (महिला मात्र)', type: 'religious' },
    { bsDate: '2082-05-15', adDate: '2025-08-31', nameEng: 'Gora Purnima', nameNep: 'गौरापर्व', type: 'religious' },
    { bsDate: '2082-05-21', adDate: '2025-09-06', nameEng: 'Indra Jatra', nameNep: 'इन्द्रजात्रा (स्वाँछ्या)', type: 'religious' },
    { bsDate: '2082-05-30', adDate: '2025-09-15', nameEng: 'Jivatputrika (Jitiya)', nameNep: 'जीवतपुतृका ब्रत (जितियापर्व)', type: 'religious' },
    { bsDate: '2082-06-03', adDate: '2025-09-19', nameEng: 'Constitution Day', nameNep: 'संविधान दिवस', type: 'national' },
    { bsDate: '2082-06-06', adDate: '2025-09-22', nameEng: 'Ghatasthapana (Dashain begins)', nameNep: 'घटस्थापना (न:ला स्वने)', type: 'religious' },
    { bsDate: '2082-06-13', adDate: '2025-09-29', nameEng: 'Phulpati', nameNep: 'फूलपाती', type: 'religious' },
    { bsDate: '2082-06-14', adDate: '2025-09-30', nameEng: 'Maha Ashtami', nameNep: 'महाष्टमी व्रत', type: 'religious' },
    { bsDate: '2082-06-15', adDate: '2025-10-01', nameEng: 'Maha Navami', nameNep: 'महानवमी', type: 'religious' },
    { bsDate: '2082-06-16', adDate: '2025-10-02', nameEng: 'Vijaya Dasami (Dashain Tika)', nameNep: 'विजया दशमी (दशैको टिका)', type: 'national' },
    { bsDate: '2082-06-17', adDate: '2025-10-03', nameEng: 'Annapurna Jatra', nameNep: 'अन्नपूर्णयात्रा/असंचालं', type: 'religious' },
    { bsDate: '2082-07-03', adDate: '2025-10-20', nameEng: 'Diwali (Lakshmi Puja)', nameNep: 'दीपावली (लक्ष्मी पूजा)', type: 'national' },
    { bsDate: '2082-07-04', adDate: '2025-10-21', nameEng: 'Darshan Shraddha', nameNep: 'दर्शश्राद्ध', type: 'religious' },
    { bsDate: '2082-07-05', adDate: '2025-10-22', nameEng: 'Cow Tihar', nameNep: 'गाई तिहार', type: 'religious' },
    { bsDate: '2082-07-06', adDate: '2025-10-23', nameEng: 'Bhai Tika', nameNep: 'भाइटीका (किजा पूजा)', type: 'religious' },
    { bsDate: '2082-07-07', adDate: '2025-10-24', nameEng: 'World Information Development Day', nameNep: 'विश्व विकास सूचना दिवस', type: 'observance' },
    { bsDate: '2082-07-10', adDate: '2025-10-27', nameEng: 'Chhath Puja', nameNep: 'छठपर्व', type: 'religious' },
    { bsDate: '2082-07-19', adDate: '2025-11-05', nameEng: 'Guru Nanak Jayanti', nameNep: 'गुरु नानक जयन्ती (शिख धर्मावलम्बी)', type: 'religious' },
    { bsDate: '2082-07-25', adDate: '2025-11-11', nameEng: 'Phalgunanda Jayanti', nameNep: 'फाल्गुनानन्द जयन्ती (किराँत धर्मावलम्बी मात्र)', type: 'religious' },
    { bsDate: '2082-08-17', adDate: '2025-12-03', nameEng: 'International Day of Persons with Disabilities', nameNep: 'अन्तर्राष्ट्रिय अपाङ्गता दिवस', type: 'observance' },
    { bsDate: '2082-08-18', adDate: '2025-12-04', nameEng: 'Udhali Festival', nameNep: 'उँधौली पर्व', type: 'religious' },
    { bsDate: '2082-09-10', adDate: '2025-12-25', nameEng: 'Christmas', nameNep: 'क्रिसमस (इसाई धर्म मात्र)', type: 'religious' },
    { bsDate: '2082-09-15', adDate: '2025-12-30', nameEng: 'Tamu Lhosar (Gurung New Year)', nameNep: 'तमु (गुरुङ) ल्होसार', type: 'religious' },
    { bsDate: '2082-09-27', adDate: '2026-01-11', nameEng: 'Prithvi Jayanti', nameNep: 'पृथ्वी जयन्ती', type: 'observance' },
    { bsDate: '2082-10-01', adDate: '2026-01-15', nameEng: 'Maaghe Sankranti', nameNep: 'माघे संक्रान्ति (घ्यौ:चाकु:सँन्हु)', type: 'religious' },
    { bsDate: '2082-10-05', adDate: '2026-01-19', nameEng: 'Sonam Lhosar (Tamang New Year)', nameNep: 'सोनाम (तामाङ) ल्होसार', type: 'religious' },
    { bsDate: '2082-10-09', adDate: '2026-01-23', nameEng: 'Saraswati Jayanti', nameNep: 'सरस्वती जयन्ती', type: 'religious' },
    { bsDate: '2082-10-16', adDate: '2026-01-30', nameEng: 'Shahid Day (Martyrs Day)', nameNep: 'शहीद दिवस', type: 'national' },
    { bsDate: '2082-11-03', adDate: '2026-02-15', nameEng: 'Maha Shivaratri', nameNep: 'महाशिवरात्रि व्रत', type: 'religious' },
    { bsDate: '2082-11-06', adDate: '2026-02-18', nameEng: 'Gyalpo Lhosar (Bhutanese New Year)', nameNep: 'ग्याल्पो ल्होसार', type: 'religious' },
    { bsDate: '2082-11-07', adDate: '2026-02-19', nameEng: 'National Democracy Day', nameNep: 'राष्ट्रिय प्रजातन्त्र दिवस', type: 'national' },
    { bsDate: '2082-11-18', adDate: '2026-03-02', nameEng: 'Holi (Phagwa) - Hill Region', nameNep: 'पहाडमा होली', type: 'religious' },
    { bsDate: '2082-11-19', adDate: '2026-03-03', nameEng: 'Holi (Phagwa) - Terai Region', nameNep: 'तराईमा होली', type: 'religious' },
    { bsDate: '2082-11-20', adDate: '2026-03-04', nameEng: 'Election Holiday', nameNep: 'निर्वाचन बिदा, २०८२', type: 'observance' },
    { bsDate: '2082-11-21', adDate: '2026-03-05', nameEng: 'Representative Assembly Election', nameNep: 'प्रतिनिधि सभा निर्वाचन, २०८२', type: 'observance' },
    { bsDate: '2082-11-22', adDate: '2026-03-06', nameEng: 'Election Holiday', nameNep: 'निर्वाचन बिदा, २०८२', type: 'observance' },
    { bsDate: '2082-11-24', adDate: '2026-03-08', nameEng: 'International Women\'s Day', nameNep: 'अन्तर्राष्ट्रिय नारी दिवस', type: 'observance' },
    { bsDate: '2082-12-04', adDate: '2026-03-18', nameEng: 'Ghode Jatra (Kathmandu only)', nameNep: 'घोडेजात्रा (काठमाडौं मात्र)', type: 'religious' },
    { bsDate: '2082-12-13', adDate: '2026-03-27', nameEng: 'Ram Navami', nameNep: 'रामनवमी ब्रत (रामजयन्ती)', type: 'religious' },
  ];

  /**
   * Get all holidays for a specific BS year
   * @param {number} bsYear - Bikram Sambat year
   * @return {Array} Array of holiday objects for that year
   */
  function getHolidaysForYear(bsYear) {
    return HOLIDAYS_DB.filter(function (holiday) {
      var yearFromDate = parseInt(holiday.bsDate.split('-')[0]);
      return yearFromDate === bsYear;
    });
  }

  /**
   * Get all holidays for a specific month and year in BS
   * @param {number} bsYear - Bikram Sambat year
   * @param {number} bsMonth - Bikram Sambat month (1-12)
   * @return {Array} Array of holiday objects for that month
   */
  function getHolidaysForMonth(bsYear, bsMonth) {
    return HOLIDAYS_DB.filter(function (holiday) {
      var parts = holiday.bsDate.split('-');
      var yearFromDate = parseInt(parts[0]);
      var monthFromDate = parseInt(parts[1]);
      return yearFromDate === bsYear && monthFromDate === bsMonth;
    });
  }

  /**
   * Get holidays by type
   * @param {string} type - holiday type: 'national', 'religious', or 'observance'
   * @return {Array} Array of holiday objects of specified type
   */
  function getHolidaysByType(type) {
    return HOLIDAYS_DB.filter(function (holiday) {
      return holiday.type === type;
    });
  }

  /**
   * Get upcoming holidays from today onwards
   * @param {number} [days=365] - Number of days to look ahead
   * @return {Array} Array of upcoming holiday objects
   */
  function getUpcomingHolidays(days) {
    if (!days) days = 365;
    
    return HOLIDAYS_DB.filter(function (holiday) {
      var adDate = new Date(holiday.adDate);
      var today = new Date();
      return adDate >= today;
    });
  }

  /**
   * Check if a specific date is a holiday (BS date)
   * @param {string} bsDate - Date in YYYY-MM-DD format (BS)
   * @return {Object|null} Holiday object if it's a holiday, null otherwise
   */
  function isHolidayBS(bsDate) {
    for (var i = 0; i < HOLIDAYS_DB.length; i++) {
      if (HOLIDAYS_DB[i].bsDate === bsDate) {
        return HOLIDAYS_DB[i];
      }
    }
    return null;
  }

  /**
   * Check if a specific AD date is a holiday
   * @param {string} adDate - Date in YYYY-MM-DD format (AD)
   * @return {Object|null} Holiday object if it's a holiday, null otherwise
   */
  function isHolidayAD(adDate) {
    for (var i = 0; i < HOLIDAYS_DB.length; i++) {
      if (HOLIDAYS_DB[i].adDate === adDate) {
        return HOLIDAYS_DB[i];
      }
    }
    return null;
  }

  /**
   * Get holiday info by either BS or AD date (auto-detect)
   * @param {string} dateStr - Date in YYYY-MM-DD format
   * @return {Object|null} Holiday object if found, null otherwise
   */
  function getHolidayInfo(dateStr) {
    return isHolidayBS(dateStr) || isHolidayAD(dateStr);
  }

  /**
   * Get total number of holidays in database
   * @return {number} Total count of holidays
   */
  function getTotalHolidays() {
    return HOLIDAYS_DB.length;
  }

  /**
   * Get all unique years with holidays
   * @return {Array} Array of years with holidays
   */
  function getAvailableYears() {
    var years = {};
    HOLIDAYS_DB.forEach(function (holiday) {
      var year = parseInt(holiday.bsDate.split('-')[0]);
      years[year] = true;
    });
    return Object.keys(years).map(Number).sort(function (a, b) {
      return a - b;
    });
  }

  /**
   * Get holiday display string with both BS and AD dates in both languages
   * @param {string} bsDate - Date in YYYY-MM-DD format (BS)
   * @return {string} Formatted holiday string
   */
  function getHolidayDisplay(bsDate) {
    var holiday = isHolidayBS(bsDate);
    if (holiday) {
      return holiday.nameEng + ' (' + holiday.nameNep + ') - ' + holiday.bsDate + ' BS / ' + holiday.adDate + ' AD';
    }
    return null;
  }

  /**
   * Format holidays as HTML table with bilingual names
   * @param {number} bsYear - Bikram Sambat year
   * @return {string} HTML table string
   */
  function formatHolidaysAsHTML(bsYear) {
    var holidays = getHolidaysForYear(bsYear);
    if (holidays.length === 0) {
      return '<p>No holidays found for year ' + bsYear + ' BS</p>';
    }
    
    var html = '<table style="border-collapse: collapse; width: 100%;">\n';
    html += '<thead style="background-color: #f2f2f2;">\n';
    html += '<tr>\n';
    html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Holiday (English)</th>\n';
    html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Holiday (Nepali)</th>\n';
    html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">BS Date</th>\n';
    html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">AD Date</th>\n';
    html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Type</th>\n';
    html += '</tr>\n';
    html += '</thead>\n';
    html += '<tbody>\n';
    
    for (var i = 0; i < holidays.length; i++) {
      var h = holidays[i];
      var bgColor = h.type === 'national' ? '#e8f5e9' : (h.type === 'religious' ? '#f3e5f5' : '#fff3e0');
      html += '<tr style="background-color: ' + bgColor + ';">\n';
      html += '<td style="border: 1px solid #ddd; padding: 8px;">' + h.nameEng + '</td>\n';
      html += '<td style="border: 1px solid #ddd; padding: 8px;">' + h.nameNep + '</td>\n';
      html += '<td style="border: 1px solid #ddd; padding: 8px;">' + h.bsDate + '</td>\n';
      html += '<td style="border: 1px solid #ddd; padding: 8px;">' + h.adDate + '</td>\n';
      html += '<td style="border: 1px solid #ddd; padding: 8px;">' + h.type + '</td>\n';
      html += '</tr>\n';
    }
    
    html += '</tbody>\n';
    html += '</table>\n';
    return html;
  }

  /**
   * Format holidays as formatted text/string with bilingual names
   * @param {number} bsYear - Bikram Sambat year
   * @param {boolean} [withType=true] - Include holiday type in output
   * @return {string} Formatted text string
   */
  function formatHolidaysAsText(bsYear, withType) {
    if (withType === undefined) withType = true;
    
    var holidays = getHolidaysForYear(bsYear);
    if (holidays.length === 0) {
      return 'No holidays found for year ' + bsYear + ' BS';
    }
    
    var text = 'Holidays for BS Year ' + bsYear + ' (' + holidays.length + ' holidays)\n';
    text += '====================================\n\n';
    
    for (var i = 0; i < holidays.length; i++) {
      var h = holidays[i];
      text += (i + 1) + '. ' + h.nameEng + ' | ' + h.nameNep + '\n';
      text += '   BS Date: ' + h.bsDate + ' | AD Date: ' + h.adDate + '\n';
      if (withType) {
        text += '   Type: ' + h.type.toUpperCase() + '\n';
      }
      text += '\n';
    }
    
    return text;
  }

  /**
   * Format holidays as CSV with bilingual names
   * @param {number} bsYear - Bikram Sambat year
   * @return {string} CSV formatted string
   */
  function formatHolidaysAsCSV(bsYear) {
    var holidays = getHolidaysForYear(bsYear);
    var csv = 'Holiday (English),Holiday (Nepali),BS Date,AD Date,Type\n';
    
    for (var i = 0; i < holidays.length; i++) {
      var h = holidays[i];
      csv += '"' + h.nameEng + '","' + h.nameNep + '",' + h.bsDate + ',' + h.adDate + ',' + h.type + '\n';
    }
    
    return csv;
  }

  /**
   * Format holidays as JSON array with bilingual names
   * @param {number} bsYear - Bikram Sambat year
   * @return {string} JSON formatted string
   */
  function formatHolidaysAsJSON(bsYear, pretty) {
    if (pretty === undefined) pretty = true;
    var holidays = getHolidaysForYear(bsYear);
    
    if (pretty) {
      return JSON.stringify(holidays, null, 2);
    } else {
      return JSON.stringify(holidays);
    }
  }

  /**
   * Display holidays in console (for debugging/testing) with bilingual names
   * @param {number} bsYear - Bikram Sambat year
   */
  function logHolidaysForYear(bsYear) {
    var holidays = getHolidaysForYear(bsYear);
    console.log('Holidays for BS year ' + bsYear + ':');
    console.table(holidays);
  }

  // Return the public API
  return {
    // Main conversion functions
    BS_TO_AD: BS_TO_AD,
    AD_TO_BS: AD_TO_BS,
    
    // DateBS class
    DateBS: DateBS,
    
    // Helper functions
    todayBS: todayBS,
    isValidBS: isValidBS,
    isValidAD: isValidAD,
    
    // Holiday functions
    getHolidaysForYear: getHolidaysForYear,
    getHolidaysForMonth: getHolidaysForMonth,
    getHolidaysByType: getHolidaysByType,
    getUpcomingHolidays: getUpcomingHolidays,
    isHolidayBS: isHolidayBS,
    isHolidayAD: isHolidayAD,
    getHolidayInfo: getHolidayInfo,
    getTotalHolidays: getTotalHolidays,
    getAvailableYears: getAvailableYears,
    getHolidayDisplay: getHolidayDisplay,
    
    // Holiday formatting functions
    formatHolidaysAsHTML: formatHolidaysAsHTML,
    formatHolidaysAsText: formatHolidaysAsText,
    formatHolidaysAsCSV: formatHolidaysAsCSV,
    formatHolidaysAsJSON: formatHolidaysAsJSON,
    logHolidaysForYear: logHolidaysForYear,
    
    // Data
    BSMonths: BSMonths,
    MONTH_NAMES_EN: MONTH_NAMES_EN,
    MONTH_NAMES_NE: MONTH_NAMES_NE,
    WEEKDAY_NAMES_EN: WEEKDAY_NAMES_EN,
    WEEKDAY_NAMES_NE: WEEKDAY_NAMES_NE,
    HOLIDAYS_DB: HOLIDAYS_DB,
    
    // Version
    version: '2.1.0'
  };
}));

// Test cases in terminal
/*node -e "const N = require('./NepaliBStoAD.js'); console.log('Test 1: 2026-01-24 AD =', N.AD_TO_BS('2026-01-24'), 'BS (expected: 2082-10-10)'); console.log('Test 2: 2025-04-14 AD =', N.AD_TO_BS('2025-04-14'), 'BS (expected: 2082-01-01)'); console.log('Test 3: 2082-10-10 BS =', N.BS_TO_AD('2082-10-10'), 'AD (expected: 2026-01-24)'); console.log('Test 4: 2082-01-01 weekday:', N.DateBS.fromString('2082-01-01').getWeekday());" */
// Expected output:
// Test 1: 2026-01-24 AD = 2082-10-10 BS (expected: 2082-10-10)
// Test 2: 2025-04-14 AD = 2082-01-01 BS (expected: 2082-01-01)
// Test 3: 2082-10-10 BS = 2026-01-24 AD (expected: 2026-01-24)
// Test 4: 2082-01-01 weekday: Monday

//node -e "const N = require('./NepaliBStoAD.js'); const bs = N.AD_TO_BS('1992-03-22', true); console.log('AD 1992-03-22 =', bs.format('YYYY-MM-DD, mmmm DD, dddd'), bs.getWeekday(true));"
//AD 1992-03-22 = 2048-12-09, चैत 09, Sunday आइतबार

/*
const holiday = NepaliDate.isHolidayBS('2082-01-01');
// Returns: { nameEng: 'Nepali New Year', nameNep: 'नेपाली नववर्ष', ... }

// Display both names
console.log(NepaliDate.getHolidayDisplay('2082-01-01'));
// Output: Nepali New Year (नेपाली नववर्ष) - 2082-01-01 BS / 2025-04-14 AD

// Format with both names
console.log(NepaliDate.formatHolidaysAsText(2082));
*/