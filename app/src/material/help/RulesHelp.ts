import { RuleId } from '@gamepark/odysseus/rules/RuleId'
import { TurnHelp } from './TurnHelp'

export const RulesHelp = {
  [RuleId.ChooseTrialCard]: TurnHelp,
  [RuleId.ResolveSkillGain]: TurnHelp,
  [RuleId.ChooseTale]: TurnHelp,
  [RuleId.FinishTurn]: TurnHelp
}
