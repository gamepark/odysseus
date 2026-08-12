# Revue des règles — `rules/src` vs. `app/public/rules-fr.pdf`

Troisième relecture complète : chaque point de règle du livret (8 pages de règles) recomparé ligne à
ligne à `rules/src`, plus un contrôle de conformité aux conventions officielles GamePark
(gamepark.github.io/docs) et à CLAUDE.md.

**Verdict** : la boucle de jeu principale (2 à 5 joueurs) implémente correctement tous les points de
règle du livret. Trois bugs ont été trouvés au fil des passes précédentes et sont tous corrigés. Une
déviation volontaire reste en place (documentée). Le mode solo/Automa (p.8) n'est pas implémenté.

## Historique des bugs trouvés et corrigés

Les trois bugs suivants ont été trouvés lors des passes précédentes de cette revue et sont **tous
corrigés** — revérifiés dans cette troisième passe (compilation + `__verify.test.ts`, 100 parties
aléatoires, toujours vertes).

1. **"Une fois par tour" du Récit contre Faveurs pas respecté** — `ChooseTrialCardRule.onRuleStart()`
   remettait `Memory.TaleBoughtThisTurn` à `false` même en revenant d'un achat de Récit dans le même
   tour (rules-fr.pdf p.7 : "une seule fois pendant votre tour"). Corrigé : le flag n'est remis à zéro
   que si on ne revient pas de `RuleId.ChooseTale`.
2. **`ChooseTaleRule` cassait l'undo** — utilisait `startPlayerTurn` avec le même joueur au lieu de
   `startRule` sur le chemin de retour vers `ChooseTrialCardRule`, en violation de
   `features/rule-moves.md` ("do not use startPlayerTurn if the player does not change"). Corrigé : les
   deux branches de `returnFromTale()` utilisent `startRule`.
3. **Donnée erronée sur une carte** — `Trial5Intelligence` avait `gains: ['AthenaFavor']` au lieu de
   `gains: [Skill.Strength, Skill.Strength]` (l'image de la carte montre bien 2 icônes Force). Trouvé
   suite à un signalement joueur, confirmé en comparant les 60 images de cartes une par une aux données
   de `TrialCardStats.ts`. Corrigé.

## Vérification détaillée face au livret

**Mise en place (p.2)**
- Pioche Épreuve : `players.length × 12` cartes gardées parmi les 60 mélangées (24/36/48/60) —
  `OdysseusSetup.setupTrialDeck`. Le livret ne donne que les quantités par nombre de joueurs, pas
  lesquelles cartes ; un sous-ensemble aléatoire est le seul choix possible.
- Rangées du Navire : la paire centrale (x 2-3) de chaque côté distribuée face cachée (4 cartes au
  total), les 4 emplacements restants par côté (x 0,1,4,5) distribués face visible (8 au total) —
  `setupShipRows`.
- Jetons Récit : 28 (14 types × 2) répartis en 2 pioches face cachée, 4 révélés depuis l'une d'elles —
  `setupTaleTiles`.
- Faveur d'Athéna : 1 posée de chaque côté du Navire, "formez une réserve avec les jetons restants"
  (p.2, §6) — `setupAthenaFavor`. Le livret ne dit rien d'une réserve épuisée, ni en mise en place ni
  p.7 : les 40 jetons sont une quantité de matériel jugée suffisante, pas une règle. La réserve est donc
  modélisée comme un stock illimité (aucun item, un `staticItem` côté affichage) : les Faveurs octroyées
  sont créées, les Faveurs dépensées supprimées. C'est l'ancien code qui déviait, en supprimant
  silencieusement l'octroi quand la réserve était vide — cas atteignable en théorie (une partie à 5 où
  tout le monde se repose systématiquement distribue jusqu'à ~65 Faveurs sans en dépenser aucune).
- Tuiles Épopée : empilées pour que la **plus grande** valeur soit distribuée en premier — vérifié via
  le tri par défaut de `Material.deck()` (`item => -item.location.x`, x décroissant distribué en
  premier) combiné à l'assignation `x: index` croissante de `setupEpicTiles` (id 10 au x le plus haut).
- Par joueur : plateau + 4 cubes à 0, 1 Récit de départ (pioche "Second"), 1 Faveur de départ, carte
  aide (matériel physique, pas de code nécessaire) — `setupPlayers`.
- Dernier joueur à avoir "voyagé en bateau" commence : pas modélisable en code (choix de siège externe
  au moteur), `this.players[0]` est le premier joueur fourni par la plateforme — conforme à la
  convention habituelle de ce framework.

**Anatomie d'une carte Épreuve / Choisir une carte Épreuve (p.4)**
- 4 compétences × couleur (Force rouge, Intelligence bleue, Ruse jaune, Chance verte) — `Skill.ts`.
- Seules les deux extrémités de chaque rangée sont jouables — `ChooseTrialCardRule.getPlayerMoves`
  (`minBy`/`maxBy` par côté), jamais une carte entre deux autres.
- Choisir une carte adjacente à la paire centrale cachée (x 1 ou 4) révèle les deux cartes cachées de
  *ce côté uniquement* et octroie la Faveur placée entre elles — vérifié que cette condition ne peut
  être atteinte que quand la carte choisie est justement l'extrémité courante (les cartes ne sont
  jamais retirées qu'aux extrémités, donc x=1/x=4 n'est jouable qu'une fois x=0/x=5 déjà pris).

**Partir à l'aventure / Se reposer (p.5)**
- Aventure : les gains sont résolus dans l'ordre imprimé via la file d'attente de
  `ResolveSkillGainRule` (compétence fixe / Choix / Faveur). Les gains Faveur se trouvent toujours être
  imprimés en premier sur les 60 cartes (vérifié en relisant `TrialCardStats.ts`), donc l'implémentation
  "accorder toutes les Faveurs immédiatement, puis résoudre la file des autres gains" ne diverge jamais
  en pratique de l'ordre imprimé sur la carte. La carte est ajoutée dans la colonne de sa compétence.
- Maximum 4 cartes par compétence : le coup "aventure" n'est offert que si
  `column.length < MAX_CARDS_PER_SKILL` ; "se reposer" est toujours offert, donc une colonne pleine
  force naturellement le repos pour cette carte précise — correspond à "si vous n'avez pas d'autre
  choix... vous devez vous reposer" sans logique supplémentaire nécessaire.
- Repos : carte posée face cachée (sans les gains, jamais comptée nulle part ensuite — ni succès, ni
  Récit, puisqu'exclue de `getScoredCards`), +1 compétence au choix, +1 Faveur de la réserve —
  `resolveRest()`.

**Finir son tour (p.5) / Fin de partie (p.7)**
- Redistribution (défausser la dernière carte, 4 cachées + 8 visibles, +1 Faveur par côté) seulement
  quand il reste exactement 1 carte sur le Navire et que la pioche n'est pas vide ; pioche vide + 1
  carte restante termine la partie — `FinishTurnRule`. Vérifié que la pioche ne peut jamais se
  retrouver avec un reste partiel (1 à 11 cartes) à ce moment précis : elle démarre à un multiple exact
  de 12 et chaque redistribution en consomme exactement 12 (11 cartes piochées par les joueurs + 1
  défaussée = 12 par cycle), donc c'est toujours soit "≥ 12, redistribution propre" soit "exactement 0,
  fin de partie" — les 12 appels `dealOne` de `FinishTurnRule` ne peuvent jamais planter par manque de
  cartes.
- Score : VP de réussite par compétence (`value <= skillScore`, une carte non réussie ne rapporte
  rien), + VP de Récit (inconditionnel, compte même les cartes non réussies), + VP de tuile Épopée.
  Départage sur le score de Récit, puis victoire partagée si toujours égalité — `getScore`/
  `getTieBreaker`, conforme au contrat documenté de `CompetitiveScore` ("appelé avec des valeurs de
  tieBreaker croissantes jusqu'à ce qu'undefined soit renvoyé").

**Récits (p.6)**
- Remporté en complétant une ligne de 4 (une carte par compétence à la même rangée) ou en dépensant 3
  Faveurs une fois par tour. `isRowComplete` redérive dynamiquement la complétion depuis la rangée de
  la carte qui vient d'être posée, ce qui gère correctement n'importe quel ordre de remplissage des 4
  colonnes.
- Maximum 6 Récits au total, *en comptant* celui de départ — correspond aux 6 emplacements physiques de
  `PlayerTaleLocator` côté app.
- 14 types (4 compétence / 5 type d'épreuve / 5 valeur de compétence, "1-2" fusionné en un seul type
  `Value1Or2`) × 2 exemplaires, 2 PV par carte correspondante, quel que soit son état de réussite —
  `StoryTile.ts`/`getStoryTileScore`, revérifié à la main sur un vrai état de partie (4 Récits, 11
  cartes) : calcul exact, confirmé auprès d'un joueur qui pensait initialement avoir trouvé un bug.

**Épopée (p.7)**
- Nécessite de *posséder* (pas forcément réussir) une carte de chacun des 5 types d'épreuve, une seule
  pile de 5 tuiles partagée pour toute la partie (valeur décroissante), maximum 1 par joueur —
  `isEpicEligible`.

**Faveurs d'Athéna (p.7)**
- Dépenser 3 une fois par tour pour un Récit (bug #1 ci-dessus, corrigé). Dépenser 1 Faveur pour
  rediriger un gain de compétence *fixe* vers un choix libre — correctement exclu pour les gains
  `'Choice'`, qui sont déjà un choix libre (aucune Faveur n'y serait utile).

**Mode solo (p.8)** — voir "Non implémenté" plus bas.

## Non implémenté : le mode solo / l'Automa

Rien dans `rules/src` ne modélise l'Automa : pas de `MaterialType` pour les 16 cartes Automa ni les 4
tuiles de difficulté, pas de logique de tour pour l'Automa (sélection "sens de la flèche", priorité
Faveur), pas de gestion Récit/Épopée pour l'Automa, pas de condition de fin de partie à 1 joueur
(`l'Automa possède 11 cartes Épreuve`). `OdysseusOptions` ne déclare pas non plus de minimum de
joueurs. C'est un mode entier non implémenté, pas un bug dans le code existant. Le CLAUDE.md documente
déjà que les 16 faces de cartes Automa n'ont même pas été livrées comme assets source.

## Déviation connue (volontaire, déjà discutée)

**rules-fr.pdf p.6** : "Si vous avez choisi un Récit visible, vous le remplacez par **le premier de
l'une des deux pioches**" — sous-entend un choix du joueur entre les deux pioches face cachée.

`ChooseTaleRule.dealTale()` réapprovisionne automatiquement depuis la première pioche non vide, sans
interaction du joueur. Comme les deux pioches sont mélangées et cachées, laquelle est piochée n'a
aucune incidence sur la partie — simplification volontaire pour supprimer un clic inutile.

## Conformité aux conventions GamePark

Comparé le code aux pages officielles : `concepts/core-concepts.md`, `concepts/items-and-locations.md`,
`concepts/hiding-data.md`, `features/item-moves.md`, `features/rule-moves.md`,
`features/custom-moves.md`, `features/location-strategies.md`, `features/piles-of-items.md`,
`step-by-step-example/write-the-headers.md`, `step-by-step-example/help-dialogs.md`, et la checklist de
fin de projet (`step-by-step-example/checklist.md`).

**Conforme :**
- `MaterialType`/`LocationType` démarrent à 1, un fichier de règle par phase de jeu, `getPlayerMoves()`/
  `beforeItemMove()`/`afterItemMove()`/`onRuleStart()` utilisés comme documenté.
- Nommage singulier/pluriel des coups (`moveItem`/`moveItems`, `createItem`/`createItems`,
  `deleteItem`/`deleteItems`) et pattern "filtrer d'abord" respectés partout.
- `startPlayerTurn` seulement quand le joueur change (3 appels, tous vérifiés : `OdysseusSetup.start()`
  et les 2 dans `FinishTurnRule`, tous via `this.nextPlayer`), `startRule` sinon (bug #2 corrigé).
- `HiddenMaterialRules` est le bon choix (pas de `SecretMaterialRules`) : aucune information n'est
  asymétrique entre joueurs.
- `CustomMoveType` en enum, `customMove()`/`onCustomMove()`, boutons de header via `useLegalMove()` +
  `isCustomMoveType()` + `PlayMoveButton` — correspond exactement au pattern documenté.
- `locationsStrategies` organisé par `MaterialType` puis `LocationType` ; l'absence de stratégie sur
  `PlayerRestPile` est correcte (l'ordre des cartes défaussées face cachée n'a aucune importance).
- `scoring` (nouveau `OdysseusScoringDescription`) suit le pattern `ScoringDescription` documenté
  (`getScoringKeys`/`getScoringHeader`/`getScoringPlayerData`), vérifié contre l'exemple fonctionnel de
  `../looot`.
- Assets de checklist présents : favicon, avatar, cover, box, `rules-en.pdf`/`rules-fr.pdf`.
- Aide (`help-dialogs.md`) : chaque description de matériel a sa propre `[Nom]Help`, contenu vérifié
  factuellement exact contre le livret (voir ci-dessous).

**Point vérifié empiriquement, la doc induit en erreur** : `write-the-headers.md` dit "Never use double
braces (`{{player}}`)" et les vrais projets `../looot`/`../dragon-bomb` utilisent bien `{player}`
(simple accolade). Odysseus utilise partout `{{player}}`/`{{skill}}`/`{{value}}` (double accolade,
syntaxe i18next standard) dans `fr.json`. Craignant que `i18next-icu` (chargé automatiquement par
`GameProvider`, voir `translation.util.js`) ne casse cette syntaxe, j'ai vérifié en ouvrant l'aide
"Cube de compétence" dans le navigateur : le texte interpolé s'affiche correctement ("Valeur actuelle
de la Force : 0 / 6"), aucune accolade brute visible. Donc **pas un bug** malgré la divergence avec la
doc — je le note seulement pour éviter qu'un futur refactor ne "corrige" ce qui fonctionne déjà.

**Déjà connu, rien de nouveau** : traductions non-FR vides (volontaire, voir CLAUDE.md), pas de
tutoriel (`features/tutorial-ai.md` non touché, cohérent avec l'absence du mode solo), TODO dans
`OdysseusSetup.ts:30` (`setupDebugPlayerBoards`, helper de debug désactivé, pas du code mort actif).

## Conformité au CLAUDE.md

- **Material** : `MaterialType`/`LocationType` démarrent à 1 ✓. Convention images (100px/cm cartes,
  cubes 1.65×1.67cm) respectée dans les descriptions déjà en place, non re-vérifiée pixel par pixel
  cette fois (déjà validée aux passes précédentes, rien n'a changé côté assets).
- **Structure du projet** : `rules/src/material`, `rules/src/rules`, `app/src/material`,
  `app/src/locators`, `app/src/headers` — tous présents et utilisés comme documenté.
- **Patterns à suivre** : création d'items en Setup, coups joueur dans `getPlayerMoves()`,
  conséquences via `before`/`afterItemMove` — respectés dans les 4 fichiers de règle.
- **Traductions** : "During development, only write translations in the developer's native language
  file" — `fr.json` (11.5 Ko) est le seul rempli, les 5 autres (`en/de/es/it/ru.json`) restent à `{}`
  malgré l'ajout récent d'un système d'aide complet (traductions `help.*`) — toujours respecté.
- **When Helping** : lu le code existant avant de modifier, suivi des patterns établis, testé
  incrémentalement (`tsc`/`vitest`/navigateur) à chaque changement de cette session.

## Hors périmètre / non vérifiable

Les `value`/`victoryPoints`/`gains` des 60 cartes Épreuve dans `TrialCardStats.ts` sont relevés sur
l'illustration des cartes (déjà entièrement recomparés image par image lors de la passe précédente, un
seul écart trouvé et corrigé — voir bug #3). Les faces des 16 cartes Automa solo n'ont pas été
livrées du tout (voir CLAUDE.md), donc rien à vérifier de ce côté.

## Remarque mineure (non confirmée comme atteignable)

Si un joueur avait un jour ses 4 compétences au maximum (6) simultanément pendant qu'un gain `'Choice'`
est en attente, `ResolveSkillGainRule.getPlayerMoves()` ne renverrait aucun coup, bloquant ce joueur.
Vu le nombre total fixe de cartes du jeu (`11×joueurs + 1` cartes jamais piochées sur toute la partie),
ça semble très improbable à atteindre, et ce n'est jamais arrivé dans les 100 parties aléatoires jouées
jusqu'au bout dans `__verify.test.ts` (25 parties × 4 nombres de joueurs, jusqu'à 20 000 coups
chacune).
