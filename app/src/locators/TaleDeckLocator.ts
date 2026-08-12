import { MaterialType } from '@gamepark/odysseus/material/MaterialType.ts'
import { TaleStack } from '@gamepark/odysseus/material/TaleStack'
import { DeckLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

// The 2 facedown stacks, bow side of the mast (measured on ShipBoard.jpg, stored bow up).
class TaleDeckLocator extends DeckLocator {
  parentItemType = MaterialType.ShipBoard
  maxCount = 10

  getPositionOnParent({ id }: Location) {
    return { x: 50, y: id === TaleStack.First ? 43 : 36.5 }
  }
}

export const taleDeckLocator = new TaleDeckLocator()
