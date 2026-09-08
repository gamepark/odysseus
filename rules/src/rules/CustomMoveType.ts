export enum CustomMoveType {
  /** Declining the last chance to buy a Tale before the turn ends (see BuyTaleRule). */
  Pass = 1,
  /**
   * Letting go of a printed skill gain that cannot be raised — its track is full — when the player
   * would rather keep their Athena Favor than redirect it to another skill (see ResolveSkillGainRule).
   */
  ForfeitGain
}
