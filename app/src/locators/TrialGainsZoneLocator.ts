import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { LocationDescription, Locator } from '@gamepark/react-game'

/** UI-only: the immediate-gain icons printed in the red band at the bottom of a Trial card, for the tutorial to highlight. */
class TrialGainsZoneLocator extends Locator {
  locationDescription = new LocationDescription({ width: 1.9, height: 1.1, borderRadius: 0.3 })
  parentItemType = MaterialType.TrialCard
  positionOnParent = { x: 50, y: 88 }
}

export const trialGainsZoneLocator = new TrialGainsZoneLocator()
