import { Skill } from '../Skill'
import { getTrialCardAdventure, TrialCard } from './TrialCard'

/**
 * The 5 categories of Trial, printed top-right on each card (same icon for all 4 skill variants of
 * a given adventure). Adventures 1-15 are grouped by 3 into the 5 types, in order.
 */
export enum AdventureType {
  Navigation = 1,
  Gods,
  Creatures,
  Encounters,
  Ithaca
}

export const adventureTypeOf = (card: TrialCard): AdventureType => Math.ceil(getTrialCardAdventure(card) / 3) as AdventureType

/**
 * A gain printed at the bottom of a Trial card: a fixed {@link Skill} icon (+1 to that skill),
 * `'Choice'` (the rainbow icon, +1 to a skill of your choice) or `'AthenaFavor'` (the owl icon).
 */
export type Gain = Skill | 'Choice' | 'AthenaFavor'

/** A {@link Gain} that requires a player decision to resolve (the AthenaFavor gain is immediate). */
export type PendingGain = Exclude<Gain, 'AthenaFavor'>

export interface TrialCardStats {
  /** The skill value to reach for this card to be successful at the end of the game. */
  value: number
  /** Victory points earned at the end of the game if {@link value} is reached. */
  victoryPoints: number
  /** Gains obtained when going on adventure with this card, resolved in order. */
  gains: Gain[]
}

/**
 * Relevé visuellement sur chaque carte (aucune donnée n'était livrée à part les images) :
 * la valeur seuil et les PV (bandeau parchemin, en haut à gauche) et les gains (bas de carte).
 */
export const trialCardStats: Record<TrialCard, TrialCardStats> = {
  [TrialCard.Trial1Cunning]: { value: 4, victoryPoints: 3, gains: [Skill.Strength, Skill.Strength] },
  [TrialCard.Trial1Luck]: { value: 2, victoryPoints: 2, gains: [Skill.Cunning, Skill.Cunning] },
  [TrialCard.Trial1Strength]: { value: 3, victoryPoints: 6, gains: [] },
  [TrialCard.Trial1Intelligence]: { value: 2, victoryPoints: 1, gains: ['AthenaFavor', Skill.Strength, Skill.Cunning, Skill.Luck] },

  [TrialCard.Trial2Cunning]: { value: 6, victoryPoints: 7, gains: ['Choice'] },
  [TrialCard.Trial2Luck]: { value: 5, victoryPoints: 7, gains: ['AthenaFavor'] },
  [TrialCard.Trial2Strength]: { value: 5, victoryPoints: 7, gains: [Skill.Cunning] },
  [TrialCard.Trial2Intelligence]: { value: 6, victoryPoints: 9, gains: [Skill.Luck] },

  [TrialCard.Trial3Cunning]: { value: 5, victoryPoints: 6, gains: [Skill.Luck] },
  [TrialCard.Trial3Luck]: { value: 6, victoryPoints: 8, gains: [Skill.Intelligence] },
  [TrialCard.Trial3Strength]: { value: 6, victoryPoints: 10, gains: ['AthenaFavor'] },
  [TrialCard.Trial3Intelligence]: { value: 4, victoryPoints: 3, gains: [Skill.Strength, Skill.Cunning] },

  [TrialCard.Trial4Cunning]: { value: 3, victoryPoints: 3, gains: [Skill.Intelligence, Skill.Intelligence] },
  [TrialCard.Trial4Luck]: { value: 2, victoryPoints: 3, gains: ['AthenaFavor', Skill.Strength] },
  [TrialCard.Trial4Strength]: { value: 4, victoryPoints: 6, gains: ['AthenaFavor', Skill.Intelligence] },
  [TrialCard.Trial4Intelligence]: { value: 5, victoryPoints: 6, gains: [Skill.Luck] },

  [TrialCard.Trial5Cunning]: { value: 6, victoryPoints: 11, gains: [] },
  [TrialCard.Trial5Luck]: { value: 5, victoryPoints: 6, gains: [Skill.Cunning] },
  [TrialCard.Trial5Strength]: { value: 2, victoryPoints: 4, gains: [Skill.Luck] },
  [TrialCard.Trial5Intelligence]: { value: 6, victoryPoints: 9, gains: [Skill.Strength, Skill.Strength] },

  [TrialCard.Trial6Cunning]: { value: 5, victoryPoints: 5, gains: ['Choice'] },
  [TrialCard.Trial6Luck]: { value: 6, victoryPoints: 9, gains: ['AthenaFavor'] },
  [TrialCard.Trial6Strength]: { value: 5, victoryPoints: 9, gains: [] },
  [TrialCard.Trial6Intelligence]: { value: 4, victoryPoints: 5, gains: [Skill.Cunning] },

  [TrialCard.Trial7Cunning]: { value: 4, victoryPoints: 4, gains: ['Choice'] },
  [TrialCard.Trial7Luck]: { value: 3, victoryPoints: 4, gains: ['AthenaFavor', Skill.Intelligence] },
  [TrialCard.Trial7Strength]: { value: 5, victoryPoints: 8, gains: ['AthenaFavor'] },
  [TrialCard.Trial7Intelligence]: { value: 6, victoryPoints: 8, gains: [Skill.Cunning] },

  [TrialCard.Trial8Cunning]: { value: 5, victoryPoints: 8, gains: [] },
  [TrialCard.Trial8Luck]: { value: 4, victoryPoints: 4, gains: [Skill.Strength, Skill.Cunning] },
  [TrialCard.Trial8Strength]: { value: 3, victoryPoints: 4, gains: [Skill.Intelligence, Skill.Intelligence] },
  [TrialCard.Trial8Intelligence]: { value: 4, victoryPoints: 4, gains: [Skill.Luck, Skill.Luck] },

  [TrialCard.Trial9Cunning]: { value: 2, victoryPoints: 1, gains: ['AthenaFavor', 'Choice', 'Choice'] },
  [TrialCard.Trial9Luck]: { value: 6, victoryPoints: 10, gains: ['AthenaFavor'] },
  [TrialCard.Trial9Strength]: { value: 4, victoryPoints: 8, gains: [] },
  [TrialCard.Trial9Intelligence]: { value: 3, victoryPoints: 3, gains: [Skill.Cunning, Skill.Luck] },

  [TrialCard.Trial10Cunning]: { value: 0, victoryPoints: 0, gains: ['Choice', 'Choice'] },
  [TrialCard.Trial10Luck]: { value: 3, victoryPoints: 3, gains: [Skill.Strength, Skill.Strength] },
  [TrialCard.Trial10Strength]: { value: 3, victoryPoints: 5, gains: [Skill.Cunning] },
  [TrialCard.Trial10Intelligence]: { value: 2, victoryPoints: 2, gains: [Skill.Strength, Skill.Luck] },

  [TrialCard.Trial11Cunning]: { value: 3, victoryPoints: 4, gains: ['AthenaFavor', Skill.Strength] },
  [TrialCard.Trial11Luck]: { value: 4, victoryPoints: 5, gains: ['AthenaFavor', Skill.Cunning] },
  [TrialCard.Trial11Strength]: { value: 6, victoryPoints: 12, gains: [] },
  [TrialCard.Trial11Intelligence]: { value: 5, victoryPoints: 5, gains: [Skill.Cunning, Skill.Cunning] },

  [TrialCard.Trial12Cunning]: { value: 4, victoryPoints: 5, gains: [Skill.Intelligence] },
  [TrialCard.Trial12Luck]: { value: 5, victoryPoints: 5, gains: [Skill.Intelligence, Skill.Strength] },
  [TrialCard.Trial12Strength]: { value: 0, victoryPoints: 2, gains: ['AthenaFavor', Skill.Luck, Skill.Luck] },
  [TrialCard.Trial12Intelligence]: { value: 3, victoryPoints: 2, gains: [Skill.Strength, Skill.Cunning, Skill.Luck] },

  [TrialCard.Trial13Cunning]: { value: 3, victoryPoints: 2, gains: ['Choice', 'Choice'] },
  [TrialCard.Trial13Luck]: { value: 4, victoryPoints: 6, gains: [Skill.Strength] },
  [TrialCard.Trial13Strength]: { value: 2, victoryPoints: 3, gains: [Skill.Cunning, Skill.Cunning] },
  [TrialCard.Trial13Intelligence]: { value: 0, victoryPoints: 1, gains: [Skill.Strength, Skill.Cunning, Skill.Luck] },

  [TrialCard.Trial14Cunning]: { value: 6, victoryPoints: 9, gains: ['AthenaFavor'] },
  [TrialCard.Trial14Luck]: { value: 0, victoryPoints: 0, gains: ['AthenaFavor', 'AthenaFavor', Skill.Intelligence, Skill.Intelligence] },
  [TrialCard.Trial14Strength]: { value: 4, victoryPoints: 7, gains: [Skill.Luck] },
  [TrialCard.Trial14Intelligence]: { value: 3, victoryPoints: 4, gains: ['AthenaFavor', Skill.Strength] },

  [TrialCard.Trial15Cunning]: { value: 2, victoryPoints: 2, gains: [Skill.Luck, Skill.Luck] },
  [TrialCard.Trial15Luck]: { value: 3, victoryPoints: 2, gains: [Skill.Cunning, Skill.Intelligence] },
  [TrialCard.Trial15Strength]: { value: 6, victoryPoints: 9, gains: [Skill.Intelligence] },
  [TrialCard.Trial15Intelligence]: { value: 5, victoryPoints: 7, gains: [Skill.Strength] }
}
