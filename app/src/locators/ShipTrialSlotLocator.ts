import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { ShipSide } from '@gamepark/odysseus/material/ShipSide'
import { ItemContext, Locator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { shipBoardDescription } from '../material/ShipBoardDescription'
import { shipBoardPlaceLocator } from './ShipBoardPlaceLocator'

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

  /**
   * A card being dragged straightens up, like a card taken out of a hand does (see HandLocator): the tilt
   * belongs to the slot it is printed on, not to the card the player is carrying to its destination. The
   * flag is set by ItemDisplay as soon as a drag transform is applied, and the drop animation is built
   * from the same upright transform, so the card lands without a spin.
   */
  getItemRotateZ(item: MaterialItem, context: ItemContext) {
    if (context.isDragging) return 0
    return super.getItemRotateZ(item, context)
  }
}

export const shipTrialSlotLocator = new ShipTrialSlotLocator()

/**
 * Where a slot falls on the table. The locator itself never needs this — a Trial on the Ship is placed on
 * its parent board, in percentages of it — but anything reasoning about the table's own edges does (see
 * TrialCardDescription, which slides a hovered Trial back inside them).
 */
export function getShipTrialSlotCoordinates({ id, x = 0 }: Location, context: MaterialContext) {
  const { x: boardX = 0, y: boardY = 0 } = shipBoardPlaceLocator.getCoordinates({ type: LocationType.ShipBoardPlace }, context)
  return {
    x: boardX + (shipBoardDescription.width * (xPercent[id as ShipSide][x] - 50)) / 100,
    y: boardY + (shipBoardDescription.height * (yPercents[x] - 50)) / 100
  }
}
