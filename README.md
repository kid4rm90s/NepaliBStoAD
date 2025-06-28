# BS to AD Date Converter

A JavaScript library for converting dates between Bikram Sambat (BS) and Anno Domini (AD) calendars, specifically designed for Google Sheets and general JavaScript applications.

## Features

- ✅ Convert BS dates to AD dates
- ✅ Convert AD dates to BS dates
- ✅ Support for multiple date formats
- ✅ Comprehensive month name recognition (English & Nepali)
- ✅ Google Sheets custom function integration
- ✅ Robust error handling
- ✅ Year range: 2000-2099 BS (1943-2042 AD)

## Supported Date Formats

### Input Formats
1. **Standard Format**: `YYYY-MM-DD`
   - Example: `"2048-09-14"`

2. **Named Month Format**: `YYYY MonthName DD`
   - Example: `"2048 Poush 14"`

3. **Nepali Month Names**: `YYYY नेपाली_महिना DD`
   - Example: `"2048 पुष 14"`

4. **8-digit Number Format**: `YYYYMMDD`
   - Example: `20480914`

5. **Date Objects**: JavaScript Date objects
   - Automatically handled

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

## Usage

### Google Sheets Custom Function

```javascript
=BS_TO_AD("2048-09-14")        // Returns: 1991-12-29
=BS_TO_AD("2048 Poush 14")     // Returns: 1991-12-29  
=BS_TO_AD("2048 पुष 14")       // Returns: 1991-12-29
```

### JavaScript Library

```javascript
// Create BS date from string
var bsDate = DateBS.fromString("2048-09-14");
var bsDate2 = DateBS.fromString("2048 Poush 14");

// Convert to AD
var adDate = bsDate.toAD();
console.log(adDate); // JavaScript Date object

// Create BS date from AD
var todayBS = DateBS.fromAD(new Date());

// Get formatted string
console.log(bsDate.toString()); // "2048-9-14"

// Get month in English/Nepali
console.log(bsDate.monthInString());       // "Poush"
console.log(bsDate.monthInStringNepali()); // "पुष"

// Get financial year
console.log(bsDate.financialYear()); // "2048/49"

// Get days in month/year
console.log(bsDate.daysInMonth()); // 30
console.log(bsDate.daysInYear());  // 365
```

## API Reference

### Main Function

#### `BS_TO_AD(bsDate)`
Google Sheets custom function to convert BS date to AD date.

**Parameters:**
- `bsDate` (string|number|Date): BS date in any supported format

**Returns:**
- String in YYYY-MM-DD format or error message

### DateBS Class

#### Constructor
```javascript
new DateBS(year, month, day)
```

#### Static Methods

##### `DateBS.fromString(datestring)`
Creates DateBS object from string.

##### `DateBS.fromAD(date)`
Creates DateBS object from AD Date object.

##### `DateBS.daysInYear(year)`
Returns total days in given BS year.

##### `DateBS.daysInMonth(year, month)`
Returns days in given BS month and year.

##### `DateBS.monthsInYear(year)`
Returns array of days in each month for given year.

#### Instance Methods

##### `toAD()`
Converts BS date to AD Date object.

##### `toString()`
Returns BS date as "YYYY-M-D" string.

##### `dayOfYear()`
Returns day number in the year (1-365/366).

##### `daysInYear()`
Returns total days in the year.

##### `daysInMonth()`
Returns days in the month.

##### `monthInString()`
Returns month name in English.

##### `monthInStringNepali()`
Returns month name in Nepali.

##### `financialYear()`
Returns financial year string (e.g., "2048/49").

##### `add(days, months, years)`
Adds specified time to the date.

##### `daysSince(date)`
Returns days since given date (default: 2000-9-17).

## Error Handling

The library provides descriptive error messages for various scenarios:

- **Invalid format**: "Invalid BS date format. Expected YYYY-MM-DD or 'YYYY MonthName DD'"
- **Unknown month**: "Unknown month name: 'xyz'. Supported formats: YYYY-MM-DD or 'YYYY MonthName DD'"
- **Year out of range**: "Year out of supported range (2000-2099 BS). Got: 2150"
- **Invalid month**: "Month out of range (1-12). Got: 13"
- **Invalid day**: "Day out of range for year 2048 month 9. Max day is 30 but got: 31"

## Google Sheets Integration

### Installation
1. Open Google Sheets
2. Go to Extensions → Apps Script
3. Paste the entire script
4. Save and authorize

### Usage in Sheets
- Use `=BS_TO_AD(A1)` where A1 contains a BS date
- Handles Google Sheets error values gracefully
- Returns empty string for invalid inputs
- Supports cell references, direct strings, and formulas

## Technical Details

### Calendar Data
- Supports BS years 2000-2099 (100 years)
- Uses accurate month-day mappings for each year
- Reference point: BS 2000-9-17 = AD 1944-1-1

### Algorithm
- Day-counting algorithm for accurate conversion
- Handles leap years and variable month lengths
- Accounts for BS calendar irregularities

## Examples

```javascript
// Various input formats
BS_TO_AD("2081-1-1")           // "2024-04-13"
BS_TO_AD("2081 Baishakh 1")    // "2024-04-13"
BS_TO_AD("2081 वैशाख 1")       // "2024-04-13"
BS_TO_AD(20810101)             // "2024-04-13"

// Error cases
BS_TO_AD("2081-13-1")          // "Month out of range (1-12). Got: 13"
BS_TO_AD("2081 Unknown 1")     // "Unknown month name: 'Unknown'..."
BS_TO_AD("1999-1-1")           // "Year out of supported range..."
```

## Changelog

### Version 2.0
- ✅ Added support for named month formats
- ✅ Added Nepali month name recognition
- ✅ Improved error handling
- ✅ Enhanced Google Sheets integration
- ✅ Added comprehensive validation

### Version 1.0
- ✅ Basic BS to AD conversion
- ✅ YYYY-MM-DD format support
- ✅ Google Sheets custom function

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:
- Bug fixes
- Feature enhancements
- Documentation improvements
- Additional month name variants
- Extended year range support

## Support

For issues or questions:
1. Check the error message for specific guidance
2. Verify date format matches supported patterns
3. Ensure year is within 2000-2099 BS range
4. Confirm month names are spelled correctly
