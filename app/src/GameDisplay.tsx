import { css } from '@emotion/react'
import { DevToolsHub, GameTable, GameTableNavigation, usePlayerId, usePlayers } from '@gamepark/react-game'
import { useEffect, useState } from 'react'
import { setDisplayedPlayer } from './DisplayedPlayer'
import { PlayerPanels } from './panels/PlayerPanels'

export function GameDisplay() {
  const margin = { top: 7, left: 0, right: 30, bottom: 0 }
  const myPlayerId = usePlayerId<number>()
  const players = usePlayers<number>()
  const [displayedPlayer, setDisplayedPlayerState] = useState<number>()

  // Only one player's Story board is shown on the table at a time (see DisplayedPlayer.ts). Default to
  // my own board once the game has loaded; a click on any panel can then switch it.
  useEffect(() => {
    if (displayedPlayer === undefined && players.length > 0) {
      const initial = myPlayerId ?? players[0].id
      setDisplayedPlayerState(initial)
      setDisplayedPlayer(initial)
    }
  }, [myPlayerId, players, displayedPlayer])

  const selectPlayer = (player: number) => {
    setDisplayedPlayerState(player)
    setDisplayedPlayer(player)
  }

  return (
    <>
      <GameTable xMin={-50} xMax={50} yMin={-30} yMax={30} margin={margin} css={process.env.NODE_ENV === 'development' && tableBorder}>
        <GameTableNavigation />
        <PlayerPanels displayedPlayer={displayedPlayer} onSelectPlayer={selectPlayer} />
        {process.env.NODE_ENV === 'development' && <DevToolsHub fabBottom="calc(5em)" />}
      </GameTable>
    </>
  )
}

const tableBorder = css`
  border: 1px solid white;
`
