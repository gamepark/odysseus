import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { LocationDescription, Locator } from '@gamepark/react-game'

/** UI-only: the threshold and victory-point badges printed in a Trial card's top-left corner, for the tutorial to highlight. */
class TrialValueZoneLocator extends Locator {
  locationDescription = new LocationDescription({ width: 1.7, height: 2.3, borderRadius: 0.3 })
  parentItemType = MaterialType.TrialCard
  positionOnParent = { x: 14, y: 20 }
}

export const trialValueZoneLocator = new TrialValueZoneLocator()
