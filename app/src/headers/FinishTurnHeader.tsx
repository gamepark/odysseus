import { useTranslation } from 'react-i18next'

export const FinishTurnHeader = () => {
  const { t } = useTranslation()
  return <>{t('header.finishTurn')}</>
}
