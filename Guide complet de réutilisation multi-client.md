## 📚 **GUIDE COMPLET DE RÉUTILISATION - Entretiens Pharmaceutiques Multi-Clients**

---

# 🎯 **TABLE DES MATIÈRES**

1. [Vue d'ensemble de l'architecture](#architecture)
2. [Prérequis et outils nécessaires](#prérequis)
3. [Configuration initiale (à faire une seule fois)](#config-initiale)
4. [Processus d'ajout d'un nouveau client (10 minutes)](#nouveau-client)
5. [Guide de déploiement](#déploiement)
6. [Maintenance et suivi](#maintenance)
7. [Dépannage](#dépannage)
8. [Checklist complète](#checklist)

---

<a name="architecture"></a>
# 🏗️ **1. VUE D'ENSEMBLE DE L'ARCHITECTURE**

## **Principe :**
- ✅ **1 seul code source** (GitHub)
- ✅ **1 application web** (Vercel)
- ✅ **Plusieurs clients** avec URLs personnalisées
- ✅ **1 Google Sheet par client** (isolation totale des données)

## **Schéma :**

```
┌─────────────────────────────────────────────────────────────┐
│          CODE SOURCE UNIQUE (GitHub)                        │
│  github.com/vous/entretiens-pharmaceutiques                 │
│                                                             │
│  📄 index.html     → Interface du formulaire                │
│  🎨 styles.css     → Design moderne violet/bleu            │
│  ⚙️ app.js         → Logique + Configuration multi-clients │
│  📋 vercel.json    → Configuration Vercel                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
              ┌─────────────┴─────────────┐
              │   DÉPLOIEMENT VERCEL      │
              │   (Application unique)     │
              └─────────────┬─────────────┘
                            ↓
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ CLIENT A     │    │ CLIENT B     │    │ CLIENT C     │
│ ?client=     │    │ ?client=     │    │ ?client=     │
│ ouazanan     │    │ martin       │    │ dupont       │
└──────────────┘    └──────────────┘    └──────────────┘
        ↓                   ↓                   ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Webhook A    │    │ Webhook B    │    │ Webhook C    │
│ AKfycbxTL4.. │    │ AKfycbyXYZ.. │    │ AKfycbzABC.. │
└──────────────┘    └──────────────┘    └──────────────┘
        ↓                   ↓                   ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Google Sheet │    │ Google Sheet │    │ Google Sheet │
│ Ouazanan     │    │ Martin       │    │ Dupont       │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

<a name="prérequis"></a>
# 🛠️ **2. PRÉREQUIS ET OUTILS NÉCESSAIRES**

## **Comptes à créer (gratuits) :**

| Service | Usage | URL d'inscription |
|---------|-------|-------------------|
| **GitHub** | Hébergement du code source | https://github.com/signup |
| **Vercel** | Déploiement de l'application web | https://vercel.com/signup |
| **Google Account** | Google Sheets + Apps Script | https://accounts.google.com/signup |

## **Logiciels à installer :**

| Logiciel | Usage | Téléchargement |
|----------|-------|----------------|
| **Git** | Gestion de version | https://git-scm.com/downloads |
| **VS Code** | Éditeur de code | https://code.visualstudio.com/ |
| **Node.js** (optionnel) | Pour tester localement | https://nodejs.org/ |

## **Connaissances requises :**

- 🟢 **Débutant** : Utilisation d'un navigateur web
- 🟡 **Intermédiaire** : Copier-coller du code, utilisation de Git
- 🔴 **Avancé** : Modification du code JavaScript (optionnel)

---

<a name="config-initiale"></a>
# ⚙️ **3. CONFIGURATION INITIALE (À FAIRE UNE SEULE FOIS)**

## **📂 Étape 1 : Cloner ou créer le projet**

### **Option A : Vous avez déjà le code**

```bash
# Vérifier que vous êtes dans le bon dossier
cd Desktop/entretiens-pharmaceutiques-app

# Vérifier que Git est configuré
git status
```

### **Option B : Nouveau démarrage**

```bash
# Cloner depuis GitHub
git clone https://github.com/danamzallag-lab/webapp-qcm-nouvelle-mission-.git
cd webapp-qcm-nouvelle-mission-

# Ou créer un nouveau dépôt
mkdir entretiens-pharmaceutiques
cd entretiens-pharmaceutiques
git init
```

---

## **📝 Étape 2 : Créer le Google Sheet TEMPLATE**

### **A. Créer la structure du template**

1. Allez sur **https://sheets.google.com**
2. Cliquez sur **"+ Vide"** (nouveau document)
3. Nommez-le : **`[TEMPLATE] Entretiens Pharmaceutiques`**

### **B. Créer les en-têtes (Ligne 1)**

Copiez-collez ces colonnes dans la ligne 1 (A1 à Q1) :

| A1 | B1 | C1 | D1 | E1 | F1 | G1 | H1 | I1 | J1 | K1 | L1 | M1 | N1 | O1 | P1 | Q1 |
|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
| Date/Heure | Type d'entretien | Nom Patient | Date de naissance | N° Sécu | Email | Téléphone | Adresse | Code Postal | Ville | Pharmacie | Pharmacien Référent | Objectifs | Thématiques | Synthèse | Appréciation | Données JSON |

### **C. Formater le template (optionnel)**

1. **Sélectionnez la ligne 1** (cliquez sur le numéro "1")
2. **Gras** : Ctrl+B
3. **Centrer** : Icône de centrage
4. **Couleur de fond** : Bleu clair (#4A86E8)
5. **Figer la ligne** : Affichage → Figer → 1 ligne

### **D. Créer le script Apps Script TEMPLATE**

1. Dans le Google Sheet template, cliquez sur **"Extensions"** → **"Apps Script"**
2. **Supprimez tout le code par défaut**
3. **Copiez-collez ce script :**

```javascript
/**
 * 🔧 SCRIPT TEMPLATE - Webhook Entretiens Pharmaceutiques
 * Version : 2.0
 * Date : Octobre 2025
 *
 * ⚠️ IMPORTANT : Ce script est un TEMPLATE
 * À dupliquer et personnaliser pour chaque client
 */

// ========== 🎯 CONFIGURATION CLIENT (À MODIFIER) ==========
const CLIENT_NAME = "NOM_DU_CLIENT";  // Ex: "Pharmacie Ouazanan"
const CLIENT_ID = "CODE_XXX";         // Ex: "OUAZ_001"

// ========== 📥 FONCTION PRINCIPALE ==========
function doPost(e) {
  try {
    console.log('📥 Réception de données pour : ' + CLIENT_NAME);

    // Vérification des données POST
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Données POST manquantes ou invalides');
    }

    // Récupérer la feuille active
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parser les données JSON
    const data = JSON.parse(e.postData.contents);
    console.log('✅ Données parsées avec succès');

    // Extraire les sections de données
    const patient = data.patient || {};
    const adhesion = data.adhesion || {};
    const synthese = data.synthese || {};

    // ========== PRÉPARER LES DONNÉES ==========

    // Colonne A : Date/Heure
    const timestamp = new Date();

    // Colonne B : Type d'entretien
    const typeEntretien = (data.type || '').toUpperCase();

    // Colonne C : Nom Patient
    const nomPatient = patient.nomPrenom || "";

    // Colonne D : Date de naissance
    const dateNaissance = patient.dateNaissance || "";

    // Colonne E : N° Sécu
    const numSecu = patient.numSecu || "";

    // Colonne F : Email
    const email = patient.email || "";

    // Colonne G : Téléphone
    const telephone = patient.telephone || "";

    // Colonne H : Adresse (combine adresse1 et adresse2)
    const adresseComplete = [
      patient.adresse1 || "",
      patient.adresse2 || ""
    ].filter(Boolean).join(", ");

    // Colonne I : Code Postal
    const codePostal = patient.codePostal || "";

    // Colonne J : Ville
    const ville = patient.ville || "";

    // Colonne K : Pharmacie
    const pharmacie = adhesion.nomPharmacie || "";

    // Colonne L : Pharmacien Référent
    const pharmacienReferent = adhesion.pharmacienReferent || "";

    // Colonne M : Objectifs
    const objectifs = adhesion.objectifs || "";

    // Colonne N : Thématiques (convertir array en texte)
    const thematiques = (data.thematiques || []).join(", ");

    // Colonne O : Synthèse
    const syntheseEntretien = synthese.syntheseEntretien || "";

    // Colonne P : Appréciation
    const appreciation = synthese.appreciationNiveau || "";

    // Colonne Q : Données JSON complètes (backup)
    const jsonComplet = JSON.stringify(data, null, 2);

    // ========== INSÉRER LA LIGNE DANS LE SHEET ==========
    sheet.appendRow([
      timestamp,              // A
      typeEntretien,          // B
      nomPatient,             // C
      dateNaissance,          // D
      numSecu,                // E
      email,                  // F
      telephone,              // G
      adresseComplete,        // H
      codePostal,             // I
      ville,                  // J
      pharmacie,              // K
      pharmacienReferent,     // L
      objectifs,              // M
      thematiques,            // N
      syntheseEntretien,      // O
      appreciation,           // P
      jsonComplet             // Q
    ]);

    const newRow = sheet.getLastRow();
    console.log('✅ Données ajoutées à la ligne ' + newRow + ' pour ' + CLIENT_NAME);

    // ========== RÉPONSE DE SUCCÈS ==========
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: "✅ Entretien enregistré avec succès",
        client: CLIENT_NAME,
        clientId: CLIENT_ID,
        patient: nomPatient,
        type: typeEntretien,
        timestamp: timestamp.toISOString(),
        row: newRow
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // ========== GESTION DES ERREURS ==========
    console.error('❌ ERREUR : ' + error.toString());
    console.error('Stack trace : ' + error.stack);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        message: "❌ Erreur lors de l'enregistrement",
        client: CLIENT_NAME,
        clientId: CLIENT_ID
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ========== 🧪 FONCTION DE TEST ==========
function testInsertion() {
  console.log('🧪 Test d\'insertion pour ' + CLIENT_NAME);

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Données de test
    sheet.appendRow([
      new Date(),                                    // Date/Heure
      "AOD",                                         // Type
      "Test Patient " + CLIENT_NAME,                // Nom
      "1980-05-15",                                 // Date naissance
      "180056789012345",                            // N° Sécu
      "test@" + CLIENT_ID + ".com",                // Email
      "0612345678",                                 // Téléphone
      "10 rue de Test, Appt 5",                    // Adresse
      "75001",                                      // Code postal
      "Paris",                                      // Ville
      CLIENT_NAME,                                  // Pharmacie
      "Dr. Test",                                   // Pharmacien
      "Test de connexion",                          // Objectifs
      "observance, effets_traitement",              // Thématiques
      "Entretien de test réussi pour " + CLIENT_NAME, // Synthèse
      "Bonne compréhension",                        // Appréciation
      JSON.stringify({                              // JSON
        test: true,
        client: CLIENT_NAME,
        clientId: CLIENT_ID,
        timestamp: new Date().toISOString()
      }, null, 2)
    ]);

    const newRow = sheet.getLastRow();
    console.log('✅ Test réussi ! Ligne ajoutée : ' + newRow);
    console.log('📊 Vérifiez le Google Sheet');

    return true;
  } catch (error) {
    console.error('❌ Erreur lors du test : ' + error.toString());
    return false;
  }
}

// ========== 📋 INFORMATIONS DU TEMPLATE ==========
function infosTemplate() {
  console.log('═══════════════════════════════════════');
  console.log('📋 INFORMATIONS DU TEMPLATE');
  console.log('═══════════════════════════════════════');
  console.log('Client : ' + CLIENT_NAME);
  console.log('ID Client : ' + CLIENT_ID);
  console.log('');
  console.log('⚠️ AVANT DÉPLOIEMENT :');
  console.log('1. Modifier CLIENT_NAME');
  console.log('2. Modifier CLIENT_ID');
  console.log('3. Tester avec testInsertion()');
  console.log('4. Déployer comme Application Web');
  console.log('═══════════════════════════════════════');
}
```

4. **Sauvegardez** (Ctrl+S)
5. Nommez le projet : **"[TEMPLATE] Webhook Entretiens Pharmaceutiques"**

### **E. NE PAS déployer le template**

⚠️ **IMPORTANT** : Le template ne doit JAMAIS être déployé en production. Il sert uniquement de base pour créer les scripts clients.

---

## **💻 Étape 3 : Configurer le code source pour le multi-clients**

### **A. Modifier `app.js`**

Ouvrez `app.js` et remplacez les **lignes 8-12** par ce code :

```javascript
/**
 * ========== CONFIGURATION MULTI-CLIENTS ==========
 * Chaque client a son propre webhook Google Apps Script
 * L'URL du client est déterminée par le paramètre ?client=XXX
 */

// Table de correspondance : ID client → URL webhook
const CLIENT_WEBHOOKS = {
  // ⚠️ REMPLACER LES URLs CI-DESSOUS PAR VOS VRAIES URLs DE WEBHOOK

  "ouazanan": "https://script.google.com/macros/s/AKfycbxTL4ulOdQ1JOopLHvXA-p7JwV5a_vLkzhHwBXVfBzQAQ2V6iwvDx0rWGXJBtzUKcONhw/exec",

  // Ajouter vos autres clients ici :
  // "martin": "https://script.google.com/macros/s/VOTRE_URL_CLIENT_2/exec",
  // "dupont": "https://script.google.com/macros/s/VOTRE_URL_CLIENT_3/exec",

  // Webhook par défaut (utilisé si aucun client spécifié)
  "default": "https://script.google.com/macros/s/AKfycbxTL4ulOdQ1JOopLHvXA-p7JwV5a_vLkzhHwBXVfBzQAQ2V6iwvDx0rWGXJBtzUKcONhw/exec"
};

// Récupérer le paramètre "client" depuis l'URL (?client=ouazanan)
const urlParams = new URLSearchParams(window.location.search);
const clientId = urlParams.get('client') || 'default';

// Sélectionner le webhook correspondant au client
const WEBHOOK_URL = CLIENT_WEBHOOKS[clientId] || CLIENT_WEBHOOKS['default'];

// Logs pour le debug (visible dans la console du navigateur)
console.log('🏥 Client actif :', clientId);
console.log('🔗 Webhook configuré :', WEBHOOK_URL ? '✅ Oui' : '❌ Non');

// Afficher un avertissement si le client n'est pas configuré
if (!CLIENT_WEBHOOKS[clientId] && clientId !== 'default') {
  console.warn('⚠️ ATTENTION : Client "' + clientId + '" non configuré ! Utilisation du webhook par défaut.');
}
```

### **B. Vérifier que l'envoi est activé**

Trouvez les **lignes 427-428** et assurez-vous que l'envoi est **décommenté** :

```javascript
// ✅ BON (décommenté)
await sendToWebhook(data);

// ❌ MAUVAIS (commenté)
// await sendToWebhook(data);
```

### **C. Commit et push**

```bash
git add app.js
git commit -m "Add multi-client support with query parameters"
git push origin main
```

---

## **🚀 Étape 4 : Déployer sur Vercel (une seule fois)**

1. Allez sur **https://vercel.com**
2. Cliquez sur **"Add New..."** → **"Project"**
3. **Import** votre dépôt GitHub
4. **Nommez le projet** : `entretiens-pharmaceutiques`
5. Cliquez sur **"Deploy"**
6. Attendez 1-2 minutes
7. **Copiez l'URL Vercel** (ex: `https://entretiens-pharmaceutiques.vercel.app`)

---

<a name="nouveau-client"></a>
# 👥 **4. PROCESSUS D'AJOUT D'UN NOUVEAU CLIENT (10 MINUTES)**

## **📋 Checklist complète pour ajouter un client**

```
□ Étape 1 : Dupliquer le Google Sheet template (1 min)
□ Étape 2 : Personnaliser le script Apps Script (2 min)
□ Étape 3 : Tester le script (1 min)
□ Étape 4 : Déployer le webhook (2 min)
□ Étape 5 : Ajouter le client dans app.js (2 min)
□ Étape 6 : Tester le flux complet (2 min)
□ Étape 7 : Livrer au client (1 min)
```

---

## **📝 Étape 1 : Dupliquer le Google Sheet template**

1. Ouvrez votre Google Sheet **`[TEMPLATE] Entretiens Pharmaceutiques`**
2. Cliquez sur **"Fichier"** → **"Créer une copie"**
3. Nommez la copie : **`Entretiens Pharmaceutiques - [Nom Client]`**
   - Exemple : `Entretiens Pharmaceutiques - Pharmacie Martin`
4. Cliquez sur **"Créer une copie"**
5. Le nouveau Google Sheet s'ouvre automatiquement
6. **Supprimez toutes les lignes de test** (gardez uniquement la ligne 1 avec les en-têtes)

---

## **📝 Étape 2 : Personnaliser le script Apps Script**

1. Dans le nouveau Google Sheet, cliquez sur **"Extensions"** → **"Apps Script"**
2. Un script est déjà là (copié depuis le template)
3. **Modifiez UNIQUEMENT ces 2 lignes** (lignes 10-11) :

```javascript
// AVANT (template)
const CLIENT_NAME = "NOM_DU_CLIENT";
const CLIENT_ID = "CODE_XXX";

// APRÈS (exemple pour Pharmacie Martin)
const CLIENT_NAME = "Pharmacie Martin";
const CLIENT_ID = "MART_002";
```

**Convention de nommage recommandée :**
- `CLIENT_NAME` : Nom complet de la pharmacie
- `CLIENT_ID` : Code court + numéro séquentiel
  - Format : `[4 LETTRES]_[3 CHIFFRES]`
  - Exemples : `OUAZ_001`, `MART_002`, `DUPO_003`

4. **Sauvegardez** (Ctrl+S)
5. **Renommez le projet** : `Webhook Pharmacie Martin`

---

## **📝 Étape 3 : Tester le script**

1. Dans Apps Script, menu déroulant en haut → Sélectionnez **`testInsertion`**
2. Cliquez sur **"Exécuter"** (▶️)
3. **Si c'est la première fois**, autorisez l'accès :
   - Cliquez sur **"Examiner les autorisations"**
   - Sélectionnez votre compte Google
   - **"Paramètres avancés"** → **"Accéder à Webhook Pharmacie Martin (dangereux)"**
   - **"Autoriser"**
4. **Vérifiez le journal d'exécution** (en bas) :
   - Vous devriez voir : `✅ Test réussi ! Ligne ajoutée : 3`
5. **Retournez dans le Google Sheet**
6. **Vérifiez qu'une ligne de test** apparaît (ligne 3) avec toutes les données
7. **Si OK** : ✅ Supprimez la ligne de test et passez à l'étape suivante

---

## **📝 Étape 4 : Déployer le webhook**

1. Dans Apps Script, cliquez sur **"Déployer"** (en haut à droite)
2. Sélectionnez **"Nouvelle déployment"**
3. Cliquez sur l'icône **⚙️** (à côté de "Sélectionner le type")
4. Choisissez **"Application Web"**
5. **Configuration** :
   - **Description** : `Webhook Pharmacie Martin v1`
   - **Exécuter en tant que** : **Moi** (votre email)
   - **Qui peut accéder** : **Tout le monde**
6. Cliquez sur **"Déployer"**
7. Une fenêtre s'ouvre avec l'**URL de l'application Web**
8. **📋 COPIEZ CETTE URL COMPLÈTE** :
   ```
   https://script.google.com/macros/s/AKfycbyXYZ123...abc456/exec
   ```
9. **Collez-la dans un document texte temporaire** (vous en aurez besoin à l'étape suivante)
10. Cliquez sur **"OK"**

---

## **📝 Étape 5 : Ajouter le client dans `app.js`**

1. **Ouvrez `app.js`** dans votre éditeur de code (VS Code)
2. **Trouvez la section** `CLIENT_WEBHOOKS` (lignes ~10-20)
3. **Ajoutez une nouvelle ligne** avec l'ID du client et son URL webhook :

```javascript
const CLIENT_WEBHOOKS = {
  "ouazanan": "https://script.google.com/macros/s/AKfycbxTL4ulOdQ1JOopLHvXA-p7JwV5a_vLkzhHwBXVfBzQAQ2V6iwvDx0rWGXJBtzUKcONhw/exec",

  // ✅ NOUVEAU CLIENT AJOUTÉ ICI
  "martin": "https://script.google.com/macros/s/AKfycbyXYZ123...abc456/exec",

  "default": "https://script.google.com/macros/s/AKfycbxTL4ulOdQ1JOopLHvXA-p7JwV5a_vLkzhHwBXVfBzQAQ2V6iwvDx0rWGXJBtzUKcONhw/exec"
};
```

**⚠️ Points importants :**
- L'ID client (ex: `"martin"`) doit être en **minuscules**, sans espaces ni caractères spéciaux
- L'URL du webhook doit se terminer par `/exec`
- N'oubliez pas la virgule à la fin de chaque ligne

4. **Sauvegardez** (Ctrl+S)
5. **Commit et push** :

```bash
git add app.js
git commit -m "Add Pharmacie Martin webhook"
git push origin main
```

6. **Attendez 1-2 minutes** que Vercel redéploie automatiquement

---

## **📝 Étape 6 : Tester le flux complet**

1. **Ouvrez votre URL Vercel avec le paramètre client** :
   ```
   https://votre-app.vercel.app?client=martin
   ```

2. **Ouvrez DevTools** (F12) → Onglet **Console**

3. **Vérifiez les logs dans la console** :
   ```
   🏥 Client actif : martin
   🔗 Webhook configuré : ✅ Oui
   ```

4. **Remplissez un entretien de test complet** (6 étapes) :
   - Nom : Test Martin
   - Date de naissance : 01/01/1980
   - Type : AOD
   - Répondez à toutes les questions
   - Sélectionnez 2-4 thématiques
   - Remplissez la synthèse

5. **À l'étape 6, cliquez sur "Soumettre l'entretien"**

6. **Vérifiez dans la console** :
   - Message de succès : `✅ Entretien enregistré avec succès`
   - Ou message d'erreur (à corriger)

7. **Ouvrez le Google Sheet "Pharmacie Martin"**

8. **Vérifiez qu'une nouvelle ligne** est apparue avec toutes les données du test ! 🎉

9. **Si tout est OK** : Supprimez la ligne de test

---

## **📝 Étape 7 : Livrer au client**

### **A. Partager le Google Sheet**

1. Dans le Google Sheet du client, cliquez sur **"Partager"** (en haut à droite)
2. **Entrez l'email du client**
3. **Choisissez les permissions** :
   - **Lecteur** : Le client peut uniquement consulter (recommandé)
   - **Éditeur** : Le client peut modifier (si nécessaire)
4. **Décochez** "Avertir les utilisateurs" si vous ne voulez pas envoyer d'email
5. Cliquez sur **"Envoyer"** ou **"Copier le lien"**

### **B. Créer l'URL personnalisée pour le client**

**Format de l'URL** :
```
https://votre-app.vercel.app?client=[ID_CLIENT]
```

**Exemples** :
- Client Ouazanan : `https://entretiens-pharmaceutiques.vercel.app?client=ouazanan`
- Client Martin : `https://entretiens-pharmaceutiques.vercel.app?client=martin`
- Client Dupont : `https://entretiens-pharmaceutiques.vercel.app?client=dupont`

### **C. Email de livraison au client (template)**

```
Objet : 🎉 Votre application Entretiens Pharmaceutiques est prête !

Bonjour [Nom du client],

Votre application de gestion des entretiens pharmaceutiques est maintenant opérationnelle !

📱 ACCÈS À L'APPLICATION :
URL : https://votre-app.vercel.app?client=[ID_CLIENT]

⚠️ Important : Utilisez UNIQUEMENT cette URL (avec ?client=[ID_CLIENT])

📊 ACCÈS AUX DONNÉES :
Google Sheet : [Lien du Google Sheet partagé]

Vous pouvez consulter toutes les données des entretiens en temps réel.

📖 UTILISATION :
1. Ouvrez l'URL ci-dessus
2. Remplissez les 6 étapes du formulaire
3. Cliquez sur "Soumettre l'entretien"
4. Les données apparaissent automatiquement dans votre Google Sheet

✅ FONCTIONNALITÉS :
- 3 types d'entretiens : AOD, AVK, Asthme
- Questions dynamiques selon le type
- Sélection de 2-4 thématiques
- Synthèse de l'entretien
- Sauvegarde automatique dans Google Sheets

📞 SUPPORT :
En cas de problème, contactez-moi à [votre email]

Cordialement,
[Votre nom]
```

### **D. Documentation client (optionnel)**

Créez un document PDF simple avec :
- L'URL de l'application
- Le lien vers le Google Sheet
- Guide d'utilisation rapide (captures d'écran)
- Contact support

---

<a name="déploiement"></a>
# 🚀 **5. GUIDE DE DÉPLOIEMENT**

## **📋 Commandes Git essentielles**

### **Vérifier l'état**
```bash
git status
```

### **Ajouter des modifications**
```bash
# Ajouter un fichier spécifique
git add app.js

# Ajouter tous les fichiers modifiés
git add .
```

### **Commit**
```bash
git commit -m "Description de la modification"
```

### **Push vers GitHub**
```bash
git push origin main
```

### **Vérifier l'historique**
```bash
git log --oneline
```

---

## **🔄 Workflow de mise à jour**

### **Scénario 1 : Ajouter un nouveau client**

```bash
# 1. Modifier app.js (ajouter le client dans CLIENT_WEBHOOKS)
# 2. Sauvegarder

# 3. Commit et push
git add app.js
git commit -m "Add new client: Pharmacie [Nom]"
git push origin main

# 4. Vercel redéploie automatiquement (1-2 min)
```

### **Scénario 2 : Corriger un bug**

```bash
# 1. Modifier le fichier concerné
# 2. Tester localement (ouvrir index.html)

# 3. Commit et push
git add [fichier modifié]
git commit -m "Fix: [description du bug corrigé]"
git push origin main
```

### **Scénario 3 : Ajouter une fonctionnalité**

```bash
# 1. Créer une branche de développement
git checkout -b feature/nouvelle-fonctionnalite

# 2. Faire les modifications
# 3. Tester

# 4. Commit
git add .
git commit -m "Add: [description de la fonctionnalité]"

# 5. Merger dans main
git checkout main
git merge feature/nouvelle-fonctionnalite
git push origin main

# 6. Supprimer la branche de développement
git branch -d feature/nouvelle-fonctionnalite
```

---

<a name="maintenance"></a>
# 🔧 **6. MAINTENANCE ET SUIVI**

## **📊 Tableau de suivi des clients**

Créez un Google Sheet séparé : **`[ADMIN] Suivi Clients Entretiens Pharmaceutiques`**

### **Structure recommandée :**

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| **N°** | **Client** | **Code** | **Google Sheet URL** | **Webhook URL** | **URL Client** | **Date création** | **Statut** | **Nb entretiens** | **Remarques** |
| 1 | Pharmacie Ouazanan | OUAZ_001 | [lien] | AKfycbxTL4... | ?client=ouazanan | 18/10/2025 | ✅ Actif | 12 | - |
| 2 | Pharmacie Martin | MART_002 | [lien] | AKfycbyXYZ... | ?client=martin | 20/10/2025 | ✅ Actif | 8 | - |
| 3 | [TEMPLATE] | TEMP_000 | [lien] | - | - | - | 📋 Template | - | Ne pas utiliser en prod |

---

## **🔍 Monitoring des clients**

### **Vérifier le nombre d'entretiens par client**

Pour chaque Google Sheet client :
1. Ouvrez le Google Sheet
2. Notez le **nombre de lignes** (dernière ligne - 2 pour enlever les en-têtes)
3. Mettez à jour votre tableau de suivi

### **Alertes à surveiller**

| Situation | Action |
|-----------|--------|
| **Aucun entretien depuis 1 mois** | Contacter le client pour s'assurer que tout fonctionne |
| **Augmentation soudaine d'entretiens** | Vérifier qu'il n'y a pas de spam/erreur |
| **Google Sheet plein** (proche de 10 000 lignes) | Créer un nouveau sheet ou archiver les anciennes données |

---

## **🔒 Sécurité et bonnes pratiques**

### **Protection des URLs de webhook**

⚠️ **IMPORTANT** : Les URLs de webhook sont sensibles !

**À FAIRE** :
- ✅ Ne JAMAIS partager les URLs de webhook publiquement
- ✅ Ne PAS les mettre dans un dépôt GitHub public (les mettre dans le code est OK si le dépôt est privé)
- ✅ Changer l'URL si vous soupçonnez une fuite (redéployer le webhook Apps Script)

**À NE PAS FAIRE** :
- ❌ Poster les URLs sur des forums
- ❌ Les inclure dans des captures d'écran publiques
- ❌ Les envoyer par email non chiffré

### **Gestion des accès Google Sheets**

| Type d'accès | Quand l'utiliser | Permissions |
|--------------|------------------|-------------|
| **Lecteur** | Client consulte uniquement | Voir les données, exporter |
| **Commentateur** | Client peut annoter | + Ajouter des commentaires |
| **Éditeur** | Client peut modifier | + Modifier/Supprimer des données |
| **Propriétaire** | Vous uniquement | + Gérer les partages, supprimer le sheet |

**Recommandation** : Donnez accès **Lecteur** par défaut aux clients.

---

## **🗄️ Archivage des données**

### **Quand archiver ?**

- Google Sheet proche de 10 000 lignes
- Fin d'année fiscale
- Client inactif depuis 6 mois

### **Comment archiver ?**

1. **Dupliquer le Google Sheet**
   - Nommez-le : `[ARCHIVE] Entretiens Pharmaceutiques - [Client] - [Année]`

2. **Vider le Google Sheet actif**
   - Sélectionnez toutes les lignes sauf la ligne 1 (en-têtes)
   - Clic droit → Supprimer les lignes

3. **Mettre à jour votre tableau de suivi**
   - Ajoutez une colonne "Lien Archive"
   - Notez la date d'archivage

---

<a name="dépannage"></a>
# 🆘 **7. DÉPANNAGE**

## **❌ Problème 1 : Les données n'arrivent pas dans le Google Sheet**

### **Symptômes :**
- Le formulaire affiche "✅ Entretien soumis avec succès"
- Mais aucune ligne n'apparaît dans le Google Sheet

### **Diagnostic :**

1. **Ouvrez DevTools** (F12) → Console
2. Cherchez des erreurs en rouge
3. **Vérifiez l'URL du client** :
   ```
   🏥 Client actif : [ID]
   🔗 Webhook configuré : ✅ Oui
   ```

### **Solutions :**

#### **Solution A : Vérifier l'ID client**

**Problème** : L'URL utilise `?client=Martin` (avec majuscule) mais dans `app.js` c'est `"martin"` (minuscule)

**Solution** :
```javascript
// Dans app.js, utilisez TOUJOURS des minuscules
"martin": "https://...",  // ✅ BON
"Martin": "https://...",  // ❌ MAUVAIS
```

#### **Solution B : Vérifier l'URL du webhook**

1. Ouvrez `app.js`
2. Trouvez l'URL du webhook pour ce client
3. **Copiez l'URL**
4. **Collez-la dans un nouvel onglet** du navigateur
5. Vous devriez voir un message comme :
   ```json
   {"success":false,"error":"Données POST manquantes"}
   ```
   ✅ Si vous voyez ce message, l'URL est **valide**

   ❌ Si vous avez une erreur 404, l'URL est **invalide**

**Si l'URL est invalide** :
- Retournez dans le Google Sheet du client
- Extensions → Apps Script
- Déployer → Gérer les déploiements
- Vérifiez l'URL actuelle
- Mettez à jour `app.js` avec la bonne URL

#### **Solution C : Vérifier les logs Apps Script**

1. Ouvrez le Google Sheet du client
2. Extensions → Apps Script
3. Cliquez sur **"Executions"** (menu de gauche)
4. Regardez les dernières exécutions :
   - ✅ Succès : Vérifiez le Google Sheet
   - ❌ Erreur : Lisez le message d'erreur

---

## **❌ Problème 2 : Message d'erreur "CORS"**

### **Symptômes :**
```
Access to fetch at 'https://script.google.com/...' from origin 'https://votre-app.vercel.app'
has been blocked by CORS policy
```

### **Cause :**
Le webhook Apps Script n'autorise pas les requêtes depuis Vercel.

### **Solution :**

1. Ouvrez le Google Sheet du client
2. Extensions → Apps Script
3. **Déployer** → **Gérer les déploiements**
4. Cliquez sur **✏️ (Modifier)**
5. **Qui peut accéder** : Changez en **"Tout le monde"**
6. Cliquez sur **"Déployer"**
7. Retestez

---

## **❌ Problème 3 : Le bouton "Suivant" reste grisé**

### **Symptômes :**
- Impossible de passer à l'étape suivante
- Le bouton "Suivant" est désactivé

### **Causes et solutions :**

#### **Étape 1** :
- **Cause** : Nom, date de naissance ou type d'entretien manquant
- **Solution** : Remplissez tous les champs obligatoires

#### **Étape 2** :
- **Cause** : Champs obligatoires non remplis
- **Solution** : Remplissez "Déjà participé", "Accepte participation" et "Date entretien"

#### **Étape 4** :
- **Cause** : Moins de 2 thématiques sélectionnées
- **Solution** : Cochez **au moins 2 thématiques** (maximum 4)

---

## **❌ Problème 4 : Erreur "Unauthorized" ou "Invalid API Key"**

### **Symptômes :**
```json
{"success":false,"error":"Unauthorized - Invalid API Key"}
```

### **Cause :**
Vous avez ajouté une vérification de clé API dans le script mais pas configuré le client.

### **Solution :**

**Si vous N'utilisez PAS de clé API** (configuration actuelle) :
- Supprimez les vérifications de clé API du script Apps Script

**Si vous VOULEZ utiliser une clé API** (sécurité avancée) :
- Voir la section "Sécurité avancée" plus bas

---

## **❌ Problème 5 : "TypeError: Cannot read properties of undefined"**

### **Symptômes :**
Dans les logs Apps Script :
```
TypeError: Cannot read properties of undefined (reading 'nomPrenom')
```

### **Cause :**
Les données envoyées ne sont pas au bon format.

### **Solution :**

1. Ouvrez DevTools (F12) → Network
2. Trouvez la requête vers `script.google.com`
3. Onglet "Payload" → Regardez les données envoyées
4. Vérifiez la structure JSON

**Structure attendue** :
```json
{
  "patient": {
    "nomPrenom": "...",
    "dateNaissance": "..."
  },
  "adhesion": {...},
  "synthese": {...}
}
```

---

<a name="checklist"></a>
# ✅ **8. CHECKLIST COMPLÈTE**

## **📋 Checklist : Configuration initiale (à faire 1 fois)**

```
□ Compte GitHub créé
□ Compte Vercel créé
□ Compte Google créé
□ Git installé sur l'ordinateur
□ VS Code installé
□ Code source cloné/créé
□ Google Sheet template créé
□ Script Apps Script template créé
□ app.js modifié pour multi-clients
□ Application déployée sur Vercel
□ URL Vercel copiée
□ Premier client (Ouazanan) configuré et testé
```

---

## **📋 Checklist : Ajout d'un nouveau client (10 min)**

```
DATE : ___/___/______
CLIENT : _______________________
CODE : _______________________

□ 1. Google Sheet dupliqué depuis template
□ 2. Renommé "Entretiens Pharmaceutiques - [Nom Client]"
□ 3. Lignes de test supprimées
□ 4. Extensions → Apps Script ouvert
□ 5. CLIENT_NAME modifié
□ 6. CLIENT_ID modifié
□ 7. Script sauvegardé
□ 8. Fonction testInsertion exécutée
□ 9. Ligne de test apparue dans le Sheet
□ 10. Ligne de test supprimée
□ 11. Webhook déployé (Application Web)
□ 12. Autorisations Google accordées
□ 13. URL du webhook copiée : _______________________
□ 14. app.js modifié (nouveau client ajouté dans CLIENT_WEBHOOKS)
□ 15. git add + commit + push effectués
□ 16. Vercel a redéployé (vérifié sur Vercel)
□ 17. URL client testée : https://votre-app.vercel.app?client=_______
□ 18. Console navigateur vérifiée (Client actif + Webhook OK)
□ 19. Entretien de test rempli (6 étapes complètes)
□ 20. Données apparues dans le Google Sheet client
□ 21. Ligne de test supprimée
□ 22. Google Sheet partagé avec le client (Lecteur/Éditeur)
□ 23. Email de livraison envoyé au client
□ 24. Tableau de suivi mis à jour
□ 25. Client ajouté au système de facturation (si applicable)
```

---

## **📋 Checklist : Maintenance mensuelle**

```
DATE : ___/___/______

□ Vérifier que tous les clients sont actifs
□ Compter le nombre d'entretiens par client
□ Mettre à jour le tableau de suivi
□ Vérifier qu'aucun Google Sheet n'est proche de la limite (10 000 lignes)
□ Archiver les données si nécessaire
□ Vérifier les logs Apps Script pour les erreurs
□ Tester l'application avec un entretien de test
□ Vérifier que Vercel est à jour
□ Sauvegarder le code source (backup)
□ Vérifier les emails clients (support)
```

---

# 🎯 **RÉSUMÉ : Points clés à retenir**

## **✅ Architecture**
- 1 code source → Plusieurs clients
- 1 Google Sheet par client (isolation totale)
- URLs personnalisées : `?client=ID`

## **✅ Pour ajouter un client (10 min)**
1. Dupliquer le Google Sheet template
2. Modifier CLIENT_NAME et CLIENT_ID dans Apps Script
3. Déployer le webhook
4. Ajouter dans `app.js` (CLIENT_WEBHOOKS)
5. Tester et livrer

## **✅ Sécurité**
- URLs de webhook sensibles (ne pas partager)
- Google Sheets en accès Lecteur pour les clients
- Surveiller les entretiens suspects

## **✅ Maintenance**
- Tableau de suivi mensuel
- Archivage si > 10 000 lignes
- Backup du code source

---

# 📞 **SUPPORT**

**En cas de problème :**

1. ✅ Consultez la section "Dépannage" de ce guide
2. ✅ Vérifiez les logs dans DevTools (F12)
3. ✅ Vérifiez les logs Apps Script (Executions)
4. ✅ Testez avec `?client=default` pour voir si c'est un problème de configuration client

---

# 🎉 **CONCLUSION**

Vous avez maintenant un système complet pour :
- ✅ Gérer plusieurs clients avec un seul code source
- ✅ Ajouter un nouveau client en 10 minutes
- ✅ Isoler les données de chaque client
- ✅ Maintenir et surveiller vos clients

**Bonne chance avec votre application !** 🚀

---

**Document créé le** : 18 octobre 2025
**Version** : 2.0
**Auteur** : Assistant Claude
**Dernière mise à jour** : 18 octobre 2025
