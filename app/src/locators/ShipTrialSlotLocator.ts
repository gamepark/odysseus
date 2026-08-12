import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { ShipSide } from '@gamepark/odysseus/material/ShipSide'
import { Locator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

// Measured directly on ShipBoard.jpg (edge detection on the printed slot borders, not a formula):
// percentages of the board's width/height for the 12 printed slots (6 per side), and each one's own
// rotation in degrees, matching how the artwork tilts them.
const xPercents = [11.8, 25.8, 40, 59.9, 74, 88.2]

const rotations: Record<ShipSide, number[]> = {
  [ShipSide.Port]: [-7.4, -4.5, -1.6, 1.7, 4.1, 6.9],
  [ShipSide.Starboard]: [7.1, 4.2, 1.5, -1.7, -4.3, -7.2]
}
const yPercent: Record<ShipSide, number[]> = {
  [ShipSide.Port]: [19.5, 17, 14.5 , 14.5, 17, 19.5],
  [ShipSide.Starboard]: [80.5, 83.5, 85.5, 85.5, 83.5, 80.5]
}

class ShipTrialSlotLocator extends Locator {
  parentItemType = MaterialType.ShipBoard

  getPositionOnParent({ id, x = 0 }: Location) {
    return { x: xPercents[x], y: yPercent[id as ShipSide][x] }
  }

  // The extra quarter turn cancels the ship board's own (see ShipBoardPlaceLocator), so the Trials stay
  // upright and readable while the board is laid out lengthwise. Trial cards are square, so a card turned
  // a quarter more than its slot still covers exactly the same printed rectangle — only its artwork, and
  // the "adventure" / "rest" buttons above it, turn back the right way up.
  getRotateZ({ id, x = 0 }: Location) {
    return rotations[id as ShipSide][x] + 90
  }
}

export const shipTrialSlotLocator = new ShipTrialSlotLocator()
