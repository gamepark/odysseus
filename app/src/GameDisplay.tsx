import { css } from '@emotion/react'
import { DevToolsHub, GameTable, GameTableNavigation, usePlayerId, usePlayers } from '@gamepark/react-game'
import { useEffect } from 'react'
import { initDisplayedPlayer, useDisplayedPlayer } from './DisplayedPlayer'

export function GameDisplay() {
  const margin = { top: 7, left: 0, right: 0, bottom: 0 }
  const myPlayerId = usePlayerId<number>()
  const players = usePlayers<number>()

  // Only one player's Story board is shown on the table at a time (see DisplayedPlayer.ts and
  // PlayerPanelContent, part of the table itself). Default to my own board once the game has loaded;
  // a click on any panel can then switch it.
  useEffect(() => {
    if (players.length > 0) initDisplayedPlayer(myPlayerId ?? players[0].id)
  }, [myPlayerId, players])

  // Locators and static-item descriptions read the displayed player directly from the module-level
  // store (they're plain objects, not React components). Subscribing here re-renders this component,
  // and with it the whole GameTable subtree, whenever the store changes — otherwise a click on a
  // player panel updates the store but nothing ever re-renders to reflect it.
  useDisplayedPlayer(myPlayerId ?? players[0]?.id ?? 0)

  return (
    <>
      <GameTable xMin={-60} xMax={60} yMin={-30} yMax={30} margin={margin} css={process.env.NODE_ENV === 'development' && tableBorder}>
        <GameTableNavigation />
        {process.env.NODE_ENV === 'development' && <DevToolsHub fabBottom="calc(5em)" />}
      </GameTable>
    </>
  )
}

const tableBorder = css`
  border: 1px solid white;
`
