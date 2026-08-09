import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { StoryTileType } from '@gamepark/odysseus/material/StoryTile'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { storyTileDescription } from '../material/StoryTileDescription'
import { MaterialChip } from './MaterialChip'

export const WinTaleLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const rules = new OdysseusRules(context.game as MaterialGame)
  const moveItem = move as MoveItem
  const item = rules.material(MaterialType.StoryTile).getItem(moveItem.itemIndex)
  const playerName = usePlayerName(moveItem.location.player)

  return (
    <Trans
      i18nKey="log.winTale"
      values={{ player: playerName }}
      components={{ tile: <MaterialChip type={MaterialType.StoryTile} item={item} image={storyTileDescription.images[item.id as StoryTileType]} /> }}
    />
  )
}
