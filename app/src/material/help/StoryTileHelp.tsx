import { StoryTileType } from '@gamepark/odysseus/material/StoryTile'
import { AdventureType } from '@gamepark/odysseus/material/TrialCardStats'
import { Skill } from '@gamepark/odysseus/Skill'
import { MaterialHelpProps } from '@gamepark/react-game'
import { Trans, useTranslation } from 'react-i18next'

const skillTypes: Partial<Record<StoryTileType, Skill>> = {
  [StoryTileType.Strength]: Skill.Strength,
  [StoryTileType.Intelligence]: Skill.Intelligence,
  [StoryTileType.Cunning]: Skill.Cunning,
  [StoryTileType.Luck]: Skill.Luck
}

const adventureTypes: Partial<Record<StoryTileType, AdventureType>> = {
  [StoryTileType.Navigation]: AdventureType.Navigation,
  [StoryTileType.Encounters]: AdventureType.Encounters,
  [StoryTileType.Gods]: AdventureType.Gods,
  [StoryTileType.Creatures]: AdventureType.Creatures,
  [StoryTileType.Ithaca]: AdventureType.Ithaca
}

const adventureTypeKeys: Record<AdventureType, string> = {
  [AdventureType.Navigation]: 'navigation',
  [AdventureType.Gods]: 'gods',
  [AdventureType.Creatures]: 'creatures',
  [AdventureType.Encounters]: 'encounters',
  [AdventureType.Ithaca]: 'ithaca'
}

const valueLabels: Partial<Record<StoryTileType, string>> = {
  [StoryTileType.Value1Or2]: '1-2',
  [StoryTileType.Value3]: '3',
  [StoryTileType.Value4]: '4',
  [StoryTileType.Value5]: '5',
  [StoryTileType.Value6]: '6'
}

export const StoryTileHelp = ({ item }: MaterialHelpProps) => {
  const { t } = useTranslation()
  const id = item.id as StoryTileType | undefined
  const skill = id !== undefined ? skillTypes[id] : undefined
  const adventureType = id !== undefined ? adventureTypes[id] : undefined
  const value = id !== undefined ? valueLabels[id] : undefined

  return (
    <>
      <h2>
        <Trans i18nKey="help.storyTile.title" />
      </h2>
      <p>
        <Trans i18nKey="help.storyTile.role" />
      </p>
      <p>
        <Trans i18nKey="help.storyTile.scoring" />
      </p>
      {skill !== undefined && (
        <p>
          <Trans i18nKey="help.storyTile.matchSkill" values={{ skill: t(`skill.${Skill[skill].toLowerCase()}`) }} />
        </p>
      )}
      {adventureType !== undefined && (
        <p>
          <Trans i18nKey="help.storyTile.matchAdventureType" values={{ type: t(`adventureType.${adventureTypeKeys[adventureType]}`) }} />
        </p>
      )}
      {value !== undefined && (
        <p>
          <Trans i18nKey="help.storyTile.matchValue" values={{ value }} />
        </p>
      )}

      <h3>
        <Trans i18nKey="help.storyTile.obtainTitle" />
      </h3>
      <ul>
        <li>
          <Trans i18nKey="help.storyTile.obtainRow" />
        </li>
        <li>
          <Trans i18nKey="help.storyTile.obtainFavor" />
        </li>
      </ul>
      <p>
        <Trans i18nKey="help.storyTile.choice" />
      </p>
      <p>
        <Trans i18nKey="help.storyTile.max" />
      </p>
    </>
  )
}
