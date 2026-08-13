import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'

/**
 * Nothing is said of the Tale a player could buy with 3 Athena Favors: the offer follows them all
 * turn long (see OdysseusPlayerTurnRule) and the tiles carry their own "-3 🦉" button, so spelling it
 * out here would only drown the one thing this step is about — picking a Trial card.
 */
export const ChooseTrialCardHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<OdysseusRules>()!
  const me = usePlayerId<number>()
  const activePlayer = rules.getActivePlayer()
  const player = usePlayerName(activePlayer)
  if (activePlayer !== me) {
    return <>{t('header.chooseTrialCard.player', { player })}</>
  }
  return <>{t('header.chooseTrialCard.you')}</>
}
