import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { hideUnlessDisplayedPlayer } from '../DisplayedPlayer'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

const xPositions = [- 13.7, -8.4, -3, 3.3, 8.7, 14.1]

/** Up to 6 gathered Tale tiles. */
class PlayerTaleLocator extends ListLocator {

  getCoordinates(location: Location, context: MaterialContext) {
    const { x = 0, y = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    return { x: x + xPositions[location.x], y: y + 1.75 }
  }

  hide(item: MaterialItem, context: MaterialContext) {
    return hideUnlessDisplayedPlayer(item, context)
  }
}

export const playerTaleLocator = new PlayerTaleLocator()
