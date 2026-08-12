import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { ShipSide } from '../material/ShipSide'
import { RuleId } from './RuleId'

const SHIP_ROW_SLOTS = 6

/**
 * Step 3 of the rulebook's turn structure ("Finir son tour", p.5): when only 1 Trial card is left on
 * the Ship, either the game ends (draw pile empty, p.7 "Fin de partie") or the Ship is fully
 * redistributed (4 facedown + 8 face up) and an Athena Favor is added to each side. Then it's the
 * next player's turn. No player decision happens here (mirrors RevealNewGardenCardRule in
 * les-jardins-suspendus).
 */
export class FinishTurnRule extends PlayerTurnRule {
  getPlayerMoves() {
    return []
  }

  onRuleStart() {
    const ship = this.material(MaterialType.TrialCard).location(LocationType.ShipTrialSlot)
    if (ship.length !== 1) {
      return [this.startPlayerTurn(RuleId.ChooseTrialCard, this.nextPlayer)]
    }

    const trialDeck = this.material(MaterialType.TrialCard).location(LocationType.TrialDeck)
    if (trialDeck.length === 0) {
      return [this.endGame()]
    }

    const moves: MaterialMove[] = [ship.deleteItem()]
    const deck = trialDeck.deck()
    for (const side of [ShipSide.Port, ShipSide.Starboard]) {
      for (let x = 0; x < SHIP_ROW_SLOTS; x++) {
        moves.push(deck.dealOne({ type: LocationType.ShipTrialSlot, id: side, x, rotation: x === 2 || x === 3 }))
      }
    }
    for (const side of [ShipSide.Port, ShipSide.Starboard]) {
      moves.push(this.material(MaterialType.AthenaFavorToken).createItem({ location: { type: LocationType.AthenaFavorShipSlot, id: side } }))
    }
    moves.push(this.startPlayerTurn(RuleId.ChooseTrialCard, this.nextPlayer))
    return moves
  }
}
