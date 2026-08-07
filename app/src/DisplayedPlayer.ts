import { MaterialContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'

// Only one player's Story board (and personal material) is shown on the table at a time, chosen by
// clicking their panel. Locators and static-item descriptions are plain objects/methods, not React
// components, so they cannot read React state directly — they read this module-level value instead.
// It is only ever written from GameDisplay/PlayerPanels, which also update React state to trigger a
// re-render of the (unmemoized) table components that read it.
let displayedPlayer: number | undefined

export function getDisplayedPlayer(fallback: number): number {
  return displayedPlayer ?? fallback
}

export function setDisplayedPlayer(player: number) {
  displayedPlayer = player
}

/** For Locator.hide() overrides on every player-owned LocationType: hidden unless it's on the displayed player's board. */
export function hideUnlessDisplayedPlayer(item: MaterialItem, context: MaterialContext): boolean {
  return item.location.player !== getDisplayedPlayer(context.player ?? context.rules.players[0])
}
