import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

// Centre of each of the 6 recesses, measured on the publisher's die line for the board's top layer
// ("Die line PLATEAU PERSO-2ND LAYER - 2.png"): its 4489x910 cut box maps onto the opaque pixels of
// StoryBoard.png, whose centre is the origin here. The small grip tab on the left of every recess is
// left out of the measure — the tile itself is a plain torn rectangle, so it centres on the recess
// without it. The recesses are 4.55 x 2.80 cm for a 4.37 x 2.68 cm tile: that clearance is the reason
// a few tenths of a millimeter off is visible.
const xPositions = [-13.98, -8.52, -3.06, 3.32, 8.88, 14.43]
const Y_POSITION = 1.6

/** Up to 6 gathered Tale tiles. */
class PlayerTaleLocator extends ListLocator {

  getCoordinates(location: Location, context: MaterialContext) {
    const { x = 0, y = 0, z = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    return { x: x + xPositions[location.x ?? 0], y: y + Y_POSITION, z }
  }
}

export const playerTaleLocator = new PlayerTaleLocator()
