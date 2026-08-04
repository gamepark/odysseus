import { OptionsSpec } from '@gamepark/rules-api'

/**
 * Odysseus is played by 1 to 5 players (1 player being the solo mode against the Automa).
 * There is no identity to pick: the game has no player color, and every Story board is identical.
 * The only setup input is therefore the number of players, which the platform provides.
 */
export type OdysseusOptions = {
  players: number
}

/**
 * This object describes all the options a game can have, and will be used by GamePark website to create automatically forms for you game
 * (forms for friendly games, or forms for matchmaking preferences, for instance).
 * Odysseus has no option so far.
 */
export const OdysseusOptionsSpec: OptionsSpec<OdysseusOptions> = {}
