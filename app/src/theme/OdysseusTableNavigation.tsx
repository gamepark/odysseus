/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { GameTableNavigation } from '@gamepark/react-game'
import { SHIP_BOARD_X, TABLE_CENTER_X, TABLE_MARGIN_TOP, TABLE_UNIT, TABLE_Y_MAX, TABLE_Y_MIN } from '../locators/TableLayout'
import { colors } from './colors'

/**
 * The zoom buttons, restyled and laid on the ship's stern.
 *
 * GameTableNavigation floats them top left, over the sea the ship board prints there and over the Trial card
 * lying on it. They belong at the stern instead — the one part of the board that holds nothing once the Epic
 * tiles and the Athena favor supply are passed (see EpicDeckLocator and AthenaFavorSupplyLocator).
 *
 * They stay *fixed on screen* rather than being drawn inside the table: a control that pans away with the
 * board is a control you have to hunt for once you have zoomed in. Landing them on the stern all the same is
 * a matter of arithmetic — GameTable always draws the table in the same box, TABLE_MARGIN_TOP em down from
 * the top of the screen, TABLE_UNIT em per table unit, centered horizontally (see TableLayout) — so the
 * position below is read straight off the stern's table coordinates. It holds at every screen size, and only
 * parts company with the board when someone zooms in, which is the point.
 *
 * The `&&` on every rule below doubles the class specificity: the styles the library writes on that div and
 * its buttons are inserted after ours (a child renders after its parent), so a plain class would lose.
 */
export const OdysseusTableNavigation = () => <GameTableNavigation css={navigationCss} />

/**
 * Diameter of a disc, in table units, so the pair is read against the board it sits on rather than the
 * screen. What caps it is the band it has to fit in: the aft Trial cards hang their own buttons down to
 * 2.5 units of the stern's tip, and the pair sits in what is left.
 */
const BUTTON_SIZE = 2

/** Daylight between the two discs. */
const GAP = 0.5

/**
 * Where the pair sits, in table coordinates: on the ship's axis, and as low as the stern goes — the aft Trial
 * cards, and the buttons they open, come down to just above it.
 */
const ANCHOR_X = SHIP_BOARD_X
const ANCHOR_Y = TABLE_Y_MAX - BUTTON_SIZE / 2 - 0.2

/** Same point, in the screen em the table's box is expressed in: from the center for x, from the top for y. */
const OFFSET_FROM_CENTER = (ANCHOR_X - TABLE_CENTER_X) * TABLE_UNIT
const OFFSET_FROM_TOP = TABLE_MARGIN_TOP + (ANCHOR_Y - TABLE_Y_MIN) * TABLE_UNIT

const navigationCss = css`
  && {
    top: ${OFFSET_FROM_TOP}em;
    left: calc(50% + ${OFFSET_FROM_CENTER}em);
    /* translateZ is the library's own: the container is portaled next to the table, keep it above it. */
    transform: translate(-50%, -50%) translateZ(100em);
    gap: ${GAP * TABLE_UNIT}em;
  }

  && > button {
    font-size: ${(BUTTON_SIZE / 2) * TABLE_UNIT}em;
    background: ${colors.teal};
    border: 0.12em solid ${colors.gold};
    color: ${colors.cream};
    filter: none;
    box-shadow: 0 0.15em 0.4em rgba(0, 0, 0, 0.5), inset 0 0.08em 0.12em rgba(255, 255, 255, 0.1);
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease, transform 120ms ease;
  }

  && > button:not(:disabled) {
    &:hover,
    &:focus {
      background: ${colors.tealLight};
      border-color: ${colors.goldLight};
      color: ${colors.cream};
      transform: none;
    }

    &:active {
      background: ${colors.tealDeep};
      border-color: ${colors.goldDeep};
      transform: translateY(0.06em);
    }
  }

  /* Zoomed all the way in or out: the disc stays in place, dimmed, rather than turning grey and jumping out
   * of the row (the library's own disabled look). Dimmed only so far — it lies on the painted hull, and any
   * fainter it would read as a smudge on the wood rather than as the other half of the pair. */
  && > button:disabled {
    background: rgba(44, 121, 151, 0.75);
    border-color: rgba(184, 134, 46, 0.6);
    color: rgba(242, 233, 213, 0.45);
  }
`
