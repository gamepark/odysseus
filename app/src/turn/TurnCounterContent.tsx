import { css } from '@emotion/react'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { useRules } from '@gamepark/react-game'
import { colors } from '../theme/colors'
import { fontDisplay } from '../theme/typography'
import { getTurnCount, TURNS_PER_PLAYER } from './TurnCount'

/** "3/11", nothing else: the plaque itself is the button that opens the help (the location's own short click, see TurnCounterHelp). */
export const TurnCounterContent = () => {
  const rules = useRules<OdysseusRules>()!
  const { turn } = getTurnCount(rules)
  return (
    <div css={plaqueCss}>
      {turn}/{TURNS_PER_PLAYER}
    </div>
  )
}

const plaqueCss = css`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  background: ${colors.teal};
  border: 0.08em solid ${colors.gold};
  box-shadow: 0 0.1em 0.3em rgba(0, 0, 0, 0.5);
  color: ${colors.cream};
  font-family: ${fontDisplay};
  font-weight: bold;
  font-size: 1em;
  line-height: 1;
  /* Flex centers the line box, not the digits: Cinzel's ascent (0.98em) dwarfs its descent (0.37em), so in a
   * 1em line the digits (0.72em tall, measured with canvas measureText) end 0.805em down and their middle falls
   * 0.055em above the box's. Twice that on top brings it back to the middle. */
  box-sizing: border-box;
  padding-top: 0.11em;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;

  &:hover {
    background: ${colors.tealLight};
    border-color: ${colors.goldLight};
  }
`
