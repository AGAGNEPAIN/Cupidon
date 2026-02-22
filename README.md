# 💘 Cupidon

Une expérience web romantique et interactive conçue pour une déclaration spéciale (Saint-Valentin, anniversaire, etc.).

## ✨ Fonctionnalités

- **Gateway "Private Joke"** : Une page de connexion personnalisée déverrouillable uniquement par un mot de passe/réponse à une private joke (visant une seule personne).
- **Ambiance sonore** : Une musique continue et romantique qui se déclenche après la validation du mot de passe.
- **Effets visuels immersifs** :
  - Arrière-plan Parallax (effet de profondeur)
  - Filtre "Bokeh" en surimpression
  - Système de particules personnalisées (shaders)
  - Curseur Cupidon personnalisé (non visible sur mobile, désactivé lors d'états solennels)
- **Bouton "Non" Fuyant** : Un comportement interactif et amusant où le bouton de refus s'éloigne ou tremble lorsqu'on essaie de cliquer dessus sur desktop.
- **Séquence engageante** : Une série de questions romantiques menant à un grand bouquet final en confettis (célébration de l'acceptation).

## 🛠 Technologies

- **[React 19](https://react.dev/)**
- **[Vite](https://vitejs.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)** avec `@tailwindcss/vite`
- **[Framer Motion](https://www.framer.com/motion/)** (pour la fluidité temporelle, l'orchestration des animations et le "fleeing button")
- **[Canvas Confetti](https://github.com/catdad/canvas-confetti)**
- **[Vite Plugin GLSL](https://github.com/UstymUkhman/vite-plugin-glsl)** pour l'intégration de shaders

## 🚀 Installation & Développement

1. Installer les dépendances :

   ```bash
   npm install
   ```

2. Démarrer le serveur de développement :
   ```bash
   npm run dev
   ```
   L'application sera accessible (par défaut) sur http://localhost:5173.

## 📦 Scripts npm

- `npm run dev` : Lance le serveur de développement.
- `npm run build` : Compile TypeScript et génère l'application de production.
- `npm run lint` : Lance l'analyse de code via ESLint.
- `npm run preview` : Démarre un serveur local pour tester la version de production (build).

## 🤝 Crédits et Inspiration

Ce projet utilise des interactions modernes poussées (fleeing buttons, sound orchestration, lazy loading) pour créer une "surprise" unique en son genre, tout en gardant des performances fluides.
