import { Skill } from '@gamepark/odysseus/Skill'
import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { isDisplayedPlayer } from '../DisplayedPlayer'
import { getFirstTrialOffset, getTrialStep, showsAllTrials } from './PlayerRowLayout'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

const columnOffsets: Record<Skill, number> = {
  [Skill.Strength]: -14,
  [Skill.Intelligence]: -5,
  [Skill.Cunning]: 5,
  [Skill.Luck]: 14
}

/** Whether this column is one of those the height affords to lay out (see PlayerRowLayout). */
const isLaidOut = (location: Location, context: MaterialContext) =>
  showsAllTrials(context) || isDisplayedPlayer(location.player, context)

/**
 * The 4 skill columns of Trial cards played "on adventure", climbing above their owner's Story board.
 * Up to 3 players every column is laid out for real; past that only the selected player's are, the others
 * piling up on the middle of their own board, which covers them entirely — the column is still there, just
 * not the one being read (see DisplayedPlayer and PlayerRowLayout).
 */
class PlayerAdventureColumnLocator extends ListLocator {
  // Negative z: each new card slides *behind* the ones already there, so the first card played (index 0,
  // closest to the track) stays fully visible on top instead of getting covered up (same technique as
  // ../dragon-bomb's PlayerCapturedDragonLocator fan). The whole column has to stay within the 0.05 that
  // separates it from the board of the row above, hence the very small step.
  getGap(location: Location, context: MaterialContext) {
    if (!isLaidOut(location, context)) return { y: 0, z: -0.001 }
    return { y: -getTrialStep(context), z: -0.01 }
  }

  getCoordinates(location: Location, context: MaterialContext) {
    const { x = 0, y = 0, z = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    // Each column keeps its own place above the skill track it belongs to, whoever is selected. Only the
    // climb above the board is dropped when they are not: the cards then sit flat on the middle of their
    // own board, which is taller than a card and hides the lot — a column that is not being read, not one
    // that moved somewhere else.
    const columnX = x + columnOffsets[location.id as Skill]
    if (!isLaidOut(location, context)) return { x: columnX, y, z: z - 0.05 }
    // The bottom card of the column rests on the board's top edge, or slid under it when the height calls
    // for it (see PlayerRowLayout) — never far enough under to take its victory point laurel with it.
    return { x: columnX, y: y - getFirstTrialOffset(context), z: z - 0.05 }
  }
}

export const playerAdventureColumnLocator = new PlayerAdventureColumnLocator()
