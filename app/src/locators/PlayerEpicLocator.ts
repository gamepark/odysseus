import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { hideUnlessDisplayedPlayer, isDisplayedPlayer } from '../DisplayedPlayer'
import { playerPanelCoordinates } from './PlayerPanelLocator'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

/** The single Epic tile earned during the game, if any. */
class PlayerEpicLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    if (!isDisplayedPlayer(location.player, context)) return playerPanelCoordinates(location.player!, context)
    const { x = 0, y = 0, z = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    return { x: x + 19.8, y: y + 0.8, z }
  }

  hide(item: MaterialItem, context: MaterialContext) {
    return hideUnlessDisplayedPlayer(item, context)
  }
}

export const playerEpicLocator = new PlayerEpicLocator()
