import { TokenDescription } from '@gamepark/react-game'
import AthenaFavor from '../images/tokens/AthenaFavor.png'
import { AthenaFavorTokenHelp } from './help/AthenaFavorTokenHelp'

class AthenaFavorTokenDescription extends TokenDescription {
  width = 1.85
  height = 2.31
  image = AthenaFavor
  transparency = true
  help = AthenaFavorTokenHelp
}

export const athenaFavorTokenDescription = new AthenaFavorTokenDescription()
