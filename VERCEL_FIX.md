# 🔧 Comment corriger l'affichage sur Vercel

## Problème constaté
- **Local** : Design moderne avec gradient violet/bleu ✅
- **Vercel** : Design basique blanc sans styles ❌

## Cause
Vercel déploie une ancienne version du code ou pointe vers la mauvaise branche.

---

## ✅ Solution 1 : Changer la branche de déploiement (RECOMMANDÉ)

### Étape 1 : Aller sur Vercel
1. Allez sur https://vercel.com
2. Connectez-vous
3. Cliquez sur votre projet : `webapp-qcm-nouvelle-mission-`

### Étape 2 : Changer la branche
1. Cliquez sur **Settings** (en haut)
2. Dans le menu de gauche : **Git**
3. Dans "Production Branch" :
   - Remplacez `master` par `main`
   - Cliquez sur "Save"

### Étape 3 : Redéployer
1. Retournez sur **Deployments**
2. Le déploiement automatique devrait démarrer
3. Attendez 1-2 minutes
4. Testez votre URL Vercel

---

## ✅ Solution 2 : Forcer un redéploiement manuel

### Si Solution 1 ne fonctionne pas :

1. Sur Vercel, onglet **Deployments**
2. Trouvez le dernier déploiement (en haut)
3. Cliquez sur les **3 points** (...) à droite
4. Cliquez sur **"Redeploy"**
5. Attendez le redéploiement (1-2 min)
6. Testez votre URL

---

## ✅ Solution 3 : Vérifier les fichiers déployés

### Si les 2 solutions précédentes ne fonctionnent pas :

1. Sur Vercel, cliquez sur le dernier **Deployment**
2. Cliquez sur **"Source"** (dans le menu)
3. Vérifiez que vous voyez :
   - `index.html` (7.5 KB)
   - `styles.css` (9.3 KB) ← **IMPORTANT**
   - `app.js` (27 KB) ← **IMPORTANT**

4. Si `styles.css` est plus petit (genre 1 KB) ou absent :
   - Le problème vient de Git
   - Voir Solution 4 ci-dessous

---

## ✅ Solution 4 : Reconnecter le dépôt (si rien ne fonctionne)

### Supprimer et recréer la connexion :

1. Sur Vercel, allez dans **Settings**
2. En bas de la page : **"Delete Project"**
   - ⚠️ Notez bien votre URL actuelle avant !
3. Cliquez sur **"Add New Project"**
4. Sélectionnez votre dépôt GitHub : `webapp-qcm-nouvelle-mission-`
5. Configuration :
   - **Framework Preset** : Other
   - **Root Directory** : `./`
   - **Build Command** : (laissez vide)
   - **Output Directory** : (laissez vide)
6. Cliquez sur **"Deploy"**
7. Attendez 1-2 minutes
8. Testez la nouvelle URL

---

## 🎯 Vérification finale

Une fois redéployé, votre app Vercel devrait avoir :

### ✅ Design correct :
- Fond avec gradient violet/bleu
- Formulaire dans une carte blanche arrondie
- Boutons colorés (bleu pour "Suivant", gris pour "Précédent")
- Animations au survol

### ✅ Fonctionnalités :
- Étape 3 (AOD) : Menu déroulant avec Eliquis, Xarelto, Pradaxa
- Étape 3 (AOD) : Dosages s'activent après sélection du médicament
- Étape 3 (Asthme + fond Oui) : Barre de recherche pour corticoïdes

---

## 📱 Test rapide

Après redéploiement, testez ceci :

```
1. Allez sur votre URL Vercel
2. Remplissez Nom + Date de naissance
3. Cochez "Anticoagulant Oral Direct (AOD)"
4. Cliquez "Suivant" (x2)
5. À l'étape 3 :
   - Sélectionnez "Xarelto (Rivaroxaban)"
   - Le menu dosage devrait afficher : 10 mg, 15 mg, 20 mg
```

Si ça fonctionne ✅ → Le problème est résolu !

---

## 🆘 Si rien ne fonctionne

Contactez-moi avec :
1. Capture d'écran de Vercel → Deployments (dernier déploiement)
2. Capture d'écran de Vercel → Settings → Git
3. URL de votre app Vercel
4. Message d'erreur (si il y en a)

---

## 📝 Notes techniques

### Pourquoi ça arrive ?

Vercel peut avoir plusieurs problèmes :
1. **Cache** : Vercel met en cache les déploiements
2. **Branche** : Vercel déploie peut-être depuis `master` au lieu de `main`
3. **Fichiers manquants** : Les fichiers CSS/JS n'ont pas été poussés correctement
4. **Configuration** : Le `vercel.json` est incorrect (peu probable ici)

### Ce que j'ai fait :

```bash
✅ Créé la branche "main" avec tout le code
✅ Poussé vers GitHub
✅ Ajouté .vercelignore pour optimiser
✅ Tous les fichiers sont sur GitHub (master ET main)
```

Maintenant c'est à vous de configurer Vercel pour déployer depuis `main` ! 🚀

---

**Dernière mise à jour** : 17 octobre 2025
