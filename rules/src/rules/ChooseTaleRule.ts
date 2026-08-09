import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { TaleStack } from '../material/TaleStack'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

const TALE_STACKS = [TaleStack.First, TaleStack.Second]

/**
 * Picking a Tale tile (rules-fr.pdf p.6 "Récits") — reached either after completing a row of 4 Trial
 * cards or after spending 3 Athena Favors. Choosing a visible tile leaves an empty display slot that
 * is immediately replenished from the first non-empty of the two facedown stacks — which one is drawn
 * from has no bearing on gameplay since both are shuffled and hidden — before returning to whichever
 * rule started this one.
 */
export class ChooseTaleRule extends PlayerTurnRule {
  getPlayerMoves() {
    const moves: MaterialMove[] = this.material(MaterialType.StoryTile)
      .location(LocationType.TaleDisplay)
      .moveItems({ type: LocationType.PlayerTale, player: this.player })
    for (const stack of TALE_STACKS) {
      const pile = this.material(MaterialType.StoryTile).location(LocationType.TaleDeck).locationId(stack).deck()
      if (pile.length) {
        moves.push(pile.dealOne({ type: LocationType.PlayerTale, player: this.player }))
      }
    }
    return moves
  }

  beforeItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.StoryTile)(move) && move.location.type === LocationType.PlayerTale) {
      const origin = this.material(MaterialType.StoryTile).getItem(move.itemIndex).location
      if (origin.type === LocationType.TaleDisplay) {
        this.memorize(Memory.AwaitingReplenish, origin.x, this.player)
      }
    }
    return []
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.StoryTile)(move) || move.location.type !== LocationType.PlayerTale) return []
    const replenish = this.remind<number | undefined>(Memory.AwaitingReplenish, this.player)
    if (replenish === undefined) return this.returnFromTale()
    this.forget(Memory.AwaitingReplenish, this.player)
    const dealMove = this.dealTale(replenish)
    return dealMove ? [dealMove, ...this.returnFromTale()] : this.returnFromTale()
  }

  dealTale(x: number): MaterialMove | undefined {
    for (const stack of TALE_STACKS) {
      const pile = this.material(MaterialType.StoryTile).location(LocationType.TaleDeck).locationId(stack).deck()
      if (pile.length) return pile.dealOne({ type: LocationType.TaleDisplay, x })
    }
    return undefined
  }

  /**
   * Same player either way — use startRule, never startPlayerTurn, for a same-player transition (see
   * gamepark.github.io/docs/features/rule-moves.md: startPlayerTurn "would otherwise prevent any legal
   * undo").
   */
  returnFromTale(): MaterialMove[] {
    const returnsTo = this.remind<RuleId>(Memory.TaleReturnsTo, this.player)
    this.forget(Memory.TaleReturnsTo, this.player)
    return [this.startRule(returnsTo === RuleId.ChooseTrialCard ? RuleId.ChooseTrialCard : RuleId.FinishTurn)]
  }
}
