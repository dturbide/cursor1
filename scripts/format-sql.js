#!/usr/bin/env node

/**
 * Script pour formater le SQL en morceaux plus faciles à copier-coller 
 * dans l'éditeur SQL de Supabase
 */

const fs = require('fs');
const path = require('path');

// Lire les fichiers SQL de migration
const createTablesSQL = fs.readFileSync(path.join(__dirname, '../migrations/01_create_tables.sql'), 'utf8');
const seedDataSQL = fs.readFileSync(path.join(__dirname, '../migrations/02_seed_data.sql'), 'utf8');

// Diviser le SQL en sections logiques
function splitSqlIntoSections(sql) {
  const sections = [];
  let currentSection = '';
  let currentName = 'Section 1';
  
  // Recherche des délimiteurs de section (commentaires)
  const lines = sql.split('\n');
  
  for (const line of lines) {
    // Si la ligne commence par un commentaire et contient "Création" ou "Ajout", c'est un nouveau titre de section
    if (line.trim().startsWith('--') && (line.includes('Création') || line.includes('Ajout'))) {
      // Si on a déjà accumulé du contenu, on ajoute la section
      if (currentSection.trim()) {
        sections.push({
          name: currentName,
          sql: currentSection.trim()
        });
      }
      
      // Commencer une nouvelle section
      currentName = line.trim().replace('-- ', '');
      currentSection = line + '\n';
    } else {
      currentSection += line + '\n';
    }
  }
  
  // Ajouter la dernière section
  if (currentSection.trim()) {
    sections.push({
      name: currentName,
      sql: currentSection.trim()
    });
  }
  
  return sections;
}

// Formater les sections en fichiers individuels
function writeFormattedSections(sections, baseName) {
  if (!fs.existsSync(path.join(__dirname, '../formatted'))) {
    fs.mkdirSync(path.join(__dirname, '../formatted'));
  }
  
  // Écrire un fichier pour chaque section
  sections.forEach((section, i) => {
    const fileName = `${baseName}_${(i+1).toString().padStart(2, '0')}_${section.name.replace(/[^a-zA-Z0-9]/g, '_')}.sql`;
    const filePath = path.join(__dirname, '../formatted', fileName);
    
    fs.writeFileSync(filePath, section.sql);
    console.log(`✅ Fichier créé: ${fileName}`);
  });
  
  // Écrire aussi un fichier complet
  const fullFilePath = path.join(__dirname, '../formatted', `${baseName}_full.sql`);
  fs.writeFileSync(fullFilePath, sections.map(s => s.sql).join('\n\n'));
  console.log(`✅ Fichier complet créé: ${baseName}_full.sql`);
}

// Traiter les fichiers
console.log('🔧 Formatage des fichiers SQL...');

const createTablesSections = splitSqlIntoSections(createTablesSQL);
writeFormattedSections(createTablesSections, 'create_tables');

const seedDataSections = splitSqlIntoSections(seedDataSQL);
writeFormattedSections(seedDataSections, 'seed_data');

console.log('\n📋 Instructions:');
console.log('1. Ouvrez la console Supabase et allez dans "SQL Editor"');
console.log('2. Créez une nouvelle requête');
console.log('3. Commencez par copier-coller et exécuter le contenu de "create_tables_full.sql"');
console.log('4. Si vous rencontrez des erreurs, essayez d\'exécuter les fichiers individuels un par un');
console.log('5. Ensuite, exécutez "seed_data_full.sql" ou les fichiers individuels pour insérer les données');
console.log('\nLes fichiers formatés se trouvent dans le dossier "formatted"');

console.log('\n🎉 Formatage terminé !'); 