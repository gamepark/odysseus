import { css } from '@emotion/react'
import { useMaterialContext } from '@gamepark/react-game'
import { getPanelRowY, PANEL_COLUMN_X, PANEL_WIDTH } from '../locators/PlayerPanelLayout'
import { getStoryBoardRowY, showsAllTrials, STORY_BOARD_X } from '../locators/PlayerRowLayout'
import { TABLE_X_MAX, TABLE_X_MIN, TABLE_Y_MAX, TABLE_Y_MIN } from '../locators/TableLayout'
import { storyBoardDescription } from '../material/StoryBoardDescription'

/**
 * From 4 players on, a panel is no longer level with the board it reads: the boards make room for the
 * selected player's Trials and shift as another player is picked (see PlayerRowLayout), while the panels
 * keep their own evenly spread column. This draws the thread back — one line per player, from their board
 * to their panel.
 *
 * Laid flat at z = 0, so it runs *under* everything: only the stretch between the board and the panel is
 * ever seen, and both ends are tucked away rather than stopping short of what they join.
 */
export function PlayerPanelLinks() {
  const context = useMaterialContext()
  if (showsAllTrials(context)) return null

  return (
    <svg css={linksCss} viewBox={`${TABLE_X_MIN} ${TABLE_Y_MIN} ${TABLE_X_MAX - TABLE_X_MIN} ${TABLE_Y_MAX - TABLE_Y_MIN}`}>
      {context.rules.players.map((player) => (
        <line
          key={player}
          x1={BOARD_EDGE_X - LINK_TUCK}
          y1={getStoryBoardRowY(player, context)}
          x2={PANEL_EDGE_X + LINK_TUCK}
          y2={getPanelRowY(player, context)}
        />
      ))}
    </svg>
  )
}

/** Right edge of the Story boards, where a line starts. */
const BOARD_EDGE_X = STORY_BOARD_X + storyBoardDescription.width / 2

/** Left edge of the panel column, where a line ends. */
const PANEL_EDGE_X = PANEL_COLUMN_X - PANEL_WIDTH / 2

/** How far each end runs under what it joins, so neither ever shows a gap. */
const LINK_TUCK = 1

const linksCss = css`
  position: absolute;
  left: 0;
  top: 0;
  width: ${TABLE_X_MAX - TABLE_X_MIN}em;
  height: ${TABLE_Y_MAX - TABLE_Y_MIN}em;
  /* The table is a preserve-3d box: this puts the whole drawing on the z = 0 plane, under every board,
   * card and panel (all of which sit at z >= 5, see PlayerRowLayout and PlayerPanelLocator). */
  transform: translateZ(0em);
  pointer-events: none;
  overflow: visible;

  line {
    stroke: white;
    stroke-width: 0.15;
    stroke-linecap: round;
  }
`
