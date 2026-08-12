import { CustomMove, getEnumValues, isMoveItemType, ItemMove, Material, MaterialMove, MoveItem, PlayerTurnRule, RuleStep } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { ShipSide } from '../material/ShipSide'
import { getTrialCardSkill, TrialCard } from '../material/TrialCard'
import { PendingGain, trialCardStats } from '../material/TrialCardStats'
import { CustomMoveType } from './CustomMoveType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

/** Also used client-side to preview the "go on adventure" option before it's played (see TrialCardDescription). */
export const MAX_CARDS_PER_SKILL = 4
const MAX_TALES = 6
const TALE_COST = 3

/**
 * Steps 1 and 2 of the rulebook's turn structure in one rule: pick a Trial card at either end of
 * either side of the Ship (rules-fr.pdf p.4), and send it straight on adventure or to rest
 * (rules-fr.pdf p.5) — there's no player decision in between the two, so a single move takes the
 * card directly from the Ship to its final spot instead of visiting a staging location first.
 * Picking the slot next to the hidden central pair (x 1 or 4) reveals that pair and grants the
 * Athena Favor token sitting between them. Spending 3 Athena Favors for a Tale (rules-fr.pdf p.6,
 * "En dépensant, une seule fois pendant votre tour, 3 Faveurs d'Athéna") is also offered here, once
 * per turn, as it doesn't consume the mandatory card choice.
 */
export class ChooseTrialCardRule extends PlayerTurnRule {
  /**
   * Resets the once-per-turn Tale purchase, but only when a genuinely new turn is starting. This rule
   * is also re-entered mid-turn, when ChooseTaleRule.returnFromTale() sends the player back here right
   * after they bought a Tale with 3 Favors (onRuleStart fires on every StartPlayerTurn/StartRule move,
   * even one that returns to the very rule it came from) — resetting the flag there would let them buy
   * another Tale in the same turn.
   */
  onRuleStart(_move: unknown, previousRule?: RuleStep) {
    if (previousRule?.id !== RuleId.ChooseTale) {
      this.memorize(Memory.TaleBoughtThisTurn, false, this.player)
    }
    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    /** Both the "rest" and (if the skill's column isn't full) "go on adventure" moves for one pickable Ship card. */
    const movesForPick = (pick: Material<number, MaterialType, LocationType>) => {
      const pickMoves: MaterialMove[] = [pick.moveItem({ type: LocationType.PlayerRestPile, player: this.player })]
      const card = pick.getItem<TrialCard>()!.id
      const skill = getTrialCardSkill(card)
      const column = this.material(MaterialType.TrialCard).location(LocationType.PlayerAdventureColumn).player(this.player).locationId(skill)
      if (column.length < MAX_CARDS_PER_SKILL) {
        pickMoves.push(pick.moveItem({ type: LocationType.PlayerAdventureColumn, player: this.player, id: skill, y: column.length }))
      }
      return pickMoves
    }

    for (const side of getEnumValues(ShipSide)) {
      const row = this.material(MaterialType.TrialCard).location(LocationType.ShipTrialSlot).locationId(side)
      if (!row.length) continue
      const min = row.minBy((item) => item.location.x!)
      const max = row.maxBy((item) => item.location.x!)
      moves.push(...movesForPick(min))
      if (max.getIndex() !== min.getIndex()) {
        moves.push(...movesForPick(max))
      }
    }

    if (!this.remind<boolean>(Memory.TaleBoughtThisTurn, this.player) && this.tales.length < MAX_TALES) {
      const favor = this.material(MaterialType.AthenaFavorToken).location(LocationType.PlayerAthenaFavor).player(this.player)
      if (favor.getQuantity() >= TALE_COST) {
        moves.push(this.customMove(CustomMoveType.SpendFavorForTale))
      }
    }
    return moves
  }

  get tales() {
    return this.material(MaterialType.StoryTile).location(LocationType.PlayerTale).player(this.player)
  }

  beforeItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.TrialCard)(move)) {
      const origin = this.material(MaterialType.TrialCard).getItem(move.itemIndex).location
      if (origin.type === LocationType.ShipTrialSlot && (origin.x === 1 || origin.x === 4)) {
        const side = origin.id as ShipSide
        const moves: MaterialMove[] = this.material(MaterialType.TrialCard)
          .location(LocationType.ShipTrialSlot)
          .locationId(side)
          .location((l) => l.x === 2 || l.x === 3)
          .rotateItems(false)
        const favor = this.material(MaterialType.AthenaFavorToken).location(LocationType.AthenaFavorShipSlot).locationId(side)
        if (favor.length) {
          moves.push(favor.moveItem({ type: LocationType.PlayerAthenaFavor, player: this.player }, 1))
        }
        return moves
      }
    }
    return []
  }

  afterItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.TrialCard)(move)) {
      if (move.location.type === LocationType.PlayerAdventureColumn) {
        return this.resolveAdventure(move)
      } else if (move.location.type === LocationType.PlayerRestPile) {
        return this.resolveRest()
      }
    }
    return []
  }

  /** The reserve is an unlimited stock (see OdysseusSetup.setupAthenaFavor): a granted Favor is simply created. */
  get favorFromSupply(): MaterialMove {
    return this.material(MaterialType.AthenaFavorToken).createItem({ location: { type: LocationType.PlayerAthenaFavor, player: this.player } })
  }

  resolveAdventure(move: MoveItem<number, MaterialType, LocationType>) {
    const card = this.material(MaterialType.TrialCard).getItem<TrialCard>(move.itemIndex).id
    const moves: MaterialMove[] = []
    const pending: PendingGain[] = []
    for (const gain of trialCardStats[card].gains) {
      if (gain === 'AthenaFavor') {
        moves.push(this.favorFromSupply)
      } else {
        pending.push(gain)
      }
    }
    this.memorize(Memory.PendingGains, pending, this.player)
    this.memorize(Memory.PlacedAdventureRow, move.location.y, this.player)
    moves.push(this.startRule(RuleId.ResolveSkillGain))
    return moves
  }

  resolveRest() {
    const moves: MaterialMove[] = [this.favorFromSupply]
    this.memorize(Memory.PendingGains, ['Choice'] satisfies PendingGain[], this.player)
    this.forget(Memory.PlacedAdventureRow, this.player)
    moves.push(this.startRule(RuleId.ResolveSkillGain))
    return moves
  }

  onCustomMove(move: CustomMove) {
    if (move.type === CustomMoveType.SpendFavorForTale) {
      this.memorize(Memory.TaleBoughtThisTurn, true, this.player)
      this.memorize(Memory.TaleReturnsTo, RuleId.ChooseTrialCard, this.player)
      return [
        this.material(MaterialType.AthenaFavorToken).location(LocationType.PlayerAthenaFavor).player(this.player).deleteItem(TALE_COST),
        this.startRule(RuleId.ChooseTale)
      ]
    }
    return []
  }
}
