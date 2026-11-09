import { css } from '@emotion/react'
import { AdventureType } from '@gamepark/odysseus/material/TrialCardStats'
import { Skill } from '@gamepark/odysseus/Skill'
import { Picture } from '@gamepark/react-game'
import { getEnumValues } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import Skills from '../images/icons/Skills.png'
import { adventureTypeIcons, skillIcons } from '../images/Icons'

const skillColors: Record<Skill, string> = {
  [Skill.Strength]: '#C01020',
  [Skill.Intelligence]: '#0090D0',
  [Skill.Cunning]: '#B89000',
  [Skill.Luck]: '#40A040'
}

const skillNameKeys: Record<Skill, string> = {
  [Skill.Strength]: 'strength',
  [Skill.Intelligence]: 'intelligence',
  [Skill.Cunning]: 'cunning',
  [Skill.Luck]: 'luck'
}

const skillChipCss = (skill: Skill) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.2em;
  font-weight: 700;
  color: ${skillColors[skill]};
`

const skillIconCss = css`
  display: inline-block;
  height: 1.1em;
  width: auto;
  vertical-align: -0.2em;
`

/** A skill name in its color, preceded by its cube icon. */
export const SkillChip: FC<{ skill: Skill }> = ({ skill }) => (
  <span css={skillChipCss(skill)}>
    <Picture src={skillIcons[skill]} css={skillIconCss} />
    <Trans defaults={`tuto.skillName.${skillNameKeys[skill]}`} />
  </span>
)

/** The four-coloured emblem standing for the cubes, inline with the text. */
export const SkillsEmblem: FC = () => <Picture src={Skills} css={skillIconCss} />

const adventureIconCss = css`
  display: inline-block;
  height: 1.3em;
  width: auto;
  vertical-align: -0.3em;
  margin: 0 0.05em;
`

/** The 5 Trial category icons in a row, for the Epic tile step: a `<types/>` tag in a Trans string. */
export const AdventureTypeIcons: FC = () => (
  <>
    {getEnumValues(AdventureType).map((type) => (
      <Picture key={type} src={adventureTypeIcons[type]} css={adventureIconCss} />
    ))}
  </>
)
