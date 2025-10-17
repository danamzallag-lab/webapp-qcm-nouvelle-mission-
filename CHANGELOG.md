# Changelog - Application Entretiens Pharmaceutiques

## Version 1.1.0 - 17 octobre 2025

### ✨ Nouvelles fonctionnalités

#### 🩺 Base de données médicaments AOD
Ajout des anticoagulants oraux directs avec leurs dosages :
- **Eliquis (Apixaban)** : 2,5 mg | 5 mg
- **Xarelto (Rivaroxaban)** : 10 mg | 15 mg | 20 mg
- **Pradaxa (Dabigatran)** : 75 mg | 110 mg | 150 mg

#### 💊 Base de données médicaments AVK
Ajout des anti-vitamines K avec leurs dosages :
- **Coumadine (Warfarine)** : 2 mg | 5 mg
- **Sintrom (Acénocoumarol)** : 4 mg
- **Mini-Sintrom (Acénocoumarol)** : 1 mg
- **Previscan (Fluindione)** : 20 mg

#### 🫁 Base de données corticoïdes inhalés
Ajout de 8 corticoïdes inhalés avec :
- Nom commercial
- DCI (Dénomination Commune Internationale)
- Type de dispositif (MDI, DPI, Turbuhaler, etc.)
- Dosages disponibles en µg/dose

**Liste complète** :
1. **Flixotide** (Fluticasone propionate) - MDI Evohaler : 50, 125, 250 µg
2. **Flixotide Diskus** (Fluticasone propionate) - DPI Diskus : 100, 250, 500 µg
3. **Pulmicort Turbuhaler** (Budésonide) - DPI Turbuhaler : 100, 200, 400 µg
4. **Alvesco** (Ciclésonide) - MDI : 80, 160 µg
5. **Asmanex Twisthaler** (Furoate de mométasone) - DPI Twisthaler : 200, 400 µg
6. **Bécotide** (Béclométasone dipropionate) - MDI : 250 µg
7. **Beclometasone Teva** (Béclométasone dipropionate) - MDI : 50, 250 µg
8. **QVAR Autohaler** (Béclométasone dipropionate) - MDI autodéclenché : 100 µg

### 🔍 Barre de recherche intelligente

#### Pour les corticoïdes inhalés :
- **Recherche en temps réel** : Tapez 2 caractères minimum
- **Recherche multi-critères** : Nom commercial, DCI, ou type de dispositif
- **Affichage détaillé** : Toutes les informations du médicament
- **Sélection visuelle** : Carte colorée avec le médicament choisi
- **Suppression facile** : Bouton × pour retirer la sélection

### 🎯 Sélection dynamique de dosage

#### Pour AOD et AVK :
1. **Sélection du médicament** : Menu déroulant avec tous les médicaments disponibles
2. **Dosage automatique** : Les dosages s'affichent automatiquement selon le médicament choisi
3. **Validation** : Impossible de sélectionner un dosage avant d'avoir choisi un médicament

### 🎨 Améliorations visuelles

- **Design moderne** pour la barre de recherche avec focus bleu
- **Liste déroulante** avec hover bleu clair
- **Carte de sélection** avec gradient violet/bleu
- **Scrollbar personnalisée** pour les résultats
- **Animations fluides** lors de la sélection

---

## Version 1.0.0 - 17 octobre 2025

### 🎉 Version initiale

#### Fonctionnalités principales :
- Formulaire multi-étapes (6 étapes)
- 3 types d'entretiens : AOD, AVK, Asthme
- Questions dynamiques selon le type d'entretien
- Sélection de 2 à 4 thématiques
- Design responsive (mobile/tablette/PC)
- Prêt pour déploiement Vercel

#### Documentation :
- 8 fichiers de documentation complète
- Guide de démarrage rapide
- Instructions de déploiement
- Workflow détaillé

---

## 📊 Statistiques

### Version 1.1.0
- **Fichiers modifiés** : 2 (app.js, styles.css)
- **Lignes ajoutées** : ~350 lignes
- **Nouvelles fonctionnalités** : 3 (AOD, AVK, Corticoïdes)
- **Médicaments ajoutés** : 15 médicaments

### Projet complet
- **Total de commits** : 8
- **Total de fichiers** : 15
- **Taille du projet** : ~320 KB
- **Lignes de code** : ~3800 lignes

---

## 🔧 Modifications techniques

### [app.js](app.js)

#### Ajouts :
```javascript
// Ligne 9-34 : Base de données des médicaments
const medicamentsAOD = { ... }
const medicamentsAVK = { ... }
const corticoidesInhales = [ ... ]

// Ligne 39-62 : Types de questions modifiés
- type: "select_medicament" (sélection de médicament)
- type: "select_dosage" (sélection de dosage dépendant)
- type: "search_corticoide" (recherche avec autocomplete)

// Ligne 248-424 : Fonction renderEvaluationQuestions() étendue
- Gestion des menus déroulants de médicaments
- Gestion de la dépendance dosage/médicament
- Implémentation de la recherche de corticoïdes
- Affichage des résultats en temps réel
- Sélection et suppression de médicaments
```

### [styles.css](styles.css)

#### Ajouts (lignes 367-503) :
```css
.corticoide-search-container    → Conteneur principal
.corticoide-search               → Barre de recherche
.corticoide-results              → Liste des résultats
.corticoide-result-item          → Item de résultat
.corticoide-selection            → Zone de sélection
.selected-corticoide             → Carte du médicament sélectionné
.remove-selection                → Bouton de suppression
::-webkit-scrollbar-*            → Scrollbar personnalisée
```

---

## 🚀 Comment tester les nouvelles fonctionnalités

### Test AOD :
1. Lancez l'application (double-clic sur LANCER.bat)
2. Sélectionnez "Anticoagulant Oral Direct (AOD)"
3. À l'étape 3 :
   - Sélectionnez un médicament (Eliquis, Xarelto ou Pradaxa)
   - Le menu de dosage s'active automatiquement
   - Sélectionnez le dosage correspondant

### Test AVK :
1. Sélectionnez "Anti-vitamine K (AVK)"
2. À l'étape 3 :
   - Sélectionnez un médicament (Coumadine, Sintrom, etc.)
   - Le menu de dosage s'active automatiquement
   - Sélectionnez le dosage

### Test Corticoïdes (Asthme) :
1. Sélectionnez "Asthme"
2. À l'étape 3, cochez "Oui" pour "Avez-vous un traitement de fond ?"
3. La barre de recherche apparaît :
   - Tapez "flixo" → Flixotide et Flixotide Diskus apparaissent
   - Tapez "mdi" → Tous les dispositifs MDI apparaissent
   - Tapez "fluticas" → Médicaments avec fluticasone apparaissent
4. Cliquez sur un résultat pour le sélectionner
5. Une carte colorée s'affiche avec toutes les infos
6. Cliquez sur × pour retirer la sélection

---

## 🎯 Prochaines évolutions possibles

### Version 1.2.0 (suggestions)
- [ ] Ajout de davantage de corticoïdes inhalés
- [ ] Ajout des bronchodilatateurs de longue durée d'action (BDLA)
- [ ] Ajout des associations fixes (CSI + BDLA)
- [ ] Export PDF avec les médicaments sélectionnés
- [ ] Historique des médicaments du patient
- [ ] Interactions médicamenteuses
- [ ] Posologie détaillée selon l'indication

### Version 2.0.0 (long terme)
- [ ] Connexion à une base de données médicaments externe (Vidal, Thériaque)
- [ ] Mise à jour automatique des dosages
- [ ] Photos des dispositifs d'inhalation
- [ ] Vidéos de démonstration d'utilisation
- [ ] Interface pharmacien vs interface patient
- [ ] Multi-langues (anglais, arabe, etc.)

---

## 📞 Support

Pour toute question sur ces nouvelles fonctionnalités :
- Consultez [README.md](README.md)
- Consultez [WORKFLOW.md](WORKFLOW.md)
- Consultez [INDEX.md](INDEX.md)

---

**Développé avec ❤️ pour InnovaPharm Formation**
🤖 Généré avec [Claude Code](https://claude.com/claude-code)
