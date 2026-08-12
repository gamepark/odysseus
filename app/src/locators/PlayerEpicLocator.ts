import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

/** The single Epic tile earned during the game, if any. */
class PlayerEpicLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    const { x = 0, y = 0, z = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    return { x: x + 19.8, y: y + 0.8, z }
  }
}

export const playerEpicLocator = new PlayerEpicLocator()
