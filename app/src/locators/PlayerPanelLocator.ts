import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { PlayerPanelDescription } from '../material/PlayerPanelDescription'
import { getPanelRowY, PANEL_COLUMN_X, PANEL_HEIGHT, PANEL_WIDTH } from './PlayerPanelLayout'

const PANEL_Z = 20

/** Every player's info panel (avatar, name, skills, Favors), displayed as part of the table itself. */
class PlayerPanelLocator extends Locator {
  locationDescription = new PlayerPanelDescription({ width: PANEL_WIDTH, height: PANEL_HEIGHT })

  getLocations(context: MaterialContext) {
    return context.rules.players.map((player) => ({ player }))
  }

  getCoordinates(location: Location, context: MaterialContext) {
    // z lifted well above any card: a panel always renders on top of whatever else is on the table
    // (in particular, whatever slides underneath it, see playerPanelCoordinates below).
    return { x: PANEL_COLUMN_X, y: getPanelRowY(location.player, context), z: PANEL_Z }
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { players: context.rules.players.length, viewer: context.player }
  }
}

export const playerPanelLocator = new PlayerPanelLocator()

/**
 * Real table coordinates of `player`'s info panel, but sunk well below it (z), so a redirected item
 * animates as if it slides underneath the panel instead of popping on top of it. Other player-owned
 * locators (PlayerTaleLocator, PlayerAdventureColumnLocator, etc.) redirect here — via their own
 * `getCoordinates` — instead of the real (shared) board position whenever a location's owner isn't the
 * displayed player: see DisplayedPlayer.ts for why.
 */
export function playerPanelCoordinates(player: number, context: MaterialContext) {
  const { x, y } = playerPanelLocator.getCoordinates({ type: LocationType.PlayerPanel, player }, context)
  return { x, y, z: PANEL_Z - 10 }
}
