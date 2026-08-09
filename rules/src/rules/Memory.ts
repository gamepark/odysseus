export enum Memory {
  /** Whether the active player already spent 3 Athena Favors for a Tale this turn (once/turn). */
  TaleBoughtThisTurn = 1,
  /** Queue of interactive gains left to resolve, drained one at a time by ResolveSkillGainRule. */
  PendingGains,
  /** The row (y) of the adventure card just placed this turn, set while it may still complete a line. */
  PlacedAdventureRow,
  /** Where ChooseTaleRule should return to once the Tale is fully resolved. */
  TaleReturnsTo,
  /** The TaleDisplay slot (x) left empty by ChooseTaleRule, waiting to be replenished. */
  AwaitingReplenish
}
