import { getEnumValues } from '@gamepark/rules-api'

/**
 * The 4 skills of the game, each associated with a color.
 * Those colors identify the skills, not the players: every player owns one cube of each color,
 * placed on the matching track of their Story board.
 */
export enum Skill {
  Strength = 1, // red
  Intelligence, // blue
  Cunning, // yellow
  Luck // green
}

export const skills = getEnumValues(Skill)
