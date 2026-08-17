import { OdysseusBot } from '@gamepark/odysseus/OdysseusBot'
import { MaterialGame, MaterialMove } from '@gamepark/rules-api'

export const ai = (game: MaterialGame, playerId: number): Promise<MaterialMove[]> => {
  return Promise.resolve(new OdysseusBot(playerId).run(game))
}
