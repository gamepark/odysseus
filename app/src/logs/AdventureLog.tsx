import { TrialCard } from '@gamepark/odysseus/material/TrialCard'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { trialCardDescription } from '../material/TrialCardDescription'
import { MaterialChip } from './MaterialChip'

export const AdventureLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const rules = new OdysseusRules(context.game as MaterialGame)
  const moveItem = move as MoveItem
  const item = rules.material(MaterialType.TrialCard).getItem(moveItem.itemIndex)
  const playerName = usePlayerName(moveItem.location.player)

  return (
    <Trans
      i18nKey="log.adventure"
      values={{ player: playerName }}
      components={{ card: <MaterialChip type={MaterialType.TrialCard} item={item} image={trialCardDescription.images[item.id as TrialCard]} /> }}
    />
  )
}
