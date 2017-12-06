import * as util from "./DateUtility"

describe("DateUtility", () => {
  describe("incrementDateBy()", () => {
    it("Increments date by the given number.", () => {
      const date = Date.UTC(2017, 0, 1)
      const expected = Date.UTC(2017, 0, 3)

      expect(util.incrementDateBy(date, 2)).toBe(expected)
    })
  })

  describe("incrementMonthBy()", () => {
    const date = Date.UTC(2017, 0, 1)
    const expected = Date.UTC(2017, 2, 1)

    expect(util.incrementMonthBy(date, 2)).toBe(expected)
  })

  describe("incrementYear()", () => {
    const date = Date.UTC(2017, 0, 1)
    const expected = Date.UTC(2019, 0, 1)

    expect(util.incrementYearBy(date, 2)).toBe(expected)
  })

  describe("findQuarter()", () => {
    describe("Test first quarter.", () => {
      it("january", () => {
        const date = new Date(2017, 0)
        expect(util.findQuarter(date)).toBe(1)
      })
      it("february", () => {
        const date = new Date(2017, 1)
        expect(util.findQuarter(date)).toBe(1)
      })
      it("mars", () => {
        const date = new Date(2017, 2)
        expect(util.findQuarter(date)).toBe(1)
      })
    })

    describe("Test second quarter.", () => {
      it("april", () => {
        const date = new Date(2017, 3)
        expect(util.findQuarter(date)).toBe(2)
      })
      it("may", () => {
        const date = new Date(2017, 4)
        expect(util.findQuarter(date)).toBe(2)
      })
      it("june", () => {
        const date = new Date(2017, 5)
        expect(util.findQuarter(date)).toBe(2)
      })
    })

    describe("test third quarter", () => {
      it("july", () => {
        const date = new Date(2017, 6)
        expect(util.findQuarter(date)).toBe(3)
      })
      it("august", () => {
        const date = new Date(2017, 7)
        expect(util.findQuarter(date)).toBe(3)
      })
      it("september", () => {
        const date = new Date(2017, 8)
        expect(util.findQuarter(date)).toBe(3)
      })
    })

    describe("fourth quarter", () => {
      it("october", () => {
        const date = new Date(2017, 9)
        expect(util.findQuarter(date)).toBe(4)
      })
      it("november", () => {
        const date = new Date(2017, 10)
        expect(util.findQuarter(date)).toBe(4)
      })
      it("december", () => {
        const date = new Date(2017, 11)
        expect(util.findQuarter(date)).toBe(4)
      })
    })
  })

  describe("getLastMonthOfDivision", () => {
    it("returns correct array for half year", () => {
      expect(util.getLastMonthOfDivision(6)).toEqual(
        expect.arrayContaining([5, 11])
      )
    })
    it("returns correct array for year divided in 3", () => {
      expect(util.getLastMonthOfDivision(4)).toEqual(
        expect.arrayContaining([3, 7, 11])
      )
    })
    it("returns correct array for quarter year", () => {
      expect(util.getLastMonthOfDivision(3)).toEqual(
        expect.arrayContaining([2, 5, 8, 11])
      )
    })
    it("returns every second month", () => {
      expect(util.getLastMonthOfDivision(2)).toEqual(
        expect.arrayContaining([1, 3, 5, 7, 9, 11])
      )
    })
    it("returns all months", () => {
      expect(util.getLastMonthOfDivision(1)).toEqual(
        expect.arrayContaining([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
      )
    })
  })

  describe("getDateAsJson()", () => {
    it("retuns a json object for the epox", () => {
      let epox = Date.UTC(2017, 2, 5)
      expect(util.getDateAsJson(epox)).toEqual({
        year: 2017,
        month: 2,
        date: 5
      })
    })
  })

  describe("incrementToNextLowerBound()", () => {
    describe("Should return the month that is the first for the next given interval", () => {
      it("returns 6===july for interval 6 when date is before july", () => {
        const date = Date.UTC(2017, 2, 2)
        const expected = Date.UTC(2017, 6, 1)
        const result = util.incrementToNextLowerBound(date, 6)
        expect(result).toBe(expected)
      })

      it("returns 4===may for interval 4 when date is before may", () => {
        const date = Date.UTC(2017, 3, 2)
        const expected = Date.UTC(2017, 4, 1)
        const result = util.incrementToNextLowerBound(date, 4)
        expect(result).toBe(expected)
      })

      it("returns 3===april for interval 3 when date is before april", () => {
        const date = Date.UTC(2017, 2, 2)
        const expected = Date.UTC(2017, 3, 1)
        const result = util.incrementToNextLowerBound(date, 3)
        expect(result).toBe(expected)
      })
    })
  })

  describe("toISODateString()", () => {
    it("Returns the epox as a ISO date string", () => {
      const date = new Date(2017, 0, 1, 12)
      expect(util.toISODateString(date)).toMatch(/2017-01-01/)
    })
  })
})
