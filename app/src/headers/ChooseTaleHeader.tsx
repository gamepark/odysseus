import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'

export const ChooseTaleHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<OdysseusRules>()!
  const me = usePlayerId<number>()
  const activePlayer = rules.getActivePlayer()
  const player = usePlayerName(activePlayer)
  if (activePlayer === me) {
    return <>{t('header.chooseTale.you')}</>
  } else {
    return <>{t('header.chooseTale.player', { player })}</>
  }
}
