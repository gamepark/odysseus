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
