import { Skill } from '@gamepark/odysseus/Skill'
import { MaterialHelpProps } from '@gamepark/react-game'
import { Trans, useTranslation } from 'react-i18next'

export const SkillCubeHelp = ({ item }: MaterialHelpProps) => {
  const { t } = useTranslation()
  const id = item.id as Skill | undefined
  const value = item.location?.x

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
          <Trans i18nKey="help.skillCube.current" values={{ skill: t(`skill.${Skill[id].toLowerCase()}`), value: value ?? 0 }} />
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
