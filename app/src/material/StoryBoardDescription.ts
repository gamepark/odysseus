import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { BoardDescription, MaterialContext } from '@gamepark/react-game'
import StoryBoard from '../images/boards/StoryBoard.png'
import { getStoryBoardRowY } from '../locators/PlayerRowLayout'
import { StoryBoardHelp } from './help/StoryBoardHelp'

class StoryBoardDescription extends BoardDescription {
  width = 38.32
  height = 8.02
  image = StoryBoard
  transparency = true
  help = StoryBoardHelp

  // One board per player, all on the table at once, stacked in a column (see PlayerRowLayout). Each one
  // carries its own row, which changes when another player is selected.
  //
  // The `y` is never read back — StoryBoardPlaceLocator works the row out from the player alone. It is here
  // because a *static* item is the one thing position dependencies do not reach: StaticItemsDisplay
  // memoizes it on the item, the boundaries and the legal moves, and nothing else. Everything laid on the
  // boards repositions on its own, `rules.game.view` being part of what react-game watches, but the boards
  // would only follow while the legal moves happen to change too — that is, on your turn, and not while
  // you sit watching someone else play.
  getStaticItems(context: MaterialContext) {
    return context.rules.players.map((player) => ({
      location: { type: LocationType.StoryBoardPlace, player, y: getStoryBoardRowY(player, context) }
    }))
  }
}

export const storyBoardDescription = new StoryBoardDescription()
