import { Trans } from 'react-i18next'

export const StoryBoardHelp = () => {
  return (
    <>
      <h2>
        <Trans i18nKey="help.storyBoard.title" />
      </h2>
      <p>
        <Trans i18nKey="help.storyBoard.role" />
      </p>
      <p>
        <Trans i18nKey="help.storyBoard.scoring" />
      </p>
      <p>
        <Trans i18nKey="help.storyBoard.tieBreak" />
      </p>
    </>
  )
}
