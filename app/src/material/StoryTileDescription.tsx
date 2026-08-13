import { faHandBackFist } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { StoryTileType } from '@gamepark/odysseus/material/StoryTile'
import { TALE_COST } from '@gamepark/odysseus/rules/OdysseusPlayerTurnRule'
import { RuleId } from '@gamepark/odysseus/rules/RuleId'
import { isMoveItemType, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { ItemContext, TokenDescription } from '@gamepark/react-game'
import { FavorCost } from '../theme/FavorIcon'
import { OdysseusMenuButton } from '../theme/OdysseusMenuButton'
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

/** How much a Tale tile grows under the pointer: three times its size, small as it is printed, to read its icon and its value. */
const HOVER_SCALE = 3

/** How high it rises with it: enough to clear everything it now covers, in a table where nothing else stands above 20. */
const HOVER_LIFT = 10

/** How far right of a tile its "take" button stands: past the tile's own half-width (4.67 / 2), before the next one. */
const BUTTON_X = 3

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
   * A Tale tile showing its face grows under the pointer. Nothing else is needed on top of the scale: the
   * tiles are laid out square with the table, and even at three times their size none of them reaches an
   * edge of it — the Ship's display sits mid-hull, and the six slots of a Story board leave enough margin
   * on either side (see TableLayout). A tile face down in the deck is left alone: there is nothing to read.
   */
  getHoverTransform(item: MaterialItem<number, LocationType>): string[] {
    if (this.isFlipped(item)) return []
    return [`translateZ(${HOVER_LIFT}em)`, `scale(${HOVER_SCALE})`]
  }

  /**
   * The PlayerTale destination has no drop zone to aim at: PositiveSequenceStrategy assigns the
   * leftmost free slot itself once the move is played (see OdysseusRules), so the move's location
   * carries no x — a button is the only sensible way to take a tile. Every takeable tile shows its
   * own at once, as Trial cards and skill cubes do, which leaves a click on a tile free to read its
   * help (see TrialCardDescription for the whole trade-off).
   */
  menuAlwaysVisible = true

  /**
   * The button sits just right of the tile, clear of the one next to it in the display. It spells out
   * its price, "-3 🦉", whenever the Tale is bought with Athena Favors — which is everywhere except
   * ChooseTaleRule, where a completed row of 4 Trial cards has already paid for it.
   */
  getItemMenu(_item: MaterialItem<number, LocationType>, context: ItemContext<number, MaterialType, LocationType>, legalMoves: MaterialMove[]) {
    const move = legalMoves.find(
      (move) => isMoveItemType(MaterialType.StoryTile)(move) && move.location.type === LocationType.PlayerTale && move.itemIndex === context.index
    )
    if (!move) return null
    const free = context.rules.game.rule?.id === RuleId.ChooseTale
    return (
      <OdysseusMenuButton x={BUTTON_X} y={0} move={move} cost={!free} label={free ? undefined : <FavorCost cost={TALE_COST} />} labelPosition="right">
        <FontAwesomeIcon icon={faHandBackFist} />
      </OdysseusMenuButton>
    )
  }
}

export const storyTileDescription = new StoryTileDescription()
