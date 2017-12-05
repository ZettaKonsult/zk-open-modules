/* @flow */
export const getMonthRange = (epoch: number) => {
  const date = new Date(epoch)
  return {
    start: Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
    end: Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
  }
}

export const getYearRange = (epoch: number) => {
  const date = new Date(epoch)
  return {
    start: Date.UTC(date.getUTCFullYear(), 0, 1),
    end: Date.UTC(date.getUTCFullYear() + 1, 0, 0)
  }
}
