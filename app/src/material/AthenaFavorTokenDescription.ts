import { TokenDescription } from '@gamepark/react-game'
import AthenaFavor from '../images/tokens/AthenaFavor.png'

class AthenaFavorTokenDescription extends TokenDescription {
  width = 1.55
  height = 2.01
  image = AthenaFavor
  transparency = true
}

export const athenaFavorTokenDescription = new AthenaFavorTokenDescription()
