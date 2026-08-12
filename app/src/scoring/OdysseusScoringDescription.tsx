import { css } from '@emotion/react'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { Skill } from '@gamepark/odysseus/Skill'
import { Picture, ScoringDescription, ScoringValue } from '@gamepark/react-game'
import { getEnumValues } from '@gamepark/rules-api'
import EpicTile from '../images/icons/EpicTile.png'
import StoryToken from '../images/icons/StoryToken.png'
import { skillIcons } from '../images/Icons'

/** Mirrors ScorePad.jpg's row order: the 4 skills, then Récits (lyre icon), then Épopée, then the total. */
enum ScoringKey {
  Strength = 1,
  Intelligence,
  Cunning,
  Luck,
  Tale,
  Epic,
  Total
}

export class OdysseusScoringDescription implements ScoringDescription<number, OdysseusRules, ScoringKey> {
  getScoringKeys() {
    return getEnumValues(ScoringKey)
  }

  getScoringHeader(key: ScoringKey): ScoringValue {
    switch (key) {
      case ScoringKey.Strength:
        return <Picture src={skillIcons[Skill.Strength]} css={iconCss} />
      case ScoringKey.Intelligence:
        return <Picture src={skillIcons[Skill.Intelligence]} css={iconCss} />
      case ScoringKey.Cunning:
        return <Picture src={skillIcons[Skill.Cunning]} css={iconCss} />
      case ScoringKey.Luck:
        return <Picture src={skillIcons[Skill.Luck]} css={iconCss} />
      case ScoringKey.Tale:
        return <Picture src={StoryToken} css={iconCss} />
      case ScoringKey.Epic:
        return <Picture src={EpicTile} css={iconCss} />
      case ScoringKey.Total:
        return <span css={totalCss}>=</span>
    }
  }

  getScoringPlayerData(key: ScoringKey, player: number, rules: OdysseusRules): ScoringValue {
    switch (key) {
      case ScoringKey.Strength:
        return rules.getSkillScore(player, Skill.Strength)
      case ScoringKey.Intelligence:
        return rules.getSkillScore(player, Skill.Intelligence)
      case ScoringKey.Cunning:
        return rules.getSkillScore(player, Skill.Cunning)
      case ScoringKey.Luck:
        return rules.getSkillScore(player, Skill.Luck)
      case ScoringKey.Tale:
        return rules.getTaleScore(player)
      case ScoringKey.Epic:
        return rules.getEpicScore(player)
      case ScoringKey.Total:
        return rules.getScore(player)
    }
  }
}

const iconCss = css`
  height: 1em;
  transform: scale(1.8) translateY(0.1em);
`

const totalCss = css`
  font-size: 1.5em;
  font-weight: bold;
  line-height: 0.7;
`
