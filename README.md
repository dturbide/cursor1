# Cursor1 - Application SaaS de Gestion avec Authentification Multi-Niveaux

Application SaaS moderne pour la gestion d'entreprise avec authentification multi-niveaux, intégration IA et interfaces utilisateur réactives, construite avec Next.js 15 et Supabase.

## Fonctionnalités

- Authentification multi-niveaux (utilisateur, admin, superadmin) avec Supabase
- Tableaux de bord spécifiques à chaque niveau d'accès
- Gestion des clients
- Éditeur de base de données IA
- Interface responsive et moderne
- Intégration avec v0.dev pour le design d'interfaces

## Prérequis

- Node.js 20+ et npm
- Compte Supabase
- Accès à v0.dev (optionnel, pour la conception d'interfaces)

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/dturbide/cursor1.git
   cd cursor1
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Créez un fichier `.env.local` à la racine du projet avec les variables d'environnement suivantes :
   ```
   NEXT_PUBLIC_SUPABASE_URL=votre-url-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-supabase
   SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-supabase
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Déploiement sur Vercel

L'application est déployée automatiquement sur Vercel à chaque push sur la branche main.

Site en production : [https://cursor1-one.vercel.app](https://cursor1-one.vercel.app)

### Configuration du déploiement

1. Configurez les variables d'environnement dans les paramètres du projet Vercel :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (URL de production)

## Workflow de Développement

### Conception des interfaces

1. Les interfaces sont conçues avec [v0.dev](https://v0.dev), un outil de génération d'UI par Vercel
2. Le code généré est ensuite intégré au projet et adapté pour fonctionner avec l'architecture existante
3. L'équipe backend implémente la logique métier et les connexions à la base de données

### Architecture

- Authentification basée sur les rôles (user, admin, superadmin)
- API routes sécurisées pour les opérations backend
- Composants d'UI modulaires et réutilisables

## Structure du Projet

- `/src/app` - Pages et routes de l'application
- `/src/components` - Composants réutilisables
- `/src/lib` - Utilitaires et configurations
- `/public` - Ressources statiques

## Technologies Utilisées

- [Next.js 15](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.io/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [TypeScript](https://www.typescriptlang.org/) - Typage statique
- [v0.dev](https://v0.dev) - Génération d'UI avec IA

## Licence

MIT
