import { Trans } from 'react-i18next'

export const AthenaFavorTokenHelp = () => {
  return (
    <>
      <h2>
        <Trans i18nKey="help.athenaFavorToken.title" />
      </h2>
      <p>
        <Trans i18nKey="help.athenaFavorToken.role" />
      </p>
      <ul>
        <li>
          <Trans i18nKey="help.athenaFavorToken.useTale" />
        </li>
        <li>
          <Trans i18nKey="help.athenaFavorToken.useRedirect" />
        </li>
      </ul>

      <h3>
        <Trans i18nKey="help.athenaFavorToken.gainTitle" />
      </h3>
      <ul>
        <li>
          <Trans i18nKey="help.athenaFavorToken.gainReveal" />
        </li>
        <li>
          <Trans i18nKey="help.athenaFavorToken.gainRest" />
        </li>
        <li>
          <Trans i18nKey="help.athenaFavorToken.gainCard" />
        </li>
        <li>
          <Trans i18nKey="help.athenaFavorToken.gainRefill" />
        </li>
      </ul>
    </>
  )
}
