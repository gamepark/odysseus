import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { ShipSide } from '@gamepark/odysseus/material/ShipSide'
import { Locator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

/** Sits between the 2 facedown central slots of its row (x 2-3), slightly toward the ship's centerline. */
class AthenaFavorShipSlotLocator extends Locator {
  parentItemType = MaterialType.ShipBoard

  getPositionOnParent({ id }: Location) {
    return { x: 50, y: id === ShipSide.Port ? 7 : 94
    }
  }

  getRotateZ({ id }: Location) {
    return id === ShipSide.Port ? 180 : 0
  }
}

export const athenaFavorShipSlotLocator = new AthenaFavorShipSlotLocator()
