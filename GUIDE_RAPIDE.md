# Guide de Démarrage Rapide

## 🚀 Lancer l'application en 2 minutes

### Option 1 : Double-clic (le plus simple)
1. **Double-cliquez sur `LANCER.bat`**
2. L'application s'ouvre automatiquement dans votre navigateur

### Option 2 : Ouvrir directement
1. **Double-cliquez sur `index.html`**
2. Le formulaire s'ouvre dans votre navigateur par défaut

## 📝 Utilisation du formulaire

### Étape par étape :

1. **Étape 1** : Informations du patient
   - Remplissez le nom, date de naissance (obligatoires)
   - Sélectionnez le type d'entretien (AOD, AVK ou Asthme)
   - Cliquez sur "Suivant"

2. **Étape 2** : Adhésion au programme
   - Répondez aux questions d'adhésion
   - Renseignez les informations de la pharmacie
   - Cliquez sur "Suivant"

3. **Étape 3** : Questionnaire d'évaluation
   - Répondez aux questions spécifiques au type d'entretien
   - Les questions "Si oui..." apparaissent automatiquement
   - Cliquez sur "Suivant"

4. **Étape 4** : Sélection des thématiques
   - **Cochez entre 2 et 4 thématiques**
   - Le bouton "Suivant" s'active quand 2 thèmes minimum sont sélectionnés
   - Cliquez sur "Suivant"

5. **Étape 5** : Questions par thématique
   - Répondez aux questions des thématiques sélectionnées
   - Cliquez sur "Suivant"

6. **Étape 6** : Synthèse de l'entretien
   - Complétez les informations de synthèse
   - **Cliquez sur "Soumettre l'entretien"**
   - Confirmation affichée

## 🌐 Mettre en ligne sur Vercel (GRATUIT)

### Méthode simple (sans code)

1. **Créez un compte sur Vercel**
   - Allez sur https://vercel.com
   - Cliquez sur "Sign Up" (gratuit)
   - Connectez-vous avec GitHub, GitLab ou Email

2. **Déployez votre application**
   - Cliquez sur "Add New" → "Project"
   - Sélectionnez "Upload from computer"
   - **Glissez-déposez** le dossier `entretiens-pharmaceutiques-app`
   - Cliquez sur "Deploy"

3. **C'est en ligne !**
   - Vercel vous donne une URL publique (ex: `votre-app.vercel.app`)
   - Partagez cette URL avec vos utilisateurs

### Méthode avec CLI (plus rapide pour les mises à jour)

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer (depuis le dossier de l'app)
cd entretiens-pharmaceutiques-app
vercel

# Pour les mises à jour futures
vercel --prod
```

## 🔗 Connecter à Google Sheets ou n8n

### Pour enregistrer les réponses automatiquement :

1. **Ouvrez `app.js`** dans un éditeur de texte

2. **Trouvez la ligne 11** :
   ```javascript
   const WEBHOOK_URL = "https://votre-webhook-url.com/entretien";
   ```

3. **Remplacez par votre URL** :
   - URL de webhook n8n, OU
   - URL de Google Apps Script

4. **Décommentez les lignes 427-428** :
   ```javascript
   // Avant :
   // await sendToWebhook(data);

   // Après :
   await sendToWebhook(data);
   ```

5. **Sauvegardez** et redéployez

### Exemple de webhook n8n

1. Créez un workflow n8n
2. Ajoutez un nœud "Webhook" au début
3. Copiez l'URL du webhook
4. Collez-la dans `WEBHOOK_URL`

### Exemple Google Apps Script

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.openById('VOTRE_ID_SHEET').getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.patient.nomPrenom,
    data.patient.email,
    data.type,
    JSON.stringify(data.evaluation),
    JSON.stringify(data.synthese)
  ]);

  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 📱 Tester sur mobile

1. **Lancez l'application sur votre ordinateur**
2. **Trouvez votre adresse IP locale** :
   - Windows : Ouvrez CMD et tapez `ipconfig`
   - Cherchez "IPv4" (ex: 192.168.1.10)
3. **Sur votre téléphone** :
   - Connectez-vous au même WiFi
   - Ouvrez le navigateur
   - Allez sur `http://192.168.1.10:8000` (remplacez par votre IP)

## ❓ Problèmes courants

### Le formulaire ne s'ouvre pas
- Vérifiez que vous êtes dans le bon dossier
- Essayez de faire un clic droit sur `index.html` → "Ouvrir avec" → Votre navigateur

### Les données ne s'enregistrent pas
- Vérifiez que `WEBHOOK_URL` est configuré
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que votre webhook est actif

### Le bouton "Suivant" reste désactivé à l'étape 4
- Vous devez sélectionner **au minimum 2 thématiques**
- Maximum 4 thématiques

### Le design ne s'affiche pas correctement
- Vérifiez que `styles.css` est dans le même dossier que `index.html`
- Actualisez la page (Ctrl+F5)

## 📞 Support

Pour plus d'aide, consultez le fichier `README.md` complet.

---

**Astuce** : Enregistrez ce guide en favori pour y accéder rapidement !
