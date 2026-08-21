import { DeckLocator, DropAreaDescription, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { trialCardDescription } from '../material/TrialCardDescription'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

/**
 * Trial cards played face down via "Rest", to the left of the Story board.
 *
 * No `parentItemType`, like every other player-owned locator but the skill cubes: the pile is placed
 * beside the board, not on it, so it works its position out from the board's own locator. Declaring the
 * board as its parent would also cost the pile its drop area — react-game only offers the locations of a
 * *parentless* locator as drop targets while an item is dragged (see useStaticLocations), so a Trial could
 * be sent on adventure by drag and drop but never left to rest.
 *
 * `locationDescription` is set explicitly (rather than left to the base Locator's auto-generated one,
 * which only kicks in for a `parentItemType` locator) so the empty pile still renders a location
 * component before any card has ever been rested there — otherwise nothing registers a ref for it, and
 * a tutorial step focusing on it (see Tutorial.tsx's "rest1"/"rest2" steps) waits forever for a zoom
 * target that never mounts.
 */
class PlayerRestPileLocator extends DeckLocator {
  locationDescription = new DropAreaDescription(trialCardDescription)

  getCoordinates(location: Location, context: MaterialContext) {
    const { x = 0, y = 0, z = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    return { x: x - 21.4, y, z }
  }
}

export const playerRestPileLocator = new PlayerRestPileLocator()
