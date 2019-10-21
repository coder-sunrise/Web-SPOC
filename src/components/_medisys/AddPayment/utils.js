import { roundToTwoDecimals } from '@/utils/utils'

export const rounding = (config, amount) => {
  if (amount === 0) return 0 // abort early

  let returnAmount = Math.floor(amount)
  let cents = roundToTwoDecimals(amount % 1)

  if (cents === 0) return returnAmount + cents

  const { currencyRounding, currencyRoundingToTheClosest = 0.0 } = config
  const roundingPoint = parseFloat(currencyRoundingToTheClosest)

  if (currencyRounding.toLowerCase() === 'up') {
    switch (roundingPoint) {
      case 0.05:
        cents = cents < roundingPoint ? roundingPoint : 0.1
        break
      case 0.1:
        cents = Math.floor(cents * 10) / 10 + roundingPoint
        break
      case 0.5:
        cents = cents < roundingPoint ? roundingPoint : 1.0
        break
      case 1.0:
        cents = 1.0
        break
      default:
        break
    }
  } else {
    switch (roundingPoint) {
      case 0.05:
        cents = cents < roundingPoint ? 0.0 : roundingPoint
        break
      case 0.1:
        cents = Math.floor(cents * 10) / 10
        break
      case 0.5:
      case 1.0:
        cents = cents < roundingPoint ? 0.0 : roundingPoint
        break
      default:
        break
    }
  }

  returnAmount += cents
  return Math.round(returnAmount * 100) / 100
}
