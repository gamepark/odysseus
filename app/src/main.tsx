import { OdysseusOptionsSpecV2 } from '@gamepark/odysseus/OdysseusOptions'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { OdysseusSetup } from '@gamepark/odysseus/OdysseusSetup'
import { GameProvider } from '@gamepark/react-game'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gameAnimations } from './animations/GameAnimations'
import { App } from './App'
import { Locators } from './locators/Locators'
import { OdysseusLogDescription } from './logs/OdysseusLogDescription'
import { Material } from './material/Material'
import { RulesHelp } from './material/help/RulesHelp'
import { OdysseusScoringDescription } from './scoring/OdysseusScoringDescription'
import { theme } from './theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider
      game="odysseus"
      Rules={OdysseusRules}
      optionsSpec={OdysseusOptionsSpecV2}
      GameSetup={OdysseusSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}
      scoring={new OdysseusScoringDescription()}
      rulesHelp={RulesHelp}
      logs={new OdysseusLogDescription()}
      theme={theme}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
