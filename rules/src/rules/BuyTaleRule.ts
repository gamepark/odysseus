import { CustomMove, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { CustomMoveType } from './CustomMoveType'
import { isTaleTaken, OdysseusPlayerTurnRule } from './OdysseusPlayerTurnRule'
import { RuleId } from './RuleId'

/**
 * The last chance to buy a Tale with 3 Athena Favors (rules-fr.pdf p.6 "Récits"), offered once the
 * player has nothing left to do with their turn. The purchase is available all along the turn (see
 * OdysseusPlayerTurnRule), but the turn ends by itself once the gains are resolved — so a player who
 * meant to spend at the very end would never get the chance to. Hence this stop, entered every time a
 * turn ends (see OdysseusPlayerTurnRule.endTurn), and immediately skipped to FinishTurn when the
 * player in fact can't buy — checked here, in onRuleStart, rather than by the caller before starting
 * this rule, because a Favor spent earlier in the same turn (a redirected skill gain) may still be an
 * unapplied consequence at that point: onRuleStart only runs once it has actually landed.
 */
export class BuyTaleRule extends OdysseusPlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    return this.canBuyTale ? [] : [this.startRule(RuleId.FinishTurn)]
  }

  getPlayerMoves(): MaterialMove[] {
    return [...this.getTaleMoves(), this.customMove(CustomMoveType.Pass)]
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    const moves = super.afterItemMove(move)
    if (isTaleTaken(move)) moves.push(this.startRule(RuleId.FinishTurn))
    return moves
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (move.type === CustomMoveType.Pass) return [this.startRule(RuleId.FinishTurn)]
    return []
  }
}
