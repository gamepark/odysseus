import { MaterialContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { useSyncExternalStore } from 'react'

// Only one player's Story board (and personal material) is shown on the table at a time, chosen by
// clicking their panel (see PlayerPanelContent). Locators and static-item descriptions are plain
// objects/methods, not React components, so they cannot read React state directly — they read this
// module-level store instead. PlayerPanelContent both reads it (via useDisplayedPlayer, for the
// "selected" ring) and writes it (on click), so every subscriber — including non-React locators —
// picks up the change immediately.
let displayedPlayer: number | undefined
const listeners = new Set<() => void>()

export function getDisplayedPlayer(fallback: number): number {
  return displayedPlayer ?? fallback
}

export function setDisplayedPlayer(player: number) {
  if (player === displayedPlayer) return
  displayedPlayer = player
  listeners.forEach((listener) => listener())
}

/** Sets the displayed player only if none was chosen yet — called once the game has loaded, see GameDisplay. */
export function initDisplayedPlayer(player: number) {
  if (displayedPlayer === undefined) setDisplayedPlayer(player)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** React binding (e.g. for PlayerPanelContent) that re-renders when the displayed player changes. */
export function useDisplayedPlayer(fallback: number): number {
  return useSyncExternalStore(subscribe, () => getDisplayedPlayer(fallback))
}

/** Whether a player-owned location's `player` belongs to the Story board currently on the table. */
export function isDisplayedPlayer(player: number | undefined, context: MaterialContext): boolean {
  return player === getDisplayedPlayer(context.player ?? context.rules.players[0])
}

/** For Locator.hide() overrides on every player-owned LocationType: hidden unless it's on the displayed player's board. */
export function hideUnlessDisplayedPlayer(item: MaterialItem, context: MaterialContext): boolean {
  return !isDisplayedPlayer(item.location.player, context)
}
