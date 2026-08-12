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
    // z lifted well above any card: a panel always renders on top of whatever else is on the table.
    return { x: PANEL_COLUMN_X, y: getPanelRowY(location.player, context), z: PANEL_Z }
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { players: context.rules.players.length, viewer: context.player }
  }
}

export const playerPanelLocator = new PlayerPanelLocator()
