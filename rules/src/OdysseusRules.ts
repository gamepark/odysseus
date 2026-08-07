import { HiddenMaterialRules, hideItemId, MaterialGame, MaterialItem, MaterialMove, PositiveSequenceStrategy, TimeLimit } from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { isShipTrialSlotFaceDown } from './material/TrialCard'
import { RuleId } from './rules/RuleId'
import { TheFirstStepRule } from './rules/TheFirstStepRule'

/** The central pair of a ShipTrialSlot row (x 2-3) stays hidden; the other 4 slots (x 0,1,4,5) are dealt face up. */
const hideShipTrialSlotCentralPair = (item: MaterialItem<number, LocationType>) =>
  isShipTrialSlotFaceDown(item.location.x) ? ['id'] : []

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 *
 * Players have no color in Odysseus, so they are identified by their seat number (1 to 5).
 * No hidden information is asymmetric between players (nobody peeks at a face-down Trial card,
 * not even its owner), so {@link HiddenMaterialRules} is enough — no need for SecretMaterialRules.
 */
export class OdysseusRules
  extends HiddenMaterialRules<number, MaterialType, LocationType>
  implements TimeLimit<MaterialGame<number, MaterialType, LocationType>, MaterialMove<number, MaterialType, LocationType>, number>
{
  rules = {
    [RuleId.TheFirstStep]: TheFirstStepRule
  }

  hidingStrategies = {
    [MaterialType.TrialCard]: {
      [LocationType.TrialDeck]: hideItemId,
      [LocationType.PlayerRestPile]: hideItemId,
      [LocationType.ShipTrialSlot]: hideShipTrialSlotCentralPair
    }
  }

  locationsStrategies = {
    [MaterialType.TrialCard]: {
      [LocationType.TrialDeck]: new PositiveSequenceStrategy(),
      [LocationType.PlayerAdventureColumn]: new PositiveSequenceStrategy('y')
    },
    [MaterialType.StoryTile]: {
      [LocationType.TaleDeck]: new PositiveSequenceStrategy(),
      [LocationType.PlayerTale]: new PositiveSequenceStrategy(),
    },
    [MaterialType.EpicTile]: { [LocationType.EpicDeck]: new PositiveSequenceStrategy() }
  }

  giveTime(): number {
    return 60
  }
}
