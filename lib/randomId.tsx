const { getRandomValues } = require('crypto')

export const generateRandomId = () => {
  const length = 8
  const bytesNeeded = Math.ceil(length / 2)
  const array = new Uint32Array(bytesNeeded)
  getRandomValues(array)
  const randomId = Array.from(array)
    .map((number) => number.toString(16).padStart(8, '0'))
    .join('')
  return randomId.slice(0, length)
}
