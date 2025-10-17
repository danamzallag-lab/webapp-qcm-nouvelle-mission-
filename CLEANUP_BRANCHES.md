# 🧹 Nettoyage des branches GitHub

## ⚠️ Problème actuel

Vous avez **2 branches** sur GitHub :
- `master` (branche par défaut)
- `main` (branche avec le code le plus récent)

Il faut garder **seulement `main`** et supprimer `master`.

---

## ✅ Solution : Changer la branche par défaut sur GitHub

### Étape 1 : Aller sur GitHub

1. Allez sur https://github.com/danamzallag-lab/webapp-qcm-nouvelle-mission-
2. Cliquez sur **"Settings"** (en haut à droite)

### Étape 2 : Changer la branche par défaut

1. Dans le menu de gauche, cliquez sur **"General"** (déjà sélectionné par défaut)
2. Scroll vers le bas jusqu'à la section **"Default branch"**
3. Vous verrez : `master` avec un bouton à côté
4. Cliquez sur les **deux flèches** 🔄 (bouton "Switch to another branch")
5. Sélectionnez **`main`**
6. Cliquez sur **"Update"**
7. Une boîte de dialogue s'ouvre → Cliquez sur **"I understand, update the default branch"**

### Étape 3 : Supprimer la branche master

1. Retournez sur la page principale du dépôt
2. Cliquez sur **"X branches"** (en haut, à gauche)
3. Trouvez la branche `master`
4. Cliquez sur l'**icône de poubelle** 🗑️ à droite de `master`
5. Confirmez la suppression

---

## ⚙️ Alternative : Via la ligne de commande (après avoir changé la branche par défaut)

Une fois que vous avez changé la branche par défaut sur GitHub vers `main` :

```bash
cd Desktop/entretiens-pharmaceutiques-app

# Supprimer la branche master de GitHub
git push origin --delete master

# Supprimer la branche master localement (optionnel)
git branch -d master
```

---

## ✅ Résultat attendu

Après le nettoyage, vous aurez :
- **1 seule branche** : `main`
- `main` définie comme branche par défaut
- Vercel déployant depuis `main`

---

## 🔄 Pour vos futurs projets

Depuis quelques années, GitHub utilise `main` par défaut au lieu de `master`. Pour vos nouveaux projets :

```bash
# Créer un nouveau dépôt avec main par défaut
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
git push -u origin main
```

---

## 📝 Notes

### Pourquoi c'est arrivé ?

J'ai créé la branche en local et poussé vers GitHub sans vérifier quelle était la branche par défaut. GitHub avait `master` comme branche par défaut à l'époque.

### Est-ce que ça casse quelque chose ?

Non ! Les deux branches ont exactement le même code. C'est juste qu'avoir les deux prête à confusion.

### Que se passe-t-il avec Vercel ?

Une fois que vous avez configuré Vercel pour déployer depuis `main` (voir VERCEL_FIX.md), tout fonctionnera correctement.

---

## 🎯 Checklist

- [ ] Aller sur Settings de GitHub
- [ ] Changer la branche par défaut vers `main`
- [ ] Supprimer la branche `master`
- [ ] Vérifier que Vercel déploie depuis `main`
- [ ] Tester l'application

---

**Une fois terminé, vous aurez un dépôt propre avec une seule branche `main` !** 🎉
