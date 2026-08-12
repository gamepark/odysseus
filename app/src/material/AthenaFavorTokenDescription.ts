import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { TokenDescription } from '@gamepark/react-game'
import AthenaFavor from '../images/tokens/AthenaFavor.png'
import { AthenaFavorTokenHelp } from './help/AthenaFavorTokenHelp'

/** How many tokens the reserve stack is drawn with — a picture of a stock, not a countdown. */
const SUPPLY_STACK_SIZE = 10

class AthenaFavorTokenDescription extends TokenDescription {
  width = 1.85
  height = 2.31
  image = AthenaFavor
  transparency = true
  help = AthenaFavorTokenHelp

  // The reserve is unlimited: no item ever sits in it, tokens are created when granted and deleted when
  // spent (see OdysseusSetup.setupAthenaFavor). This static stack is what the player sees of it — it never
  // grows nor shrinks — and `stockLocation` makes creations and deletions fly from and to it instead of
  // fading in and out on the spot. Being a deck (see AthenaFavorSupplyLocator), they always fly from its
  // top token: getFirstStockItemTransforms positions the animation on displayIndex = quantity - 1.
  staticItem = { quantity: SUPPLY_STACK_SIZE, location: { type: LocationType.AthenaFavorSupply } }
  stockLocation = { type: LocationType.AthenaFavorSupply }
}

export const athenaFavorTokenDescription = new AthenaFavorTokenDescription()
