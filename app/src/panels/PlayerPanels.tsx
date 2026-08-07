import { css } from '@emotion/react'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { Skill, skills } from '@gamepark/odysseus/Skill'
import { CounterProps, StyledPlayerPanel, usePlayers, useRules } from '@gamepark/react-game'
import { createPortal } from 'react-dom'
import Cunning from '../images/icons/Cunning.png'
import Intelligence from '../images/icons/Intelligence.png'
import Luck from '../images/icons/Luck.png'
import Strength from '../images/icons/Strength.png'
import AthenaFavor from '../images/tokens/AthenaFavor.png'

const skillIcons: Record<Skill, string> = {
  [Skill.Strength]: Strength,
  [Skill.Intelligence]: Intelligence,
  [Skill.Cunning]: Cunning,
  [Skill.Luck]: Luck
}

type PlayerPanelsProps = {
  displayedPlayer?: number
  onSelectPlayer: (player: number) => void
}

export const PlayerPanels = ({ displayedPlayer, onSelectPlayer }: PlayerPanelsProps) => {
  const players = usePlayers<number>({ sortFromMe: true })
  const rules = useRules<OdysseusRules>()
  const root = document.getElementById('root')
  if (!root || !rules) {
    return null
  }

  return createPortal(
    <>
      {players.map((player, index) => {
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
            key={player.id}
            player={player}
            counters={counters}
            countersPerLine={3}
            activeRing
            onClick={() => onSelectPlayer(player.id)}
            css={[panelPosition(index), panelStyle, player.id === displayedPlayer && selectedPanel]}
          />
        )
      })}
    </>,
    root
  )
}

const panelPosition = (index: number) => css`
  position: absolute;
  right: 1em;
  top: ${8.5 + index * 16}em;
  width: 28em;
`

const panelStyle = css`
  cursor: pointer;
`

const selectedPanel = css`
  outline: 0.3em solid gold;
  outline-offset: 0.2em;
`
