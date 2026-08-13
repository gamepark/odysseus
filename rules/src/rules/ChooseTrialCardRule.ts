import { getEnumValues, isMoveItemType, ItemMove, Material, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { ShipSide } from '../material/ShipSide'
import { getTrialCardSkill, TrialCard } from '../material/TrialCard'
import { PendingGain, PendingGains, trialCardStats } from '../material/TrialCardStats'
import { Memory } from './Memory'
import { OdysseusPlayerTurnRule } from './OdysseusPlayerTurnRule'
import { RuleId } from './RuleId'

/** Also used client-side to preview the "go on adventure" option before it's played (see TrialCardDescription). */
export const MAX_CARDS_PER_SKILL = 4

/**
 * Steps 1 and 2 of the rulebook's turn structure in one rule: pick a Trial card at either end of
 * either side of the Ship (rules-fr.pdf p.4), and send it straight on adventure or to rest
 * (rules-fr.pdf p.5) — there's no player decision in between the two, so a single move takes the
 * card directly from the Ship to its final spot instead of visiting a staging location first.
 * Picking the slot next to the hidden central pair (x 1 or 4) reveals that pair and grants the
 * Athena Favor token sitting between them. Buying a Tale with 3 Athena Favors is offered on top of
 * the card choice, as everywhere else in the turn (see OdysseusPlayerTurnRule).
 */
export class ChooseTrialCardRule extends OdysseusPlayerTurnRule {
  /** The turn starts here, and only here, so this is where the once-per-turn Tale purchase is unlocked again. */
  onRuleStart() {
    this.memorize(Memory.TaleBoughtThisTurn, false, this.player)
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

    if (this.canBuyTale) moves.push(...this.getTaleMoves())
    return moves
  }

  beforeItemMove(move: ItemMove): MaterialMove[] {
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
    return super.beforeItemMove(move)
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (isMoveItemType(MaterialType.TrialCard)(move)) {
      if (move.location.type === LocationType.PlayerAdventureColumn) {
        return this.resolveAdventure(move)
      } else if (move.location.type === LocationType.PlayerRestPile) {
        return this.resolveRest()
      }
    }
    return super.afterItemMove(move)
  }

  /** The reserve is an unlimited stock (see OdysseusSetup.setupAthenaFavor): a granted Favor is simply created. */
  get favorFromSupply(): MaterialMove {
    return this.material(MaterialType.AthenaFavorToken).createItem({ location: { type: LocationType.PlayerAthenaFavor, player: this.player } })
  }

  resolveAdventure(move: MoveItem<number, MaterialType, LocationType>) {
    const card = this.material(MaterialType.TrialCard).getItem<TrialCard>(move.itemIndex).id
    const moves: MaterialMove[] = []
    const gains: PendingGain[] = []
    for (const gain of trialCardStats[card].gains) {
      if (gain === 'AthenaFavor') {
        moves.push(this.favorFromSupply)
      } else {
        gains.push(gain)
      }
    }
    this.memorize(Memory.PendingGains, { gains, left: gains.length } satisfies PendingGains, this.player)
    this.memorize(Memory.PlacedAdventureRow, move.location.y, this.player)
    moves.push(this.startRule(RuleId.ResolveSkillGain))
    return moves
  }

  resolveRest() {
    const moves: MaterialMove[] = [this.favorFromSupply]
    this.memorize(Memory.PendingGains, { gains: ['Choice'], left: 1 } satisfies PendingGains, this.player)
    this.forget(Memory.PlacedAdventureRow, this.player)
    moves.push(this.startRule(RuleId.ResolveSkillGain))
    return moves
  }
}
