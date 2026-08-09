import { css } from '@emotion/react'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { Skill } from '@gamepark/odysseus/Skill'
import { Picture, ScoringDescription, ScoringValue } from '@gamepark/react-game'
import { getEnumValues } from '@gamepark/rules-api'
import Cunning from '../images/icons/Cunning.png'
import EpicTile from '../images/icons/EpicTile.png'
import Intelligence from '../images/icons/Intelligence.png'
import Luck from '../images/icons/Luck.png'
import Strength from '../images/icons/Strength.png'
import StoryToken from '../images/icons/StoryToken.png'

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
        return <Picture src={Strength} css={iconCss} />
      case ScoringKey.Intelligence:
        return <Picture src={Intelligence} css={iconCss} />
      case ScoringKey.Cunning:
        return <Picture src={Cunning} css={iconCss} />
      case ScoringKey.Luck:
        return <Picture src={Luck} css={iconCss} />
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
