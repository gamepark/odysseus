import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'

/** The gains are resolved on the board itself, one button per skill cube (see SkillCubeDescription). */
export const ResolveSkillGainHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<OdysseusRules>()!
  const me = usePlayerId<number>()
  const activePlayer = rules.getActivePlayer()
  const player = usePlayerName(activePlayer)
  if (activePlayer === me) {
    return <>{t('header.resolveSkillGain.you')}</>
  }
  return <>{t('header.resolveSkillGain.player', { player })}</>
}
