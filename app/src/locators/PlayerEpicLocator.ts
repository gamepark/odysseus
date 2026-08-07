import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { hideUnlessDisplayedPlayer } from '../DisplayedPlayer'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

/** The single Epic tile earned during the game, if any. */
class PlayerEpicLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    const { x = 0, y = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    return { x: x + 19.6, y: y + 1 }
  }

  hide(item: MaterialItem, context: MaterialContext) {
    return hideUnlessDisplayedPlayer(item, context)
  }
}

export const playerEpicLocator = new PlayerEpicLocator()
