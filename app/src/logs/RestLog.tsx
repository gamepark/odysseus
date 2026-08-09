import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialMove, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

/**
 * A card placed via "Se reposer" (rules-fr.pdf p.5) stays face down in play, so unlike AdventureLog
 * no card image is shown — even to its owner, hiddenStrategies keeps its id out of the move (see
 * OdysseusRules.hidingStrategies, PlayerRestPile).
 */
export const RestLog: FC<MoveComponentProps<MaterialMove>> = ({ move }) => {
  const moveItem = move as MoveItem
  const playerName = usePlayerName(moveItem.location.player)

  return <Trans i18nKey="log.rest" values={{ player: playerName }} />
}
