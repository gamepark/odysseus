import { css } from '@emotion/react'
import { getTrialCardSkill, TrialCard } from '@gamepark/odysseus/material/TrialCard'
import { AdventureType, adventureTypeOf, Gain, trialCardStats } from '@gamepark/odysseus/material/TrialCardStats'
import { Skill } from '@gamepark/odysseus/Skill'
import { MaterialHelpProps } from '@gamepark/react-game'
import { Trans, useTranslation } from 'react-i18next'
import Creatures from '../../images/icons/Creatures.png'
import Cunning from '../../images/icons/Cunning.png'
import Encounters from '../../images/icons/Encounters.png'
import Gods from '../../images/icons/Gods.png'
import Intelligence from '../../images/icons/Intelligence.png'
import Ithaca from '../../images/icons/Ithaca.png'
import Luck from '../../images/icons/Luck.png'
import Navigation from '../../images/icons/Navigation.png'
import Strength from '../../images/icons/Strength.png'

const adventureTypeKeys: Record<AdventureType, string> = {
  [AdventureType.Navigation]: 'navigation',
  [AdventureType.Gods]: 'gods',
  [AdventureType.Creatures]: 'creatures',
  [AdventureType.Encounters]: 'encounters',
  [AdventureType.Ithaca]: 'ithaca'
}

const adventureTypeIcons: Record<AdventureType, string> = {
  [AdventureType.Navigation]: Navigation,
  [AdventureType.Gods]: Gods,
  [AdventureType.Creatures]: Creatures,
  [AdventureType.Encounters]: Encounters,
  [AdventureType.Ithaca]: Ithaca
}

const skillIcons: Record<Skill, string> = {
  [Skill.Strength]: Strength,
  [Skill.Intelligence]: Intelligence,
  [Skill.Cunning]: Cunning,
  [Skill.Luck]: Luck
}

const inlineIcon = css`
  height: 1.2em;
  vertical-align: middle;
  margin-right: 0.3em;
`

const GainLine = ({ gain }: { gain: Gain }) => {
  const { t } = useTranslation()
  if (gain === 'Choice') return <Trans i18nKey="help.trialCard.gainChoice" />
  if (gain === 'AthenaFavor') return <Trans i18nKey="help.trialCard.gainFavor" />
  return (
    <>
      <img css={inlineIcon} src={skillIcons[gain]} alt="" />
      <Trans i18nKey="help.trialCard.gainFixed" values={{ skill: t(`skill.${Skill[gain].toLowerCase()}`) }} />
    </>
  )
}

export const TrialCardHelp = ({ item }: MaterialHelpProps) => {
  const { t } = useTranslation()
  const id = item.id as TrialCard | undefined
  const stats = id !== undefined ? trialCardStats[id] : undefined
  const skill = id !== undefined ? getTrialCardSkill(id) : undefined
  const adventureType = id !== undefined ? adventureTypeOf(id) : undefined

  return (
    <>
      <h2>
        <Trans i18nKey="help.trialCard.title" />
      </h2>
      <p>
        <Trans i18nKey="help.trialCard.role" />
      </p>
      {skill !== undefined && (
        <p>
          <Trans i18nKey="help.trialCard.skill" values={{ skill: t(`skill.${Skill[skill].toLowerCase()}`) }} />
        </p>
      )}
      {stats !== undefined && (
        <p>
          <Trans i18nKey="help.trialCard.value" values={{ value: stats.value }} />
        </p>
      )}
      {stats !== undefined && (
        <p>
          <Trans i18nKey="help.trialCard.points" values={{ points: stats.victoryPoints }} />
        </p>
      )}
      {adventureType !== undefined && (
        <p>
          <img css={inlineIcon} src={adventureTypeIcons[adventureType]} alt="" />
          <Trans i18nKey="help.trialCard.adventureType" values={{ type: t(`adventureType.${adventureTypeKeys[adventureType]}`) }} />
        </p>
      )}
      {stats !== undefined && (
        <>
          <h3>
            <Trans i18nKey="help.trialCard.gainsTitle" />
          </h3>
          {stats.gains.length === 0 ? (
            <p>
              <Trans i18nKey="help.trialCard.gainsNone" />
            </p>
          ) : (
            <ul>
              {stats.gains.map((gain, index) => (
                <li key={index}>
                  <GainLine gain={gain} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <h3>
        <Trans i18nKey="help.trialCard.chooseTitle" />
      </h3>
      <p>
        <Trans i18nKey="help.trialCard.chooseDesc" />
      </p>

      <h3>
        <Trans i18nKey="action.adventure" />
      </h3>
      <p>
        <Trans i18nKey="help.trialCard.adventureDesc" />
      </p>

      <h3>
        <Trans i18nKey="action.rest" />
      </h3>
      <p>
        <Trans i18nKey="help.trialCard.restDesc" />
      </p>

      <h3>
        <Trans i18nKey="help.trialCard.scoringTitle" />
      </h3>
      <p>
        <Trans i18nKey="help.trialCard.scoringDesc" />
      </p>
    </>
  )
}
