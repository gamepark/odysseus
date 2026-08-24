import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { MaterialHelpProps, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const StoryBoardHelp = ({ item }: MaterialHelpProps) => {
  const rules = useRules<OdysseusRules>()!
  const player = item.location?.player as number | undefined
  const name = usePlayerName(player)
  const currentScore = player !== undefined ? rules.getScore(player) : undefined

  return (
    <>
      <h2>
        <Trans i18nKey="help.storyBoard.title" />
      </h2>
      <p>
        <Trans i18nKey="help.storyBoard.role" />
      </p>
      {currentScore !== undefined && (
        <p>
          <Trans i18nKey="help.storyBoard.currentScore" values={{ name, score: currentScore }} />
        </p>
      )}
      <p>
        <Trans i18nKey="help.storyBoard.scoring" />
      </p>
      <p>
        <Trans i18nKey="help.storyBoard.tieBreak" />
      </p>
    </>
  )
}
