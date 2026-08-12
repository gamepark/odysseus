import { MaterialType } from '@gamepark/odysseus/material/MaterialType.ts'
import { DeckLocator } from '@gamepark/react-game'


class TrialDeckLocator extends DeckLocator {
  parentItemType = MaterialType.ShipBoard
  // Cancels the ship board's own quarter turn, like the Trial slots do (see ShipTrialSlotLocator).
  rotateZ = 90
  maxCount = 10

  getPositionOnParent() {
    return { x: 74, y: 50 }
  }
}
export const trialDeckLocator = new TrialDeckLocator()
