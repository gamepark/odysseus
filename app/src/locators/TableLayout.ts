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
 *   player panels       13.5 wide column (see PlayerPanelLayout)        →  37.60 ..  51.10
 *
 * Vertical: the ship board, 49.02 tall, is by far the tallest piece, so the table is cut flush
 * with its top, bottom and left edges — its printed sea reaches them, so there is nothing to keep clear.
 * That height is the number that matters: on any wide screen it is the height, never the width, that
 * limits how big everything is drawn. The panel column is sized to fit inside it (see PlayerPanelLayout).
 */
export const TABLE_X_MIN = -35.96
export const TABLE_X_MAX = 52.1
export const TABLE_Y_MIN = -24.51
export const TABLE_Y_MAX = 24.51
