# VotreSaaS - Application de Gestion d'Entreprise

Une application SaaS complète pour la gestion de clients, devis et factures, construite avec Next.js et Supabase.

## Fonctionnalités

- Authentification utilisateur avec Supabase
- Tableau de bord administrateur
- Gestion des clients
- Éditeur de base de données IA
- Interface responsive et moderne

## Prérequis

- Node.js 18+ et npm
- Compte Supabase

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-username/votresaaS.git
   cd votresaaS
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

1. Créez un compte sur [Vercel](https://vercel.com) si vous n'en avez pas déjà un.

2. Connectez votre dépôt GitHub à Vercel.

3. Configurez les variables d'environnement dans les paramètres du projet Vercel :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (URL de production)

4. Déployez votre application.

## Structure du Projet

- `/src/app` - Pages et routes de l'application
- `/src/components` - Composants réutilisables
- `/src/lib` - Utilitaires et configurations
- `/supabase` - Configuration et migrations Supabase

## Technologies Utilisées

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.io/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [TypeScript](https://www.typescriptlang.org/) - Typage statique

## Licence

MIT
