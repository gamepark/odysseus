import { MaterialType } from '@gamepark/odysseus/material/MaterialType.ts'
import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { hideUnlessDisplayedPlayer } from '../DisplayedPlayer'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

/** Trial cards played face down via "Rest", to the left of the Story board. */
class PlayerRestPileLocator extends DeckLocator {
  parentItemType = MaterialType.StoryBoard
  positionOnParent = { x: 0, y: 0 }

  getCoordinates(location: Location, context: MaterialContext) {
    const { x = 0, y = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    return { x: x - 21.2, y: y + 0.2 }
  }

  hide(item: MaterialItem, context: MaterialContext) {
    return hideUnlessDisplayedPlayer(item, context)
  }
}

export const playerRestPileLocator = new PlayerRestPileLocator()
