const fs = require('fs');
const path = require('path');
const ThronetekiCyclesValidator = require('../src/ThronetekiCyclesValidator');
const ThronetekiPackValidator = require('../src/ThronetekiPackValidator.js');
const BasicValidator = require('../src/BasicValidator.js');

let validator = new ThronetekiPackValidator();
let directory = path.join(__dirname, '../packs');
let packFiles = fs.readdirSync(directory).filter(file => file.endsWith('.json'));

let valid = true;

for(let file of packFiles) {
    let pack = require(path.join(directory, file));
    let result = validator.validate(pack);
    if(!result.valid) {
        console.error(`Errors in ${file}:\n${result.errors.join('\n')}`);
        valid = false;
    }
}

let cyclesValidator = new ThronetekiCyclesValidator({ packFiles });
let cycles = require('../cycles.json');
let cyclesResult = cyclesValidator.validate(cycles);

if(!cyclesResult.valid) {
    console.error(`Errors in cycles.json:\n${cyclesResult.errors.join('\n')}`);
    valid = false;
}

let restrictedListValidator = new BasicValidator(require('../restricted-list.schema.json'));
let restrictedList = require('../restricted-list.json');
let restrictedListResult = restrictedListValidator.validate(restrictedList);

if(!restrictedListResult.valid) {
    console.error(`Errors in restricted-list.json:\n${restrictedListResult.errors.join('\n')}`);
    valid = false;
}

let standaloneDecksValidator = new BasicValidator(require('../standalone-decks.schema.json'));
let standaloneDecks = require('../standalone-decks.json');
let standaloneDecksResult = standaloneDecksValidator.validate(standaloneDecks);

if(!standaloneDecksResult.valid) {
    console.error(`Errors in standalone-decks.json:\n${standaloneDecksResult.errors.join('\n')}`);
    valid = false;
}

if(valid) {
    console.log('Validation complete, no errors.');
} else {
    console.log('Validation complete, please correct the above errors.');
    process.exit(1);
}
