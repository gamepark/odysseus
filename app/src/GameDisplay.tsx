import { css } from '@emotion/react'
import { DevToolsHub, GameTable } from '@gamepark/react-game'
import { TABLE_MARGIN_TOP, TABLE_X_MAX, TABLE_X_MIN, TABLE_Y_MAX, TABLE_Y_MIN } from './locators/TableLayout'
import { PlayerPanelLinks } from './panels/PlayerPanelLinks'
import { OdysseusTableNavigation } from './theme/OdysseusTableNavigation'

export function GameDisplay() {
  const margin = { top: TABLE_MARGIN_TOP, left: 0, right: 0, bottom: 0 }

  return (
    <>
      <GameTable
        xMin={TABLE_X_MIN}
        xMax={TABLE_X_MAX}
        yMin={TABLE_Y_MIN}
        yMax={TABLE_Y_MAX}
        margin={margin}
        css={process.env.NODE_ENV === 'development' && tableBorder}
      >
        <PlayerPanelLinks />
        <OdysseusTableNavigation />
        {process.env.NODE_ENV === 'development' && <DevToolsHub fabBottom="calc(5em)" />}
      </GameTable>
    </>
  )
}

const tableBorder = css`
  border: 1px solid white;
`
