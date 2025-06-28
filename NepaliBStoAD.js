/**
 * Converts a date from Bikram Sambat (BS) to Anno Domini (AD).
 *
 * @param {string} bsDate The date in BS format (YYYY-MM-DD).
 * @return The date in AD format (YYYY-MM-DD).
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
    return `${adYear}-${String(adMonth).padStart(2, '0')}-${String(adDay).padStart(2, '0')}`;
  } catch (e) {
    return e.message || 'Invalid BS date format. Use YYYY-MM-DD or "YYYY MonthName DD".';
  }
}

/**
 * no of days in months from year 2000 to 2100 BS
 * @constant
 **/
var BSMonths = [
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], //2000
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], //2001
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], //2071
  [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], //2072
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], //2073
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30], //2090
  [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  [30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 30, 30, 30],
  [30, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 29, 30, 30, 30], //2099
];

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
 * converts BS Date to string
 **/
DateBS.prototype.toString = function () {
  return this.year + '-' + this.month + '-' + this.day;
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
 **/
DateBS.prototype.toAD = function () {
  var startingDateAD = new Date('1944-01-01T00:00');
  startingDateAD.setDate(1 + this.daysSince());
  return startingDateAD;
};

/**
 * converts the date in AD to date in BS
 * @static
 **/
DateBS.fromAD = function (date) {
  if (!date) date = new Date();
  var startingDateAD = new Date('1944-01-01');
  var diff = DateBS.daysDiff(date, startingDateAD);
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
  var before = new Date('2020-07-01');
  var after = new Date('2020-07-02');
  return Math.floor((a - b) / (after - before));
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
 **/
DateBS.prototype.monthInString = function () {
  var monthBS = ['Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];
  return monthBS[this.month - 1];
};

/**
 * converts the month to nepali string
 **/
DateBS.prototype.monthInStringNepali = function () {
  var monthBS = ['वैशाख', 'ज्येष्ठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कात्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'];
  return monthBS[this.month - 1];
};

/**
 * get the financial year
 **/
DateBS.prototype.financialYear = function () {
  if (this.month > 3) {
    return this.year + '/' + ((this.year % 100) + 1);
  } else {
    return this.year - 1 + '/' + (this.year % 100);
  }
};
