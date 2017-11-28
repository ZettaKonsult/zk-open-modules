const insertItem = (array, item, index = array.length) => [
  ...array.slice(0, index),

  item,
  ...array.slice(index)
]

const removeItem = (array, index) => [
  ...array.slice(0, index),
  ...array.slice(index + 1)
]

module.exports =

{
  insertItem,
  removeItem
}
