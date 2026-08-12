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
 * Width and height are set apart from one another here, which is the whole point of this file.
 * StyledPlayerPanel is authored as a box 28em wide whose every piece — avatar, name, timer, badges — is
 * sized in em, so scaling it by a single font-size, the obvious way to fit it in a column, buys width and
 * height together at a fixed ratio: past a certain width, 5 panels no longer stack inside the table. What
 * it is really short of is height, and only height, so the two are bought separately below — a font-size
 * that spends the height budget, and a box wider than the 28em that font-size would give, which the
 * counter lines (the only content that stretches) spread into.
 *
 * The table's right edge simply follows the column (see TableLayout), and on a wide screen that costs
 * nothing: the table is cut so tightly around the ship board that its height is what limits the scale.
 *
 * Kept out of PlayerPanelLocator so that PlayerPanelContent and PlayerPanelLinks can read it without
 * creating an import cycle between the two (see DisplayedPlayer.ts).
 */

/**
 * Counters per line inside a panel: the 5 Trial symbols fill the first line exactly, the 4 skills and the
 * Athena favors the second (see PlayerPanelContent).
 */
export const COUNTERS_PER_LINE = 5

/** Blank space kept above and below the column, for the shadow a panel casts (0.5em at panel scale) to stay inside the table. */
const PANEL_EDGE_MARGIN = 0.5

/** Daylight kept between two panels of a full column, so they never read as one block. */
const PANEL_ROW_GAP = 0.5

/** A column of panels never holds more than one per player, and there are never more than 5 of those. */
const MAX_PLAYERS = 5

/**
 * All the height a panel may claim: what 5 of them, plus the daylight between them, leave of the table.
 * This is the constraint everything else here answers to.
 */
export const PANEL_HEIGHT = (TABLE_Y_MAX - TABLE_Y_MIN - 2 * PANEL_EDGE_MARGIN - (MAX_PLAYERS - 1) * PANEL_ROW_GAP) / MAX_PLAYERS

/**
 * Height of a panel's content, in its own em: the name, the timer line and 2 lines of counters, each sized
 * in em by StyledPlayerPanel and by the badge style in PlayerPanelContent. Measured on the rendered panel —
 * nothing declares it, so it has to be read back whenever that content changes.
 */
const PANEL_CONTENT_HEIGHT = 19.84

/** Table units bought by 1em of panel content: as much as the height budget affords, and no more. */
export const PANEL_SCALE = PANEL_HEIGHT / PANEL_CONTENT_HEIGHT

/** Width of the panel box, which the height above no longer has any say in: whatever the column can spare. */
export const PANEL_WIDTH = 20

/** Blank space kept between the panel column and the table's right edge (the panel casts a shadow at its own scale). */
const PANEL_RIGHT_MARGIN = 1

/** x of the panel column: right against the table's right edge. */
export const PANEL_COLUMN_X = TABLE_X_MAX - PANEL_RIGHT_MARGIN - PANEL_WIDTH / 2

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
