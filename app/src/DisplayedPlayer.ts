import { MaterialContext } from '@gamepark/react-game'

// Every player's Story board is on the table, and up to 3 players so are everyone's Trials — this whole
// notion then decides nothing but the panel's own highlight. Past that the height only affords one column
// at a time: the others stay hidden under their own board (see PlayerAdventureColumnLocator), and every
// board's row depends on which player that is (see PlayerRowLayout).
//
// That player is the framework's own "view": clicking a panel plays MaterialMoveBuilder.changeView as a
// transient local move (see PlayerPanelContent), which is exactly what react-game watches to reposition
// items — it hands `rules.game.view` to every locator's position dependencies for free. Keeping the choice
// anywhere else (a module-level store, say) leaves the framework blind to it, and only the pieces it
// happens to re-render for other reasons ever move.

/** The player whose Trials are laid out above their board: the viewer's own board until they pick another. */
export function getDisplayedPlayer(context: MaterialContext): number {
  return context.rules.game.view ?? context.player ?? context.rules.players[0]
}

/** Whether a player-owned location's `player` is the one whose Trials are laid out above their board. */
export function isDisplayedPlayer(player: number | undefined, context: MaterialContext): boolean {
  return player === getDisplayedPlayer(context)
}
