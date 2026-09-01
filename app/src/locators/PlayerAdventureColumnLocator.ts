import { Skill } from '@gamepark/odysseus/Skill'
import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { isDisplayedPlayer } from '../DisplayedPlayer'
import { storyBoardDescription } from '../material/StoryBoardDescription'
import { trialCardDescription } from '../material/TrialCardDescription'
import { getFirstTrialOffset, getTrialStep, showsAllTrials } from './PlayerRowLayout'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

/** Board's top edge exactly meeting the Trial's bottom edge: no tuck at all, see {@link isTutorialCloseUp}. */
const FULLY_CLEAR_OFFSET = storyBoardDescription.height / 2 + trialCardDescription.width / 2

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
 * The tutorial steps ("tuto.value" and "tuto.gains" in Tutorial.tsx) that zoom in on the very first Trial
 * card right after it's played, before anything else has touched the board — the only moments worth
 * clearing the tuck below for. Keep in sync with Tutorial.tsx's `steps` order if it ever changes: locators
 * can't import the tutorial (it imports them), so the index has to be duplicated here instead.
 */
const CLOSE_UP_TUTORIAL_STEPS = [5, 6]

const isTutorialCloseUp = (context: MaterialContext) => CLOSE_UP_TUTORIAL_STEPS.includes(context.rules.game.tutorial?.step ?? -1)

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
    // for it (see PlayerRowLayout) — never far enough under to take its victory point laurel with it. The
    // tutorial's two close-up steps skip the tuck for this one card so its full face reads on screen; every
    // other moment — including later in that same tutorial, once the lesson has moved on — tucks it exactly
    // like a real game would.
    const offset = isTutorialCloseUp(context) ? FULLY_CLEAR_OFFSET : getFirstTrialOffset(context)
    return { x: columnX, y: y - offset, z: z - 0.05 }
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { tutorialStep: context.rules.game.tutorial?.step }
  }
}

export const playerAdventureColumnLocator = new PlayerAdventureColumnLocator()
