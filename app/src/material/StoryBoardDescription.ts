import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { BoardDescription, MaterialContext } from '@gamepark/react-game'
import { getDisplayedPlayer } from '../DisplayedPlayer'
import StoryBoard from '../images/boards/StoryBoard.png'
import { StoryBoardHelp } from './help/StoryBoardHelp'

class StoryBoardDescription extends BoardDescription {
  width = 38.32
  height = 8.02
  image = StoryBoard
  transparency = true
  help = StoryBoardHelp

  // Only one player's board is on the table at a time (switched by clicking their panel). Static items
  // never go through Locator.hide(), so the filtering has to happen here instead.
  getStaticItems(context: MaterialContext) {
    const player = getDisplayedPlayer(context.player ?? context.rules.players[0])
    return [{ location: { type: LocationType.StoryBoardPlace, player } }]
  }
}

export const storyBoardDescription = new StoryBoardDescription()
