# Revue du module `app` — `app/src` vs. `app/public/rules-fr.pdf` et `CLAUDE.md`

Relecture du client (`app/src`) : textes des en-têtes, modales d'aide, historique de partie, tailles et
recadrage des images, cohérence avec les conventions documentées dans `CLAUDE.md`. Verdict : la logique
et les textes collent au livret. Trois problèmes ont été trouvés — build cassé, tailles PNG erronées,
icône incohérente — et sont désormais corrigés.

## ~~Build cassé~~ Corrigé : deux erreurs `tsc -b`

`npm run build` (qui exécute `tsc -b && vite build`) échoue actuellement avant même d'atteindre `vite
build`, à cause de deux erreurs TypeScript dans `app/src/locators/` :

**`PlayerTaleLocator.ts:15`** — `xPositions[location.x]` indexe un tableau avec une valeur potentiellement
`undefined` (`Location.x` est typé `x?: number`), ce qui produit `TS2538: Type 'undefined' cannot be used
as an index type`. En pratique, `PositiveSequenceStrategy` assigne toujours un `x` avant qu'un jeton Récit
n'atteigne `PlayerTale`, donc ça ne plante probablement jamais à l'exécution — mais le build échoue quand
même. Tous les autres locators du même dossier déstructurent avec une valeur par défaut (`{ x = 0 }`) ;
`PlayerTaleLocator` devrait faire pareil, par exemple `xPositions[location.x ?? 0]`.

**`TaleDeckLocator.ts:2`** — import inutilisé `ShipSide` (`TS6133`), résidu d'une version antérieure du
fichier (la classe utilise `TaleStack`, pas `ShipSide`). `tsc -b` traite ça comme une erreur bloquante.
Correction triviale : supprimer la ligne d'import.

**Corrigé** : `PlayerTaleLocator.getCoordinates` utilise maintenant `xPositions[location.x ?? 0]`, et
l'import mort `ShipSide` a été retiré de `TaleDeckLocator.ts`. `npx tsc -b --noEmit`, `eslint` et
`npm run build` (jusqu'à `vite build` inclus) passent tous à nouveau proprement.

## ~~Déclarations de taille trop petites~~ Corrigé : 0,30 cm (ou 0,60 cm) manquants sur 4 PNG à ombre portée

`CLAUDE.md` documente explicitement la convention : *« PNGs (transparency) carry a baked drop shadow:
canvas grown by 15 px per side, so the declared `width`/`height` grows by 0.30 cm in each direction »*.
Autrement dit, pour un PNG avec `transparency = true`, la taille déclarée dans la `Description` doit
correspondre au **canevas complet** (image livrée / 100, à la convention 100 px = 1 cm), pas à la taille
« physique » de l'objet une fois l'ombre retirée.

En mesurant les fichiers réellement livrés, quatre `Description` déclarent une taille inférieure de
précisément ce montant :

| Fichier | Déclaré | Image réelle (px → cm) | Écart |
|---|---|---|---|
| `AthenaFavorTokenDescription.ts:6-7` | 1.55 × 2.01 | `tokens/AthenaFavor.png` 185×231px → 1.85 × 2.31 | **-0.30 cm** / axe |
| `StoryTileDescription.ts:30-31` | 4.37 × 2.68 | `tokens/story/Strength.png` 467×298px → 4.67 × 2.98 | **-0.30 cm** / axe |
| `EpicTileDescription.ts:13-14` | 3.39 × 3.93 | `tiles/epic/EpicTile2.png` 369×423px → 3.69 × 4.23 | **-0.30 cm** / axe |
| `StoryBoardDescription.ts:8-9` | 37.72 × 7.42 | `boards/StoryBoard.png` 1916×401px → 38.32 × 8.02 (à 50 px/cm) | **-0.60 cm** / axe |

Le décalage sur `StoryBoard` est le double car ce plateau suit la convention 50 px = 1 cm (donc le même
padding absolu de 15 px/côté vaut 0,30 cm par côté = 0,60 cm au total, contre 0,15 cm/côté = 0,30 cm au
total pour les jetons/tuiles à 100 px = 1 cm).

Deux cas servent de témoin et confirment que ce n'est pas du bruit :
- `ShipBoardDescription` (image JPEG, donc **sans** ombre portée à retirer) déclare 49.02 × 24.52, qui
  correspond exactement à `ShipBoard.jpg` / 50 — zéro écart.
- Les 4 cubes (`SkillCubeDescription`, 1.65 × 1.67) suivent leur propre formule spéciale documentée dans
  `CLAUDE.md` (taille déclarée = canevas complet, sans soustraction) et correspondent eux aussi exactement
  à leurs fichiers PNG (165×167px).

Effet visuel concret : le rendu utilise `background-size: cover` (voir `backgroundCss.js` du framework),
qui recadre l'image pour remplir la boîte déclarée. D'après le calcul précis (ex. pour la Faveur d'Athéna :
facteur d'échelle `cover` ≈ 0.87, recadrage résultant d'environ 3 px de chaque côté sur une image de
185 px de large), le recadrage reste dans la marge de l'ombre portée dans les cas vérifiés — donc
probablement une ombre un peu plus « dure »/rognée plutôt qu'un jeton visiblement coupé.

**Corrigé** : les quatre `Description` déclarent maintenant la taille du canevas complet —
`AthenaFavorTokenDescription` 1.85 × 2.31, `StoryTileDescription` 4.67 × 2.98, `EpicTileDescription`
3.69 × 4.23, `StoryBoardDescription` 38.32 × 8.02. Le plateau Récit ayant grandi, les offsets des locators
qui en dépendent (`PlayerTaleLocator` et les autres locators d'objets posés sur le plateau personnel) ont
été retouchés à l'œil pour rester alignés sur le nouveau rendu — vérifié manuellement dans le navigateur.

## ~~Icône de la Faveur d'Athéna incohérente~~ Corrigé dans le panneau joueur

**`app/src/panels/PlayerPanelContent.tsx:35`** — le compteur de Faveurs d'Athéna du panneau joueur utilise
`tokens/AthenaFavor.png` (185×231px, l'illustration réaliste du jeton physique) alors que les 3 compteurs
de compétence juste à côté utilisent les icônes du dossier `icons/` (256×256px, capées et recadrées pour
l'UI selon `CLAUDE.md`).

Le composant `Counters` du framework (`react-game`) affiche chaque icône de compteur dans une boîte fixe
de `1em × 1em` avec `background-size: contain`, donc le ratio d'aspect de l'image détermine directement
quelle proportion de la boîte elle remplit. Les icônes de compétence, carrées, remplissent toute la boîte ;
`tokens/AthenaFavor.png` (ratio 0.80) en remplit visiblement moins, ce qui donne une icône plus petite/fine
que ses voisines dans la même ligne de compteurs. `CLAUDE.md` indique explicitement que le dossier
`icons/` contient les « UI assets, not physical material » — `icons/AthenaFavor.png` (201×256px, ratio
plus proche des icônes de compétence) est le candidat naturel, et c'est déjà ce que fait
`OdysseusScoringDescription.tsx` pour sa propre ligne d'icônes du bloc de score.

**Corrigé** : `PlayerPanelContent.tsx` importe désormais `icons/AthenaFavor.png` au lieu de
`tokens/AthenaFavor.png`.

## Vérifié correct

- **Textes des en-têtes et des modales d'aide** (`headers/*`, `material/help/*`) : recoupés avec
  `rules-fr.pdf` — terminologie et mécaniques toujours fidèles (choix d'une carte Épreuve, aventure/repos,
  Récits, Épopée, Faveurs d'Athéna, fin de partie).
- **Historique de partie** (`logs/*`) : les lignes loggées correspondent aux actions et conséquences
  réelles des règles ; la nidification (flèche `↳`, `depth: 1`) reflète maintenant correctement les
  conséquences d'un même choix de carte.
- **Couverture des traductions** : toutes les clés `i18nKey`/`t()` utilisées dans `app/src` (y compris les
  clés dynamiques `skill.*`/`adventureType.*`) existent dans `fr.json` ; aucune clé manquante. `en.json`
  reste vide, conformément à la consigne de `CLAUDE.md` (ne traduire que dans la langue du développeur en
  cours de développement).
- **`TrialCardDescription`** (cartes Épreuve, JPEG sans ombre) et les 4 **cubes de compétence** : taille
  déclarée strictement identique à celle du fichier image — aucun écart.

## Remarque annexe (non un bug)

Les 5 cartes aide de jeu (`cards/PlayerAidFront.jpg` / `PlayerAidBack.jpg`, listées p.2 du livret comme
matériel physique) sont livrées comme assets mais ne sont modélisées dans aucun `MaterialType` ni affichées
nulle part dans `app` — probablement remplacées volontairement par les modales d'aide numériques. Signalé
pour information, comme la non-implémentation de l'Automa déjà documentée dans `RULES.md` pour
`rules/src`.
