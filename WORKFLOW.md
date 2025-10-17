# 🔄 Workflow de l'Application - Entretiens Pharmaceutiques

Ce document décrit le parcours complet de l'utilisateur à travers les 6 étapes du formulaire.

---

## 📊 Vue d'ensemble du processus

```
┌─────────────────────────────────────────────────────────────────┐
│                    FORMULAIRE EN 6 ÉTAPES                       │
└─────────────────────────────────────────────────────────────────┘

[Étape 1] → [Étape 2] → [Étape 3] → [Étape 4] → [Étape 5] → [Étape 6] → [✓ Confirmation]
   ↓           ↓           ↓           ↓           ↓           ↓
Patient      Adhésion   Évaluation  Thématiques Questions   Synthèse
+ Type                                (2-4)     Dynamiques
```

---

## 📝 ÉTAPE 1 : Informations du patient + Type d'entretien

### Champs obligatoires :
- ✅ **Nom et Prénom** du patient
- ✅ **Date de naissance**
- ✅ **Type d'entretien** (choix unique)

### Champs optionnels :
- N° Sécurité Sociale
- Adresse complète (ligne 1, ligne 2)
- Code postal
- Ville
- Téléphone
- Email

### Types d'entretien disponibles :
1. **AOD** - Anticoagulant Oral Direct
2. **AVK** - Anti-vitamine K
3. **Asthme**

### Validation :
- Le bouton "Suivant" ne s'active que si :
  - Nom ET Date de naissance renseignés
  - Un type d'entretien sélectionné

### Navigation :
- **Suivant** → Étape 2

---

## 🤝 ÉTAPE 2 : Adhésion au programme

### Champs obligatoires :
- ✅ **Avez-vous déjà participé à un entretien pharmaceutique ?** (Oui/Non)
- ✅ **Acceptez-vous de participer au programme ?** (Oui/Non)
- ✅ **Date de l'entretien**

### Champs optionnels :
- Objectifs personnels (texte libre)
- Nom de la pharmacie
- Adresse de la pharmacie (2 lignes)
- Pharmacien référent

### Validation :
- Les 3 champs obligatoires doivent être remplis

### Navigation :
- **Précédent** → Étape 1
- **Suivant** → Étape 3

---

## 📋 ÉTAPE 3 : Questionnaire d'évaluation

Les questions **changent selon le type d'entretien** sélectionné à l'étape 1.

### Questions pour AOD (Anticoagulants Oraux Directs) :

1. Quel anticoagulant oral direct prenez-vous ?
2. Connaissez-vous la dose que vous prenez ? (Oui/Non)
   - Si Oui → **3. Quelle dose ?** (apparaît dynamiquement)
4. Pour quelle raison prenez-vous ce traitement ?
5. Depuis combien de temps prenez-vous ce traitement ?
6. Connaissez-vous les effets indésirables possibles ? (Oui/Non)

### Questions pour AVK (Anti-vitamine K) :

1. Quel anti-vitamine K prenez-vous ?
2. Quel est votre INR cible ?
3. Quelle était votre dernière valeur d'INR ?
4. Date du dernier contrôle INR
5. Avez-vous un carnet de suivi INR ? (Oui/Non)
6. À quelle fréquence faites-vous contrôler votre INR ?

### Questions pour Asthme :

1. Quel type d'asthme avez-vous ?
2. Depuis combien de temps êtes-vous asthmatique ?
3. Avez-vous un traitement de fond ? (Oui/Non)
   - Si Oui → **4. Quel(s) traitement(s) de fond ?** (apparaît dynamiquement)
5. Avez-vous un traitement de crise ? (Oui/Non)
   - Si Oui → **6. Lequel ?** (apparaît dynamiquement)
7. Fréquence des crises d'asthme

### Fonctionnalité clé :
- 🔍 **Affichage conditionnel** : Les questions "Si oui..." n'apparaissent que si la réponse précédente est "Oui"

### Navigation :
- **Précédent** → Étape 2
- **Suivant** → Étape 4

---

## 🎯 ÉTAPE 4 : Sélection des thématiques

### Règle importante :
**⚠️ Vous DEVEZ sélectionner entre 2 et 4 thématiques**

### Thématiques disponibles pour AOD et AVK :

- ☐ Observance
- ☐ Surveillance biologique
- ☐ Effets du traitement
- ☐ Vie quotidienne

### Thématiques disponibles pour Asthme :

- ☐ Effets du traitement
- ☐ Principe du traitement
- ☐ Facteurs déclenchants

### Comportement du formulaire :

| Nombre de cases cochées | État du bouton "Suivant" | Cases restantes |
|-------------------------|--------------------------|-----------------|
| 0-1 thématique | ❌ Désactivé | Toutes disponibles |
| 2-3 thématiques | ✅ Activé | Toutes disponibles |
| 4 thématiques | ✅ Activé | ❌ Désactivées (max atteint) |

### Navigation :
- **Précédent** → Étape 3
- **Suivant** → Étape 5 (actif uniquement si ≥ 2 thématiques)

---

## 💬 ÉTAPE 5 : Questions par thématique

Les questions affichées **dépendent des thématiques sélectionnées** à l'étape 4.

### Questions par thématique :

#### 📌 Observance
1. Prenez-vous régulièrement votre traitement tel que prescrit ? (Oui/Non)
2. Quelles difficultés rencontrez-vous pour suivre votre traitement ?

#### 📌 Surveillance biologique
1. À quelle fréquence effectuez-vous des analyses de sang de suivi ?
2. Interprétez-vous ou suivez-vous les résultats de vos analyses (ex : INR) ? (Oui/Non)

#### 📌 Effets du traitement
1. Avez-vous constaté des effets indésirables depuis le début du traitement ? (Oui/Non)
   - Si Oui → **2. Lesquels ?** (apparaît dynamiquement)

#### 📌 Vie quotidienne
1. Votre traitement impacte-t-il votre vie quotidienne (alimentation, activités, etc.) ? (Oui/Non)
   - Si Oui → **2. De quelle manière ?** (apparaît dynamiquement)

#### 📌 Principe du traitement
1. Comprenez-vous comment fonctionne votre traitement de fond ? (Oui/Non)
2. Expliquez ce que vous avez compris du rôle de votre traitement

#### 📌 Facteurs déclenchants
1. Connaissez-vous les facteurs déclenchants de vos crises d'asthme ? (Oui/Non)
   - Si Oui → **2. Quels facteurs avez-vous identifiés ?** (apparaît dynamiquement)

### Exemple de parcours :

Si vous avez sélectionné **"Observance"** + **"Effets du traitement"** :
```
┌─────────────────────────────────────────┐
│ Observance                              │
│ - Question 1                            │
│ - Question 2                            │
├─────────────────────────────────────────┤
│ Effets du traitement                    │
│ - Question 1                            │
│ - Question 2 (si "Oui" à question 1)    │
└─────────────────────────────────────────┘
```

### Navigation :
- **Précédent** → Étape 4
- **Suivant** → Étape 6

---

## 📄 ÉTAPE 6 : Synthèse de l'entretien

### Champs de synthèse :

- **Mode de contact** (ex: Téléphone, Visio, Présentiel)
- **Présence d'un accompagnant** (Oui/Non)
- **Orientation du patient nécessaire ?** (Oui/Non)
- **Synthèse de l'entretien et durée** (texte libre)
- **Appréciation sur le niveau de connaissance du patient** (texte libre)
- **Remarques et observations complémentaires** (texte libre)

### Navigation :
- **Précédent** → Étape 5
- **Soumettre l'entretien** → Page de confirmation

---

## ✅ CONFIRMATION : Entretien soumis

### Ce qui se passe à la soumission :

1. **Collecte des données** :
   ```javascript
   {
     patient: { nom, date_naissance, email, ... },
     type: "aod" | "avk" | "asthme",
     adhesion: { ... },
     evaluation: { ... },
     thematiques: ["theme1", "theme2", ...],
     questionsThematiques: { ... },
     synthese: { ... },
     timestamp: "2025-10-17T10:30:00.000Z"
   }
   ```

2. **Envoi vers le backend** (si configuré) :
   - Google Sheets
   - n8n webhook
   - Autre API

3. **Affichage de la confirmation** :
   ```
   ✓ Entretien soumis avec succès !
   Les données ont été enregistrées correctement.

   [Bouton : Nouvel entretien]
   ```

### Navigation :
- **Nouvel entretien** → Retour à l'étape 1 (formulaire réinitialisé)

---

## 🎨 Design et expérience utilisateur

### Palette de couleurs :

| Couleur | Usage |
|---------|-------|
| 🟣 Violet/Bleu (gradient) | Arrière-plan principal |
| 🔵 Bleu (#3498db) | Boutons primaires, titres |
| ⚪ Blanc | Conteneur du formulaire |
| 🟢 Vert (#27ae60) | Bouton de soumission, succès |
| ⚫ Gris foncé (#2c3e50) | Texte principal |

### Animations :

- ✨ **Transition entre étapes** : Slide-in (glissement)
- ✨ **Survol des boutons** : Élévation (lift effect)
- ✨ **Focus des champs** : Bordure bleue + ombre
- ✨ **Confirmation** : Bounce-in (rebond)

### Responsive :

| Appareil | Largeur | Adaptations |
|----------|---------|-------------|
| 💻 Desktop | > 768px | Layout complet, 2 colonnes |
| 📱 Mobile | < 768px | Layout empilé, boutons pleine largeur |
| 📲 Tablette | 768-1024px | Layout mixte |

---

## 🔄 Flux de données

```
┌────────────────────────────────────────────────────────────────┐
│                     FLUX DE TRAITEMENT                         │
└────────────────────────────────────────────────────────────────┘

1. Utilisateur remplit le formulaire
   ↓
2. Validation à chaque étape
   ↓
3. Questions dynamiques selon les réponses
   ↓
4. Collecte finale (étape 6)
   ↓
5. Soumission → app.js (fonction collectFormData)
   ↓
6. Formatage JSON
   ↓
7. Envoi vers webhook (si configuré)
   ↓
   ├─→ Google Sheets → Nouvelle ligne
   ├─→ n8n → Workflow d'automatisation
   └─→ Autre API → Traitement personnalisé
   ↓
8. Confirmation à l'utilisateur
```

---

## 📊 Données collectées (structure JSON)

```json
{
  "patient": {
    "nomPrenom": "Dupont Jean",
    "dateNaissance": "1975-05-15",
    "numSecu": "1234567890123",
    "adresse1": "10 rue de la Pharmacie",
    "adresse2": "Appartement 5",
    "codePostal": "75001",
    "ville": "Paris",
    "telephone": "0612345678",
    "email": "jean.dupont@email.com"
  },
  "type": "aod",
  "adhesion": {
    "dejaParticipe": "Non",
    "accepteParticipation": "Oui",
    "objectifs": "Mieux comprendre mon traitement",
    "nomPharmacie": "Pharmacie Centrale",
    "adressePharmacie1": "5 avenue Principale",
    "adressePharmacie2": "",
    "dateEntretien": "2025-10-17",
    "pharmacienReferent": "Dr. Martin"
  },
  "evaluation": {
    "medicament": "Xarelto",
    "connaitDose": "Oui",
    "dose": "20mg",
    "indication": "Fibrillation auriculaire",
    "duree": "2 ans",
    "effetsConnus": "Oui"
  },
  "thematiques": ["observance", "effets_traitement"],
  "questionsThematiques": {
    "[Observance] Prenez-vous régulièrement...": "Oui",
    "[Observance] Quelles difficultés...": "Parfois j'oublie",
    "[Effets du traitement] Avez-vous constaté...": "Oui",
    "[Effets du traitement] Si oui, lesquels ?": "Fatigue légère"
  },
  "synthese": {
    "modeContact": "Téléphone",
    "presenceAccompagnant": "Non",
    "orientationNecessaire": "Non",
    "syntheseEntretien": "Entretien de 30 minutes...",
    "appreciationNiveau": "Bonne compréhension du traitement",
    "remarques": "Patient motivé et impliqué"
  },
  "timestamp": "2025-10-17T10:30:00.000Z"
}
```

---

## 🔒 Bonnes pratiques de sécurité

### Données sensibles :
- ⚠️ Les données patients sont **confidentielles** (RGPD)
- ⚠️ Utilisez toujours **HTTPS** (automatique avec Vercel)
- ⚠️ Ne partagez jamais les URL de webhook publiquement

### Recommandations :
1. ✅ Configurez un consentement patient
2. ✅ Chiffrez les données en transit (HTTPS)
3. ✅ Limitez l'accès aux données (authentification)
4. ✅ Conservez les données selon les règles RGPD

---

## 🎯 Cas d'usage

### Scénario 1 : Entretien AOD
```
Patient → Sélectionne "AOD" → Questions spécifiques AOD
       → Choisit 3 thématiques : Observance + Surveillance + Effets
       → Répond aux questions
       → Pharmacien rédige synthèse
       → Données enregistrées dans Google Sheets
```

### Scénario 2 : Entretien Asthme
```
Patient → Sélectionne "Asthme" → Questions spécifiques Asthme
       → Choisit 2 thématiques : Principe traitement + Facteurs déclenchants
       → Répond aux questions
       → Pharmacien rédige synthèse
       → Données envoyées vers n8n pour automatisation
```

---

## 📈 Évolutions possibles

### Futures améliorations :
- [ ] Ajout d'un système d'authentification pharmacien
- [ ] Signature électronique du patient
- [ ] Export PDF de l'entretien
- [ ] Dashboard de statistiques
- [ ] Rappels automatiques (n8n)
- [ ] Multi-langues (FR/EN)
- [ ] Mode hors ligne avec synchronisation

---

## 🔄 Cycle de vie complet

```
[Ouverture app]
     ↓
[Étape 1] → Patient + Type
     ↓
[Étape 2] → Adhésion
     ↓
[Étape 3] → Évaluation (questions dynamiques selon type)
     ↓
[Étape 4] → Sélection 2-4 thématiques
     ↓
[Étape 5] → Questions thématiques (affichage selon sélection)
     ↓
[Étape 6] → Synthèse
     ↓
[Soumission] → Collecte + Formatage + Envoi
     ↓
[Confirmation] → Succès
     ↓
[Nouvel entretien] → Retour à l'étape 1
```

---

## 📝 Notes importantes

### Validation :
- Champs obligatoires : ⚠️ Le bouton "Suivant" est désactivé tant que non remplis
- Étape 4 : ⚠️ Minimum 2 thématiques requises

### Questions dynamiques :
- 🔍 Apparaissent automatiquement selon les réponses "Oui"
- 🔍 Se masquent si la réponse devient "Non"
- 🔍 Le champ se vide automatiquement si la question disparaît

### Performance :
- ⚡ Application légère (~70 KB total)
- ⚡ Pas de dépendances externes
- ⚡ Chargement instantané
- ⚡ Fonctionne hors ligne (version locale)

---

**Ce workflow assure une collecte structurée et complète des entretiens pharmaceutiques.**

🤖 Généré avec Claude Code
