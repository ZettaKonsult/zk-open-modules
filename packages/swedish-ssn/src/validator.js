import { transformToApprovedFormat } from './utils'

export const validateSwedishSsn = ssn => {
  if (!ssn || ssn.length < 10 || ssn.length > 13) return false

  //Handle LADOK numbers which contains letters
  let match = /([A-z*])/.exec(ssn)
  if (match) {
    ssn = ssn.substr(0, match.index) + '1' + ssn.substr(match.index + 1)
  }

  let cleanedssn = transformToApprovedFormat(ssn)
  if (!cleanedssn) return false

  //check for YYMMDD-/+XXXX || YYYYMMDD-/+XXXX
  let regex = /^(\d{2})(\d{2})(\d{2})[-+](\d{4})|(\d{4})(\d{2})(\d{2})[-+](\d{4})$/
  if (!regex.exec(cleanedssn)) return false

  // Remove - || + before calculations
  if (/-/.exec(cleanedssn)) {
    cleanedssn = cleanedssn.replace('-', '')
  }
  if (/\+/.exec(cleanedssn)) {
    cleanedssn = cleanedssn.replace('+', '')
  }

  // Check luhn algorithm
  return luhnAlgorithm(cleanedssn)
}

const luhnAlgorithm = ssn => {
  let sum = 0, parity = ssn.length % 2
  for (let i = 0; i < ssn.length; i++) {
    let digit = parseInt(ssn.charAt(i), 10)
    if (i % 2 === parity) digit *= 2
    if (digit > 9) digit -= 9
    sum += digit
  }
  return sum % 10 === 0
}
