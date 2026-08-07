import { MaterialContext, PileLocator } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { hideUnlessDisplayedPlayer } from '../DisplayedPlayer'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

/** Athena's Favor tokens held by the player. */
class PlayerAthenaFavorLocator extends PileLocator {
  radius = 0.8

  getCoordinates(location: Location, context: MaterialContext) {
    const { x = 0, y = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    return { x: x + 21, y: y - 3}
  }

  hide(item: MaterialItem, context: MaterialContext) {
    return hideUnlessDisplayedPlayer(item, context)
  }
}

export const playerAthenaFavorLocator = new PlayerAthenaFavorLocator()
