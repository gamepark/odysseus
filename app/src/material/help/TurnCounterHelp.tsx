import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'
import { getTurnCount, TURNS_PER_PLAYER } from '../../turn/TurnCount'

export const TurnCounterHelp = () => {
  const rules = useRules<OdysseusRules>()!
  const { turn, ship, ships } = getTurnCount(rules)
  const values = { turn, total: TURNS_PER_PLAYER, ship, ships }
  return (
    <>
      <h2>
        <Trans i18nKey="help.turnCounter.title" values={values} />
      </h2>
      <p>
        <Trans i18nKey="help.turnCounter.rounds" values={values} />
      </p>
      <p>
        <Trans i18nKey="help.turnCounter.why" values={values} />
      </p>
      <p>
        <Trans i18nKey="help.turnCounter.ship" values={values} />
      </p>
      <p>
        <Trans i18nKey="help.turnCounter.end" values={values} />
      </p>
    </>
  )
}
