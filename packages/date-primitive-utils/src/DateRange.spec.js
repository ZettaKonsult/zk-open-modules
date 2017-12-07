import * as dateRange from "./DateRange"

describe("DateRange", () => {
  describe("getMonthRange()", () => {
    it("Returns start and end of month for given epoch.", () => {
      const date = Date.UTC(2017, 1, 5)
      const expected = {
        start: Date.UTC(2017, 1, 1),
        end: Date.UTC(2017, 2, 0)
      }
      expect(dateRange.getMonthRange(date)).toEqual(expected)
    })
  })

  describe("getYearRange()", () => {
    it("Returns start and end of year for given epoch.", () => {
      const date = Date.UTC(2017, 1, 5)
      const expected = {
        start: Date.UTC(2017, 0, 1),
        end: Date.UTC(2018, 0, 0)
      }
      expect(dateRange.getYearRange(date)).toEqual(expected)
    })
  })
})
