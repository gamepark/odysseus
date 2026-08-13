export enum Memory {
  /** Whether the active player already spent 3 Athena Favors for a Tale this turn (once/turn). */
  TaleBoughtThisTurn = 1,
  /** Interactive gains left to resolve, one eaten per skill increase by ResolveSkillGainRule. */
  PendingGains,
  /** The row (y) of the adventure card just placed this turn, set while it may still complete a line. */
  PlacedAdventureRow,
  /** The TaleDisplay slot (x) left empty by the Tale just taken, waiting to be replenished. */
  AwaitingReplenish
}
