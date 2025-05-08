# Site Web CGT Alteia

Un modèle de site web moderne et responsive pour les syndicats et organisations de travailleurs. Ce projet fournit une base pour créer des sites web professionnels et accessibles qui aident les organisations syndicales à se connecter avec leurs membres et le public.

## 🚧 En cours de développement

Ce projet est actuellement en développement. Nous travaillons à le rendre prêt pour la production et open-source pour les organisations syndicales du monde entier.

## ✨ Fonctionnalités

- **Design Moderne** : Interface propre et professionnelle avec un accent sur l'accessibilité
- **Mise en page Responsive** : Design entièrement responsive qui fonctionne sur tous les appareils
- **Éléments Interactifs** :
  - Section FAQ avec fonctionnalité d'accordéon
  - Formulaire de contact interactif
  - Assistant de chat alimenté par l'IA pour les questions courantes
  - Intégration Google Maps
  - Génération de formulaires PDF pour les demandes d'adhésion
- **Accessibilité** : Construit selon les directives WCAG
- **Support Multilingue** : Prêt pour l'internationalisation
- **Performance Optimisée** : Temps de chargement rapides et interactions fluides

## 🛠️ Stack Technique

- **Frontend** :
  - HTML5
  - CSS3 (avec variables CSS pour le thème)
  - JavaScript Vanilla
  - API Google Maps
  - PDF-Lib pour la génération de PDF
  - Mistral AI pour la fonctionnalité de chat

## 📁 Structure du Projet

```
project/
├── index.html          # Point d'entrée principal
├── desktop.css         # Styles desktop
├── mobile.css          # Styles mobile
├── script.js           # Fonctionnalités JavaScript principales
├── mistral.js          # Intégration du chat IA
├── static/            # Assets statiques
│   └── adhesion.pdf   # Template du formulaire d'adhésion
└── media/             # Fichiers médias
    ├── logo.png
    ├── favicon.png
    └── poi.svg
```

## 🚀 Pour Commencer

1. Clonez le dépôt :
   ```bash
   git clone [url-du-depot]
   ```

2. Configurez votre environnement :
   - Obtenez une clé API Google Maps
   - Obtenez une clé API Mistral AI
   - Mettez à jour les clés API dans les fichiers respectifs

3. Démarrez un serveur local :
   ```bash
   python -m http.server 8000
   ```

4. Ouvrez `http://localhost:8000` dans votre navigateur

## 🔧 Configuration

### Clés API
- Google Maps : Mettre à jour dans `index.html`
- Mistral AI : Mettre à jour dans `mistral.js`

### Personnalisation
- Les couleurs et thèmes peuvent être modifiés dans `desktop.css` en utilisant les variables CSS
- Le contenu peut être mis à jour dans `index.html`
- Les champs du formulaire peuvent être modifiés dans la section adhésion

## 🤝 Contribution

Nous accueillons les contributions ! Veuillez lire nos directives de contribution avant de soumettre des pull requests.

## 📝 Licence

Ce projet sera publié sous une licence open-source. Restez à l'écoute pour les mises à jour.

## 📞 Contact

Pour toute question ou support, veuillez contacter :
- Email : cgt.alteia@gmail.com

## 🔜 Feuille de Route

- [ ] Compléter la documentation
- [ ] Ajouter plus de support linguistique
- [ ] Créer un assistant d'installation
- [ ] Ajouter plus d'options de personnalisation
- [ ] Implémenter des analyses
- [ ] Ajouter un système de gestion de contenu
- [ ] Créer des guides de déploiement
- [ ] Ajouter des tests automatisés
- [ ] Créer des directives de contribution
- [ ] Mettre en place un pipeline CI/CD

---

Fait avec ❤️ pour les organisations syndicales du monde entier
