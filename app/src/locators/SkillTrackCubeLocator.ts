import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { Skill } from '@gamepark/odysseus/Skill'
import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { hideUnlessDisplayedPlayer } from '../DisplayedPlayer'
import { storyBoardDescription } from '../material/StoryBoardDescription'

// The "0" space isn't on the same row as 1-6: it sits in its own box directly under space "1"
// (see StoryBoard.png). Percentages measured on the image (1916x401px) with each track's space "1" x.
const trackStartX: Record<Skill, number> = {
  [Skill.Strength]: 5.7,
  [Skill.Intelligence]: 28.4,
  [Skill.Cunning]: 53.8,
  [Skill.Luck]: 76.6
}
const TRACK_STEP_X = 3.66 // spacing between consecutive spaces 1-6
const TRACK_ROW_Y = 19 // y of spaces 1-6
const ZERO_ROW_Y = 36.5 // y of space 0, below the track row

class SkillTrackCubeLocator extends Locator {
  parentItemType = MaterialType.StoryBoard

  getParentItem(location: Location, context: MaterialContext) {
    return storyBoardDescription.getStaticItems(context).find((item) => item.location.player === location.player)
  }

  getPositionOnParent({ id, x = 0 }: Location) {
    const startX = trackStartX[id as Skill]
    if (x === 0) return { x: startX, y: ZERO_ROW_Y }
    return { x: startX + (x - 1) * TRACK_STEP_X, y: TRACK_ROW_Y }
  }

  hide(item: MaterialItem, context: MaterialContext) {
    return hideUnlessDisplayedPlayer(item, context)
  }
}

export const skillTrackCubeLocator = new SkillTrackCubeLocator()
