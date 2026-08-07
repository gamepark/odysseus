import { MaterialType } from '@gamepark/odysseus/material/MaterialType.ts'
import { DeckLocator } from '@gamepark/react-game'


class TrialDeckLocator extends DeckLocator {
  parentItemType = MaterialType.ShipBoard
  maxCount = 10

  getPositionOnParent() {
    return { x: 74, y: 50 }
  }
}
export const trialDeckLocator = new TrialDeckLocator()
