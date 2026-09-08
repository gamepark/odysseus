/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { CustomMoveType } from '@gamepark/odysseus/rules/CustomMoveType'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { Trans, useTranslation } from 'react-i18next'
import { FavorIcon } from '../theme/FavorIcon'

/** Matches BuyTaleHeader: lifts the shadowed owl artwork back onto the small-caps cap band. */
const headerFavorCss = css`
  vertical-align: -0.05em;
`

/**
 * The gains are resolved on the board itself, one button per skill cube (see SkillCubeDescription).
 * The only header button is the forfeit one, offered when an imposed gain lands on a full track and
 * the player would rather keep their Athena Favor than redirect it (see ResolveSkillGainRule).
 */
export const ResolveSkillGainHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<OdysseusRules>()!
  const me = usePlayerId<number>()
  const activePlayer = rules.getActivePlayer()
  const player = usePlayerName(activePlayer)
  const forfeit = useLegalMove(isCustomMoveType(CustomMoveType.ForfeitGain))
  if (activePlayer !== me) {
    return <>{t('header.resolveSkillGain.player', { player })}</>
  }
  if (forfeit) {
    return (
      <Trans
        defaults="header.resolveSkillGain.forfeit"
        components={{ favor: <FavorIcon css={headerFavorCss} />, forfeit: <PlayMoveButton move={forfeit} /> }}
      />
    )
  }
  return <>{t('header.resolveSkillGain.you')}</>
}
