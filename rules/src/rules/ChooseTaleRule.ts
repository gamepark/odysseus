import { ItemMove, MaterialMove } from '@gamepark/rules-api'
import { isTaleTaken, OdysseusPlayerTurnRule } from './OdysseusPlayerTurnRule'

/**
 * The Tale tile granted by a completed row of 4 Trial cards (rules-fr.pdf p.6 "Récits"), the only
 * one that costs no Athena Favor — hence a rule of its own, entered from ResolveSkillGainRule once
 * the row is complete. A Tale bought with 3 Favors is taken straight from whichever rule the player
 * is in, without stopping here (see OdysseusPlayerTurnRule).
 *
 * Everything about taking the tile — the choice offered, the replenishment of the display slot it
 * leaves empty — is the base rule's; all that is left here is to hand the turn over afterwards.
 */
export class ChooseTaleRule extends OdysseusPlayerTurnRule {
  get isTaleFree() {
    return true
  }

  getPlayerMoves() {
    return this.getTaleMoves()
  }

  /**
   * Still the same player — use startRule, never startPlayerTurn, for a same-player transition (see
   * gamepark.github.io/docs/features/rule-moves.md: startPlayerTurn "would otherwise prevent any legal
   * undo"). A free Tale does not use up the paid one, so the turn may still end on BuyTaleRule.
   */
  afterItemMove(move: ItemMove): MaterialMove[] {
    const moves = super.afterItemMove(move)
    if (isTaleTaken(move)) moves.push(this.endTurn())
    return moves
  }
}
