import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { CustomMoveType } from '@gamepark/odysseus/rules/CustomMoveType'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { Trans, useTranslation } from 'react-i18next'

export const ChooseTrialCardHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<OdysseusRules>()!
  const me = usePlayerId<number>()
  const activePlayer = rules.getActivePlayer()
  const player = usePlayerName(activePlayer)
  const spendFavor = useLegalMove(isCustomMoveType(CustomMoveType.SpendFavorForTale))
  if (activePlayer !== me) {
    return <>{t('header.chooseTrialCard.player', { player })}</>
  }
  if (spendFavor) {
    return (
      <Trans
        defaults="header.chooseTrialCard.youWithFavor"
        components={{
          spendFavor: <PlayMoveButton move={spendFavor} />
        }}
      />
    )
  }
  return <>{t('header.chooseTrialCard.you')}</>
}
