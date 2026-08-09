import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { StoryTileType } from '@gamepark/odysseus/material/StoryTile'
import { isMoveItemType, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { ItemContext, TokenDescription } from '@gamepark/react-game'
import { StoryTileHelp } from './help/StoryTileHelp'
import Creatures from '../images/tokens/story/Creatures.png'
import Cunning from '../images/tokens/story/Cunning.png'
import Encounters from '../images/tokens/story/Encounters.png'
import Gods from '../images/tokens/story/Gods.png'
import Intelligence from '../images/tokens/story/Intelligence.png'
import Ithaca from '../images/tokens/story/Ithaca.png'
import Luck from '../images/tokens/story/Luck.png'
import Navigation from '../images/tokens/story/Navigation.png'
import Strength from '../images/tokens/story/Strength.png'
import Value1Or2 from '../images/tokens/story/Value1Or2.png'
import Value3 from '../images/tokens/story/Value3.png'
import Value4 from '../images/tokens/story/Value4.png'
import Value5 from '../images/tokens/story/Value5.png'
import Value6 from '../images/tokens/story/Value6.png'
import Back from '../images/tokens/story/StoryTokenBack.png'

class StoryTileDescription extends TokenDescription<number, MaterialType, LocationType, StoryTileType> {
  width = 4.67
  height = 2.98
  transparency = true

  images = {
    [StoryTileType.Strength]: Strength,
    [StoryTileType.Intelligence]: Intelligence,
    [StoryTileType.Cunning]: Cunning,
    [StoryTileType.Luck]: Luck,
    [StoryTileType.Navigation]: Navigation,
    [StoryTileType.Encounters]: Encounters,
    [StoryTileType.Gods]: Gods,
    [StoryTileType.Creatures]: Creatures,
    [StoryTileType.Ithaca]: Ithaca,
    [StoryTileType.Value1Or2]: Value1Or2,
    [StoryTileType.Value3]: Value3,
    [StoryTileType.Value4]: Value4,
    [StoryTileType.Value5]: Value5,
    [StoryTileType.Value6]: Value6
  }

  backImage = Back
  help = StoryTileHelp

  isFlipped(item: Partial<MaterialItem<number, LocationType>>): boolean {
    return item.location?.type === LocationType.TaleDeck
  }

  /**
   * The PlayerTale destination has no drop zone to aim at: PositiveSequenceStrategy assigns the
   * leftmost free slot itself once the move is played (see OdysseusRules), so the move's location
   * carries no x. A short click plays that same move directly instead.
   */
  canShortClick(move: MaterialMove, context: ItemContext): boolean {
    return isMoveItemType(MaterialType.StoryTile)(move) && move.location.type === LocationType.PlayerTale && move.itemIndex === context.index
  }
}

export const storyTileDescription = new StoryTileDescription()
