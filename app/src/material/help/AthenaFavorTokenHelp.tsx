import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { TALE_COST } from '@gamepark/odysseus/rules/OdysseusPlayerTurnRule'
import { useMaterialContext, usePlayerId } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const AthenaFavorTokenHelp = () => {
  const { rules } = useMaterialContext()
  const player = usePlayerId<number>()
  const currentCount =
    player !== undefined ? rules.material(MaterialType.AthenaFavorToken).location(LocationType.PlayerAthenaFavor).player(player).length : undefined

  return (
    <>
      <h2>
        <Trans i18nKey="help.athenaFavorToken.title" />
      </h2>
      <p>
        <Trans i18nKey="help.athenaFavorToken.role" />
      </p>
      {currentCount !== undefined && (
        <p>
          <Trans i18nKey="help.athenaFavorToken.currentCount" values={{ count: currentCount }} />
        </p>
      )}
      <ul>
        <li>
          <Trans i18nKey="help.athenaFavorToken.useTale" />
        </li>
        <li>
          <Trans i18nKey="help.athenaFavorToken.useRedirect" />
        </li>
      </ul>
      {currentCount !== undefined && currentCount >= TALE_COST && (
        <p>
          <Trans i18nKey="help.athenaFavorToken.canBuyTale" />
        </p>
      )}

      <h3>
        <Trans i18nKey="help.athenaFavorToken.gainTitle" />
      </h3>
      <ul>
        <li>
          <Trans i18nKey="help.athenaFavorToken.gainReveal" />
        </li>
        <li>
          <Trans i18nKey="help.athenaFavorToken.gainRest" />
        </li>
        <li>
          <Trans i18nKey="help.athenaFavorToken.gainCard" />
        </li>
        <li>
          <Trans i18nKey="help.athenaFavorToken.gainRefill" />
        </li>
      </ul>
    </>
  )
}
