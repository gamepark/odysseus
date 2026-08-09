import { getRelativePlayerIndex, MaterialContext } from '@gamepark/react-game'

/**
 * Every player's panel sits in a column near the table's top-right corner (see PlayerPanelLocator),
 * stacked tightly one below the other starting from the top — mine (relative index 0, see
 * getRelativePlayerIndex) first — instead of spread across the table's whole height (which used to put
 * mine at the bottom and opponents' near the top). Kept in its own file, with no further app imports,
 * so both PlayerPanelLocator and PlayerPanelContent can read it without creating an import cycle
 * between the two (see DisplayedPlayer.ts).
 */

const TABLE_X_MAX = 60
const TABLE_Y_MIN = -30

/** StyledPlayerPanel is authored in its own 28em-wide box (see PlayerPanelContent): rescaled down to this width in table units. */
export const PANEL_WIDTH = 16

/** Not fixed but driven by its content (name, then 2 rows of counters): this is what it actually renders at, tuned by eye. */
export const PANEL_HEIGHT = 11

/** Blank space kept between the panel column and the table's right edge (the panel casts a shadow at its own scale). */
const PANEL_RIGHT_MARGIN = 1

/** x of the panel column: right against the table's right edge. */
export const PANEL_COLUMN_X = TABLE_X_MAX - PANEL_RIGHT_MARGIN - PANEL_WIDTH / 2

/** Blank space kept above the column, for the shadow the top panel casts (0.5em at panel scale) to stay inside the table. */
const PANEL_TOP_MARGIN = 2

/** Vertical gap kept between two consecutive panels. */
const PANEL_ROW_GAP = 1

const PANEL_TOP_ROW_Y = TABLE_Y_MIN + PANEL_TOP_MARGIN + PANEL_HEIGHT / 2
const PANEL_ROW_SPACING = PANEL_HEIGHT + PANEL_ROW_GAP

/** y of a player's panel row: stacked tightly from the top, mine (relative index 0) first. */
export function getPanelRowY(player: number | undefined, context: MaterialContext): number {
  const playerIndex = getRelativePlayerIndex(context, player)
  return PANEL_TOP_ROW_Y + playerIndex * PANEL_ROW_SPACING
}
