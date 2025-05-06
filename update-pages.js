const fs = require('fs');
const path = require('path');

// List of all page files
const pageFiles = [
    'ability-scores.js', 'alignments.js', 'backgrounds.js',
    'classes.js', 'conditions.js', 'damage-types.js',
    'equipment.js', 'feats.js', 'features.js',
    'magic-schools.js', 'monsters.js', 'proficiencies.js',
    'races.js', 'rule-sections.js', 'rules.js',
    'skills.js', 'subclasses.js', 'subraces.js',
    'traits.js', 'weapon-properties.js'
];

const pagesDir = path.join(__dirname, 'pages');

pageFiles.forEach(file => {
    const filePath = path.join(pagesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Remove route additions
    const cleanedContent = content
        .replace(/window\.router\.addRoute\('[^']*'\s*,\s*[\s\S]*?\);/g, '')
        .replace(/window\.router\.addRoute\('[^']*\/:[^']*'\s*,\s*[\s\S]*?\);/g, '')
        .replace(/const\s+\w+\s*=\s*new\s+\w+\(\);/g, '')
        .replace(/\/\/\s*Initialize\s+the\s+page/g, '')
        .replace(/\/\/\s*Handle\s+navigation/g, '');
    
    // Add global export
    const className = file.replace('.js', '').charAt(0).toUpperCase() + file.replace('.js', '').slice(1);
    const finalContent = `${cleanedContent}\n\nwindow.${className} = ${className};`;
    
    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log(`Updated: ${file}`);
});