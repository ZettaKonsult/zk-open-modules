[![Build Status](https://travis-ci.org/fiddep/swedish-ssn.png)](https://travis-ci.org/fiddep/swedish-ssn)

## Installation

```
  npm install --save swedish-ssn
```

or

```
  yarn add swedish-ssn
```

## Usage

```javascript
var ssn = require("swedish-ssn")
var personSsn = "9105041835"

ssn.validateSwedishSsn(personSsn) // Returns true.
ssn.calculateAge(personSsn) // Returns current year - 1991.
ssn.calculateGender(personSsn) // Returns man.
ssn.transformToApprovedFormat(personSsn) // Returns format YYMMDD-XXXX.
```

##Usable Formats

```
YYYYMMDD-XXXX
YYYYMMDD+XXXX
YYYYMMDDXXXX

YYMMDD-XXXX
YYMMDD+XXXX
YYMMDDXXXX
```
