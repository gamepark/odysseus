import { RuleId } from '@gamepark/odysseus/rules/RuleId'
import { ComponentType } from 'react'
import { BuyTaleHeader } from './BuyTaleHeader'
import { ChooseTaleHeader } from './ChooseTaleHeader'
import { ChooseTrialCardHeader } from './ChooseTrialCardHeader'
import { FinishTurnHeader } from './FinishTurnHeader'
import { ResolveSkillGainHeader } from './ResolveSkillGainHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.ChooseTrialCard]: ChooseTrialCardHeader,
  [RuleId.ResolveSkillGain]: ResolveSkillGainHeader,
  [RuleId.ChooseTale]: ChooseTaleHeader,
  [RuleId.BuyTale]: BuyTaleHeader,
  [RuleId.FinishTurn]: FinishTurnHeader
}
