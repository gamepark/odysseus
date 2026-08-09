import { css } from '@emotion/react'
import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { Skill, skills } from '@gamepark/odysseus/Skill'
import { CounterProps, StyledPlayerPanel, usePlayer, useRules } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { setDisplayedPlayer, useDisplayedPlayer } from '../DisplayedPlayer'
import Cunning from '../images/icons/Cunning.png'
import Intelligence from '../images/icons/Intelligence.png'
import Luck from '../images/icons/Luck.png'
import Strength from '../images/icons/Strength.png'
import AthenaFavor from '../images/tokens/AthenaFavor.png'
import { PANEL_WIDTH } from '../locators/PlayerPanelLayout'

const skillIcons: Record<Skill, string> = {
  [Skill.Strength]: Strength,
  [Skill.Intelligence]: Intelligence,
  [Skill.Cunning]: Cunning,
  [Skill.Luck]: Luck
}

export const PlayerPanelContent = ({ location }: { location: Location<number> }) => {
  const rules = useRules<OdysseusRules>()!
  const player = usePlayer<number>(location.player)
  const displayedPlayer = useDisplayedPlayer(rules.players[0])
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
      onClick={() => setDisplayedPlayer(player.id)}
      css={[panelStyle, player.id === displayedPlayer && selectedPanel]}
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
  cursor: pointer;
`

const selectedPanel = css`
  outline: 0.3em solid gold;
  outline-offset: 0.2em;
`
