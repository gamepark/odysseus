# Revue des règles — `rules/src` vs. `app/public/rules-fr.pdf`

Relecture complète de `rules-fr.pdf` (8 pages de règles + 2 pages d'histoire), vérifiée section par
section face à `rules/src`. Verdict : la boucle de jeu principale (2 à 5 joueurs) est correctement
implémentée et colle précisément au livret, avec deux bugs (corrigés depuis), une déviation
connue/volontaire, et un mode entièrement non implémenté.

**Mise à jour** : deuxième passe faite pour (1) revérifier que rien n'a régressé depuis la première
revue et (2) contrôler la conformité du code aux conventions officielles GamePark
(gamepark.github.io/docs) — voir la section dédiée en bas de fichier. Un second bug a été trouvé et
corrigé à cette occasion.

## ~~Bug confirmé~~ Corrigé : le "une fois par tour" du Récit contre Faveurs n'était pas respecté

**rules-fr.pdf p.7** : "Vous pouvez dépenser, **une seule fois pendant votre tour**, 3 Faveurs d'Athéna
pour gagner un Récit."

`ChooseTrialCardRule.onRuleStart()` remettait `Memory.TaleBoughtThisTurn` à `false` sans condition, y
compris quand `ChooseTaleRule.returnFromTale()` renvoyait le joueur vers `ChooseTrialCardRule` **en plein
milieu de son tour** (juste après avoir dépensé 3 Faveurs et choisi son Récit) — le moteur appelle
`onRuleStart` à chaque coup `StartPlayerTurn`/`StartRule` sans condition, peu importe si la règle ou le
joueur a réellement changé. Un joueur avec ≥6 Faveurs pouvait donc racheter un second Récit (≥9 pour un
troisième, etc.) dans le même tour.

**Corrigé** : `onRuleStart` ne remet plus le flag à `false` que si `previousRule?.id !== RuleId.ChooseTale`
(la règle quittée, reçue en second argument) — donc uniquement au démarrage d'un tour *vraiment* nouveau,
plus au retour d'un achat de Récit dans le même tour. Vérifié par un scénario ciblé (joueur avec 10
Faveurs, achat d'un Récit, puis contrôle que le second achat n'est plus proposé) avant d'être retiré, en
plus des 100 parties aléatoires de `__verify.test.ts` qui continuent de passer.

## Corrigé (trouvé en vérifiant les conventions GamePark) : `ChooseTaleRule` cassait l'undo

Pas un écart avec `rules-fr.pdf` à proprement parler, mais un bug trouvé en comparant le code à
gamepark.github.io/docs/features/rule-moves.md, qui est explicite : "do not use `startPlayerTurn` if the
player does not change, as it will otherwise prevent any legal undo" — `startRule` doit être utilisé à
la place dès que le joueur actif ne change pas.

`ChooseTaleRule.returnFromTale()`, sur le chemin "retour vers `ChooseTrialCardRule`" (après un achat de
Récit contre Faveurs), faisait :
```ts
this.startPlayerTurn(RuleId.ChooseTrialCard, this.player)
```
avec `this.player` — donc **le même joueur** que celui déjà actif. Ça enfreint directement la règle
ci-dessus et empêchait d'annuler ce coup précis. L'autre branche (retour vers `FinishTurnRule`) utilisait
déjà correctement `startRule`.

**Corrigé** : les deux branches utilisent maintenant `startRule` (qui conserve automatiquement le joueur
actif courant, `this.game.rule?.player`, sans qu'il soit besoin de le repréciser). Vérifié par
`npx tsc --noEmit` et la suite `__verify.test.ts` (toujours verte).

J'ai vérifié les 3 autres appels à `startPlayerTurn` du code (`OdysseusSetup.start()` et les deux dans
`FinishTurnRule`) : ils utilisent tous `this.nextPlayer`, donc changent bien de joueur actif — corrects,
rien à changer.

## Déviation connue (déjà discutée et volontaire)

**rules-fr.pdf p.6** : "Si vous avez choisi un Récit visible, vous le remplacez par **le premier de
l'une des deux pioches**" — sous-entend un choix du joueur entre les deux pioches face cachée.

`ChooseTaleRule.dealTale()` réapprovisionne maintenant automatiquement depuis la première pioche non
vide, sans interaction du joueur. Comme les deux pioches sont mélangées et cachées, laquelle est piochée
n'a aucune incidence sur la partie (sauf épuisement d'une pioche, déjà géré par un repli sur l'autre) —
c'est une simplification volontaire faite plus tôt dans cette session pour supprimer un clic inutile, pas
un oubli. Je le note ici juste pour que ce soit tracé comme une déviation littérale du texte imprimé.

## Non implémenté : le mode solo / l'Automa (p.8)

Rien dans `rules/src` ne modélise l'Automa : pas de `MaterialType` pour les 16 cartes Automa ni les 4
tuiles de difficulté, pas de logique de tour pour l'Automa, pas de sélection de carte "sens de la
flèche", pas de gestion Récit/Épopée pour l'Automa, pas de condition de fin de partie à 1 joueur
(`l'Automa possède 11 cartes Épreuve`). `OdysseusOptions` ne déclare pas non plus de minimum de joueurs.
C'est un mode entier non implémenté, pas un bug dans le code existant — je le signale comme le plus gros
manque connu. Le CLAUDE.md documente déjà que les 16 faces de cartes Automa n'ont même pas été livrées
comme assets source, donc c'était probablement toujours prévu pour plus tard.

## Vérifié correct

Tout ce qui suit a été vérifié ligne à ligne face au PDF et correspond.

**Mise en place (p.2)**
- Pioche Épreuve : `players.length × 12` cartes gardées parmi les 60 mélangées (24/36/48/60) — le livret
  ne donne que les quantités, pas lesquelles cartes, donc un sous-ensemble aléatoire est le bon choix
  (le commentaire de `OdysseusSetup.setupTrialDeck` le dit déjà).
- Rangées du Navire : la paire centrale (x 2-3) de chaque côté distribuée face cachée (4 cartes au total
  sur les deux côtés), les 4 emplacements restants par côté (x 0,1,4,5) distribués face visible (8 au
  total) — correspond à `setupShipRows`/`SHIP_ROW_SLOTS`.
- Jetons Récit : 28 (14 types × 2) répartis en 2 pioches face cachée, 4 révélés depuis l'une d'elles —
  correspond à `setupTaleTiles`.
- Faveur d'Athéna : 40 au total, 1 posée de chaque côté du Navire, le reste en réserve — correspond à
  `setupAthenaFavor`.
- Tuiles Épopée : empilées pour que la **plus grande** valeur soit distribuée en premier — vérifié via le
  tri par défaut de `Material.deck()` (`item => -item.location.x`, donc x décroissant distribué en
  premier) combiné à l'assignation `x: index` croissante de `setupEpicTiles` (id 10 au x le plus haut).
  Correct.
- Par joueur : plateau + 4 cubes à 0, 1 Récit de départ, 1 Faveur de départ — correspond à
  `setupPlayers`.

**Choisir une carte Épreuve (p.4)**
- Seules les deux extrémités de chaque rangée sont jouables (`ChooseTrialCardRule.getPlayerMoves`
  utilise `minBy`/`maxBy` par côté).
- Choisir une carte adjacente à la paire centrale cachée (x 1 ou 4) révèle les deux cartes cachées de
  *ce côté uniquement* et octroie la Faveur qui se trouve entre elles — vérifié que ce n'est atteignable
  que quand la carte choisie est justement l'extrémité courante (adjacence et "extrémité courante"
  coïncident par construction, puisque les cartes ne sont jamais retirées qu'aux extrémités).

**Partir à l'aventure / Se reposer (p.5)**
- Aventure : les gains sont résolus via la file d'attente de `ResolveSkillGainRule` (compétence fixe /
  Choix / Faveur, dans l'ordre imprimé — les gains Faveur se trouvent toujours être imprimés en premier
  sur chaque carte qui en a un, donc l'implémentation "accorder toutes les Faveurs immédiatement, puis
  résoudre la file" ne diverge jamais en pratique de l'ordre imprimé). La carte est ajoutée dans la
  colonne de sa compétence.
- Le maximum de 4 cartes par compétence est respecté en n'offrant le coup "aventure" que si
  `column.length < MAX_CARDS_PER_SKILL` ; "se reposer" est toujours offert, donc une colonne pleine force
  naturellement le repos pour cette carte — correspond à "si vous n'avez pas d'autre choix... vous devez
  vous reposer" sans logique supplémentaire nécessaire.
- Repos : carte posée face cachée (sans les gains), +1 compétence au choix (`PendingGains = ['Choice']`),
  +1 Faveur de la réserve. Correspond.

**Finir son tour (p.5) / Fin de partie (p.7)**
- La redistribution (défausser la dernière carte, distribuer 4 cachées + 8 visibles, +1 Faveur par côté)
  ne se déclenche que quand il ne reste exactement qu'1 carte sur le Navire, et seulement si la pioche
  n'est pas vide ; pioche vide + 1 carte restante termine la partie. Vérifié que la pioche ne peut jamais
  se retrouver avec un reste partiel (1 à 11 cartes) à ce moment précis : elle démarre à un multiple exact
  de 12 et chaque redistribution en consomme exactement 12, donc c'est toujours soit "≥ 12, on
  redistribue proprement" soit "exactement 0, fin de partie" — les appels `dealOne` dans `FinishTurnRule`
  ne peuvent jamais planter par manque de cartes.
- Score : VP de réussite par compétence (`value <= skillScore`), + VP de Récit (inconditionnel,
  correspond à "même si vos cartes Épreuves ne sont pas réussies"), + VP de tuile Épopée. Départage sur le
  score de Récit, puis victoire partagée — correspond au contrat documenté de `CompetitiveScore`
  ("renvoyer undefined pour arrêter").

**Récits (p.6)**
- Remporté en complétant une ligne de 4 (une carte par compétence à la même rangée — `isRowComplete`
  redérive ça dynamiquement depuis la rangée de la carte qui vient d'être posée, ce qui gère correctement
  n'importe quel ordre de remplissage) ou en dépensant 3 Faveurs une fois par tour (voir le bug
  ci-dessus).
- Maximum 6 Récits au total, *en comptant* celui de départ — correspond aux 6 emplacements physiques de
  `PlayerTaleLocator`.
- 14 types (4 compétence / 5 type d'épreuve / 5 valeur de compétence, avec "1-2" fusionné en un seul
  type) × 2 exemplaires, 2 VP par carte correspondante — correspond exactement à `StoryTile.ts`, fusion
  1-2 comprise.

**Épopée (p.7)**
- Nécessite de posséder (pas forcément réussir) une carte de chacun des 5 types d'épreuve, une seule
  pile de 5 tuiles partagée pour toute la partie (valeur décroissante), maximum 1 par joueur —
  correspond à `isEpicEligible`.

**Faveurs d'Athéna (p.7)**
- Dépenser 3 une fois par tour pour un Récit (corrigé, voir ci-dessus). Dépenser 1 pour rediriger un gain
  de compétence *fixe* vers un choix libre — correctement exclu pour les gains `'Choice'`, qui sont déjà
  un choix libre.

## Bug corrigé : gains erronés sur une carte

Un joueur a signalé qu'une carte censée augmenter sa Force de 2 lui a donné 1 Faveur d'Athéna à la
place. Les 60 cartes Épreuve de `TrialCardStats.ts` sont relevées sur l'illustration des cartes (le
fichier le dit lui-même : "aucune donnée n'était livrée à part les images"), donc sujettes à erreur de
saisie — j'ai comparé les 60 images (`app/src/images/cards/trials/`) une par une aux `value`/
`victoryPoints`/`gains` du fichier (valeur et PV en haut à gauche, icônes de gain en bas, type
d'aventure en haut à droite).

**Une seule erreur trouvée** (les 59 autres cartes correspondent exactement à l'image, type d'aventure
compris) : `Trial5Intelligence` (valeur 6, PV 9) affiche 2 icônes Force en bas de carte, mais le code
lui attribuait `gains: ['AthenaFavor']`. Corrigé en `gains: [Skill.Strength, Skill.Strength]`.

## Remarque mineure (non confirmée comme atteignable)

Si un joueur avait un jour ses 4 compétences au maximum (6) simultanément pendant qu'un gain `'Choice'`
est en attente, `ResolveSkillGainRule.getPlayerMoves()` ne renverrait aucun coup, bloquant ce joueur.
Vu le nombre total fixe de cartes du jeu (`11×joueurs + 1` cartes jamais piochées sur toute la partie),
ça semble très improbable à atteindre, et ce n'est jamais arrivé dans les 100 parties aléatoires jouées
jusqu'au bout dans `__verify.test.ts` (25 parties × 4 nombres de joueurs, jusqu'à 20 000 coups chacune).
Signalé uniquement par souci d'exhaustivité.

## Deuxième passe : rien de nouveau côté règles du livret

Repassé sur l'ensemble de `rules/src` en le recomparant à `rules-fr.pdf` (les fichiers modifiés depuis
la première revue sont `ChooseTaleRule.ts`, `ChooseTrialCardRule.ts`, `TrialCardStats.ts` et l'ajout
purement UI de `LocationType.PlayerPanel`) : aucun nouvel écart de règles trouvé, tout ce qui était
"Vérifié correct" plus haut le reste.

## Conformité aux conventions GamePark

Comparé le code aux pages officielles (gamepark.github.io/docs) : `concepts/core-concepts.md`,
`concepts/items-and-locations.md`, `concepts/hiding-data.md`, `features/item-moves.md`,
`features/rule-moves.md`, `features/custom-moves.md`, `features/location-strategies.md`,
`features/piles-of-items.md`, et la checklist de fin de projet
(`step-by-step-example/checklist.md`).

**Conforme :**
- `MaterialType`/`LocationType` démarrent à 1, un fichier de règle par phase de jeu, `getPlayerMoves()`/
  `beforeItemMove()`/`afterItemMove()` utilisés comme documenté.
- Nommage singulier/pluriel des coups (`moveItem`/`moveItems`, `createItem`/`createItems`,
  `deleteItem`/`deleteItems`) et pattern "filtrer d'abord" (`this.material(...).location(...).player(...)`)
  respectés partout.
- `HiddenMaterialRules` est le bon choix (pas de `SecretMaterialRules`) : aucune information n'est
  asymétrique entre joueurs, confirmé par `hidingStrategies` qui ne fait que masquer (`hideItemId`),
  jamais de vue différenciée par joueur.
- `CustomMoveType` en enum, `customMove()`/`onCustomMove()`, boutons de header via `useLegalMove()` +
  `isCustomMoveType()` + `PlayMoveButton` — correspond exactement au pattern documenté dans
  `features/custom-moves.md`.
- `locationsStrategies` organisé par `MaterialType` puis `LocationType` comme documenté ; l'absence de
  stratégie sur `PlayerRestPile` est correcte (l'ordre des cartes défaussées face cachée n'a aucune
  importance, donc pas besoin de `PositiveSequenceStrategy` ni d'aucune autre).
- Assets de checklist présents : favicon, avatar, cover, box, `rules-en.pdf`/`rules-fr.pdf`.

**À corriger** (voir section dédiée plus haut) : `ChooseTaleRule` utilisait `startPlayerTurn` au lieu de
`startRule` pour une transition sans changement de joueur, cassant l'undo — corrigé.

**Écarts avec la checklist de fin de projet, mais déjà connus/volontaires, rien de nouveau :**
- Traductions : seul `fr.json` est rempli, les 5 autres langues sont vides (`{}`) — volontaire et déjà
  documenté dans CLAUDE.md ("during development, only write translations in the developer's native
  language"), à faire avant la sortie.
- "The tutorial is available" : aucun tutoriel implémenté (rien dans `rules/src` ne touche à
  `features/tutorial-ai.md`) — cohérent avec le mode solo/Automa lui-même absent (voir plus haut).
- Un TODO trouvé : `OdysseusSetup.ts:30` — `//this.setupDebugPlayerBoards() // TODO remove after visual
  QA`. C'est un helper de debug déjà désactivé (commenté), pas du code mort actif ; je ne l'ai pas
  supprimé puisqu'il reste utile tant que le visual QA n'est pas formellement terminé, mais la checklist
  ("no TODOs or commented code left") le signale comme à traiter avant la sortie.

**Remarque de style, pas un bug** : `FinishTurnRule` redistribue le Navire avec 12 appels `dealOne()`
séparés (donc 12 coups/animations distincts) plutôt qu'un `dealAtOnce`/`moveItemsAtOnce` consolidé en un
seul coup (`features/item-moves.md` documente ce pattern pour les lots). Comme chaque carte va sur un
slot différent (`side`/`x`/`rotation` propres), regrouper proprement demanderait de passer une fonction
par item plutôt qu'une location fixe — faisable, mais purement cosmétique (l'enchaînement actuel est
correct), donc laissé tel quel sauf si un effet "tout d'un coup" est explicitement voulu.
