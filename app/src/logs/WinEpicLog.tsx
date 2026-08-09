import { EpicTile } from '@gamepark/odysseus/material/EpicTile'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { epicTileDescription } from '../material/EpicTileDescription'
import { MaterialChip } from './MaterialChip'

export const WinEpicLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const rules = new OdysseusRules(context.game as MaterialGame)
  const moveItem = move as MoveItem
  const item = rules.material(MaterialType.EpicTile).getItem(moveItem.itemIndex)
  const playerName = usePlayerName(moveItem.location.player)

  return (
    <Trans
      i18nKey="log.winEpic"
      values={{ player: playerName }}
      components={{ tile: <MaterialChip type={MaterialType.EpicTile} item={item} image={epicTileDescription.images[item.id as EpicTile]} /> }}
    />
  )
}
