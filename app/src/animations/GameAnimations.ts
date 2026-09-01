import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { RuleId } from '@gamepark/odysseus/rules/RuleId'
import { MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType } from '@gamepark/rules-api'
import { playerAdventureColumnLocator } from '../locators/PlayerAdventureColumnLocator'
import { TABLE_Y_MIN } from '../locators/TableLayout'
import { trialCardDescription } from '../material/TrialCardDescription'

export const gameAnimations = new MaterialGameAnimations<number, MaterialType, LocationType, RuleId>()

/** How high above its final spot the card lines up before dropping in, in table units. */
const APPROACH_HEIGHT = 2

/** Where the flight ends and the drop begins: the card spends the last quarter of the animation sliding in. */
const DROP_START = 0.75

/**
 * Below this the drop is not worth the detour: the card would hang in the air for a quarter of the
 * animation, going nowhere, which reads far worse than a straight flight.
 */
const MIN_DROP = 0.5

/**
 * A Trial card sent on adventure (see ChooseTrialCardRule) crosses the whole table: it leaves a slot on the
 * Ship, on the far left, and lands in a skill column climbing above its owner's Story board, on the right.
 * Flown straight, the last stretch of that line comes in from below and to the side — through the board it
 * is landing above, and through the cards already in the column, which it has to end up *behind* (see
 * PlayerAdventureColumnLocator's negative z gap).
 *
 * So it flies to a point right above its slot instead, comes back down to table level there, and only then
 * slides the last {@link APPROACH_HEIGHT} units straight down into place — the way a card is laid on a fan
 * by hand, tucked under the one below it rather than pushed through it. `ease-in` carries the flight and
 * the waypoint's `ease-out` the drop, so the two read as one motion.
 */
gameAnimations
  .configure((move) => isMoveItemType(MaterialType.TrialCard)(move) && move.location.type === LocationType.PlayerAdventureColumn)
  .trajectory((context, move) => {
    if (!isMoveItemType(MaterialType.TrialCard)(move) || move.location.type !== LocationType.PlayerAdventureColumn) return {}
    const { player, id, y: row } = move.location
    const column = { type: LocationType.PlayerAdventureColumn, player, id, y: row }
    const { x = 0, y = 0 } = playerAdventureColumnLocator.getLocationCoordinates(column, context)
    // The top card of a full column sits flush with the table's top edge, whatever the player count (see
    // PlayerRowLayout): rising above it would take the card behind the header bar. Nothing is above such a
    // card to slip past anyway, so when there is no room left to drop from, it just flies straight in.
    const approachY = Math.max(y - APPROACH_HEIGHT, TABLE_Y_MIN + trialCardDescription.height / 2)
    if (y - approachY < MIN_DROP) return {}
    return {
      easing: 'ease-in',
      elevation: { landAt: DROP_START },
      waypoints: [{ at: DROP_START, coordinates: { x, y: approachY }, easing: 'ease-out' }]
    }
  })
