import { Trans } from 'react-i18next'

export const TurnHelp = () => {
  return (
    <>
      <h2>
        <Trans i18nKey="help.turn.title" />
      </h2>
      <p>
        <Trans i18nKey="help.turn.intro" />
      </p>

      <h3>
        <Trans i18nKey="help.turn.step1Title" />
      </h3>
      <p>
        <Trans i18nKey="help.turn.step1Desc" />
      </p>

      <h3>
        <Trans i18nKey="help.turn.step2Title" />
      </h3>
      <p>
        <Trans i18nKey="help.turn.step2AdventureDesc" />
      </p>
      <p>
        <Trans i18nKey="help.turn.step2RestDesc" />
      </p>

      <h3>
        <Trans i18nKey="help.turn.step3Title" />
      </h3>
      <p>
        <Trans i18nKey="help.turn.step3Desc" />
      </p>

      <h3>
        <Trans i18nKey="help.turn.endTitle" />
      </h3>
      <p>
        <Trans i18nKey="help.turn.endDesc" />
      </p>
    </>
  )
}
