import { CustomMove, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { CustomMoveType } from './CustomMoveType'
import { isTaleTaken, OdysseusPlayerTurnRule } from './OdysseusPlayerTurnRule'
import { RuleId } from './RuleId'

/**
 * The last chance to buy a Tale with 3 Athena Favors (rules-fr.pdf p.6 "Récits"), offered once the
 * player has nothing left to do with their turn. The purchase is available all along the turn (see
 * OdysseusPlayerTurnRule), but the turn ends by itself once the gains are resolved — so a player who
 * meant to spend at the very end would never get the chance to. Hence this stop, entered only when
 * they still can buy, and left either with a Tale or by passing.
 */
export class BuyTaleRule extends OdysseusPlayerTurnRule {
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
