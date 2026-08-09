import { MaterialContext, PileLocator } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { hideUnlessDisplayedPlayer, isDisplayedPlayer } from '../DisplayedPlayer'
import { playerPanelCoordinates } from './PlayerPanelLocator'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

/** Athena's Favor tokens held by the player. */
class PlayerAthenaFavorLocator extends PileLocator {
  radius = 0.8

  getCoordinates(location: Location, context: MaterialContext) {
    if (!isDisplayedPlayer(location.player, context)) return playerPanelCoordinates(location.player!, context)
    const { x = 0, y = 0, z = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    return { x: x + 21, y: y - 3, z}
  }

  hide(item: MaterialItem, context: MaterialContext) {
    return hideUnlessDisplayedPlayer(item, context)
  }
}

export const playerAthenaFavorLocator = new PlayerAthenaFavorLocator()
