import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { ShipSide } from '@gamepark/odysseus/material/ShipSide'
import { Locator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

// Measured directly on ShipBoard.jpg (edge detection on the printed slot borders, not a formula):
// percentages of the board's width/height for the 12 printed slots (6 per side), and each one's own
// rotation in degrees, matching how the artwork tilts them. The board is stored bow up, so a slot's
// index runs down the height (index 0 at the stern, at the bottom) and the side picks the column.
const yPercents = [88.2, 74.2, 60, 40.1, 26, 11.8]

const rotations: Record<ShipSide, number[]> = {
  [ShipSide.Port]: [-7.4, -4.5, -1.6, 1.7, 4.1, 6.9],
  [ShipSide.Starboard]: [7.1, 4.2, 1.5, -1.7, -4.3, -7.2]
}
const xPercent: Record<ShipSide, number[]> = {
  [ShipSide.Port]: [19.5, 17, 14.5, 14.5, 17, 19.5],
  [ShipSide.Starboard]: [80.5, 83.5, 85.5, 85.5, 83.5, 80.5]
}

class ShipTrialSlotLocator extends Locator {
  parentItemType = MaterialType.ShipBoard

  getPositionOnParent({ id, x = 0 }: Location) {
    return { x: xPercent[id as ShipSide][x], y: yPercents[x] }
  }

  // Trial cards are square, so a card turned a quarter more than its slot still covers exactly the same
  // printed rectangle; the tilt below is the one printed on the board, which leaves the artwork and the
  // "adventure" / "rest" buttons above it the right way up.
  getRotateZ({ id, x = 0 }: Location) {
    return rotations[id as ShipSide][x]
  }
}

export const shipTrialSlotLocator = new ShipTrialSlotLocator()
