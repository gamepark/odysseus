import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialMove, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

export const GainFavorLog: FC<MoveComponentProps<MaterialMove>> = ({ move }) => {
  const moveItem = move as MoveItem
  const playerName = usePlayerName(moveItem.location.player)

  return <Trans i18nKey="log.gainFavor" values={{ player: playerName }} />
}
