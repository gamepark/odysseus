import { MaterialType } from '@gamepark/odysseus/material/MaterialType.ts'
import { DeckLocator } from '@gamepark/react-game'

class EpicDeckLocator extends DeckLocator {
  parentItemType = MaterialType.ShipBoard

  getPositionOnParent() {
    return { x: 50, y: 81 }
  }
}
export const epicDeckLocator = new EpicDeckLocator()
