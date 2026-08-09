import { getEnumValues } from '@gamepark/rules-api'
import { Skill } from '../Skill'
import { AdventureType } from './TrialCardStats'

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

export interface ScoredTrialCard {
  skill: Skill
  value: number
  adventureType: AdventureType
}

/**
 * Each Tale tile is worth 2 VP per Trial card (regardless of success) that matches its type, among
 * the cards the player has on their Story board (see rules-fr.pdf p.6 "Récits").
 */
export const getStoryTileScore = (type: StoryTileType, cards: ScoredTrialCard[]): number => {
  const matches = (card: ScoredTrialCard) => {
    switch (type) {
      case StoryTileType.Strength:
        return card.skill === Skill.Strength
      case StoryTileType.Intelligence:
        return card.skill === Skill.Intelligence
      case StoryTileType.Cunning:
        return card.skill === Skill.Cunning
      case StoryTileType.Luck:
        return card.skill === Skill.Luck
      case StoryTileType.Navigation:
        return card.adventureType === AdventureType.Navigation
      case StoryTileType.Encounters:
        return card.adventureType === AdventureType.Encounters
      case StoryTileType.Gods:
        return card.adventureType === AdventureType.Gods
      case StoryTileType.Creatures:
        return card.adventureType === AdventureType.Creatures
      case StoryTileType.Ithaca:
        return card.adventureType === AdventureType.Ithaca
      case StoryTileType.Value1Or2:
        return card.value === 1 || card.value === 2
      case StoryTileType.Value3:
        return card.value === 3
      case StoryTileType.Value4:
        return card.value === 4
      case StoryTileType.Value5:
        return card.value === 5
      case StoryTileType.Value6:
        return card.value === 6
    }
  }
  return cards.filter(matches).length * 2
}
