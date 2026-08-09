import { MaterialType } from '@gamepark/odysseus/material/MaterialType.ts'
import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { hideUnlessDisplayedPlayer, isDisplayedPlayer } from '../DisplayedPlayer'
import { playerPanelCoordinates } from './PlayerPanelLocator'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

/** Trial cards played face down via "Rest", to the left of the Story board. */
class PlayerRestPileLocator extends DeckLocator {
  parentItemType = MaterialType.StoryBoard
  positionOnParent = { x: 0, y: 0 }

  getCoordinates(location: Location, context: MaterialContext) {
    if (!isDisplayedPlayer(location.player, context)) return playerPanelCoordinates(location.player!, context)
    const { x = 0, y = 0, z = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    return { x: x - 21.4, y: y, z }
  }

  hide(item: MaterialItem, context: MaterialContext) {
    return hideUnlessDisplayedPlayer(item, context)
  }
}

export const playerRestPileLocator = new PlayerRestPileLocator()
