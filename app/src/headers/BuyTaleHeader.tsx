/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { CustomMoveType } from '@gamepark/odysseus/rules/CustomMoveType'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { FavorIcon } from '../theme/FavorIcon'

/**
 * The header is set in Cinzel small caps, whose cap height is 0.71em: measured in the browser, the
 * owl's own artwork — inset in its canvas by the drop shadow it carries — lands 0.25em too low on
 * that band with the alignment a button label calls for. This lifts it back onto the capitals.
 */
const headerFavorCss = css`
  vertical-align: -0.05em;
`

/** The Tale tiles themselves are the "take" button (see StoryTileDescription), so only passing needs one. */
export const BuyTaleHeader = () => {
  const rules = useRules<OdysseusRules>()!
  const me = usePlayerId<number>()
  const activePlayer = rules.getActivePlayer()
  const player = usePlayerName(activePlayer)
  const pass = useLegalMove(isCustomMoveType(CustomMoveType.Pass))
  const favor = <FavorIcon css={headerFavorCss} />
  if (activePlayer !== me) {
    return <Trans defaults="header.buyTale.player" values={{ player }} components={{ favor }} />
  }
  return <Trans defaults="header.buyTale.you" components={{ favor, pass: <PlayMoveButton move={pass} /> }} />
}
