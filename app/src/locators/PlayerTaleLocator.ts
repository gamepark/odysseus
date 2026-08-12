import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

const xPositions = [- 13.9, -8.6, -3.2, 3.5, 8.9, 14.3]

/** Up to 6 gathered Tale tiles. */
class PlayerTaleLocator extends ListLocator {

  getCoordinates(location: Location, context: MaterialContext) {
    const { x = 0, y = 0, z = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    return { x: x + xPositions[location.x ?? 0], y: y + 1.75, z }
  }
}

export const playerTaleLocator = new PlayerTaleLocator()
