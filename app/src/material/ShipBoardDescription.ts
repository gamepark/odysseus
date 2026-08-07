import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { BoardDescription } from '@gamepark/react-game'
import ShipBoard from '../images/boards/ShipBoard.jpg'

class ShipBoardDescription extends BoardDescription {
  width = 49.02
  height = 24.52
  image = ShipBoard
  transparency = true

  staticItem = { location: { type: LocationType.ShipBoardPlace } }
}

export const shipBoardDescription = new ShipBoardDescription()
