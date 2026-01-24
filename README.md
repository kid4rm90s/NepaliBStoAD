# NepaliDate - BS ↔ AD Date Converter

A universal JavaScript library for converting dates between Bikram Sambat (BS) and Anno Domini (AD) calendars. Works in **Google Sheets**, **Tampermonkey userscripts**, **Node.js**, and **browsers**.

---

**2026-01-24 / 2082-10-10 Correction:**
> As of v2.0.1, the BSMonths data for year 2082 has been fixed: Baishakh (month 1) now correctly has 31 days. This ensures that:
>
> - 2026-01-24 AD ↔ 2082-10-10 BS
> - 2025-04-14 AD ↔ 2082-01-01 BS (Monday)
>
> All conversions for these dates are now accurate.

---

## Features

- ✅ Convert BS dates to AD dates (`BS_TO_AD`)
- ✅ Convert AD dates to BS dates (`AD_TO_BS`)
- ✅ Support for multiple date formats
- ✅ Comprehensive month name recognition (English & Nepali)
- ✅ Google Sheets custom function integration
- ✅ UMD module support (CommonJS, AMD, browser global)
- ✅ Tampermonkey `@require` compatible
- ✅ Robust error handling
- ✅ Date formatting with custom patterns
- ✅ Weekday support (English & Nepali)
- ✅ Year range: 2000-2099 BS (1943-2042 AD)

## Installation

### Tampermonkey / Userscripts

```javascript
// @require https://raw.githubusercontent.com/kid4rm90s/NepaliBStoAD/main/NepaliBStoAD.js
// @require https://kid4rm90s.github.io/NepaliBStoAD/NepaliBStoAD.js
```

Then access via `NepaliDate` global:

```javascript
const todayBS = NepaliDate.todayBS();
const adDate = NepaliDate.BS_TO_AD('2082-10-10');
const bsDate = NepaliDate.AD_TO_BS('2026-01-24');
```

### Node.js

```javascript
const NepaliDate = require('./NepaliBStoAD.js');
// or ES modules
import NepaliDate from './NepaliBStoAD.js';
```

### Browser (Script Tag)

```html
<script src="NepaliBStoAD.js"></script>
<script>
  const todayBS = NepaliDate.todayBS();
  console.log(todayBS); // "2082-10-10"
</script>
```

### Google Sheets

1. Open Google Sheets → Extensions → Apps Script
2. Paste the entire script
3. Save and authorize
4. Use `=BS_TO_AD(A1)` or `=AD_TO_BS(A1)` in cells

## Quick Start

```javascript
// BS → AD conversion
NepaliDate.BS_TO_AD('2082-10-10');           // "2026-01-24"
NepaliDate.BS_TO_AD('2082 Magh 11');          // "2026-01-25"
NepaliDate.BS_TO_AD('2082 माघ 11');           // "2026-01-25"

// AD → BS conversion
NepaliDate.AD_TO_BS('2026-01-24');           // "2082-10-10"
NepaliDate.AD_TO_BS(new Date());              // Today in BS

// Get today in BS
NepaliDate.todayBS();                         // "2082-10-10"

// Validation
NepaliDate.isValidBS('2082-10-10');          // true
NepaliDate.isValidBS('2082-13-01');          // false (invalid month)

// Using DateBS class directly
const bs = new NepaliDate.DateBS(2082, 10, 10);
bs.toAD();                                    // Date object
bs.format('YYYY MMMM DD');                   // "2082 Magh 10"
bs.format('YYYY mmmm DD');                   // "2082 माघ 10"
bs.getWeekday();                             // "Friday"
bs.getWeekday(true);                         // "शुक्रबार"
```

## Supported Date Formats

### Input Formats
| Format | Example | Description |
|--------|---------|-------------|
| `YYYY-MM-DD` | `"2082-10-10"` | Standard format |
| `YYYY/MM/DD` | `"2082/10/11"` | Slash separator |
| `YYYY.MM.DD` | `"2082.10.11"` | Dot separator |
| `YYYY MonthName DD` | `"2082 Magh 11"` | Named month (English) |
| `YYYY नेपाली_महिना DD` | `"2082 माघ 11"` | Named month (Nepali) |
| `YYYYMMDD` | `20821011` | 8-digit number |
| Date object | `new Date()` | JavaScript Date |

### Supported Month Names

| Month # | English | Nepali | Alternatives |
|---------|---------|--------|--------------|
| 1 | Baishakh | वैशाख | बैशाख |
| 2 | Jestha | ज्येष्ठ | Jyestha |
| 3 | Ashadh | असार | आषाढ, Asar |
| 4 | Shrawan | साउन | श्रावण, Saun |
| 5 | Bhadra | भदौ | भाद्र, Bhadau |
| 6 | Ashwin | असोज | आश्विन, Asoj |
| 7 | Kartik | कात्तिक | कार्तिक |
| 8 | Mangsir | मंसिर | मार्गशीर्ष, Mangshir |
| 9 | Poush | पुष | पौष, Paush |
| 10 | Magh | माघ | |
| 11 | Falgun | फागुन | फाल्गुन, Phalgun |
| 12 | Chaitra | चैत | चैत्र |

## API Reference

### Conversion Functions

#### `BS_TO_AD(bsDate)`
Converts BS date to AD date string.

```javascript
NepaliDate.BS_TO_AD('2082-10-10');           // "2026-01-24"
NepaliDate.BS_TO_AD('2082 Magh 11');          // "2026-01-24"
```

**Parameters:**
- `bsDate` (string|number|Date): BS date in any supported format

**Returns:** String in `YYYY-MM-DD` format or error message

---

#### `AD_TO_BS(adDate, asObject)`
Converts AD date to BS date.

```javascript
NepaliDate.AD_TO_BS('2026-01-24');           // "2082-10-10"
NepaliDate.AD_TO_BS(new Date());              // Today in BS
NepaliDate.AD_TO_BS('2026-01-24', true);     // DateBS object
```

**Parameters:**
- `adDate` (string|Date|number): AD date (YYYY-MM-DD, Date object, or Google Sheets serial)
- `asObject` (boolean, optional): If true, returns DateBS object instead of string

**Returns:** String in `YYYY-MM-DD` format, DateBS object, or error message

---

### Helper Functions

#### `todayBS(asObject)`
Returns today's date in BS.

```javascript
NepaliDate.todayBS();        // "2082-10-10"
NepaliDate.todayBS(true);    // DateBS object
```

---

#### `isValidBS(bsDate)`
Validates a BS date without throwing errors.

```javascript
NepaliDate.isValidBS('2082-10-10');  // true
NepaliDate.isValidBS('2082-13-01');  // false
NepaliDate.isValidBS('2100-01-01');  // false (out of range)
```

---

#### `isValidAD(adDate)`
Validates an AD date for conversion to BS.

```javascript
NepaliDate.isValidAD('2026-01-24');  // true
NepaliDate.isValidAD('1900-01-01');  // false (before supported range)
```

---

### DateBS Class

#### Constructor
```javascript
const bs = new NepaliDate.DateBS(2082, 10, 11);
```

#### Static Methods

| Method | Description | Example |
|--------|-------------|---------|
| `DateBS.fromString(str)` | Create from string | `DateBS.fromString('2082-10-10')` |
| `DateBS.fromAD(date)` | Create from AD Date | `DateBS.fromAD(new Date())` |
| `DateBS.daysInYear(year)` | Days in BS year | `DateBS.daysInYear(2082)` → `365` |
| `DateBS.daysInMonth(year, month)` | Days in month | `DateBS.daysInMonth(2082, 10)` → `29` |
| `DateBS.monthsInYear(year)` | Array of days per month | `DateBS.monthsInYear(2082)` |

#### Instance Methods

| Method | Description | Example |
|--------|-------------|---------|
| `toAD()` | Convert to AD Date object | `bs.toAD()` |
| `toString()` | Get as `YYYY-MM-DD` string | `bs.toString()` → `"2082-10-10"` |
| `format(pattern)` | Custom formatting | See format patterns below |
| `dayOfYear()` | Day number in year | `bs.dayOfYear()` → `284` |
| `daysInYear()` | Total days in year | `bs.daysInYear()` → `365` |
| `daysInMonth()` | Days in current month | `bs.daysInMonth()` → `29` |
| `monthInString()` | Month name (English) | `bs.monthInString()` → `"Magh"` |
| `monthInStringNepali()` | Month name (Nepali) | `bs.monthInStringNepali()` → `"माघ"` |
| `financialYear()` | Nepali fiscal year | `bs.financialYear()` → `"2082/83"` |
| `getWeekday(nepali)` | Weekday name | `bs.getWeekday()` → `"Friday"` |
| `add(days, months, years)` | Add time to date | `bs.add(5, 0, 0)` |
| `clone()` | Create a copy | `bs.clone()` |
| `compare(other)` | Compare dates | `bs.compare(other)` → `-1`, `0`, or `1` |
| `equals(other)` | Check equality | `bs.equals(other)` → `true`/`false` |

#### Format Patterns

```javascript
const bs = new NepaliDate.DateBS(2082, 10, 10);

bs.format('YYYY-MM-DD');      // "2082-10-10"
bs.format('YYYY/M/D');        // "2082/10/10"
bs.format('YYYY MMMM DD');    // "2082 Magh 10"
bs.format('YYYY mmmm DD');    // "2082 माघ 10"
bs.format('MMM DD, YYYY');    // "Mag 10, 2082"
bs.format('dddd, MMMM D');    // "Saturday, Magh 10"
```

| Token | Description | Example |
|-------|-------------|---------|
| `YYYY` | 4-digit year | `2082` |
| `YY` | 2-digit year | `82` |
| `MMMM` | Month name (English) | `Magh` |
| `mmmm` | Month name (Nepali) | `माघ` |
| `MMM` | Month name short | `Mag` |
| `MM` | Month (2-digit) | `10` |
| `M` | Month (1 or 2 digit) | `10` |
| `DD` | Day (2-digit) | `10` |
| `D` | Day (1 or 2 digit) | `10` |
| `dddd` | Weekday (English) | `Saturday` |
| `ddd` | Weekday short | `Sat` |

---

### Data Constants

```javascript
NepaliDate.BSMonths;          // 2D array of days per month (100 years)
NepaliDate.MONTH_NAMES_EN;    // ['Baishakh', 'Jestha', ...]
NepaliDate.MONTH_NAMES_NE;    // ['वैशाख', 'ज्येष्ठ', ...]
NepaliDate.WEEKDAY_NAMES_EN;  // ['Sunday', 'Monday', ...]
NepaliDate.WEEKDAY_NAMES_NE;  // ['आइतबार', 'सोमबार', ...]
NepaliDate.version;           // '2.0.0'
```

## Google Sheets Usage

### Custom Functions
```
=BS_TO_AD("2082-10-10")        → 2026-01-24
=BS_TO_AD("2082 Magh 11")      → 2026-01-24
=BS_TO_AD(A1)                   → Converts date in cell A1

=AD_TO_BS("2026-01-24")        → 2082-10-10
=AD_TO_BS(TODAY())             → Today's date in BS
=AD_TO_BS(A1)                   → Converts AD date in cell A1
```

### Installation
1. Open Google Sheets
2. Go to **Extensions → Apps Script**
3. Delete any existing code
4. Paste the entire `NepaliBStoAD.js` content
5. Click **Save** (💾)
6. Return to spreadsheet and use `=BS_TO_AD()` or `=AD_TO_BS()`

## Error Handling

The library provides descriptive error messages:

| Error | Message |
|-------|---------|
| Invalid format | `"Invalid BS date format. Expected YYYY-MM-DD or 'YYYY MonthName DD'"` |
| Unknown month | `"Unknown month name: 'xyz'"` |
| Year out of range | `"Year out of supported range (2000-2099 BS). Got: 2150"` |
| Invalid month | `"Month out of range (1-12). Got: 13"` |
| Invalid day | `"Day out of range for year 2082 month 10. Max day is 29 but got: 31"` |

## Technical Details

### Calendar Data
- Supports BS years **2000-2099** (100 years)
- Accurate month-day mappings for each year
- Reference point: BS 2000-9-17 = AD 1944-01-01

### Algorithm
- Day-counting algorithm for accurate conversion
- Handles leap years and variable month lengths
- Accounts for BS calendar irregularities

## Changelog

### Version 2.0.1
- 🐞 Fixed: 2082 Baishakh now has 31 days (was 30)
- ✅ 2026-01-24 AD ↔ 2082-10-10 BS is now correct
- ✅ 2025-04-14 AD ↔ 2082-01-01 BS (Monday) is now correct

### Version 2.0.0
- ✅ Added `AD_TO_BS()` conversion function
- ✅ Added UMD module support (Node.js, AMD, browser)
- ✅ Added Tampermonkey `@require` support
- ✅ Added `todayBS()` helper function
- ✅ Added `isValidBS()` and `isValidAD()` validators
- ✅ Added `format()` method with pattern support
- ✅ Added weekday support (English & Nepali)
- ✅ Added `clone()`, `compare()`, `equals()` methods
- ✅ Fixed `toString()` to return zero-padded format (YYYY-MM-DD)
- ✅ Added `NepaliDate` global namespace
- ✅ Maintained full backward compatibility with Google Sheets

### Version 1.x
- ✅ Basic BS to AD conversion
- ✅ Named month formats support
- ✅ Nepali month name recognition
- ✅ Google Sheets custom function

## License

MIT License - feel free to use in your projects.

## Contributing

Contributions welcome! Feel free to submit PRs for:
- Bug fixes
- Extended year range
- Additional month name variants
- Documentation improvements
