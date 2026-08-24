import { Skill } from '@gamepark/odysseus/Skill'
import { MaterialHelpProps } from '@gamepark/react-game'
import { Trans, useTranslation } from 'react-i18next'

/** Top of the track (see rules-fr.pdf p.2 §"chaque personne prend..."): SkillCubeDescription lays out 7 slots, 0 to 6. */
const MAX_SKILL_VALUE = 6

export const SkillCubeHelp = ({ item }: MaterialHelpProps) => {
  const { t } = useTranslation()
  const id = item.id as Skill | undefined
  const value = item.location?.x ?? 0

  return (
    <>
      <h2>
        <Trans i18nKey="help.skillCube.title" />
      </h2>
      <p>
        <Trans i18nKey="help.skillCube.role" />
      </p>
      {id !== undefined && (
        <p>
          <Trans i18nKey="help.skillCube.current" values={{ skill: t(`skill.${Skill[id].toLowerCase()}`), value }} />
        </p>
      )}
      {id !== undefined && value >= MAX_SKILL_VALUE && (
        <p>
          <Trans i18nKey="help.skillCube.maxed" values={{ skill: t(`skill.${Skill[id].toLowerCase()}`) }} />
        </p>
      )}
      <p>
        <Trans i18nKey="help.skillCube.increase" />
      </p>
      <p>
        <Trans i18nKey="help.skillCube.redirect" />
      </p>
      <p>
        <Trans i18nKey="help.skillCube.scoring" />
      </p>
    </>
  )
}
