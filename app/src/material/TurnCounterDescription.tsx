import { LocationDescription } from '@gamepark/react-game'
import { TurnCounterContent } from '../turn/TurnCounterContent'
import { TurnCounterHelp } from './help/TurnCounterHelp'

export class TurnCounterDescription extends LocationDescription {
  content = TurnCounterContent
  help = TurnCounterHelp

  getImages(): string[] {
    return []
  }
}
