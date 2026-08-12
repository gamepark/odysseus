import { MaterialType } from '@gamepark/odysseus/material/MaterialType.ts'
import { ListLocator } from '@gamepark/react-game'

class TaleDisplayLocator extends ListLocator {
  parentItemType = MaterialType.ShipBoard
  // The board is stored bow up, so the display runs up the hull, toward the bow.
  gap = { y: -3 }

  getPositionOnParent() {
    return { x: 50, y: 72.7 }
  }
}
export const taleDisplayLocator = new TaleDisplayLocator()
