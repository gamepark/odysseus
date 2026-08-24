import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { useMaterialContext } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const ShipBoardHelp = () => {
  const { rules } = useMaterialContext()
  const deckRemaining = rules.material(MaterialType.TrialCard).location(LocationType.TrialDeck).length

  return (
    <>
      <h2>
        <Trans i18nKey="help.shipBoard.title" />
      </h2>
      <p>
        <Trans i18nKey="help.shipBoard.role" />
      </p>
      <p>
        <Trans i18nKey="help.shipBoard.choose" />
      </p>
      <p>
        <Trans i18nKey="help.shipBoard.refill" />
      </p>
      <p>
        <Trans i18nKey="help.shipBoard.end" />
      </p>
      <p>
        {deckRemaining > 0 ? (
          <Trans i18nKey="help.shipBoard.deckRemaining" values={{ count: deckRemaining }} />
        ) : (
          <Trans i18nKey="help.shipBoard.deckEmpty" />
        )}
      </p>
    </>
  )
}
