# Guide d'initialisation de la base de données

Ce document explique comment initialiser la base de données Supabase pour le tableau de bord SuperAdmin.

## Prérequis

- Accès à votre projet Supabase avec les droits d'administrateur
- Les fichiers SQL se trouvent dans le dossier `formatted/`

## Méthode 1: Via l'éditeur SQL de Supabase (Recommandée)

1. Connectez-vous à votre console Supabase
2. Allez dans la section "SQL Editor"
3. Créez une nouvelle requête
4. Copiez-collez le contenu du fichier `formatted/create_tables_full.sql`
5. Exécutez la requête en cliquant sur "Run"
6. Si tout se passe bien, copiez-collez ensuite le contenu de `formatted/seed_data_full.sql`
7. Exécutez cette seconde requête

Si vous rencontrez des erreurs avec les fichiers complets, vous pouvez essayer d'exécuter les requêtes une par une en utilisant les fichiers numérotés dans le dossier `formatted/`.

## Méthode 2: Exécution automatisée (Avancée)

Pour une exécution automatisée, nous avons créé un script Node.js. Cependant, cette méthode nécessite que votre base de données Supabase ait été configurée pour permettre l'exécution de requêtes SQL arbitraires via l'API REST.

1. Assurez-vous d'avoir les variables d'environnement nécessaires dans votre fichier `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: L'URL de votre projet Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: La clé de service de votre projet Supabase

2. Exécutez le script d'initialisation:
   ```bash
   node scripts/init-database.js
   ```

## Schéma de la base de données

Le script crée les tables suivantes:

### 1. invoices
Table des factures avec relation vers les organisations.

### 2. security_logs
Journalisation des événements de sécurité (connexions, tentatives échouées, etc.).

### 3. system_settings
Configuration globale du système (paramètres de l'application).

### 4. Modifications sur user_profiles
Ajoute des champs comme `is_blocked`, `blocked_at`, etc. pour la gestion des utilisateurs bloqués.

## Politiques de sécurité (RLS)

Le script configure également les politiques Row Level Security (RLS) pour protéger les données:

- Les SuperAdmins ont un accès complet à toutes les tables
- Les Admins peuvent visualiser certaines tables mais ont des droits limités
- Les utilisateurs normaux n'ont accès qu'aux données qui les concernent

## Données de test

Le script insère également des données de test:
- Factures fictives
- Logs de sécurité fictifs
- Paramètres système par défaut

## Problèmes connus

- Si votre table `organizations` n'existe pas encore, vous devrez créer cette table avant d'exécuter les scripts
- Si les champs dans la table `user_profiles` ont des contraintes différentes, vous pourriez rencontrer des erreurs
- Les scripts sont conçus pour être idempotents (ils peuvent être exécutés plusieurs fois sans danger), mais testez d'abord dans un environnement de développement 