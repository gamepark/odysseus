import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { Locator } from '@gamepark/react-game'
import { TurnCounterDescription } from '../material/TurnCounterDescription'

/**
 * The turn counter, on the ship's bow: on its axis, between the bow's tip and the draw pile (see
 * TrialDeckLocator), the one stretch of the hull nothing else is laid on. A location on the board rather than
 * on the table, so that a click on it opens its own help and not the board's.
 */
class TurnCounterLocator extends Locator {
  locationDescription = new TurnCounterDescription({ width: 3.6, height: 1.6, borderRadius: 0.4 })
  parentItemType = MaterialType.ShipBoard
  // No parent index: the ship board is a static item (see ShipBoardDescription), like for every other
  // location laid on it.
  location = {}

  getPositionOnParent() {
    return { x: 50, y: 14.3 }
  }
}

export const turnCounterLocator = new TurnCounterLocator()
