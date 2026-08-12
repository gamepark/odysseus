import { CustomMove, isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { TrialCard } from '../material/TrialCard'
import { adventureTypeOf, PendingGain } from '../material/TrialCardStats'
import { Skill, skills } from '../Skill'
import { CustomMoveType } from './CustomMoveType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

const MAX_SKILL_VALUE = 6
const MAX_TALES = 6
const ADVENTURE_TYPES_FOR_EPIC = 5

/**
 * Resolves the queue of gains printed at the bottom of the Trial card that was just played
 * (rules-fr.pdf p.5 "2.A Partir à l'aventure"). A fixed-skill gain always targets its associated
 * skill, but the player may still spend an Athena Favor to turn it into a free pick instead
 * (rules-fr.pdf p.7 "À chaque fois que vous augmentez une compétence d'un point, vous pouvez dépenser
 * une Faveur d'Athéna pour la changer en une autre compétence"). A `'Choice'` gain (the rainbow icon)
 * is already a free pick, so no favor is needed there. Once the queue is empty, checks the Epic tile
 * and completed-row Tale consequences of the card that was just played on adventure (rest never
 * triggers either).
 */
export class ResolveSkillGainRule extends PlayerTurnRule {
  onRuleStart() {
    return this.autoResolveGains()
  }

  /**
   * Drains pending gains that carry no decision: a fixed-skill gain is silently dropped if its skill
   * is already maxed out — the card simply doesn't have anywhere to put that point. Stops as soon as
   * a gain is left that the player must resolve (fixed-skill or `'Choice'`), or resolves this turn's
   * consequences once the queue is fully drained.
   */
  autoResolveGains(): MaterialMove[] {
    while (this.pending.length > 0) {
      const [gain] = this.pending
      if (gain === 'Choice') return []
      if (!this.cubesUnderMax.id(gain).length) {
        this.dropPendingGain()
        continue
      }
      return []
    }
    return this.resolveConsequences()
  }

  get pending(): PendingGain[] {
    return this.remind<PendingGain[]>(Memory.PendingGains, this.player) ?? []
  }

  dropPendingGain() {
    this.memorize<PendingGain[]>(Memory.PendingGains, (queue = []) => queue.slice(1), this.player)
  }

  get cubesUnderMax() {
    return this.material(MaterialType.SkillCube).player(this.player).location((l) => (l.x ?? 0) < MAX_SKILL_VALUE)
  }

  /** A `'Choice'` gain offers every skill under max; a fixed-skill gain offers only its own skill. */
  getPlayerMoves() {
    const [gain] = this.pending
    if (gain === undefined) return []
    const cubes = gain === 'Choice' ? this.cubesUnderMax : this.cubesUnderMax.id(gain)
    const moves: MaterialMove[] = cubes.getItems<Skill>().map((item) => cubes.id(item.id).moveItem((i) => ({ ...i.location, x: i.location.x! + 1 })))
    if (gain !== 'Choice' && this.material(MaterialType.AthenaFavorToken).location(LocationType.PlayerAthenaFavor).player(this.player).length > 0) {
      moves.push(this.customMove(CustomMoveType.SpendFavorForSkillChange))
    }
    return moves
  }

  onCustomMove(move: CustomMove) {
    if (move.type === CustomMoveType.SpendFavorForSkillChange) {
      this.memorize<PendingGain[]>(Memory.PendingGains, ([, ...rest]) => ['Choice', ...rest], this.player)
      return [this.material(MaterialType.AthenaFavorToken).location(LocationType.PlayerAthenaFavor).player(this.player).deleteItem(1)]
    }
    return []
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.SkillCube)(move)) return []
    this.dropPendingGain()
    return this.autoResolveGains()
  }

  resolveConsequences(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const row = this.remind<number | undefined>(Memory.PlacedAdventureRow, this.player)
    this.forget(Memory.PlacedAdventureRow, this.player)
    if (row !== undefined) {
      if (this.isEpicEligible) {
        moves.push(
          this.material(MaterialType.EpicTile).location(LocationType.EpicDeck).deck().dealOne({ type: LocationType.PlayerEpic, player: this.player })
        )
      }
      if (this.isRowComplete(row) && this.tales.length < MAX_TALES) {
        this.memorize(Memory.TaleReturnsTo, RuleId.FinishTurn, this.player)
        moves.push(this.startRule(RuleId.ChooseTale))
        return moves
      }
    }
    moves.push(this.startRule(RuleId.FinishTurn))
    return moves
  }

  get tales() {
    return this.material(MaterialType.StoryTile).location(LocationType.PlayerTale).player(this.player)
  }

  get isEpicEligible() {
    if (this.material(MaterialType.EpicTile).location(LocationType.PlayerEpic).player(this.player).length > 0) return false
    if (this.material(MaterialType.EpicTile).location(LocationType.EpicDeck).length === 0) return false
    const cards = this.material(MaterialType.TrialCard).location(LocationType.PlayerAdventureColumn).player(this.player).getItems<TrialCard>()
    const types = new Set(cards.map((item) => adventureTypeOf(item.id)))
    return types.size === ADVENTURE_TYPES_FOR_EPIC
  }

  isRowComplete(y: number) {
    return skills.every(
      (skill) => this.material(MaterialType.TrialCard).location(LocationType.PlayerAdventureColumn).player(this.player).locationId(skill).length > y
    )
  }
}
