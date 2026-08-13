import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { storyBoardDescription } from '../material/StoryBoardDescription'

// Centre of each of the 6 recesses, in percentages of the board — measured on the publisher's die line
// for its top layer ("Die line PLATEAU PERSO-2ND LAYER - 2.png"), whose 4489x910 cut box maps onto the
// opaque pixels of StoryBoard.png. The small grip tab on the left of every recess is left out of the
// measure — the tile itself is a plain torn rectangle, so it centres on the recess without it. The
// recesses are 4.55 x 2.80 cm for a 4.37 x 2.68 cm tile: that clearance is the reason a few tenths of a
// millimeter off is visible.
const xPercents = [13.518, 27.766, 42.015, 58.664, 73.173, 87.657]
const Y_PERCENT = 69.95

/** Up to 6 gathered Tale tiles. */
class PlayerTaleLocator extends ListLocator {
  // Laid *on* the board rather than beside it, like the skill cubes are (see SkillTrackCubeLocator): a
  // tile then sits at the board's own thickness in front of it, which is what the pointer needs to reach
  // it. Coplanar — which is what offsetting from StoryBoardPlaceLocator gave — the board takes the hover
  // and the click for itself, the tile still drawing over it, so nothing looked amiss until a tile had to
  // be hovered (see StoryTileDescription).
  parentItemType = MaterialType.StoryBoard

  // Every player has a board, so this always resolves — it just has to pick the right one out of the 5.
  getParentItem(location: Location, context: MaterialContext) {
    return storyBoardDescription.getStaticItems(context).find((item) => item.location.player === location.player)
  }

  /**
   * A location with no slot stands for the board as a whole, and is centred on it: that is what the move
   * to PlayerTale carries while a tile is being dragged, PositiveSequenceStrategy picking the leftmost free
   * recess only once it is played (see StoryTileDescription). Left on the first recess it would drag the
   * whole board-sized drop area a third of the board off to the left.
   */
  getPositionOnParent(location: Location) {
    if (location.x === undefined) return { x: 50, y: 50 }
    return { x: xPercents[location.x], y: Y_PERCENT }
  }

  // No getCoordinates override: placeItemOnParent already carries the board's own position, and anything
  // returned here would be *added* on top of it.
}

export const playerTaleLocator = new PlayerTaleLocator()
