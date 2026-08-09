import { EpicTile } from '@gamepark/odysseus/material/EpicTile'
import { MaterialHelpProps } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const EpicTileHelp = ({ item }: MaterialHelpProps) => {
  const value = item.id as EpicTile | undefined

  return (
    <>
      <h2>
        <Trans i18nKey="help.epicTile.title" />
      </h2>
      <p>
        <Trans i18nKey="help.epicTile.role" />
      </p>
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
