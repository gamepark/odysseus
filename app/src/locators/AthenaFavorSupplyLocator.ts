import { DeckLocator } from '@gamepark/react-game'
import { SHIP_BOARD_X } from './TableLayout'

// An ordered stock, heaped at the ship's stern — which the board laid out bow up puts at the bottom of the
// table — just below the Epic tiles, the last thing printed there. The whole right
// of the table belongs to the players' boards now, so it has nowhere else to go. A deck rather than a pile:
// the reserve is unlimited (see AthenaFavorTokenDescription), so it never shrinks, and a tidy stack reads as
// a stock to draw from where a scattered heap would suggest tokens being counted out.
export const athenaFavorSupplyLocator = new DeckLocator({ coordinates: { x: SHIP_BOARD_X, y: 19.6, z: 1 } })
