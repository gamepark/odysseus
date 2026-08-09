import { Trans } from 'react-i18next'

export const ShipBoardHelp = () => {
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
    </>
  )
}
