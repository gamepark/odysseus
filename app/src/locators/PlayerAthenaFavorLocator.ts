import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

/** Half a token: two Favors overlap, they never spread wider than this. */
const GAP = 1.8

/**
 * Athena's Favor tokens held by the player, spread left to right. `maxCount` is what caps the spread — with
 * 2, the list is already at its full width at the second token, and every one after that squeezes into the
 * same 0.9 cm (the step becomes GAP / (count - 1)), so a big holding stays a tight stack instead of running
 * across the table.
 */
class PlayerAthenaFavorLocator extends ListLocator {
  gap = { x: GAP }
  maxCount = 2

  getCoordinates(location: Location, context: MaterialContext) {
    const { x = 0, y = 0, z = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    // Half a gap left of where the pile used to be centred, so the spread stays centred on the same spot.
    return { x: x + 21 - GAP / 2, y: y - 2.5, z }
  }
}

export const playerAthenaFavorLocator = new PlayerAthenaFavorLocator()
