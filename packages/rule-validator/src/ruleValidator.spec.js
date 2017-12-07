/**
 * @date  2017-11-27
 */

import validate from "./ruleValidator"

const pass = value => true
const fail = value => false
const failText = value => "Error message."
const failText2 = value => "Wrong."

const empty = {
  key1: []
}

const checks = {
  key1: [pass],
  key2: [fail],
  key3: [fail, pass],
  key4: [pass, fail],
  key5: [pass, failText],
  key6: [pass, pass],
  key7: [pass, failText, failText2],
  key8: [fail, failText]
}

const values = {
  key1: "",
  key2: "",
  key3: "",
  key4: "",
  key5: "",
  key6: "",
  key7: "",
  key8: ""
}

describe("Rules validator.", () => {
  it("Empty.", () => {
    try {
      validate(empty)
      fail()
    } catch (error) {
      expect(error.message).toMatch(/non-empty rules array/)
    }
  })
  it("No values.", () => {
    try {
      validate(checks)
      fail()
    } catch (error) {
      expect(error.message).toMatch(/No values defined/)
    }
  })
  it("One pass.", () => {
    expect(validate(checks, values)).toEqual({
      key1: true,
      key2: false,
      key3: false,
      key4: false,
      key5: "Error message.",
      key6: true,
      key7: "Error message.",
      key8: false
    })
  })
})
