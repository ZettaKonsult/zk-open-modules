import {
  validateSwedishSsn,
  transformToApprovedFormat,
  calculateAge,
  calculateGender
} from "./"

describe("Test validation", () => {
  it("SSN for a man", () => {
    expect(validateSwedishSsn("910504-3690")).toBeTruthy()
  })
  it("SSN for a woman", () => {
    expect(validateSwedishSsn("910504-4128")).toBeTruthy()
  })
})

describe("Test transform", () => {
  it("Without hyphen-minus", () => {
    expect(transformToApprovedFormat("9105043690")).toEqual("910504-3690")
  })
  it("Full year and no hyphen-minus", () => {
    expect(transformToApprovedFormat("199105043690")).toEqual("910504-3690")
  })
  it("Full year with hyphen-minus", () => {
    expect(transformToApprovedFormat("19910504-3690")).toEqual("910504-3690")
  })
  it("Should have a plus sign as seperator", () => {
    expect(transformToApprovedFormat("110504+3690")).toEqual("110504+3690")
  })
})

describe("Test age calculation", () => {
  it("Should return current year - 1991", () => {
    const d = new Date()
    const expected = (d.getFullYear() - 1991).toString()

    expect(calculateAge("910504-3690")).toEqual(expected)
  })
  it("Should return current year - 1900", () => {
    const d = new Date()
    const expected = (d.getFullYear() - 1900).toString()

    expect(calculateAge("000504+3690")).toEqual(expected)
  })
  it("Should return current year - 2001", () => {
    const d = new Date()
    const expected = (d.getFullYear() - 2001).toString()

    expect(calculateAge("010504-3690")).toEqual(expected)
  })
})

describe("Test gender calculation", () => {
  it("Should return man", () => {
    expect(calculateGender("910504-3690")).toEqual("man")
  })
  it("Should return woman", () => {
    expect(calculateGender("910504-4128")).toEqual("woman")
  })
})
