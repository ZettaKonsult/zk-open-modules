export const calculateGender = ssn => {
  const cleanSsn = transformToApprovedFormat(ssn)

  const genderNumber = cleanSsn[9]

  return genderNumber % 2 === 0 ? "woman" : "man"
}

export const calculateAge = ssn => {
  const cleanSsn = transformToApprovedFormat(ssn)
  const now = new Date()

  const year =
    now
      .getFullYear()
      .toString()
      .slice(0, 2) + cleanSsn.substring(0, 2)
  const month = cleanSsn.substring(2, 4)
  const day = cleanSsn.substring(4, 6)

  let birth = new Date(year, month, day)

  if (birth > now) {
    birth.setFullYear(birth.getFullYear() - 100)
  }
  if (cleanSsn[6] === "+") {
    birth.setFullYear(birth.getFullYear() - 100)
  }

  const result = (now.getFullYear() - birth.getFullYear()).toString()

  return result
}

export const transformToApprovedFormat = ssn => {
  if (!ssn) return ""

  // Insert - if -/+ is missing.
  if (ssn.indexOf("-") === -1 && ssn.indexOf("+") === -1) {
    if (ssn.length === 10) {
      ssn = ssn.slice(0, 6) + "-" + ssn.slice(6)
    } else {
      ssn = ssn.slice(0, 8) + "-" + ssn.slice(8)
    }
  }

  // Return format convention of YYMMDD-/+XXXX
  if (ssn.length >= 12) {
    ssn = ssn.substring(2)
  }
  return ssn
}
