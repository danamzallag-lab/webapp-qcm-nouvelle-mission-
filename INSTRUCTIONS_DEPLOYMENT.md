# 🚀 Instructions de Déploiement - Application Entretiens Pharmaceutiques

## ✅ Votre application est prête !

Le dossier `entretiens-pharmaceutiques-app` contient tous les fichiers nécessaires pour fonctionner.

---

## 📂 Fichiers créés

```
entretiens-pharmaceutiques-app/
├── index.html              # Formulaire principal
├── styles.css              # Design moderne (violet/bleu)
├── app.js                  # Logique JavaScript
├── vercel.json             # Configuration Vercel
├── package.json            # Métadonnées du projet
├── .gitignore              # Fichiers à ignorer par Git
├── LANCER.bat              # Script de lancement Windows
├── README.md               # Documentation complète
├── GUIDE_RAPIDE.md         # Guide de démarrage rapide
└── INSTRUCTIONS_DEPLOYMENT.md  # Ce fichier
```

---

## 🎯 Étape 1 : Tester localement (MAINTENANT)

### Méthode A : Double-clic (recommandé)
1. **Double-cliquez sur `LANCER.bat`**
   - Si Python est installé : serveur sur http://localhost:8000
   - Sinon : ouverture directe dans le navigateur

### Méthode B : Ouverture directe
1. **Double-cliquez sur `index.html`**
2. Le formulaire s'ouvre immédiatement

### ✅ Vérifiez que tout fonctionne :
- [ ] La page s'affiche avec un design violet/bleu
- [ ] Vous pouvez remplir l'étape 1 et cliquer sur "Suivant"
- [ ] Les questions changent selon le type d'entretien (AOD/AVK/Asthme)
- [ ] Vous pouvez sélectionner 2-4 thématiques à l'étape 4
- [ ] Le bouton "Soumettre" fonctionne à la fin

---

## 🌐 Étape 2 : Déployer sur Vercel (GRATUIT)

### Option 1 : Interface Web (PLUS SIMPLE)

#### A. Créer un compte Vercel
1. Allez sur **https://vercel.com**
2. Cliquez sur **"Sign Up"** (gratuit à vie pour ce type de projet)
3. Connectez-vous avec :
   - GitHub (recommandé)
   - GitLab
   - Bitbucket
   - Ou Email

#### B. Déployer l'application
1. Une fois connecté, cliquez sur **"Add New..."** → **"Project"**
2. Choisissez **"Import Git Repository"** ou **"Upload from computer"**

##### Si vous uploadez directement :
1. **Glissez-déposez** le dossier `entretiens-pharmaceutiques-app` entier
2. Vercel détecte automatiquement la configuration
3. Cliquez sur **"Deploy"**
4. ⏳ Attendez 30-60 secondes
5. ✅ **C'est en ligne !**

##### Si vous utilisez GitHub :
1. Créez d'abord un dépôt GitHub
2. Poussez votre code (voir section suivante)
3. Sur Vercel, sélectionnez votre dépôt
4. Cliquez sur **"Deploy"**

#### C. Obtenir votre URL
- Vercel vous donne une URL publique : `votre-app.vercel.app`
- Vous pouvez la personnaliser dans les paramètres
- Exemple : `entretiens-pharmacie.vercel.app`

---

### Option 2 : Vercel CLI (pour développeurs)

```bash
# 1. Installer Vercel CLI (une seule fois)
npm install -g vercel

# 2. Se connecter à Vercel
vercel login
# → Suivez les instructions dans le navigateur

# 3. Déployer l'application
cd C:\Users\danam\Desktop\entretiens-pharmaceutiques-app
vercel

# Répondez aux questions :
# Set up and deploy? → Y
# Which scope? → Choisissez votre compte
# Link to existing project? → N
# What's your project's name? → entretiens-pharmaceutiques
# In which directory is your code located? → ./

# 4. Votre app est en ligne !
# Vercel affiche l'URL : https://entretiens-pharmaceutiques-xxx.vercel.app

# 5. Pour les mises à jour futures
vercel --prod
```

---

## 📤 Pousser sur GitHub (optionnel mais recommandé)

### A. Créer un dépôt sur GitHub
1. Allez sur **https://github.com**
2. Cliquez sur **"New repository"**
3. Nom : `entretiens-pharmaceutiques-app`
4. **Ne cochez pas** "Initialize with README" (déjà créé)
5. Cliquez sur **"Create repository"**

### B. Pousser votre code
```bash
cd C:\Users\danam\Desktop\entretiens-pharmaceutiques-app

# Lier au dépôt distant
git remote add origin https://github.com/VOTRE-USERNAME/entretiens-pharmaceutiques-app.git

# Pousser le code
git branch -M main
git push -u origin main
```

### C. Lier à Vercel
1. Sur Vercel, cliquez sur **"Import Project"**
2. Sélectionnez votre dépôt GitHub
3. Vercel se met à jour automatiquement à chaque push !

---

## 🔗 Étape 3 : Connecter à un backend (pour enregistrer les données)

Actuellement, les données sont collectées mais **non enregistrées**.

### Option A : n8n (Recommandé pour l'automatisation)

#### 1. Créer un workflow n8n
- Si vous avez déjà n8n installé
- Créez un nouveau workflow
- Ajoutez un nœud **"Webhook"** au début
- Configurez-le en mode **POST**

#### 2. Récupérer l'URL du webhook
- Exemple : `https://votre-n8n.com/webhook/entretien-pharmaceutique`

#### 3. Configurer l'application
Ouvrez `app.js` et modifiez la **ligne 11** :

```javascript
// Avant :
const WEBHOOK_URL = "https://votre-webhook-url.com/entretien";

// Après :
const WEBHOOK_URL = "https://votre-n8n.com/webhook/entretien-pharmaceutique";
```

#### 4. Activer l'envoi
**Décommentez les lignes 427-428** :

```javascript
// Avant :
// await sendToWebhook(data);

// Après :
await sendToWebhook(data);
```

#### 5. Redéployer
```bash
vercel --prod
```

---

### Option B : Google Sheets (Gratuit et simple)

#### 1. Créer un Google Sheet
1. Allez sur https://sheets.google.com
2. Créez une nouvelle feuille : "Entretiens Pharmaceutiques"
3. Ajoutez ces colonnes en A1-F1 :
   ```
   Date | Nom Patient | Email | Type | Évaluation | Synthèse
   ```

#### 2. Créer un script Apps Script
1. Dans votre Google Sheet : **Extensions** → **Apps Script**
2. Collez ce code :

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Ajouter une nouvelle ligne
    sheet.appendRow([
      new Date(),                              // Date
      data.patient.nomPrenom,                  // Nom
      data.patient.email,                      // Email
      data.type.toUpperCase(),                 // Type (AOD/AVK/ASTHME)
      JSON.stringify(data.evaluation),         // Évaluation (JSON)
      data.synthese.syntheseEntretien          // Synthèse
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "Données enregistrées" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

#### 3. Déployer le script
1. Cliquez sur **"Déployer"** → **"Nouvelle déployment"**
2. Type : **"Application Web"**
3. Exécuter en tant que : **Moi**
4. Qui peut accéder : **Tout le monde**
5. Cliquez sur **"Déployer"**
6. **Copiez l'URL** (ex: `https://script.google.com/macros/s/.../exec`)

#### 4. Configurer l'application
Dans `app.js`, ligne 11 :
```javascript
const WEBHOOK_URL = "https://script.google.com/macros/s/VOTRE-ID/exec";
```

#### 5. Décommenter l'envoi (ligne 427-428)
```javascript
await sendToWebhook(data);
```

#### 6. Redéployer sur Vercel
```bash
vercel --prod
```

---

## 🎨 Personnalisation

### Changer les couleurs

Ouvrez `styles.css`, lignes 2-10 :

```css
:root {
  --primary-color: #3498db;    /* Bleu principal */
  --secondary-color: #2c3e50;  /* Gris foncé */
  --success-color: #27ae60;    /* Vert succès */
  /* ... */
}
```

Modifiez les codes couleur selon vos préférences.

### Ajouter des questions

Dans `app.js`, modifiez les objets :
- `evaluationQuestions` (ligne ~14)
- `thematiqueQuestions` (ligne ~50)

---

## 📱 Tester sur mobile/tablette

### Méthode 1 : Avec le déploiement Vercel
1. Déployez sur Vercel
2. Ouvrez l'URL sur votre mobile : `votre-app.vercel.app`
3. ✅ L'application est responsive !

### Méthode 2 : En local sur votre réseau
1. Lancez le serveur local (LANCER.bat)
2. Trouvez votre IP locale :
   ```bash
   ipconfig
   ```
   Cherchez "Adresse IPv4" (ex: `192.168.1.10`)
3. Sur votre mobile (même WiFi) :
   Ouvrez `http://192.168.1.10:8000`

---

## ✅ Checklist de déploiement

- [ ] J'ai testé l'application localement
- [ ] Tous les formulaires fonctionnent (6 étapes)
- [ ] J'ai créé un compte Vercel
- [ ] J'ai déployé l'application sur Vercel
- [ ] J'ai testé l'URL publique
- [ ] (Optionnel) J'ai configuré un backend (n8n/Google Sheets)
- [ ] (Optionnel) J'ai testé l'enregistrement des données
- [ ] J'ai partagé l'URL avec les utilisateurs

---

## 🆘 Problèmes courants

### "Failed to deploy"
- Vérifiez que tous les fichiers sont présents
- Assurez-vous que `vercel.json` est bien inclus

### Les styles ne s'affichent pas
- Vérifiez que `styles.css` est dans le même dossier
- Videz le cache du navigateur (Ctrl + Shift + R)

### Les données ne sont pas enregistrées
- Vérifiez que `WEBHOOK_URL` est correctement configuré
- Décommentez `await sendToWebhook(data);` dans `app.js`
- Vérifiez les logs dans la console du navigateur (F12)

### Le bouton "Suivant" est grisé (étape 4)
- Normal ! Il faut sélectionner **au moins 2 thématiques**

---

## 📞 Support et documentation

- **README complet** : `README.md`
- **Guide rapide** : `GUIDE_RAPIDE.md`
- **Documentation Vercel** : https://vercel.com/docs

---

## 🎉 Félicitations !

Votre application est maintenant prête à être utilisée et déployée !

**Prochaines étapes recommandées :**
1. ✅ Testez localement (double-clic sur LANCER.bat)
2. ✅ Déployez sur Vercel
3. ✅ Configurez un backend pour enregistrer les données
4. ✅ Partagez l'URL avec vos utilisateurs

---

**Besoin d'aide ?** Relisez ce guide ou consultez le README.md pour plus de détails.

🤖 Généré avec Claude Code
