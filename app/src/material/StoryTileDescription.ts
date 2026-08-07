import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { StoryTileType } from '@gamepark/odysseus/material/StoryTile'
import { MaterialItem } from '@gamepark/rules-api'
import { TokenDescription } from '@gamepark/react-game'
import { svgDataUri } from '../svgDataUri'
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

// No back artwork was delivered for the Story tiles (see CLAUDE.md "Missing assets").
// This is a plain placeholder until the real art is available.
const placeholderBack = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="467" height="298"><rect width="463" height="294" x="2" y="2" rx="24" fill="#c9b896" stroke="black" stroke-opacity="0.25" stroke-width="4"/></svg>'
)

class StoryTileDescription extends TokenDescription<number, MaterialType, LocationType, StoryTileType> {
  width = 4.37
  height = 2.68
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

  backImage = placeholderBack

  isFlipped(item: Partial<MaterialItem<number, LocationType>>): boolean {
    return item.location?.type === LocationType.TaleDeck
  }
}

export const storyTileDescription = new StoryTileDescription()
