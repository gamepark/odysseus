import { MaterialGameSetup } from '@gamepark/rules-api'
import { OdysseusOptions } from './OdysseusOptions'
import { OdysseusRules } from './OdysseusRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class OdysseusSetup extends MaterialGameSetup<number, MaterialType, LocationType, OdysseusOptions> {
  Rules = OdysseusRules

  setupMaterial(_options: OdysseusOptions) {
    // TODO
  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }
}
