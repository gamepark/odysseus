import { getEnumValues } from '@gamepark/rules-api'
import { Skill } from '../Skill'

/**
 * The 60 Trial cards: 15 adventures x 4 skills.
 * Naming mirrors the delivered artwork files (Trial<adventure><Skill>.jpg). Within an adventure, the
 * order is always Cunning, Luck, Strength, Intelligence (matches the source files' numbering, see CLAUDE.md).
 */
export enum TrialCard {
  Trial1Cunning = 1,
  Trial1Luck,
  Trial1Strength,
  Trial1Intelligence,
  Trial2Cunning,
  Trial2Luck,
  Trial2Strength,
  Trial2Intelligence,
  Trial3Cunning,
  Trial3Luck,
  Trial3Strength,
  Trial3Intelligence,
  Trial4Cunning,
  Trial4Luck,
  Trial4Strength,
  Trial4Intelligence,
  Trial5Cunning,
  Trial5Luck,
  Trial5Strength,
  Trial5Intelligence,
  Trial6Cunning,
  Trial6Luck,
  Trial6Strength,
  Trial6Intelligence,
  Trial7Cunning,
  Trial7Luck,
  Trial7Strength,
  Trial7Intelligence,
  Trial8Cunning,
  Trial8Luck,
  Trial8Strength,
  Trial8Intelligence,
  Trial9Cunning,
  Trial9Luck,
  Trial9Strength,
  Trial9Intelligence,
  Trial10Cunning,
  Trial10Luck,
  Trial10Strength,
  Trial10Intelligence,
  Trial11Cunning,
  Trial11Luck,
  Trial11Strength,
  Trial11Intelligence,
  Trial12Cunning,
  Trial12Luck,
  Trial12Strength,
  Trial12Intelligence,
  Trial13Cunning,
  Trial13Luck,
  Trial13Strength,
  Trial13Intelligence,
  Trial14Cunning,
  Trial14Luck,
  Trial14Strength,
  Trial14Intelligence,
  Trial15Cunning,
  Trial15Luck,
  Trial15Strength,
  Trial15Intelligence
}

export const trialCards = getEnumValues(TrialCard)

const skillOrder = [Skill.Cunning, Skill.Luck, Skill.Strength, Skill.Intelligence]

export const getTrialCardAdventure = (card: TrialCard) => Math.floor((card - 1) / 4) + 1
export const getTrialCardSkill = (card: TrialCard): Skill => skillOrder[(card - 1) % 4]

/**
 * Within a ShipTrialSlot row (x: 0-5), the central pair (x 2-3) stays face down until revealed.
 * Shared by the client (TrialCardDescription.isFlipped) and the server (OdysseusRules.hidingStrategies)
 * so the visual flip and the actual hidden data never drift apart.
 */
export const isShipTrialSlotFaceDown = (x?: number) => x === 2 || x === 3
