export enum RuleId {
  /** Also resolves "go on adventure or rest" for the chosen card in the same move (see ChooseTrialCardRule). */
  ChooseTrialCard = 1,
  ResolveSkillGain,
  ChooseTale,
  FinishTurn,
  /** Comes just before FinishTurn, despite its rank here: the last chance to spend 3 Favors (see BuyTaleRule). */
  BuyTale
}
