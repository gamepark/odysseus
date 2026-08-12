import { getRelativePlayerIndex, MaterialContext } from '@gamepark/react-game'
import { getStoryBoardRowY, showsAllTrials } from './PlayerRowLayout'
import { TABLE_X_MAX, TABLE_Y_MAX, TABLE_Y_MIN } from './TableLayout'

/**
 * Every player's panel sits in a column against the table's right edge (see PlayerPanelLocator), where it
 * has two ways of finding its row:
 *
 * - up to 3 players, beside its owner's Story board, which never moves (see PlayerRowLayout) — the panel
 *   is then only a read-out, and clicking it does nothing (see PlayerPanelContent);
 * - past that the boards shift about as players are selected, so the panels spread evenly over the whole
 *   height instead, and a line drawn under the table joins each one to its board (see PlayerPanelLinks).
 *
 * The panel size below is set so that 5 panels — the maximum — still fit inside the table's height (5 *
 * 9.26 = 46.3 of the 48.02 the margins leave of a table 49.02 tall). That height is entirely spent on the
 * ship board, so the column has to squeeze into what it needs — but a narrower panel is not a smaller one
 * on screen, since a shorter table is scaled up more.
 *
 * Kept out of PlayerPanelLocator so that PlayerPanelContent and PlayerPanelLinks can read it without
 * creating an import cycle between the two (see DisplayedPlayer.ts).
 */

/** StyledPlayerPanel is authored in its own 28em-wide box (see PlayerPanelContent): rescaled down to this width in table units. */
export const PANEL_WIDTH = 13.5

/** Not fixed but driven by its content (name, then 2 rows of counters), which scales with PANEL_WIDTH: this is what it actually renders at. */
export const PANEL_HEIGHT = (PANEL_WIDTH * 9.6) / 14

/** Blank space kept between the panel column and the table's right edge (the panel casts a shadow at its own scale). */
const PANEL_RIGHT_MARGIN = 1

/** x of the panel column: right against the table's right edge. */
export const PANEL_COLUMN_X = TABLE_X_MAX - PANEL_RIGHT_MARGIN - PANEL_WIDTH / 2

/** Blank space kept above and below the column, for the shadow a panel casts (0.5em at panel scale) to stay inside the table. */
const PANEL_EDGE_MARGIN = 0.5

const PANEL_TOP_ROW_Y = TABLE_Y_MIN + PANEL_EDGE_MARGIN + PANEL_HEIGHT / 2
const PANEL_BOTTOM_ROW_Y = TABLE_Y_MAX - PANEL_EDGE_MARGIN - PANEL_HEIGHT / 2

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/** y of a player's panel row: level with their board, or spread evenly down the table when the boards move. */
export function getPanelRowY(player: number | undefined, context: MaterialContext): number {
  if (showsAllTrials(context)) {
    // Level with the board, give or take what it takes for the bottom panel to stay inside the table: the
    // boards are spread over the full height, the panels are shorter, so only the last row is ever pulled up.
    return clamp(getStoryBoardRowY(player, context), PANEL_TOP_ROW_Y, PANEL_BOTTOM_ROW_Y)
  }
  const rows = Math.max(1, context.rules.players.length - 1)
  const row = getRelativePlayerIndex(context, player)
  return PANEL_TOP_ROW_Y + (row * (PANEL_BOTTOM_ROW_Y - PANEL_TOP_ROW_Y)) / rows
}
