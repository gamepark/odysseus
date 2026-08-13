import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { TrialCard } from '../material/TrialCard'
import { adventureTypeOf, PendingGain } from '../material/TrialCardStats'
import { Skill, skills } from '../Skill'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

const MAX_SKILL_VALUE = 6
const MAX_TALES = 6
const ADVENTURE_TYPES_FOR_EPIC = 5

/**
 * A skill is free to raise as long as one of the gains left to resolve grants it: its own icon
 * printed on the card, or the rainbow icon that lets you pick any skill. Also used client-side, to
 * tell the free buttons from the ones that cost a Favor (see SkillCubeDescription).
 */
export const isFreeSkillGain = (pending: PendingGain[], skill: Skill) => pending.includes(skill) || pending.includes('Choice')

/**
 * Resolves the gains printed at the bottom of the Trial card that was just played (rules-fr.pdf p.5
 * "2.A Partir à l'aventure"), all of them in one rule: the player raises the skills they want, one
 * cube step each, and every step eats one gain. Raising a skill the card offers is free; raising any
 * other one spends an Athena Favor to redirect a gain (rules-fr.pdf p.7 "À chaque fois que vous
 * augmentez une compétence d'un point, vous pouvez dépenser une Faveur d'Athéna pour la changer en
 * une autre compétence"), which is paid on the spot rather than asked for first — hence a plain cube
 * move as the player's move, the Favor going out with it as a consequence. Once nothing is left to
 * resolve, checks the Epic tile and completed-row Tale consequences of the card that was just played
 * on adventure (rest never triggers either).
 */
export class ResolveSkillGainRule extends PlayerTurnRule {
  onRuleStart() {
    return this.dropUnresolvableGains()
  }

  get pending(): PendingGain[] {
    return this.remind<PendingGain[]>(Memory.PendingGains, this.player) ?? []
  }

  get cubesUnderMax() {
    return this.material(MaterialType.SkillCube).player(this.player).location((l) => (l.x ?? 0) < MAX_SKILL_VALUE)
  }

  get favors() {
    return this.material(MaterialType.AthenaFavorToken).location(LocationType.PlayerAthenaFavor).player(this.player)
  }

  /**
   * Drops the gains that have nowhere left to go — a fixed-skill gain whose track is already full (no
   * Favor redirects a point that cannot be gained in the first place), and every gain at all once all
   * 4 tracks are full — then resolves this turn's consequences if that empties the queue. Called again
   * after each increase, as that is when a track can fill up.
   */
  dropUnresolvableGains(): MaterialMove[] {
    const cubes = this.cubesUnderMax
    const pending = cubes.length ? this.pending.filter((gain) => gain === 'Choice' || cubes.id(gain).length > 0) : []
    this.memorize<PendingGain[]>(Memory.PendingGains, pending, this.player)
    return pending.length ? [] : this.resolveConsequences()
  }

  /** One step forward per skill still under 6: free if a pending gain grants it, otherwise offered only if a Favor can pay for it. */
  getPlayerMoves() {
    const pending = this.pending
    if (!pending.length) return []
    const canPayFavor = this.favors.getQuantity() > 0
    const cubes = this.cubesUnderMax
    return cubes
      .getItems<Skill>()
      .filter((item) => canPayFavor || isFreeSkillGain(pending, item.id!))
      .map((item) => cubes.id(item.id).moveItem((cube) => ({ ...cube.location, x: cube.location.x! + 1 })))
  }

  /**
   * Takes the point out of the gain it comes from, and pays the Favor when no gain grants that skill.
   * Priced here rather than in {@link afterItemMove} so that the Favor leaves ahead of the rule change
   * the last gain triggers — a spend queued behind it would be read as the next player's (see
   * OdysseusLogDescription, which attributes it to the rule's current player).
   */
  beforeItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.SkillCube)(move)) return []
    const skill = this.material(MaterialType.SkillCube).getItem<Skill>(move.itemIndex).id!
    const moves: MaterialMove[] = []
    const pending = [...this.pending]
    // The card's own icon for that skill first, then the rainbow one. Failing both, the first gain in
    // line will do — it is being redirected, and that costs 1 Favor. Taking the free skills first is
    // therefore what leaves the player the most choice.
    let index = pending.indexOf(skill)
    if (index < 0) index = pending.indexOf('Choice')
    if (index < 0) {
      index = 0
      moves.push(this.favors.deleteItem(1))
    }
    pending.splice(index, 1)
    this.memorize<PendingGain[]>(Memory.PendingGains, pending, this.player)
    return moves
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.SkillCube)(move)) return []
    return this.dropUnresolvableGains()
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
