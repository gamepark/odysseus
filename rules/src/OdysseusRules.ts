import {
  CompetitiveScore,
  HiddenMaterialRules,
  hideItemId,
  MaterialGame,
  MaterialItem,
  MaterialMove,
  PositiveSequenceStrategy,
  TimeLimit
} from '@gamepark/rules-api'
import { sumBy } from 'es-toolkit'
import { EpicTile } from './material/EpicTile'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { getStoryTileScore, ScoredTrialCard, StoryTileType } from './material/StoryTile'
import { getTrialCardSkill, isShipTrialSlotFaceDown, TrialCard } from './material/TrialCard'
import { adventureTypeOf, trialCardStats } from './material/TrialCardStats'
import { ChooseTaleRule } from './rules/ChooseTaleRule'
import { ChooseTrialCardRule } from './rules/ChooseTrialCardRule'
import { FinishTurnRule } from './rules/FinishTurnRule'
import { ResolveSkillGainRule } from './rules/ResolveSkillGainRule'
import { RuleId } from './rules/RuleId'
import { Skill } from './Skill'

/** The central pair of a ShipTrialSlot row (x 2-3) stays hidden until revealed by ChooseTrialCardRule. */
const hideShipTrialSlotCentralPair = (item: MaterialItem<number, LocationType>) => (isShipTrialSlotFaceDown(item.location) ? ['id'] : [])

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
  implements
    CompetitiveScore<MaterialGame<number, MaterialType, LocationType>, MaterialMove<number, MaterialType, LocationType>, number>,
    TimeLimit<MaterialGame<number, MaterialType, LocationType>, MaterialMove<number, MaterialType, LocationType>, number>
{
  rules = {
    [RuleId.ChooseTrialCard]: ChooseTrialCardRule,
    [RuleId.ResolveSkillGain]: ResolveSkillGainRule,
    [RuleId.ChooseTale]: ChooseTaleRule,
    [RuleId.FinishTurn]: FinishTurnRule
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

  getScoredCards(player: number): ScoredTrialCard[] {
    return this.material(MaterialType.TrialCard)
      .location(LocationType.PlayerAdventureColumn)
      .player(player)
      .getItems<TrialCard>()
      .map((item) => ({ skill: getTrialCardSkill(item.id), value: trialCardStats[item.id].value, adventureType: adventureTypeOf(item.id) }))
  }

  getTaleScore(player: number, cards = this.getScoredCards(player)): number {
    const tales = this.material(MaterialType.StoryTile).location(LocationType.PlayerTale).player(player).getItems<StoryTileType>()
    return sumBy(tales, (tale) => getStoryTileScore(tale.id, cards))
  }

  /**
   * Sum of the successful Trial cards' VP (rules-fr.pdf p.7 "Fin de partie": a card is successful
   * when its value is <= the player's score in its skill), plus the Tales' VP (which count every
   * matching card, successful or not) and the Epic tile's VP (its id doubles as its VP, see EpicTile).
   */
  getScore(player: number): number {
    const skillScore = (skill: Skill) =>
      this.material(MaterialType.SkillCube).location(LocationType.SkillTrackCube).player(player).id(skill).getItem()!.location.x!
    const cards = this.material(MaterialType.TrialCard).location(LocationType.PlayerAdventureColumn).player(player).getItems<TrialCard>()
    const successScore = sumBy(cards, (item) =>
      trialCardStats[item.id].value <= skillScore(getTrialCardSkill(item.id)) ? trialCardStats[item.id].victoryPoints : 0
    )
    const epic = this.material(MaterialType.EpicTile).location(LocationType.PlayerEpic).player(player).getItem<EpicTile>()
    return successScore + this.getTaleScore(player) + (epic?.id ?? 0)
  }

  getTieBreaker(tieBreaker: number, player: number) {
    if (tieBreaker === 1) return this.getTaleScore(player)
    return
  }

  giveTime(): number {
    return 60
  }
}
