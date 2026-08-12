import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { getStoryBoardRowY, getStoryBoardRowZ, STORY_BOARD_X } from './PlayerRowLayout'

// Every player has their board on the table, in one column on the right of the ship board — see
// PlayerRowLayout for how the rows are laid out. Every other player-owned locator offsets from this one.
class StoryBoardPlaceLocator extends Locator {
  // Always worked out from the player, never read off the location: the player-owned locators offset from
  // this one by passing their *own* location, and some of those use x/y for something else entirely (a
  // Trial's rank in its column, a Tale tile's slot).
  getCoordinates(location: Location, context: MaterialContext) {
    return {
      x: STORY_BOARD_X,
      y: getStoryBoardRowY(location.player, context),
      z: getStoryBoardRowZ(location.player, context)
    }
  }
}

export const storyBoardPlaceLocator = new StoryBoardPlaceLocator()
