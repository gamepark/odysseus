import { EpicTile } from '@gamepark/odysseus/material/EpicTile'
import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { MaterialHelpProps, usePlayerId, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const EpicTileHelp = ({ item }: MaterialHelpProps) => {
  const rules = useRules<OdysseusRules>()!
  const player = usePlayerId<number>()
  const value = item.id as EpicTile | undefined
  const alreadyEarned =
    player !== undefined && rules.material(MaterialType.EpicTile).location(LocationType.PlayerEpic).player(player).length > 0
  const adventureTypesOwned =
    player !== undefined && !alreadyEarned ? new Set(rules.getScoredCards(player).map((card) => card.adventureType)).size : undefined

  return (
    <>
      <h2>
        <Trans i18nKey="help.epicTile.title" />
      </h2>
      <p>
        <Trans i18nKey="help.epicTile.role" />
      </p>
      {alreadyEarned && (
        <p>
          <Trans i18nKey="help.epicTile.alreadyEarned" />
        </p>
      )}
      {adventureTypesOwned !== undefined && (
        <p>
          <Trans i18nKey="help.epicTile.progress" values={{ count: adventureTypesOwned }} />
        </p>
      )}
      {value !== undefined && (
        <p>
          <Trans i18nKey="help.epicTile.value" values={{ value }} />
        </p>
      )}
      <p>
        <Trans i18nKey="help.epicTile.reward" />
      </p>
      <p>
        <Trans i18nKey="help.epicTile.decreasing" />
      </p>
      <p>
        <Trans i18nKey="help.epicTile.max" />
      </p>
    </>
  )
}
