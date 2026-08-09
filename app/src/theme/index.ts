import { css } from '@emotion/react'
import { defaultTheme, GameTheme } from '@gamepark/react-game'
import { colors } from './colors'
import { fontBody, fontDisplay } from './typography'

const dialogContainer = css`
  box-shadow:
    0 0 0 0.1em rgba(184, 134, 46, 0.35),
    0 0.6em 1.5em rgba(0, 0, 0, 0.6);
`

const buttonBase = css`
  background: ${colors.teal} !important;
  color: ${colors.creamSoft} !important;
  border: 0.15em solid ${colors.gold} !important;
  border-radius: 0.3em !important;
  padding: 0.4em 1em !important;
  font-family: ${fontDisplay};
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: 0 0.2em 0.4em rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: background 150ms ease, color 150ms ease, border-color 150ms ease, transform 120ms ease;
  outline: none !important;

  &:hover:not(:disabled),
  &:focus:hover:not(:disabled) {
    background: ${colors.gold} !important;
    color: ${colors.tealDeep} !important;
    border-color: ${colors.goldDeep} !important;
  }

  &:focus:not(:hover):not(:disabled) {
    background: ${colors.teal} !important;
    color: ${colors.creamSoft} !important;
    border-color: ${colors.goldLight} !important;
  }

  &:active:not(:disabled) {
    background: ${colors.tealDeep} !important;
    color: ${colors.cream} !important;
    border-color: ${colors.goldDeep} !important;
    transform: translateY(0.05em);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

const headerBar = css`
  background: rgba(18, 50, 64, 0.93);
  border-bottom: 0.15em solid ${colors.gold};
  color: ${colors.cream};
  font-family: ${fontDisplay};
  box-shadow: 0 0.2em 0.5em rgba(0, 0, 0, 0.6);

  h1 {
    color: ${colors.cream};
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  b, strong {
    color: ${colors.gold};
  }
`

const headerButtons = css`
  background: transparent !important;
  color: ${colors.cream} !important;
  border: 0.08em solid rgba(242, 233, 213, 0.5) !important;
  border-radius: 0.3em !important;
  font-family: ${fontDisplay};
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  padding: 0 0.45em !important;
  box-shadow: none !important;
  outline: none !important;
  transition: background 150ms ease, color 150ms ease, border-color 150ms ease;

  &:hover:not(:disabled),
  &:focus:hover:not(:disabled) {
    background: ${colors.cream} !important;
    color: ${colors.tealDeep} !important;
    border-color: ${colors.cream} !important;
  }

  &:focus:not(:hover):not(:disabled) {
    background: transparent !important;
    color: ${colors.cream} !important;
    border-color: ${colors.goldLight} !important;
  }

  &:active:not(:disabled) {
    background: ${colors.gold} !important;
    color: ${colors.tealDeep} !important;
    border-color: ${colors.gold} !important;
  }
`

const menuPanel = css`
  background: ${colors.tealDeep};
  color: ${colors.cream};
  border: 0.05em solid ${colors.teal};
  box-shadow:
    0 0 0 0.1em rgba(184, 134, 46, 0.35),
    0 0.6em 1.5em rgba(0, 0, 0, 0.6);
  font-family: ${fontDisplay};

  h2 {
    color: ${colors.cream};
    border-bottom: 0.15em solid ${colors.gold};
    padding-bottom: 0.3em;
    letter-spacing: 0.02em;
  }
`

const menuMainButton = css`
  background: ${colors.gold} !important;
  color: ${colors.tealDeep} !important;
  border: 0.15em solid ${colors.goldDeep} !important;
  outline: none !important;

  &:hover:not(:disabled) {
    background: ${colors.goldDeep} !important;
    color: ${colors.cream} !important;
  }

  &:focus:not(:hover):not(:disabled) {
    background: ${colors.gold} !important;
    color: ${colors.tealDeep} !important;
  }
`

const playerPanelPanel = css`
  background: ${colors.tealDeep};
  border: 0.08em solid ${colors.teal};
  box-shadow: 0 0.2em 0.5em rgba(0, 0, 0, 0.5);
`

const playerPanelDataBadge = css`
  background: rgba(18, 50, 64, 0.85) !important;
  color: ${colors.cream} !important;
  border: 0.08em solid ${colors.gold} !important;
  font-family: ${fontDisplay};
`

export const theme: GameTheme = {
  ...defaultTheme,
  root: {
    ...defaultTheme.root,
    fontFamily: fontBody
  },
  palette: {
    primary: colors.teal,
    primaryHover: colors.tealLight,
    primaryActive: colors.tealDeep,
    primaryLight: colors.cream,
    primaryLighter: colors.creamSoft,
    surface: colors.tealDeep,
    onSurface: colors.cream,
    onSurfaceFocus: colors.teal,
    onSurfaceActive: colors.tealLight,
    danger: colors.terracottaLight,
    dangerHover: colors.terracotta,
    dangerActive: colors.terracottaDeep,
    disabled: '#6B6B6B'
  },
  buttons: buttonBase,
  dialog: {
    ...defaultTheme.dialog,
    backgroundColor: colors.tealDeep,
    color: colors.cream,
    container: dialogContainer,
    buttons: buttonBase
  },
  header: {
    bar: headerBar,
    buttons: headerButtons
  },
  menu: {
    panel: menuPanel,
    mainButton: menuMainButton
  },
  playerPanel: {
    activeRingColors: [colors.gold, colors.tealLight],
    panel: playerPanelPanel,
    dataBadge: playerPanelDataBadge
  }
}
