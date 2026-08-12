import { css } from '@emotion/react'
import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { Skill, skills } from '@gamepark/odysseus/Skill'
import { CounterProps, StyledPlayerPanel, useMaterialContext, usePlay, usePlayer, useRules } from '@gamepark/react-game'
import { Location, MaterialMoveBuilder } from '@gamepark/rules-api'
import Cunning from '../images/icons/Cunning.png'
import Intelligence from '../images/icons/Intelligence.png'
import Luck from '../images/icons/Luck.png'
import Strength from '../images/icons/Strength.png'
import AthenaFavor from '../images/icons/AthenaFavor.png'
import { PANEL_WIDTH } from '../locators/PlayerPanelLayout'
import { showsAllTrials } from '../locators/PlayerRowLayout'

const skillIcons: Record<Skill, string> = {
  [Skill.Strength]: Strength,
  [Skill.Intelligence]: Intelligence,
  [Skill.Cunning]: Cunning,
  [Skill.Luck]: Luck
}

export const PlayerPanelContent = ({ location }: { location: Location<number> }) => {
  const rules = useRules<OdysseusRules>()!
  const play = usePlay()
  const context = useMaterialContext()
  const player = usePlayer<number>(location.player)
  // The player whose Trials are laid out above their board (see DisplayedPlayer): the framework's own
  // "view", which every locator reads back from the game. Nothing to select while everyone's Trials are
  // out at once — the panel is then just a read-out, sitting beside the board it belongs to.
  const selectable = !showsAllTrials(context)
  const displayedPlayer = rules.game.view ?? rules.players[0]
  if (!player) return null

  const counters: CounterProps[] = [
    ...skills.map((skill) => ({
      image: skillIcons[skill],
      value: rules.material(MaterialType.SkillCube).player(player.id).id(skill).getItem()?.location.x ?? 0
    })),
    {
      image: AthenaFavor,
      value: rules.material(MaterialType.AthenaFavorToken).location(LocationType.PlayerAthenaFavor).player(player.id).getQuantity()
    }
  ]

  return (
    <StyledPlayerPanel
      player={player}
      counters={counters}
      countersPerLine={3}
      activeRing
      onClick={selectable ? () => play(MaterialMoveBuilder.changeView(player.id), { transient: true }) : undefined}
      css={[panelStyle, selectable && selectablePanel, selectable && player.id === displayedPlayer && selectedPanel]}
    />
  )
}

/**
 * StyledPlayerPanel is authored in its own 28em-wide box: rescale that box down to PANEL_WIDTH table units. Its
 * height is driven by its content, and PANEL_HEIGHT only approximates it (see PlayerPanelLayout).
 */
const panelStyle = css`
  position: absolute;
  top: 0;
  right: 0;
  font-size: ${PANEL_WIDTH / 28}em;
`

const selectablePanel = css`
  cursor: pointer;
  /* PlayerPanelDescription is a LocationDescription, and LocationComponent sets pointer-events: none
   * on the whole location unless it has an onShortClick/onLongClick (from displayHelp), which this one
   * doesn't. That disables pointer-events for the entire subtree by inheritance, swallowing our onClick
   * below — restore it here. */
  pointer-events: auto;
`

const selectedPanel = css`
  outline: 0.3em solid gold;
  outline-offset: 0.2em;
`
