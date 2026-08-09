import { Skill } from '@gamepark/odysseus/Skill'
import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { hideUnlessDisplayedPlayer, isDisplayedPlayer } from '../DisplayedPlayer'
import { playerPanelCoordinates } from './PlayerPanelLocator'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'

const columnOffsets: Record<Skill, number> = {
  [Skill.Strength]: -14,
  [Skill.Intelligence]: -5,
  [Skill.Cunning]: 5,
  [Skill.Luck]: 14
}

/** The 4 skill columns of trial cards played "on adventure", stacked upward above the Story board. */
class PlayerAdventureColumnLocator extends ListLocator {
  // Negative z: each new card slides *behind* the ones already there, so the first card played
  // (index 0, closest to the track) stays fully visible on top instead of getting covered up
  // (same technique as ../dragon-bomb's PlayerCapturedDragonLocator fan).
  gap = { y: -2.2, z: -0.1 }

  getCoordinates(location: Location, context: MaterialContext) {
    if (!isDisplayedPlayer(location.player, context)) return playerPanelCoordinates(location.player!, context)
    const { x = 0, y = 0, z = 0 } = storyBoardPlaceLocator.getCoordinates(location, context)
    return { x: x + columnOffsets[location.id as Skill], y: y - 3, z: z - 1 }
  }

  hide(item: MaterialItem, context: MaterialContext) {
    return hideUnlessDisplayedPlayer(item, context)
  }
}

export const playerAdventureColumnLocator = new PlayerAdventureColumnLocator()
