import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialMove } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

export const RedirectSkillLog: FC<MoveComponentProps<MaterialMove>> = ({ context }) => {
  const playerName = usePlayerName(context.game.rule?.player)

  return <Trans i18nKey="log.redirectSkill" values={{ player: playerName }} />
}
