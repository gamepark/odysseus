/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import AthenaFavor from '../images/tokens/AthenaFavor.png'

const favorIconCss = css`
  height: 1.2em;
  width: auto;
  vertical-align: -0.3em;
`

/**
 * The Athena Favor token, standing in for the word wherever the game names its currency in running
 * text. The default sits it on a button label; `className` lets a caller pass its own emotion class to
 * re-align it against a different typeface (see BuyTaleHeader).
 */
export const FavorIcon = ({ className }: { className?: string }) => <img src={AthenaFavor} alt="" css={favorIconCss} className={className} />

/**
 * The price of an action, spelled out on the button that charges it: "-1 🦉" to redirect a skill gain,
 * "-3 🦉" to take a Tale. Nothing to translate — the owl says it in every language.
 */
export const FavorCost = ({ cost }: { cost: number }) => (
  <>
    {`-${cost}`}
    <FavorIcon />
  </>
)
