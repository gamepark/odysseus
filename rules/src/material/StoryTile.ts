import { getEnumValues } from '@gamepark/rules-api'

/**
 * The 14 Tale tile types (2 copies of each in the game: 28 tiles total).
 * Matches the delivered artwork filenames in tokens/story/.
 */
export enum StoryTileType {
  // relates to a skill
  Strength = 1,
  Intelligence,
  Cunning,
  Luck,
  // relates to a Trial type
  Navigation,
  Encounters,
  Gods,
  Creatures,
  Ithaca,
  // relates to an exact skill value
  Value1Or2,
  Value3,
  Value4,
  Value5,
  Value6
}

export const storyTileTypes = getEnumValues(StoryTileType)
