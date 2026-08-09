import { MaterialType } from '@gamepark/odysseus/material/MaterialType.ts'
import { TaleStack } from '@gamepark/odysseus/material/TaleStack'
import { DeckLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

// The 2 facedown stacks, right of the mast (measured on ShipBoard.jpg).
class TaleDeckLocator extends DeckLocator {
  parentItemType = MaterialType.ShipBoard
  rotateZ = 90
  maxCount = 10

  getPositionOnParent({ id }: Location) {
    return { x: id === TaleStack.First ? 57 : 63.5, y: 50 }
  }
}

export const taleDeckLocator = new TaleDeckLocator()
