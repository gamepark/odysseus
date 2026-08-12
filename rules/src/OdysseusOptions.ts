import { OptionsSpecV2 } from '@gamepark/rules-api'

/**
 * Odysseus is played by 1 to 5 players in the box (1 player being the solo mode against the Automa).
 * There is no identity to pick: the game has no player color, and every Story board is identical.
 * The only setup input is therefore the number of players, which the platform provides.
 */
export type OdysseusOptions = {
  players: number
}

/**
 * The structure of everything a host can choose before the game starts — and nothing else.
 *
 * Two things are deliberately absent, both because they change without the game changing:
 *
 * - **Text.** No labels, no help. They live in `app/public/options/<locale>.json`, published beside the
 *   game's translations and keyed by convention: `option.<option>`, `option.<option>.<value>`,
 *   `identities.<value>`, plus optional `.help` variants. Odysseus declares no option and no identity,
 *   so it publishes no such document.
 * - **Subscription and competitive gates.** Which options require a subscription, and which are allowed
 *   in ranked play, are the platform's decisions. They live in its database and are edited there.
 *
 * The declaration is plain JSON on purpose: the platform snapshots it when the bundle is prepared, so
 * every screen reads the option space without downloading and running a game bundle.
 *
 * `players` must match the range declared for the game on the platform — it is the root that every other
 * range narrows, and a disagreement silently changes which tables exist. It starts at 2: the box allows
 * a solo game, but the Automa is not implemented (its 16 card fronts were never delivered), so a 1-player
 * table would deal a ship with no opponent. Lower the minimum the day the Automa exists.
 */
export const OdysseusOptionsSpecV2: OptionsSpecV2 = {
  specVersion: 2,
  players: { min: 2, max: 5 }
}
