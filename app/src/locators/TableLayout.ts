/**
 * The table is cut as tightly as possible around what it actually holds — an empty band around the
 * material only shrinks everything on screen, since GameTable scales the whole box down to fit.
 *
 * The ship board is laid out lengthwise, bow up (its image is stored that way): it fills the left of the
 * table on its own — the Athena favor supply is dropped on its stern, for want of room elsewhere — and
 * every player's Story board is stacked in a column to its right (see PlayerRowLayout), which suits a
 * wide screen better than stacking the two boards one above the other.
 *
 * Horizontal (left to right), all in table units:
 *   ship board          24.52 wide, centered on x = -23.7              → -35.96 .. -11.44
 *   player rows         Rest pile .. Athena favors, around x = 14.5     →  -9.90 ..  36.60
 *   player panels       20 wide column (see PlayerPanelLayout)          →  37.60 ..  57.60
 *
 * Vertical: the ship board, 49.02 tall, is by far the tallest piece, so the table is cut flush
 * with its top, bottom and left edges — its printed sea reaches them, so there is nothing to keep clear.
 * That height is what usually limits how big everything is drawn: 94.56 by 49.02, which the header margin
 * turns into a 1.79:1 box, so it is only on a screen narrower than that — a 16:10 laptop, say — that the
 * width binds instead and widening the panel column costs the boards a little of their scale.
 */
export const TABLE_X_MIN = -35.96
export const TABLE_X_MAX = 58.6
export const TABLE_Y_MIN = -24.51
export const TABLE_Y_MAX = 24.51

/** x of the ship board's axis, which everything laid on the ship shares: the deck, the stern, the Epic tiles. */
export const SHIP_BOARD_X = -23.7

/** Band left free above the table, in screen em (1em = 1vh), for the header bar to write in. */
export const TABLE_MARGIN_TOP = 7

/**
 * Screen em bought by one table unit once the table is drawn at its default scale — the scale it opens on,
 * and the only one it ever has until someone zooms in.
 *
 * GameTable draws the table at 5em per unit then scales it by `minScale = (100 - vertical margin) / 5 /
 * table height`, so a unit is worth `(100 - margin) / height` em whatever the screen: the em itself is 1vh,
 * or 1vw / table ratio once the screen is narrower than the table, and the whole box follows. Which is what
 * makes the table's place on screen knowable in CSS — see OdysseusTableNavigation, the one thing outside the
 * table that has to line up with something inside it.
 */
export const TABLE_UNIT = (100 - TABLE_MARGIN_TOP) / (TABLE_Y_MAX - TABLE_Y_MIN)

/** x of the table's center, which is where the browser centers it horizontally (GameTable's `centerZoomedOut`). */
export const TABLE_CENTER_X = (TABLE_X_MIN + TABLE_X_MAX) / 2
