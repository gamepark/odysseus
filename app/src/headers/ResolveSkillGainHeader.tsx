import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { CustomMoveType } from '@gamepark/odysseus/rules/CustomMoveType'
import { Skill } from '@gamepark/odysseus/Skill'
import { PlayMoveButton, useLegalMove, useLegalMoves, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType } from '@gamepark/rules-api'
import { Trans, useTranslation } from 'react-i18next'

export const ResolveSkillGainHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<OdysseusRules>()!
  const me = usePlayerId<number>()
  const activePlayer = rules.getActivePlayer()
  const player = usePlayerName(activePlayer)
  const skillMoves = useLegalMoves(isMoveItemType(MaterialType.SkillCube))
  const spendFavor = useLegalMove(isCustomMoveType(CustomMoveType.SpendFavorForSkillChange))
  if (activePlayer !== me) {
    return <>{t('header.resolveSkillGain.player', { player })}</>
  }
  // A single matching move means this gain targets one fixed skill (rules-fr.pdf p.5): offer to
  // confirm it, or (if we hold a Favor) to trade it for a free pick instead (rules-fr.pdf p.7).
  // Several matches mean the gain is already a free choice (the rainbow icon), resolved by clicking
  // a skill cube directly — no confirmation button needed.
  if (skillMoves.length === 1) {
    const increase = skillMoves[0]
    const skill = increase.location.id as Skill
    return (
      <Trans
        defaults={spendFavor ? 'header.resolveSkillGain.fixedWithFavor' : 'header.resolveSkillGain.fixed'}
        values={{ skill: t(`skill.${Skill[skill].toLowerCase()}`) }}
        components={{
          increase: <PlayMoveButton move={increase} />,
          ...(spendFavor && { spendFavor: <PlayMoveButton move={spendFavor} /> })
        }}
      />
    )
  }
  return <>{t('header.resolveSkillGain.you')}</>
}
