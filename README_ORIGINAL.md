# Application d'Entretien Pharmaceutique à Distance

Application web pour la gestion des entretiens pharmaceutiques (AOD, AVK, Asthme) avec un formulaire multi-étapes interactif.

## Fonctionnalités

- **3 types d'entretiens** : Anticoagulants Oraux Directs (AOD), Anti-vitamine K (AVK), Asthme
- **Formulaire multi-étapes** : 6 étapes guidées avec validation
- **Questions dynamiques** : Les questions s'adaptent selon le type d'entretien sélectionné
- **Sélection de thématiques** : Choix de 2 à 4 thématiques à aborder
- **Design moderne et responsive** : Interface adaptée aux ordinateurs, tablettes et smartphones
- **Validation en temps réel** : Vérification des champs obligatoires

## Structure du projet

```
entretiens-pharmaceutiques-app/
├── index.html          # Page principale du formulaire
├── styles.css          # Styles CSS avec design moderne
├── app.js              # Logique JavaScript de l'application
├── vercel.json         # Configuration pour le déploiement Vercel
└── README.md           # Ce fichier
```

## Installation et lancement local

### Méthode 1 : Ouvrir directement le fichier HTML

1. Naviguez vers le dossier du projet
2. Double-cliquez sur `index.html`
3. Le formulaire s'ouvre dans votre navigateur par défaut

### Méthode 2 : Utiliser un serveur local (recommandé)

#### Avec Python (installé par défaut sur Mac/Linux)

```bash
cd entretiens-pharmaceutiques-app
python -m http.server 8000
```

Puis ouvrez votre navigateur à l'adresse : `http://localhost:8000`

#### Avec Node.js et http-server

```bash
npm install -g http-server
cd entretiens-pharmaceutiques-app
http-server
```

#### Avec l'extension Live Server de VS Code

1. Ouvrez le dossier dans VS Code
2. Clic droit sur `index.html`
3. Sélectionnez "Open with Live Server"

## Déploiement sur Vercel

### Prérequis
- Compte Vercel (gratuit) : https://vercel.com

### Étapes de déploiement

1. **Installer Vercel CLI** (si ce n'est pas déjà fait)
   ```bash
   npm install -g vercel
   ```

2. **Se connecter à Vercel**
   ```bash
   vercel login
   ```

3. **Déployer l'application**
   ```bash
   cd entretiens-pharmaceutiques-app
   vercel
   ```

4. Suivez les instructions à l'écran :
   - Set up and deploy? → **Yes**
   - Which scope? → Choisissez votre compte
   - Link to existing project? → **No**
   - What's your project's name? → `entretiens-pharmaceutiques` (ou autre nom)
   - In which directory is your code located? → `.` (dossier actuel)

5. Votre application est déployée ! Vercel vous fournit une URL publique.

### Déploiement via l'interface web Vercel

1. Allez sur https://vercel.com
2. Cliquez sur "Add New" → "Project"
3. Importez votre dossier ou liez votre dépôt Git
4. Vercel détectera automatiquement la configuration
5. Cliquez sur "Deploy"

## Configuration du backend (envoi des données)

Par défaut, les données sont collectées mais non envoyées. Pour activer l'envoi :

### Option 1 : Webhook n8n

1. Créez un workflow n8n avec un nœud Webhook
2. Copiez l'URL du webhook
3. Dans `app.js`, modifiez la ligne 11 :
   ```javascript
   const WEBHOOK_URL = "https://votre-url-n8n.com/webhook/...";
   ```
4. Décommentez les lignes 427-428 dans `app.js` :
   ```javascript
   await sendToWebhook(data);
   ```

### Option 2 : Google Apps Script

1. Créez un Google Sheet
2. Créez un script Apps Script (Extensions → Apps Script)
3. Déployez-le comme application web
4. Utilisez l'URL dans `WEBHOOK_URL`

Exemple de script Apps Script :
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  // Ajoutez les données dans votre feuille
  sheet.appendRow([
    new Date(),
    data.patient.nomPrenom,
    data.patient.email,
    data.type,
    JSON.stringify(data)
  ]);

  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Types d'entretiens disponibles

### AOD (Anticoagulants Oraux Directs)
- Questions sur le médicament, la dose, l'indication
- Thématiques : Observance, Surveillance biologique, Effets du traitement, Vie quotidienne

### AVK (Anti-vitamine K)
- Questions sur l'INR, le carnet de suivi
- Thématiques : Observance, Surveillance biologique, Effets du traitement, Vie quotidienne

### Asthme
- Questions sur le type d'asthme, les traitements de fond et de crise
- Thématiques : Effets du traitement, Principe du traitement, Facteurs déclenchants

## Personnalisation

### Modifier les couleurs

Éditez les variables CSS dans `styles.css` (lignes 2-10) :
```css
:root {
  --primary-color: #3498db;    /* Couleur principale */
  --secondary-color: #2c3e50;  /* Couleur secondaire */
  --success-color: #27ae60;    /* Couleur de succès */
  ...
}
```

### Ajouter des questions

Modifiez les objets `evaluationQuestions` ou `thematiqueQuestions` dans `app.js`

### Ajouter un type d'entretien

1. Ajoutez les questions dans `evaluationQuestions`
2. Ajoutez les thématiques dans `thematiquesOptions`
3. Ajoutez un bouton radio dans `index.html` (section "Type d'entretien")

## Support et maintenance

- Pour signaler un bug : Créez une issue sur le dépôt
- Pour des questions : Contactez l'équipe de développement

## Licence

Ce projet est destiné à un usage professionnel pharmaceutique uniquement.

---

**Version** : 1.0.0
**Dernière mise à jour** : 2025
