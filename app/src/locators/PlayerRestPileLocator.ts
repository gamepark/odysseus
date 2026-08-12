import { MaterialType } from '@gamepark/odysseus/material/MaterialType.ts'
import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

/** Trial cards played face down via "Rest", to the left of the Story board. */
class PlayerRestPileLocator extends DeckLocator {
  parentItemType = MaterialType.StoryBoard
  positionOnParent = { x: 0, y: 0 }

  getCoordinates(location: Location, context: MaterialContext) {
    const { x = 0, y = 0, z = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    return { x: x - 21.4, y, z }
  }
}

export const playerRestPileLocator = new PlayerRestPileLocator()
