import { MaterialType } from '@gamepark/odysseus/material/MaterialType.ts'
import { ListLocator } from '@gamepark/react-game'

class TaleDisplayLocator extends ListLocator {
  parentItemType = MaterialType.ShipBoard
  gap = { x: 3 }
  rotateZ = 90

  getPositionOnParent() {
    return { x: 27.3, y: 50 }
  }
}
export const taleDisplayLocator = new TaleDisplayLocator()
