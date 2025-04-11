#!/usr/bin/env node

/**
 * Script d'initialisation de la base de données Supabase
 * 
 * Ce script exécute les migrations SQL pour créer et remplir les tables 
 * nécessaires au fonctionnement du tableau de bord SuperAdmin.
 * 
 * Pour l'exécuter:
 * 1. Définissez les variables d'environnement SUPABASE_URL et SUPABASE_SERVICE_KEY
 * 2. Exécutez `node scripts/init-database.js`
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: '.env.local' });

// Si les variables d'environnement ne sont pas trouvées, on cherche dans .env
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  dotenv.config();
}

// Vérifier que les variables d'environnement sont définies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Erreur : Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies.');
  console.error('Vous pouvez les définir dans un fichier .env.local ou les passer directement au script.');
  process.exit(1);
}

// Créer un client Supabase avec la clé de service
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Lire les fichiers SQL de migration
const createTablesSQL = fs.readFileSync(path.join(__dirname, '../migrations/01_create_tables.sql'), 'utf8');
const seedDataSQL = fs.readFileSync(path.join(__dirname, '../migrations/02_seed_data.sql'), 'utf8');

// Fonction pour exécuter directement du SQL via l'API REST
async function executeSql(sqlQuery) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: sqlQuery
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erreur SQL (${response.status}): ${text}`);
    }

    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution SQL:', error);
    return false;
  }
}

// Fonction pour tester la connexion à Supabase
async function testConnection() {
  try {
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Erreur de connexion à Supabase:', error);
      return false;
    }
    
    console.log('✅ Connexion à Supabase établie avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du test de connexion:', error);
    return false;
  }
}

async function initDatabase() {
  console.log('🚀 Initialisation de la base de données...');

  try {
    // Exécuter le script de création des tables
    console.log('📊 Création des tables...');
    const tablesCreated = await executeSql(createTablesSQL);
    
    if (!tablesCreated) {
      console.error('❌ Erreur lors de la création des tables');
      return;
    }
    
    console.log('✅ Tables créées avec succès');

    // Exécuter le script d'insertion des données
    console.log('📝 Insertion des données de test...');
    const dataSeeded = await executeSql(seedDataSQL);
    
    if (!dataSeeded) {
      console.error('❌ Erreur lors de l\'insertion des données');
      return;
    }
    
    console.log('✅ Données insérées avec succès');

    console.log('🎉 Base de données initialisée avec succès !');
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

// Fonction principale
async function main() {
  console.log('🔧 Préparation de l\'initialisation de la base de données Supabase...');
  
  const isConnected = await testConnection();
  if (isConnected) {
    await initDatabase();
  } else {
    console.error('❌ Impossible de se connecter à Supabase. Arrêt du script.');
    process.exit(1);
  }
}

// Exécuter la fonction principale
main().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
}); 