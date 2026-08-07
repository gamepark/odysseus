import { getEnumValues } from '@gamepark/rules-api'

/**
 * The 5 Epic tiles. The value doubles as the id and the victory points it is worth,
 * matching the delivered artwork filenames (EpicTile<N>.png).
 */
export enum EpicTile {
  Value2 = 2,
  Value4 = 4,
  Value6 = 6,
  Value8 = 8,
  Value10 = 10
}

export const epicTiles = getEnumValues(EpicTile)
