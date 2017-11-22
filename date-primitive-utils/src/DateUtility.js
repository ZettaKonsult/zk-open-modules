/* @flow */

export function incrementDateBy(date: number, value: number): number {
  let d = new Date(date)
  d.setUTCDate(d.getUTCDate() + value)
  return d.getTime()
}

export function incrementMonthBy(date: number, value: number): number {
  let d = new Date(date)
  d.setUTCMonth(d.getUTCMonth() + value)

  return d.getTime()
}

export function incrementYearBy(date: number, value: number): number {
  let d = new Date(date)
  d.setUTCFullYear(d.getUTCFullYear() + value)

  return d.getTime()
}

export function getLastMonthOfDivision(division: number) {
  let months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  return months.filter(month => (month + 1) % division === 0)
}

export function incrementToNextLowerBound(date: number, division: number) {
  let months = getLastMonthOfDivision(division)
  let paidDate = getDateAsJson(date)
  let currentUpperBound = Date.UTC(
    paidDate.year,
    months[Math.floor(paidDate.month / division)]
  )
  let nextLowerBound = incrementMonthBy(currentUpperBound, 1)
  return nextLowerBound
}

export function findQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3 + 1)
}

export function getDateAsJson(date: number) {
  let d = new Date(date)
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    date: d.getUTCDate()
  }
}

export function toISODateString(date: number): string {
  let d = new Date(date)
  const dateAndTime = d.toISOString().split('T')
  return dateAndTime[0]
}