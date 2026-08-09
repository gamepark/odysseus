import { EpicTile } from '@gamepark/odysseus/material/EpicTile'
import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { TokenDescription } from '@gamepark/react-game'
import EpicTile10 from '../images/tiles/epic/EpicTile10.png'
import EpicTile2 from '../images/tiles/epic/EpicTile2.png'
import EpicTile4 from '../images/tiles/epic/EpicTile4.png'
import EpicTile6 from '../images/tiles/epic/EpicTile6.png'
import EpicTile8 from '../images/tiles/epic/EpicTile8.png'
import { EpicTileHelp } from './help/EpicTileHelp'

class EpicTileDescription extends TokenDescription<number, MaterialType, LocationType, EpicTile> {
  width = 3.69
  height = 4.23
  transparency = true
  help = EpicTileHelp

  images = {
    [EpicTile.Value2]: EpicTile2,
    [EpicTile.Value4]: EpicTile4,
    [EpicTile.Value6]: EpicTile6,
    [EpicTile.Value8]: EpicTile8,
    [EpicTile.Value10]: EpicTile10
  }
}

export const epicTileDescription = new EpicTileDescription()
