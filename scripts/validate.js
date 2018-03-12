const fs = require('fs');
const path = require('path');
const ThronetekiPackValidator = require('../src/ThronetekiPackValidator.js');

let validator = new ThronetekiPackValidator();
let directory = path.join(__dirname, '../packs');
let packFiles = fs.readdirSync(directory).filter(file => file.endsWith('.json'));

let valid = true;
let errorCards = [];

for(let file of packFiles) {
    let pack = require(path.join(directory, file));
    let result = validator.validate(pack);
    if(!result.valid) {
        console.error(`Errors in ${file}:\n${result.errors.join('\n')}`);
        valid = false;
    }
}

// console.log(`Validation complete: ${errorCards.length} invalid cards`)
if(!valid) {
    process.exit(1);
}
