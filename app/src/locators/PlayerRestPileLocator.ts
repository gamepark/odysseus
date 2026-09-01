import { css } from '@emotion/react'
import { DeckLocator, DropAreaDescription, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { trialCardDescription } from '../material/TrialCardDescription'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

/**
 * A plain white card-shaped area, so the spot reads as a slot when it is empty: nothing is printed on the
 * table there (the pile sits *beside* the Story board), and the tutorial step explaining the Rest ("place
 * the card here") would otherwise zoom onto a blank patch of table.
 *
 * Never rendered by default though — no `getLocations`, so react-game only mounts it when something asks
 * for it: the tutorial focusing on it, or a Trial being dragged, which is exactly when it is wanted.
 */
class RestPileDescription extends DropAreaDescription {
  getExtraCss() {
    return restSlotCss
  }
}

const restSlotCss = css`
  background-color: rgba(255, 255, 255, 0.7);
`

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
  locationDescription = new RestPileDescription(trialCardDescription)

  getCoordinates(location: Location, context: MaterialContext) {
    const { x = 0, y = 0, z = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    return { x: x - 21.4, y, z }
  }
}

export const playerRestPileLocator = new PlayerRestPileLocator()
