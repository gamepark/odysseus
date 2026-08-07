import { MaterialType } from '@gamepark/odysseus/material/MaterialType.ts'
import { DeckLocator } from '@gamepark/react-game'

class EpicDeckLocator extends DeckLocator {
  parentItemType = MaterialType.ShipBoard
  rotateZ = 90

  getPositionOnParent() {
    return { x: 19, y: 50 }
  }
}
export const epicDeckLocator = new EpicDeckLocator()
