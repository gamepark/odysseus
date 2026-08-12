import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { isCreateItem, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

/** A Favor either comes off the Ship (a move) or straight out of the unlimited reserve (a creation). */
export const GainFavorLog: FC<MoveComponentProps<MaterialMove>> = ({ move }) => {
  const location = isCreateItem(move) ? move.item.location : (move as MoveItem).location
  const playerName = usePlayerName(location.player)

  return <Trans i18nKey="log.gainFavor" values={{ player: playerName }} />
}
