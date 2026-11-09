import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { TRIAL_CARDS_PER_PLAYER } from '@gamepark/odysseus/OdysseusSetup'
import { RuleId } from '@gamepark/odysseus/rules/RuleId'

/**
 * Turns one distribution of the Ship lasts: it receives TRIAL_CARDS_PER_PLAYER cards, every turn takes one,
 * and the last one is discarded when the Ship is redistributed (see FinishTurnRule).
 */
export const TURNS_PER_SHIP = TRIAL_CARDS_PER_PLAYER - 1

/**
 * There are as many distributions as players (TRIAL_CARDS_PER_PLAYER cards each in the draw pile), so every
 * player plays exactly TURNS_PER_SHIP turns, whatever the player count.
 */
export const TURNS_PER_PLAYER = TURNS_PER_SHIP

export type TurnCount = {
  /** The round in progress, 1 to TURNS_PER_PLAYER: everybody plays their n-th turn before anyone plays their next. */
  turn: number
  /** The distribution of the Ship in progress, 1 to the player count. */
  ship: number
  ships: number
}

/**
 * Computed from the material, never memorised: every turn leaves exactly one Trial card on a player's board,
 * taken on adventure or left to rest. During ChooseTrialCard the card of the turn in progress is not taken
 * yet, so that turn is counted on top.
 */
export function getTurnCount(rules: OdysseusRules): TurnCount {
  const ships = rules.players.length
  const taken = rules
    .material(MaterialType.TrialCard)
    .location((location) => location.type === LocationType.PlayerAdventureColumn || location.type === LocationType.PlayerRestPile).length
  const inProgress = rules.game.rule?.id === RuleId.ChooseTrialCard ? 1 : 0
  const globalTurn = Math.max(1, taken + inProgress)
  return {
    turn: Math.min(TURNS_PER_PLAYER, Math.ceil(globalTurn / ships)),
    ship: Math.min(ships, Math.ceil(globalTurn / TURNS_PER_SHIP)),
    ships
  }
}
