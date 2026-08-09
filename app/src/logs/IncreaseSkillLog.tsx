import { Skill } from '@gamepark/odysseus/Skill'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialMove, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export const IncreaseSkillLog: FC<MoveComponentProps<MaterialMove>> = ({ move }) => {
  const { t } = useTranslation()
  const moveItem = move as MoveItem
  const playerName = usePlayerName(moveItem.location.player)
  const skill = moveItem.location.id as Skill

  return <Trans i18nKey="log.increaseSkill" values={{ player: playerName, skill: t(`skill.${Skill[skill].toLowerCase()}`) }} />
}
